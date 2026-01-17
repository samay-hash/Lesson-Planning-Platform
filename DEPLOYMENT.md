# 🚀 Deployment Guide - Lesson Planning Platform

This guide will walk you through deploying your application to **Render** (Backend) and **Vercel** (Frontend).

## Prerequisites

- [x] MongoDB Atlas connection string (you already have this!)
- [ ] GitHub account
- [ ] Render account (free tier)
- [ ] Vercel account (free tier)
- [ ] Your code pushed to GitHub

---

## Step 1: Push Your Code to GitHub

1. Initialize git (if not already done):
```bash
cd /Users/samaysamrat/Desktop/kitab/Lesson-Planning-Platform
git init
git add .
git commit -m "Initial commit - Lesson Planning Platform"
```

2. Create a new repository on GitHub (name it `Lesson-Planning-Platform`)

3. Push your code:
```bash
git remote add origin https://github.com/YOUR_USERNAME/Lesson-Planning-Platform.git
git branch -M main
git push -u origin main
```

---

## Step 2: Deploy Backend to Render

### 2.1 Create Web Service

1. Go to [render.com](https://render.com) and sign in
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Select `Lesson-Planning-Platform`

### 2.2 Configure Build Settings

- **Name**: `lesson-planning-backend` (or any name you prefer)
- **Region**: Choose closest to you
- **Root Directory**: `server`
- **Environment**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `node index.js`
- **Instance Type**: `Free`

### 2.3 Add Environment Variables

Click **"Advanced"** → **"Add Environment Variable"** and add these:

| Key | Value |
|-----|-------|
| `MONGO_URI` | `mongodb+srv://samay:8522153976dc@cluster0.ujewxfl.mongodb.net/?appName=Cluster0` |
| `ACCESS_TOKEN_SECRET` | `your_super_secret_access_token_secret_CHANGE_ME` |
| `REFRESH_TOKEN_SECRET` | `your_super_secret_refresh_token_secret_CHANGE_ME` |
| `ACCESS_TOKEN_EXPIRY` | `1d` |
| `REFRESH_TOKEN_EXPIRY` | `10d` |
| `NODE_ENV` | `production` |
| `PORT` | `3004` |
| `GEMINI_API_KEY` | `AIzaSyC_kEb6FK9EVdI3IeerECubWFOGfBzpclo` |
| `CLIENT_URL` | `https://YOUR_VERCEL_APP.vercel.app` (you'll update this later) |

### 2.4 Deploy

1. Click **"Create Web Service"**
2. Wait for deployment to complete (5-10 minutes)
3. Copy your backend URL (e.g., `https://lesson-planning-backend.onrender.com`)

---

## Step 3: Deploy Frontend to Vercel

### 3.1 Prepare Frontend

1. Create a Vercel configuration file:

```bash
# Create vercel.json in client folder
```

**File: `/Users/samaysamrat/Desktop/kitab/Lesson-Planning-Platform/client/vercel.json`**
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

2. Update your frontend API configuration if needed (check if you have an API base URL constant)

### 3.2 Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Configure project:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### 3.3 Add Environment Variables

Under **"Environment Variables"**, add:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://lesson-planning-backend.onrender.com` (your Render URL) |

### 3.4 Deploy

1. Click **"Deploy"**
2. Wait for deployment (2-3 minutes)
3. Copy your frontend URL (e.g., `https://lesson-planning-platform.vercel.app`)

---

## Step 4: Update Backend Environment Variable

1. Go back to **Render Dashboard**
2. Open your backend service
3. Go to **"Environment"** tab
4. Update `CLIENT_URL` to your Vercel URL
5. Click **"Save Changes"** (this will trigger a redeploy)

---

## Step 5: Verify Deployment

1. Visit your Vercel frontend URL
2. Try signing up / signing in
3. Generate a lesson plan
4. Download the `.docx` file

---

## Troubleshooting

### CORS Issues
If you get CORS errors, make sure:
- `CLIENT_URL` in Render matches your Vercel URL exactly (no trailing slash)
- Your backend's CORS configuration allows your frontend domain

### MongoDB Connection Error
- Verify your MongoDB Atlas allows connections from anywhere (IP: `0.0.0.0/0`)
- Check connection string format is correct

### AI Generation Fails
- Verify `GEMINI_API_KEY` is correctly set on Render
- Check server logs on Render dashboard

### File Download Not Working
- Ensure the backend is serving files correctly
- Check browser console for errors

---

## Free Tier Limitations

### Render Free Tier
- Server spins down after 15 minutes of inactivity
- First request after sleep takes 30-60 seconds
- 750 hours/month free

### Vercel Free Tier
- Unlimited deployments
- Function execution limit: 100GB-hours
- Bandwidth: 100GB

---

## Post-Deployment

### Update .gitignore (Important!)
Make sure your `.env` file is NOT pushed to GitHub:

```bash
# Add to .gitignore if not already there
server/.env
client/.env
node_modules/
```

### Secure Your Secrets
Change your `ACCESS_TOKEN_SECRET` and `REFRESH_TOKEN_SECRET` to strong random strings:

```bash
# Generate secure secrets (run in terminal)
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## Success! 🎉

Your application is now live and accessible from anywhere in the world!

**Frontend**: `https://YOUR_APP.vercel.app`
**Backend**: `https://YOUR_BACKEND.onrender.com`

---

## Need Help?

If you encounter any issues:
1. Check Render logs (Dashboard → Your Service → Logs)
2. Check Vercel logs (Dashboard → Your Project → Deployments → View Function Logs)
3. Verify all environment variables are set correctly
