# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Install Dependencies
```bash
npm run install-all
```

### Step 2: Get Your Gemini API Key
1. Visit: https://makersuite.google.com/app/apikey
2. Sign in with your Google account
3. Create a new API key
4. Copy the API key

### Step 3: Configure Environment
1. Navigate to the `server` directory
2. Copy `.env.example` to `.env`:
   ```bash
   cd server
   copy .env.example .env
   ```
3. Open `.env` and paste your API key:
   ```
   GEMINI_API_KEY=paste-your-key-here
   ```

### Step 4: Start the Application
```bash
npm run dev
```

This will start:
- Backend server on http://localhost:5000
- Frontend app on http://localhost:3000

### Step 5: Test the Application

**Option A: Analyze Text Feedback**
1. Open http://localhost:3000
2. Paste some feedback text in the textarea
3. Click "Analyze Feedback"
4. View the results!

**Option B: Upload CSV from Google Forms**
1. Export your Google Forms responses as CSV from Google Sheets
2. Click "Upload CSV from Google Forms"
3. Select your CSV file
4. Wait for analysis to complete

## 📝 Sample Feedback Text

Try this sample feedback:
```
The product quality is excellent and the customer service team is very responsive. However, the delivery times are inconsistent and pricing could be more competitive. The user interface is intuitive but lacks some advanced features that competitors offer. Overall, I'm satisfied but there's room for improvement in logistics and feature set.
```

## 🎯 What to Expect

After analysis, you'll see:
- ✅ Overall sentiment breakdown (pie chart)
- ✅ Sentiment summary cards
- ✅ Category-wise analysis (bar chart)
- ✅ Continuous negative trend detection
- ✅ AI-generated suggestions
- ✅ Executive summary

## 🐛 Troubleshooting

**"Failed to analyze feedback" error:**
- Check that your Gemini API key is correctly set in `server/.env`
- Verify the API key is active and has proper permissions

**Port already in use:**
- Change `PORT=5000` to another port in `server/.env`
- Update `proxy` in `client/package.json` to match

**CSV upload not working:**
- Ensure CSV file is properly formatted
- Check that CSV contains text fields (not just numbers)

## 📚 Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Customize the AI prompts in `server/aiService.js`
- Adjust trend detection logic in `server/index.js`
- Modify UI components in `client/src/components/`

Happy analyzing! 🎉


