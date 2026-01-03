# Environment Variables Reference

This document lists all environment variables needed for deployment.

## Frontend Environment Variables

Create these in your frontend deployment platform (Vercel/Netlify):

### Required

| Variable | Description | Example Value |
|----------|-------------|---------------|
| `REACT_APP_API_URL` | Backend API URL | `https://your-backend.onrender.com` |

---

## Backend Environment Variables

Create these in your backend deployment platform (Render/Railway):

### Required

| Variable | Description | Example Value |
|----------|-------------|---------------|
| `GEMINI_API_KEY` | Google Gemini API Key | `AIzaSy...` (get from https://makersuite.google.com/app/apikey) |
| `FRONTEND_URL` | Frontend URL for CORS | `https://your-frontend.vercel.app` |

### Optional

| Variable | Description | Default Value |
|----------|-------------|---------------|
| `PORT` | Server port | `5000` (Render uses 10000) |
| `NODE_ENV` | Environment mode | `development` (set to `production`) |

### Firebase (Optional - only if using Firestore)

| Variable | Description | Notes |
|----------|-------------|-------|
| `FIREBASE_PROJECT_ID` | Firebase Project ID | Use this OR FIREBASE_SERVICE_ACCOUNT |
| `FIREBASE_SERVICE_ACCOUNT` | Firebase Service Account JSON | Full JSON string as environment variable |

---

## Example .env File (Local Development)

Create a `server/.env` file for local development:

```env
# Required
GEMINI_API_KEY=your-actual-api-key-here
FRONTEND_URL=http://localhost:3000

# Optional
PORT=5000
NODE_ENV=development

# Firebase (Optional)
# FIREBASE_PROJECT_ID=your-project-id
# OR
# FIREBASE_SERVICE_ACCOUNT={"type":"service_account","project_id":"..."}
```

**⚠️ Important:** Never commit `.env` files to Git! They contain sensitive information.

---

## Setting Environment Variables on Deployment Platforms

### Vercel
1. Go to Project Settings → Environment Variables
2. Add variable name and value
3. Select environment (Production, Preview, Development)
4. Save and redeploy

### Render
1. Go to your Web Service
2. Click "Environment" tab
3. Add Key-Value pairs
4. Save changes (service will redeploy)

### Railway
1. Go to your project
2. Click "Variables" tab
3. Add new variable
4. Save (auto-redeploys)

### Netlify
1. Go to Site Settings → Environment Variables
2. Add variable
3. Set scope (All, Production, Deploy Previews, Branch deploys)
4. Save (triggers rebuild)

