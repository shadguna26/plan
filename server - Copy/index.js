const express = require('express');
const cors = require('cors');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const { analyzeFeedbackWithAI } = require('./aiService');
const { storeAnalysis, getTrendData } = require('./storageService');
const { registerUser, loginUser, verifyToken, getUserById } = require('./authService');
const { authenticateToken } = require('./authMiddleware');
const { saveFeedbackToFirestore, getAllFeedbacksFromFirestore } = require('./firebase');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware for debugging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Ensure uploads directory exists
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Feedback Intelligence API is running' });
});

// Authentication endpoints
app.post('/api/auth/register', async (req, res) => {
  try {
    console.log('Register request received:', { email: req.body.email, name: req.body.name });
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      console.log('Register failed: Missing fields');
      return res.status(400).json({ error: 'Email, password, and name are required' });
    }

    if (password.length < 6) {
      console.log('Register failed: Password too short');
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const result = await registerUser(email, password, name);
    console.log('Register successful:', result.user.email);
    res.status(201).json(result);
  } catch (error) {
    console.error('Register error:', error.message);
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    console.log('Login request received:', { email: req.body.email });
    const { email, password } = req.body;

    if (!email || !password) {
      console.log('Login failed: Missing fields');
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const result = await loginUser(email, password);
    console.log('Login successful:', result.user.email);
    res.json(result);
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(401).json({ error: error.message });
  }
});

app.get('/api/auth/verify', authenticateToken, (req, res) => {
  res.json({ user: req.user });
});

app.get('/api/auth/me', authenticateToken, (req, res) => {
  res.json({ user: req.user });
});

// Main analysis endpoint
app.post('/analyze-feedback', async (req, res) => {
  try {
    // Accept both { "feedback": "string" } and { "feedbackText": "string" } for backward compatibility
    const { feedback, feedbackText } = req.body;
    const feedbackInput = feedback || feedbackText;

    // Validate input
    if (!feedbackInput) {
      return res.status(400).json({ 
        error: 'Feedback is required',
        message: 'Please provide a "feedback" or "feedbackText" field in the request body'
      });
    }

    if (typeof feedbackInput !== 'string') {
      return res.status(400).json({ 
        error: 'Invalid feedback format',
        message: 'Feedback must be a string'
      });
    }

    if (feedbackInput.trim().length === 0) {
      return res.status(400).json({ 
        error: 'Feedback cannot be empty',
        message: 'Please provide non-empty feedback text'
      });
    }

    // Analyze feedback using Google Gemini AI
    console.log('Starting analysis for feedback:', feedbackInput.substring(0, 100) + '...');
    const analysis = await analyzeFeedbackWithAI(feedbackInput);
    console.log('Analysis completed successfully');

    // Save to Firestore
    await saveFeedbackToFirestore(feedbackInput, analysis);

    // Return the analysis result in the specified format
    res.json(analysis);
  } catch (error) {
    console.error('Error analyzing feedback:', error);
    console.error('Error stack:', error.stack);
    
    // Provide clear error messages
    let statusCode = 500;
    let errorMessage = error.message || 'Failed to analyze feedback';
    
    if (error.message.includes('GEMINI_API_KEY')) {
      statusCode = 500;
      errorMessage = 'Gemini API key is not configured. Please set GEMINI_API_KEY in your .env file.';
    } else if (error.message.includes('parse')) {
      statusCode = 500;
      errorMessage = 'Failed to parse AI response. The AI may have returned invalid JSON.';
    } else if (error.message.includes('Invalid')) {
      statusCode = 400;
    } else if (error.message.includes('Failed to generate content')) {
      statusCode = 500;
      errorMessage = 'Unable to connect to Gemini API. Please check your API key and internet connection.';
    }
    
    res.status(statusCode).json({ 
      error: 'Failed to analyze feedback', 
      message: errorMessage,
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// CSV upload endpoint for Google Forms data (protected)
app.post('/upload-csv', authenticateToken, upload.single('csvFile'), async (req, res) => {
  let filePath = null;
  
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'CSV file is required' });
    }

    filePath = req.file.path;
    const rows = [];
    const results = [];

    // Parse CSV file
    await new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => {
          rows.push(row);
        })
        .on('end', () => {
          resolve();
        })
        .on('error', (error) => {
          reject(error);
        });
    });

    console.log(`Processing ${rows.length} rows from CSV...`);

    // Process each row individually
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      
      try {
        // Extract feedback from the "feedback" column (case-insensitive)
        let feedback = null;
        
        // Try to find feedback column (case-insensitive)
        for (const [key, value] of Object.entries(row)) {
          if (key.toLowerCase() === 'feedback' && value && typeof value === 'string' && value.trim().length > 0) {
            feedback = value.trim();
            break;
          }
        }

        // If no "feedback" column found, skip this row safely
        if (!feedback) {
          console.warn(`Row ${i + 1}: No feedback column found or feedback is empty, skipping...`);
          continue;
        }

        console.log(`Processing row ${i + 1}/${rows.length}: ${feedback.substring(0, 50)}...`);

        // Analyze this row's feedback using Gemini AI
        const analysis = await analyzeFeedbackWithAI(feedback);

        // Save to Firestore
        await saveFeedbackToFirestore(feedback, analysis);

        // Add row number and original feedback to result
        results.push({
          row: i + 1,
          feedback: feedback,
          sentiment: analysis.sentiment,
          category: analysis.category,
          summary: analysis.summary,
          suggestions: analysis.suggestions
        });

        console.log(`✅ Row ${i + 1} processed successfully`);

        // Add small delay to avoid rate limiting (optional)
        if (i < rows.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }

      } catch (error) {
        console.error(`Error processing row ${i + 1}:`, error.message);
        // Add error result but don't crash - continue processing other rows
        // Try to get feedback value for error reporting
        let feedbackValue = 'N/A';
        for (const [key, value] of Object.entries(row)) {
          if (key.toLowerCase() === 'feedback' && value) {
            feedbackValue = String(value).substring(0, 100);
            break;
          }
        }
        
        results.push({
          row: i + 1,
          feedback: feedbackValue,
          error: error.message || 'Failed to analyze feedback'
        });
      }
    }

    // Clean up uploaded file
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    const processedCount = results.filter(r => !r.error).length;
    const errorCount = results.filter(r => r.error).length;

    console.log(`CSV processing complete: ${processedCount} successful, ${errorCount} errors`);

    // Return structured results as requested: { processed: number, results: [...] }
    res.json({
      processed: processedCount,
      results: results
    });

  } catch (error) {
    console.error('Error processing CSV:', error);
    
    // Clean up uploaded file
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    
    res.status(500).json({ 
      error: 'Failed to process CSV file', 
      message: error.message 
    });
  }
});

