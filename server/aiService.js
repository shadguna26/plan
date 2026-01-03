const { GoogleGenerativeAI } = require('@google/generative-ai');
const https = require('https');
require('dotenv').config();

// Validate API key
if (!process.env.GEMINI_API_KEY) {
  console.warn('Warning: GEMINI_API_KEY not found in environment variables');
}

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Lists available models from Gemini API
 */
async function listAvailableModels() {
  return new Promise((resolve, reject) => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      reject(new Error('GEMINI_API_KEY is not set'));
      return;
    }

    const url = `https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`;
    
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          if (res.statusCode !== 200) {
            reject(new Error(`API returned status ${res.statusCode}: ${data}`));
            return;
          }
          const response = JSON.parse(data);
          if (response.models) {
            const modelNames = response.models
              .filter(m => m.supportedGenerationMethods && m.supportedGenerationMethods.includes('generateContent'))
              .map(m => m.name.replace('models/', ''));
            resolve(modelNames);
          } else {
            reject(new Error('No models found in API response'));
          }
        } catch (err) {
          reject(err);
        }
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

/**
 * Analyzes feedback text using Google Gemini AI (gemini-1.5-flash model)
 * Returns structured JSON with sentiment, category, summary, and suggestions
 * 
 * @param {string} feedbackText - The feedback text to analyze
 * @returns {Promise<Object>} Analysis result with sentiment, category, summary, and suggestions
 */
async function analyzeFeedbackWithAI(feedbackText) {
  try {
    // Validate API key
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not configured. Please set it in your .env file.');
    }

    // Validate input
    if (!feedbackText || typeof feedbackText !== 'string' || feedbackText.trim().length === 0) {
      throw new Error('Feedback text is required and must be a non-empty string');
    }

    // Construct the prompt
    const prompt = `Analyze the following feedback and return ONLY a valid JSON object. Do not include any markdown, code blocks, or additional text - just the raw JSON.

FEEDBACK:
${feedbackText}

Return a JSON object with this exact structure:
{
  "sentiment": "Positive | Neutral | Negative",
  "category": "Infrastructure | Teaching | Support | Service | Other",
  "summary": "Short summary",
  "suggestions": ["string"]
}

Requirements:
- sentiment: Must be exactly one of: "Positive", "Neutral", or "Negative"
- category: Must be exactly one of: "Infrastructure", "Teaching", "Support", "Service", or "Other"
- summary: A concise summary (2-3 sentences)
- suggestions: An array of 3-5 actionable suggestion strings

Return ONLY the JSON object now:`;

    // Get available models from the API
    let availableModels = [];
    try {
      console.log('Fetching available models from Gemini API...');
      availableModels = await listAvailableModels();
      console.log('✅ Available models:', availableModels.join(', '));
    } catch (error) {
      console.warn('⚠️  Could not fetch model list, using fallback models:', error.message);
      // Fallback to common model names
      availableModels = ['gemini-pro', 'gemini-1.5-pro', 'gemini-1.5-flash', 'gemini-1.0-pro'];
    }

    // Try REST API first (more reliable than SDK)
    let text = null;
    let successfulModel = null;
    let lastError = null;

    console.log('Attempting to use REST API...');
    for (const modelName of availableModels) {
      try {
        console.log(`Trying REST API with model: ${modelName}`);
        text = await callGeminiRESTAPI(modelName, prompt);
        successfulModel = modelName;
        console.log(`✅ Successfully used model: ${modelName} via REST API`);
        console.log(`Raw response length: ${text.length} characters`);
        break;
      } catch (error) {
        console.error(`❌ REST API with ${modelName} failed:`, error.message);
        lastError = error;
        continue;
      }
    }

    // If REST API fails, try SDK as fallback
    if (!text) {
      console.log('REST API failed, trying SDK...');
      for (const modelName of availableModels) {
        try {
          console.log(`Attempting SDK with model: ${modelName}`);
          const model = genAI.getGenerativeModel({ model: modelName });
          const result = await model.generateContent(prompt);
          const response = await result.response;
          text = response.text();
          successfulModel = modelName;
          console.log(`✅ Successfully used model: ${modelName} via SDK`);
          console.log(`Raw response length: ${text.length} characters`);
          break;
        } catch (error) {
          console.error(`❌ SDK with ${modelName} failed:`, error.message);
          lastError = error;
          continue;
        }
      }
    }

    if (!text) {
      const errorDetails = lastError?.message || 'Unknown error';
      console.error('❌ All methods failed. Last error:', errorDetails);
      throw new Error(`Unable to connect to Gemini API. Please verify your API key is valid and has access to Gemini models. Error: ${errorDetails.substring(0, 150)}`);
    }

    // Clean and parse the response
    console.log('Cleaning and parsing response...');
    text = cleanGeminiResponse(text);
    console.log('Cleaned response:', text.substring(0, 200) + '...');
    const analysis = parseAndValidateJSON(text);
    console.log('Parsed analysis:', JSON.stringify(analysis, null, 2));

    return analysis;
  } catch (error) {
    console.error('AI Analysis Error:', error);
    console.error('Error stack:', error.stack);
    
    // Return error details for debugging
    throw new Error(`Failed to analyze feedback: ${error.message}`);
  }
}

