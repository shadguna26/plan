const { GoogleGenerativeAI } = require("@google/generative-ai");
const https = require("https");
require("dotenv").config();

// Check API key
if (!process.env.GEMINI_API_KEY) {
  console.error("❌ Error: GEMINI_API_KEY is not set in .env file");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Function to list available models
async function listAvailableModels() {
  return new Promise((resolve, reject) => {
    const apiKey = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`;
    
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
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
    }).on('error', reject);
  });
}

async function testGemini() {
  try {
    console.log("🔍 Fetching available models from API...\n");
    
    // List available models
    let availableModels = [];
    try {
      availableModels = await listAvailableModels();
      console.log("✅ Available models:");
      availableModels.forEach(m => console.log(`   - ${m}`));
      console.log("");
    } catch (err) {
      console.log("⚠️  Could not fetch model list, trying common model names...\n");
      // Fallback to common model names
      availableModels = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-pro", "gemini-1.0-pro"];
    }

    // Try to find a working model
    let model = null;
    let modelName = null;

    // If we got model list from API, use those; otherwise use common names
    const modelsToTry = availableModels.length > 0 ? availableModels : 
      ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-pro", "gemini-1.0-pro"];

    for (const name of modelsToTry) {
      try {
        console.log(`🔍 Trying model: ${name}...`);
        const testModel = genAI.getGenerativeModel({ model: name });
        
        // Test if model actually works by making a simple API call
        const testResult = await testModel.generateContent("Say hello");
        const testResponse = testResult.response.text();
        
        if (testResponse && testResponse.trim().length > 0) {
          model = testModel;
          modelName = name;
          console.log(`✅ Model ${name} is working! (Response: "${testResponse.substring(0, 50)}...")\n`);
          break;
        }
      } catch (err) {
        const errorMsg = err.message || err.toString();
        console.log(`❌ Model ${name} failed: ${errorMsg.split('\n')[0].substring(0, 100)}`);
        continue;
      }
    }

    if (!model || !modelName) {
      throw new Error("No working Gemini models found. Please check your API key and ensure it has access to Gemini models.");
    }

    console.log(`\n📝 Using model: ${modelName}`);
    console.log("🧪 Testing with sample feedback...\n");

    const prompt = `Analyze the following feedback and return ONLY a valid JSON object. Do not include any markdown, code blocks, or additional text - just the raw JSON.

FEEDBACK:
"The classrooms are dirty and projectors often don't work."

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

    console.log("📤 Sending request to Gemini API...");
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    console.log("📥 Raw response received:");
    console.log(text);
    console.log("\n🧹 Cleaning response...");

    // Clean the response
    text = text.trim();
    text = text.replace(/```json\s*/g, '');
    text = text.replace(/```\s*/g, '');
    text = text.trim();

    // Extract JSON if wrapped
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      text = jsonMatch[0];
    }

    console.log("\n📋 Parsed JSON:");
    const analysis = JSON.parse(text);
    console.log(JSON.stringify(analysis, null, 2));

    console.log("\n✅ Test successful! Gemini API is working correctly.");
    console.log(`\n📊 Analysis Result:`);
    console.log(`   Sentiment: ${analysis.sentiment}`);
    console.log(`   Category: ${analysis.category}`);
    console.log(`   Summary: ${analysis.summary}`);
    console.log(`   Suggestions: ${analysis.suggestions.length} items`);
    analysis.suggestions.forEach((s, i) => console.log(`     ${i + 1}. ${s}`));

  } catch (error) {
    console.error("\n❌ Error testing Gemini API:");
    console.error(`   ${error.message}`);
    
    if (error.message.includes("API_KEY") || error.message.includes("401")) {
      console.error("\n💡 Tip: Check if your GEMINI_API_KEY is valid");
    } else if (error.message.includes("404") || error.message.includes("not found")) {
      console.error("\n💡 Tip: The model name might be incorrect. Try using 'gemini-pro'");
    } else if (error.message.includes("parse")) {
      console.error("\n💡 Tip: The API response might not be valid JSON");
    }
    process.exit(1);
  }
}

testGemini();