// Get all feedback data from Firestore (protected)
app.get('/dashboard-data', authenticateToken, async (req, res) => {
  try {
    const feedbacks = await getAllFeedbacksFromFirestore();
    
    res.json({
      success: true,
      count: feedbacks.length,
      data: feedbacks
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({
      error: 'Failed to fetch dashboard data',
      message: error.message
    });
  }
});

// Get sync status endpoint (protected)
app.get('/sync-status', authenticateToken, (req, res) => {
  const trendData = getTrendData();
  const lastAnalysis = trendData.historicalAnalyses[trendData.historicalAnalyses.length - 1];
  
  res.json({
    lastSynced: lastAnalysis ? lastAnalysis.timestamp : null,
    totalRecords: trendData.historicalAnalyses.length,
    dataSource: 'Google Forms'
  });
});

// Helper function to detect continuous negative trends
function detectContinuousNegativeTrends(currentCategories, trendData) {
  const continuousNegativeAreas = [];

  currentCategories.forEach(category => {
    if (category.sentiment === 'negative') {
      // Count how many consecutive times this category was negative
      let consecutiveCount = 1;

      // Check historical analyses in reverse order
      for (let i = trendData.historicalAnalyses.length - 1; i >= 0; i--) {
        const historical = trendData.historicalAnalyses[i];
        const historicalCategory = historical.category_analysis.find(
          c => c.category.toLowerCase() === category.category.toLowerCase()
        );

        if (historicalCategory && historicalCategory.sentiment === 'negative') {
          consecutiveCount++;
        } else {
          break; // Stop counting if we hit a non-negative result
        }
      }

      // Determine priority based on consecutive count
      let priority = 'Low';
      if (consecutiveCount >= 5) {
        priority = 'High';
      } else if (consecutiveCount >= 3) {
        priority = 'Medium';
      }

      continuousNegativeAreas.push({
        category: category.category,
        consecutive_negative_cycles: consecutiveCount,
        priority: priority,
        current_sentiment_score: category.score || 0
      });
    }
  });

  // Sort by priority and consecutive count
  continuousNegativeAreas.sort((a, b) => {
    const priorityOrder = { High: 3, Medium: 2, Low: 1 };
    if (priorityOrder[b.priority] !== priorityOrder[a.priority]) {
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }
    return b.consecutive_negative_cycles - a.consecutive_negative_cycles;
  });

  return continuousNegativeAreas;
}

// Check for required environment variables on startup
if (!process.env.GEMINI_API_KEY) {
  console.warn('\n⚠️  WARNING: GEMINI_API_KEY is not set!');
  console.warn('   The analyze-feedback endpoint will not work without a valid API key.');
  console.warn('   Please create a .env file in the server directory with:');
  console.warn('   GEMINI_API_KEY=your-api-key-here\n');
} else {
  console.log('✅ GEMINI_API_KEY is configured');
}

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 Feedback Intelligence API server running on port ${PORT}`);
  console.log(`   Health check: http://localhost:${PORT}/health`);
  console.log(`   API ready to accept requests\n`);
});

