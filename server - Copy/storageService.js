const fs = require('fs');
const path = require('path');

const STORAGE_FILE = path.join(__dirname, 'data', 'analyses.json');
const DATA_DIR = path.join(__dirname, 'data');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

/**
 * Stores an analysis result for trend detection
 */
function storeAnalysis(analysis) {
  try {
    let analyses = [];
    
    // Load existing analyses
    if (fs.existsSync(STORAGE_FILE)) {
      const data = fs.readFileSync(STORAGE_FILE, 'utf8');
      analyses = JSON.parse(data);
    }

    // Add new analysis with timestamp
    analyses.push({
      timestamp: new Date().toISOString(),
      overall_sentiment: analysis.overall_sentiment,
      category_analysis: analysis.category_analysis,
      summary: analysis.summary
    });

    // Keep only last 50 analyses to prevent file from growing too large
    if (analyses.length > 50) {
      analyses = analyses.slice(-50);
    }

    // Save to file
    fs.writeFileSync(STORAGE_FILE, JSON.stringify(analyses, null, 2));
  } catch (error) {
    console.error('Error storing analysis:', error);
  }
}

/**
 * Retrieves historical analysis data for trend detection
 */
function getTrendData() {
  try {
    if (fs.existsSync(STORAGE_FILE)) {
      const data = fs.readFileSync(STORAGE_FILE, 'utf8');
      const analyses = JSON.parse(data);
      return {
        historicalAnalyses: analyses,
        totalAnalyses: analyses.length
      };
    }
  } catch (error) {
    console.error('Error reading trend data:', error);
  }

  return {
    historicalAnalyses: [],
    totalAnalyses: 0
  };
}

/**
 * Clears all stored analyses (useful for testing)
 */
function clearAnalyses() {
  try {
    if (fs.existsSync(STORAGE_FILE)) {
      fs.unlinkSync(STORAGE_FILE);
    }
  } catch (error) {
    console.error('Error clearing analyses:', error);
  }
}

module.exports = {
  storeAnalysis,
  getTrendData,
  clearAnalyses
};