/**
 * Cleans the Gemini response to extract pure JSON
 * @param {string} text - Raw response text from Gemini
 * @returns {string} Cleaned JSON string
 */
function cleanGeminiResponse(text) {
  if (!text || typeof text !== 'string') {
    throw new Error('Invalid response from AI: empty or non-string response');
  }

  // Trim whitespace
  let cleaned = text.trim();

  // Remove markdown code blocks
  cleaned = cleaned.replace(/```json\s*/g, '');
  cleaned = cleaned.replace(/```\s*/g, '');
  
  // Remove any leading/trailing whitespace or newlines
  cleaned = cleaned.trim();

  // Find JSON object boundaries if wrapped in other text
  const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    cleaned = jsonMatch[0];
  }

  return cleaned;
}

/**
 * Safely parses and validates the JSON response
 * @param {string} jsonString - JSON string to parse
 * @returns {Object} Parsed and validated analysis object
 */
function parseAndValidateJSON(jsonString) {
  try {
    const parsed = JSON.parse(jsonString);

    // Validate required fields
    if (!parsed.sentiment || typeof parsed.sentiment !== 'string') {
      throw new Error('Missing or invalid sentiment field');
    }

    if (!parsed.category || typeof parsed.category !== 'string') {
      throw new Error('Missing or invalid category field');
    }

    if (!parsed.summary || typeof parsed.summary !== 'string') {
      throw new Error('Missing or invalid summary field');
    }

    if (!Array.isArray(parsed.suggestions)) {
      throw new Error('Missing or invalid suggestions field (must be an array)');
    }

    // Validate sentiment value
    const validSentiments = ['Positive', 'Neutral', 'Negative'];
    if (!validSentiments.includes(parsed.sentiment)) {
      throw new Error(`Invalid sentiment value. Must be one of: ${validSentiments.join(', ')}`);
    }

    // Validate category value
    const validCategories = ['Infrastructure', 'Teaching', 'Support', 'Service', 'Other'];
    if (!validCategories.includes(parsed.category)) {
      throw new Error(`Invalid category value. Must be one of: ${validCategories.join(', ')}`);
    }

    // Ensure suggestions are strings
    parsed.suggestions = parsed.suggestions.map((s, i) => {
      if (typeof s !== 'string') {
        throw new Error(`Suggestion at index ${i} must be a string`);
      }
      return s.trim();
    }).filter(s => s.length > 0); // Remove empty suggestions

    // Ensure summary is not empty
    if (parsed.summary.trim().length === 0) {
      throw new Error('Summary cannot be empty');
    }

    return {
      sentiment: parsed.sentiment,
      category: parsed.category,
      summary: parsed.summary.trim(),
      suggestions: parsed.suggestions
    };
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error(`Failed to parse JSON response: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Direct REST API call to Gemini (fallback method)
 */
async function callGeminiRESTAPI(modelName, prompt) {
  return new Promise((resolve, reject) => {
    const apiKey = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1/models/${modelName}:generateContent?key=${apiKey}`;
    
    const postData = JSON.stringify({
      contents: [{
        parts: [{
          text: prompt
        }]
      }]
    });

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          if (res.statusCode !== 200) {
            reject(new Error(`API returned status ${res.statusCode}: ${data}`));
            return;
          }
          const response = JSON.parse(data);
          if (response.candidates && response.candidates[0] && response.candidates[0].content) {
            const text = response.candidates[0].content.parts[0].text;
            resolve(text);
          } else {
            reject(new Error('Invalid response format from API'));
          }
        } catch (err) {
          reject(err);
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.write(postData);
    req.end();
  });
}

module.exports = { analyzeFeedbackWithAI };


