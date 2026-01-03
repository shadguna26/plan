# Deployment Guide

This guide will help you deploy the Feedback Intelligence Dashboard to production.

## 📋 Prerequisites

Before deploying, ensure you have:
- A Google Gemini API Key ([Get one here](https://makersuite.google.com/app/apikey))
- A GitHub account (for connecting repositories)
- Accounts on your chosen deployment platforms

## 🚀 Deployment Options

### Option 1: Vercel (Frontend) + Render/Railway (Backend) - **Recommended**

This is the easiest and most popular option for React + Node.js applications.

#### Frontend Deployment (Vercel)

1. **Push your code to GitHub** (if not already done)
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. **Deploy to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Sign up/Login with GitHub
   - Click "New Project"
   - Import your repository
   - Set the following:
     - **Root Directory:** `client`
     - **Framework Preset:** Create React App
     - **Build Command:** `npm run build`
     - **Output Directory:** `build`
     - **Install Command:** `npm install`

3. **Configure Environment Variables in Vercel:**
   - Go to Project Settings → Environment Variables
   - Add: `REACT_APP_API_URL` = `https://your-backend-url.onrender.com` (or your backend URL)

4. **Deploy!**
   - Click "Deploy"
   - Vercel will build and deploy your frontend
   - Your app will be live at: `https://your-project.vercel.app`

#### Backend Deployment (Render or Railway)

##### Using Render (Free tier available)

1. **Go to [render.com](https://render.com)**
   - Sign up/Login with GitHub

2. **Create a New Web Service:**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - **Name:** feedback-intelligence-api (or your choice)
     - **Root Directory:** `server`
     - **Environment:** Node
     - **Build Command:** `npm install`
     - **Start Command:** `npm start`
     - **Plan:** Free (or paid)

3. **Set Environment Variables:**
   - Go to Environment tab
   - Add the following variables:
     ```
     GEMINI_API_KEY=your-gemini-api-key-here
     PORT=10000
     FRONTEND_URL=https://your-frontend-url.vercel.app
     NODE_ENV=production
     ```
     (Optional Firebase variables if using Firestore):
     ```
     FIREBASE_PROJECT_ID=your-project-id
     FIREBASE_SERVICE_ACCOUNT={"type":"service_account",...}
     ```

4. **Deploy!**
   - Click "Create Web Service"
   - Render will build and deploy your backend
   - Your API will be live at: `https://your-service.onrender.com`

##### Using Railway (Alternative)

1. **Go to [railway.app](https://railway.app)**
   - Sign up/Login with GitHub

2. **Create New Project:**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Configure Service:**
   - Set Root Directory to `server`
   - Railway will auto-detect Node.js

4. **Set Environment Variables:**
   - Go to Variables tab
   - Add the same environment variables as Render

5. **Deploy!**
   - Railway will automatically deploy
   - Your API will be live at: `https://your-app.up.railway.app`

---

### Option 2: Vercel Full-Stack (Frontend + API Routes)

For a simpler deployment, you can deploy the entire app on Vercel using serverless functions.

**Note:** This requires restructuring the backend as Vercel serverless functions. See `vercel-fullstack.json` for configuration.

---

### Option 3: Netlify (Frontend) + Backend Service

Similar to Option 1, but using Netlify for frontend hosting.

#### Frontend Deployment (Netlify)

1. **Go to [netlify.com](https://netlify.com)**
   - Sign up/Login with GitHub

2. **New Site from Git:**
   - Click "Add new site" → "Import an existing project"
   - Connect your repository

3. **Build Settings:**
   - **Base directory:** `client`
   - **Build command:** `npm run build`
   - **Publish directory:** `client/build`

4. **Environment Variables:**
   - Go to Site settings → Environment variables
   - Add: `REACT_APP_API_URL` = your backend URL

5. **Deploy!**

---

## 🔧 Post-Deployment Steps

### 1. Update Frontend API URL

After backend deployment, update the frontend environment variable:
- **Vercel/Netlify:** Update `REACT_APP_API_URL` in environment variables
- Redeploy the frontend

### 2. Update Backend CORS Settings

Ensure your backend `FRONTEND_URL` environment variable matches your deployed frontend URL.

### 3. Test the Deployment

1. Visit your frontend URL
2. Try registering a new account
3. Test the feedback analysis feature
4. Verify CSV upload functionality

### 4. Set up Custom Domains (Optional)

Both Vercel and Render support custom domains:
- **Vercel:** Project Settings → Domains
- **Render:** Service Settings → Custom Domains

---

## 🔐 Environment Variables Reference

### Frontend (Client)

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `REACT_APP_API_URL` | Backend API URL | Yes | `https://api.yourdomain.com` |

### Backend (Server)

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `GEMINI_API_KEY` | Google Gemini API Key | Yes | `AIzaSy...` |
| `PORT` | Server port | No | `5000` (default) |
| `FRONTEND_URL` | Frontend URL for CORS | Yes | `https://app.yourdomain.com` |
| `NODE_ENV` | Environment mode | No | `production` |
| `FIREBASE_PROJECT_ID` | Firebase Project ID (optional) | No | `your-project-id` |
| `FIREBASE_SERVICE_ACCOUNT` | Firebase Service Account JSON (optional) | No | `{"type":"service_account",...}` |

---

## 📝 Important Notes

1. **Free Tier Limitations:**
   - Render free tier: Services spin down after 15 minutes of inactivity
   - Vercel free tier: Generous limits for personal projects
   - Consider paid tiers for production workloads

2. **File Storage:**
   - The app uses file-based storage (`server/data/`)
   - On platforms like Render, files are ephemeral
   - Consider migrating to a database (MongoDB, PostgreSQL) or Firebase Firestore for production

3. **Firebase Configuration:**
   - If using Firebase, ensure service account JSON is properly configured
   - Store Firebase keys securely (never commit to Git)
   - Use environment variables for Firebase credentials in production

4. **API Rate Limits:**
   - Google Gemini API has rate limits
   - Monitor usage to avoid exceeding quotas

5. **Build Optimization:**
   - Frontend builds are optimized automatically by React Scripts
   - Backend should use `NODE_ENV=production` for optimal performance

---

## 🐛 Troubleshooting

### Backend not connecting to frontend
- Check CORS settings in backend
- Verify `FRONTEND_URL` matches your frontend domain
- Check browser console for CORS errors

### API calls failing
- Verify `REACT_APP_API_URL` is set correctly
- Check backend logs for errors
- Ensure backend is running and accessible

### Environment variables not working
- Restart/redeploy after adding environment variables
- Verify variable names match exactly (case-sensitive)
- Check platform-specific documentation for env var syntax

### Build failures
- Check build logs for specific errors
- Verify all dependencies are in `package.json`
- Ensure Node.js version compatibility

---

## 🎉 Success!

Once deployed, your Feedback Intelligence Dashboard will be:
- ✅ Accessible from anywhere
- ✅ Secured with HTTPS
- ✅ Scalable and reliable
- ✅ Ready for production use

**Need help?** Check the platform-specific documentation or open an issue.

