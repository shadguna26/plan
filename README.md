# Feedback Intelligence Dashboard

An AI-powered full-stack web application that analyzes feedback text using Google Gemini AI to provide actionable insights, sentiment analysis, and trend detection.

## 🚀 Features

- **🔐 User Authentication**: Secure login and registration system with JWT tokens
- **AI-Powered Analysis**: Uses Google Gemini API for intelligent feedback analysis
- **Sentiment Analysis**: Overall sentiment breakdown (Positive, Neutral, Negative)
- **Category Detection**: Automatically identifies and categorizes feedback topics
- **Trend Detection**: Tracks continuous negative trends across multiple analyses
- **Actionable Suggestions**: AI-generated recommendations based on feedback
- **Executive Summary**: High-level insights for decision-makers
- **Google Forms Integration**: Supports CSV upload from Google Sheets
- **Modern Dashboard**: Clean, responsive UI with interactive charts
- **Protected Routes**: Secure access to dashboard and analysis features

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Google Gemini API Key ([Get one here](https://makersuite.google.com/app/apikey))

## 🛠️ Installation

1. **Clone or navigate to the project directory**

2. **Install dependencies for all parts of the application:**
   ```bash
   npm run install-all
   ```

   Or install manually:
   ```bash
   npm install
   cd server && npm install
   cd ../client && npm install
   ```

3. **Set up environment variables:**
   
   Create a `.env` file in the `server` directory:
   ```bash
   cd server
   cp .env.example .env
   ```
   
   Edit `server/.env` and add your Gemini API key:
   ```
   GEMINI_API_KEY=your-actual-api-key-here
   PORT=5000
   ```

## 🚀 Running the Application

### Option 1: Run both frontend and backend together
```bash
npm run dev
```

### Option 2: Run separately

**Terminal 1 - Backend:**
```bash
cd server
npm start
```

**Terminal 2 - Frontend:**
```bash
cd client
npm start
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## 📊 Usage

1. **Register/Login:**
   - Navigate to the application (default: http://localhost:3000)
   - Create a new account or login with existing credentials
   - You'll be redirected to the dashboard after authentication

2. **Analyze Text Feedback:**
   - Paste your feedback text in the textarea
   - Click "Analyze Feedback"
   - View results in the dashboard

3. **Upload CSV from Google Forms:**
   - Export your Google Forms responses as CSV from Google Sheets
   - Click "Upload CSV from Google Forms"
   - Select your CSV file
   - The system will automatically extract and analyze all text fields

## 🏗️ Project Structure

```
feedback-intelligence-dashboard/
├── server/
│   ├── index.js              # Express server and API endpoints
│   ├── aiService.js          # Google Gemini AI integration
│   ├── storageService.js     # File-based storage for trend detection
│   ├── data/                 # Storage directory (auto-created)
│   ├── uploads/              # Temporary CSV uploads (auto-created)
│   └── package.json
├── client/
│   ├── src/
│   │   ├── App.js            # Main React component
│   │   ├── components/       # React components
│   │   │   ├── FeedbackInput.js
│   │   │   ├── SentimentOverview.js
│   │   │   ├── SentimentCards.js
│   │   │   ├── CategoryAnalysis.js
│   │   │   ├── TrendDetection.js
│   │   │   ├── Suggestions.js
│   │   │   ├── ExecutiveSummary.js
│   │   │   └── DataSourceStatus.js
│   │   └── index.js
│   └── package.json
└── package.json
```

## 🔌 API Endpoints

### Authentication Endpoints

#### POST `/api/auth/register`
Register a new user account.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "token": "jwt-token-here",
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

#### POST `/api/auth/login`
Login with email and password.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "jwt-token-here",
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

#### GET `/api/auth/verify`
Verify JWT token (requires Authorization header).

#### GET `/api/auth/me`
Get current user information (requires Authorization header).

### Analysis Endpoints (Protected - Requires Authentication)

#### POST `/analyze-feedback`
Analyzes feedback text and returns structured analysis.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Request:**
```json
{
  "feedbackText": "Your feedback text here..."
}
```

**Response:**
```json
{
  "overall_sentiment": {
    "positive": 45,
    "neutral": 30,
    "negative": 25
  },
  "category_analysis": [...],
  "continuous_negative_areas": [...],
  "suggestions": [...],
  "summary": "...",
  "timestamp": "..."
}
```

#### POST `/upload-csv`
Uploads and processes CSV file from Google Forms.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Request:** Multipart form data with `csvFile` field

#### GET `/sync-status`
Returns data source sync status and record count.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

### GET `/health`
Health check endpoint.

## 🎨 Tech Stack

**Frontend:**
- React 18
- React Router DOM
- Tailwind CSS
- Recharts
- Axios

**Backend:**
- Node.js
- Express.js
- Google Gemini AI
- JWT (JSON Web Tokens)
- bcryptjs (password hashing)
- Multer (file uploads)
- CSV Parser

**Storage:**
- File-based JSON storage (in-memory alternative available)

## 🔍 How It Works

1. **Feedback Input**: User provides feedback text or uploads CSV
2. **AI Analysis**: Backend sends text to Google Gemini API with structured prompt
3. **Data Processing**: AI returns JSON with sentiment, categories, and insights
4. **Trend Detection**: System compares current analysis with historical data
5. **Visualization**: Frontend displays results in charts, cards, and tables
6. **Storage**: Analysis results are stored for future trend comparisons

## 📝 Notes

- **Authentication**: Uses JWT tokens stored in localStorage. Tokens expire after 7 days.
- **Password Security**: Passwords are hashed using bcryptjs before storage.
- **User Data**: User accounts are stored in `server/data/users.json` (file-based storage).
- **Protected Routes**: All analysis endpoints require valid JWT authentication.
- The AI prompt is designed to return structured JSON (not conversational responses)
- Trend detection compares current analysis with up to 50 previous analyses
- CSV uploads are automatically cleaned up after processing
- All data is stored locally in JSON files (no database required)

## 🐛 Troubleshooting

**API Key Issues:**
- Ensure your Gemini API key is correctly set in `server/.env`
- Check that the API key has proper permissions

**Port Conflicts:**
- Change `PORT` in `server/.env` if port 5000 is in use
- Update `proxy` in `client/package.json` if backend port changes

**CORS Issues:**
- Backend includes CORS middleware for development
- For production, configure CORS appropriately

## 📄 License

MIT

## 🤝 Contributing

This is a demo/hackathon project. Feel free to extend and improve!

---

**Built with ❤️ for turning feedback into actionable insights**

