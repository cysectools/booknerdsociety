# Deployment Guide for LeftOnRead

## Overview
This project consists of two main parts:
- **Frontend**: React/Vite app (deployed to Vercel)
- **Backend**: Express/Node.js API with Socket.io (requires separate deployment)

## Frontend Deployment to Vercel

### Prerequisites
1. Install Vercel CLI: `npm install -g vercel`
2. Have your Vercel account ready
3. Have your custom domain ready

### Steps

1. **Login to Vercel**
   ```bash
   vercel login
   ```

2. **Deploy from Root Directory**
   ```bash
   cd /Users/jayson/Downloads/LeftOnRead
   vercel
   ```

3. **Follow the prompts:**
   - Set up and deploy? **Y**
   - Which scope? (Select your account)
   - Link to existing project? **N**
   - Project name? **leftonread** (or your preferred name)
   - In which directory is your code located? **./**
   - Want to override settings? **N**

4. **Configure Environment Variables in Vercel Dashboard**
   - Go to your project settings in Vercel
   - Navigate to "Environment Variables"
   - Add:
     - `VITE_API_URL`: Your backend API URL
     - `VITE_APP_NAME`: LeftOnRead

5. **Connect Your Custom Domain**
   - Go to Project Settings → Domains
   - Add your domain
   - Follow Vercel's DNS configuration instructions

6. **Deploy to Production**
   ```bash
   vercel --prod
   ```

## Backend Deployment Options

Since your backend uses Socket.io (real-time WebSocket connections), it cannot run on Vercel's serverless functions. Here are your options:

### Option 1: Railway.app (Recommended for Socket.io)
Railway is perfect for Node.js apps with WebSocket support.

1. **Sign up at [railway.app](https://railway.app)**

2. **Deploy Backend:**
   ```bash
   # Install Railway CLI
   npm install -g @railway/cli
   
   # Login
   railway login
   
   # Navigate to backend
   cd apps/backend
   
   # Initialize Railway project
   railway init
   
   # Add environment variables
   railway variables set MONGODB_URI="your-mongodb-uri"
   railway variables set JWT_SECRET="your-jwt-secret"
   railway variables set FRONTEND_URL="https://yourdomain.com"
   railway variables set GOOGLE_BOOKS_API_KEY="your-api-key"
   railway variables set NODE_ENV="production"
   
   # Deploy
   railway up
   ```

3. **Get your Railway backend URL** and update the frontend's `VITE_API_URL`

### Option 2: Render.com
Similar to Railway, supports WebSockets.

1. **Sign up at [render.com](https://render.com)**
2. **Create New Web Service**
3. **Connect your GitHub repository**
4. **Configure:**
   - Root Directory: `apps/backend`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
5. **Add Environment Variables** in Render dashboard
6. **Deploy**

### Option 3: DigitalOcean App Platform
1. **Sign up at [digitalocean.com](https://www.digitalocean.com)**
2. **Create App** from your GitHub repository
3. **Configure backend app settings**
4. **Add environment variables**
5. **Deploy**

### Option 4: Separate Vercel Project (Without Socket.io)
If you want to deploy the backend to Vercel, you'll need to remove Socket.io functionality and adapt the API routes to serverless functions.

## MongoDB Setup

Your app needs MongoDB. Options:

1. **MongoDB Atlas (Recommended)**
   - Sign up at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Create a free cluster
   - Get connection string
   - Whitelist all IPs (0.0.0.0/0) for serverless deployment
   - Use connection string as `MONGODB_URI`

## Post-Deployment Checklist

- [ ] Frontend deployed to Vercel
- [ ] Backend deployed (Railway/Render/DO)
- [ ] MongoDB Atlas configured
- [ ] Environment variables set in both frontend and backend
- [ ] Custom domain configured in Vercel
- [ ] DNS settings updated
- [ ] SSL certificates active (automatic with Vercel)
- [ ] Test all API endpoints
- [ ] Test Socket.io real-time features
- [ ] Update CORS settings in backend to include production domain

## Environment Variables Summary

### Frontend (Vercel)
```
VITE_API_URL=https://your-backend-url.com
VITE_APP_NAME=LeftOnRead
```

### Backend (Railway/Render/DO)
```
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/leftonread
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
FRONTEND_URL=https://yourdomain.com
GOOGLE_BOOKS_API_KEY=your-google-books-api-key
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

## Quick Deploy Commands

### Deploy Frontend to Vercel
```bash
cd /Users/jayson/Downloads/LeftOnRead
vercel --prod
```

### Deploy Backend to Railway
```bash
cd apps/backend
railway up
```

## Troubleshooting

### Build Fails
- Check all dependencies are in package.json
- Ensure build commands are correct
- Check Node version compatibility (>= 18.0.0)

### API Calls Failing
- Verify `VITE_API_URL` is set correctly
- Check CORS settings in backend
- Ensure backend is running and accessible

### Domain Not Working
- Verify DNS records are properly configured
- Wait for DNS propagation (can take up to 48 hours)
- Check Vercel domain settings

## Support Resources
- [Vercel Documentation](https://vercel.com/docs)
- [Railway Documentation](https://docs.railway.app)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com)

