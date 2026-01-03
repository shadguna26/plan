# Quick Deployment Checklist

Use this checklist to quickly deploy your application.

## ✅ Pre-Deployment Checklist

- [ ] Code is committed and pushed to GitHub
- [ ] You have a Google Gemini API Key
- [ ] You have accounts on deployment platforms (Vercel, Render/Railway)
- [ ] All sensitive data (API keys, Firebase keys) are NOT committed to Git

## 🚀 Deployment Steps

### Step 1: Deploy Backend (Choose one)

#### Option A: Render (Recommended - Free tier available)

- [ ] Go to https://render.com and sign in with GitHub
- [ ] Click "New +" → "Web Service"
- [ ] Connect your GitHub repository
- [ ] Configure:
  - **Name:** feedback-intelligence-api
  - **Root Directory:** `server`
  - **Environment:** Node
  - **Build Command:** `npm install`
  - **Start Command:** `npm start`
- [ ] Add Environment Variables:
  - `GEMINI_API_KEY` = (your API key)
  - `FRONTEND_URL` = (will update after frontend deployment)
  - `NODE_ENV` = `production`
  - `PORT` = `10000`
- [ ] Click "Create Web Service"
- [ ] Wait for deployment (2-3 minutes)
- [ ] Copy your backend URL (e.g., `https://your-app.onrender.com`)

#### Option B: Railway

- [ ] Go to https://railway.app and sign in with GitHub
- [ ] Click "New Project" → "Deploy from GitHub repo"
- [ ] Select your repository
- [ ] Set Root Directory to `server`
- [ ] Add Environment Variables (same as Render)
- [ ] Copy your backend URL

### Step 2: Deploy Frontend

#### Option A: Vercel (Recommended)

- [ ] Go to https://vercel.com and sign in with GitHub
- [ ] Click "New Project"
- [ ] Import your repository
- [ ] Configure:
  - **Root Directory:** `client`
  - **Framework Preset:** Create React App
  - **Build Command:** `npm run build` (auto-detected)
  - **Output Directory:** `build` (auto-detected)
- [ ] Add Environment Variable:
  - `REACT_APP_API_URL` = (your backend URL from Step 1)
- [ ] Click "Deploy"
- [ ] Copy your frontend URL (e.g., `https://your-app.vercel.app`)

#### Option B: Netlify

- [ ] Go to https://netlify.com and sign in with GitHub
- [ ] Click "Add new site" → "Import an existing project"
- [ ] Connect your repository
- [ ] Configure:
  - **Base directory:** `client`
  - **Build command:** `npm run build`
  - **Publish directory:** `client/build`
- [ ] Add Environment Variable:
  - `REACT_APP_API_URL` = (your backend URL from Step 1)
- [ ] Click "Deploy site"

### Step 3: Update Backend CORS

- [ ] Go back to your backend deployment (Render/Railway)
- [ ] Update Environment Variable:
  - `FRONTEND_URL` = (your frontend URL from Step 2)
- [ ] Restart/Redeploy the backend service

### Step 4: Test Your Deployment

- [ ] Visit your frontend URL
- [ ] Test user registration
- [ ] Test login
- [ ] Test feedback analysis
- [ ] Test CSV upload (if applicable)
- [ ] Check browser console for errors
- [ ] Verify all features work correctly

## 🎉 You're Done!

Your application is now live and accessible from anywhere!

## 🔄 Updating Your Deployment

To update your deployment after making code changes:

1. **Commit and push your changes:**
   ```bash
   git add .
   git commit -m "Your update message"
   git push origin main
   ```

2. **Platforms will auto-deploy:**
   - Vercel/Netlify: Auto-deploys on push to main branch
   - Render/Railway: Auto-deploys on push (if auto-deploy is enabled)

3. **Wait for deployment to complete** (usually 1-3 minutes)

## 📝 Notes

- Free tiers may have limitations (e.g., Render services spin down after inactivity)
- Consider upgrading to paid tiers for production workloads
- Monitor your API usage to avoid exceeding quotas
- Keep your API keys secure and never commit them to Git

