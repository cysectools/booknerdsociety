# Quick Start Deployment Guide

## Prerequisites Checklist
- [ ] Vercel account created
- [ ] Custom domain ready
- [ ] MongoDB Atlas account (free tier is fine)
- [ ] Google Books API key
- [ ] Railway/Render account for backend

## Step-by-Step Deployment

### 1. Deploy Frontend to Vercel (5 minutes)

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Navigate to project root
cd /Users/jayson/Downloads/LeftOnRead

# Deploy
vercel

# When prompted:
# - Set up and deploy? Y
# - Which scope? [Select your account]
# - Link to existing project? N
# - Project name? leftonread
# - In which directory is your code located? ./
# - Want to override settings? N
```

### 2. Set Up MongoDB (5 minutes)

```bash
# 1. Go to https://www.mongodb.com/cloud/atlas
# 2. Create free account
# 3. Create free cluster (M0)
# 4. Create database user (remember username and password)
# 5. Go to Network Access → Add IP Address → Allow Access from Anywhere (0.0.0.0/0)
# 6. Go to Database → Connect → Connect your application
# 7. Copy connection string (looks like: mongodb+srv://username:password@cluster...)
```

### 3. Deploy Backend to Railway (5 minutes)

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Navigate to backend
cd apps/backend

# Initialize and deploy
railway init
railway up

# Set environment variables
railway variables set NODE_ENV=production
railway variables set MONGODB_URI="your-mongodb-connection-string"
railway variables set JWT_SECRET="$(node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")"
railway variables set FRONTEND_URL="https://yourdomain.com"
railway variables set GOOGLE_BOOKS_API_KEY="your-google-books-api-key"

# Get your backend URL
railway status
# Note the URL (e.g., https://your-app.railway.app)
```

### 4. Configure Vercel Environment Variables (2 minutes)

Go to Vercel Dashboard → Your Project → Settings → Environment Variables

Add these variables:

```
VITE_API_URL=https://your-backend-url.railway.app
VITE_APP_NAME=LeftOnRead
VITE_GOOGLE_BOOKS_API_KEY=your-google-books-api-key
VITE_APP_ENCRYPTION_KEY=your-generated-encryption-key
```

### 5. Connect Your Custom Domain (3 minutes)

In Vercel Dashboard:
1. Go to Project Settings → Domains
2. Add your domain (e.g., `yourdomain.com`)
3. Follow DNS instructions to add:
   - **A Record**: Point to Vercel IP
   - **CNAME**: `www` → `cname.vercel-dns.com`
4. Wait for DNS propagation (can take 5-48 hours)

### 6. Redeploy Frontend with Environment Variables

```bash
cd /Users/jayson/Downloads/LeftOnRead
vercel --prod
```

### 7. Update Backend CORS Settings

After frontend is deployed, update backend environment variable in Railway:

```bash
railway variables set FRONTEND_URL="https://yourdomain.com"
```

### 8. Test Your Deployment

1. Visit your domain
2. Test user registration
3. Test login
4. Test book search
5. Test real-time messaging

## Deployment Verification Checklist

- [ ] Frontend loads at your domain
- [ ] No console errors in browser
- [ ] User registration works
- [ ] User login works
- [ ] Book search returns results
- [ ] Real-time features work (if using Socket.io)
- [ ] API calls are successful
- [ ] HTTPS is enabled (automatic with Vercel)
- [ ] Custom domain is working

## Common Issues and Solutions

### Issue: API calls failing (404)
**Solution**: Check that `VITE_API_URL` in Vercel matches your backend URL

### Issue: CORS errors
**Solution**: Ensure `FRONTEND_URL` in backend matches your actual frontend domain

### Issue: Database connection failed
**Solution**: 
- Verify MongoDB connection string
- Check that IP whitelist includes 0.0.0.0/0
- Ensure database user has correct permissions

### Issue: Environment variables not working
**Solution**: Redeploy after setting environment variables in Vercel

### Issue: Domain not working
**Solution**: 
- Wait for DNS propagation (up to 48 hours)
- Verify DNS records are correct
- Check domain registrar settings

## Useful Commands

```bash
# Check Vercel deployment status
vercel ls

# View Vercel logs
vercel logs

# Check Railway status
railway status

# View Railway logs
railway logs

# Redeploy to production
vercel --prod
```

## Getting Help

- Vercel Support: https://vercel.com/support
- Railway Docs: https://docs.railway.app
- MongoDB Atlas Docs: https://docs.atlas.mongodb.com

## Estimated Total Time
**~20-30 minutes** (excluding DNS propagation time)

## Costs
- Vercel: Free for hobby projects
- Railway: Free tier available ($5/month for more resources)
- MongoDB Atlas: Free tier (512 MB storage)
- **Total**: $0-5/month depending on usage

