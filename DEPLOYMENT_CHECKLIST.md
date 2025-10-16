# Deployment Checklist

Use this checklist to ensure a smooth deployment process.

## Pre-Deployment Setup

### Accounts & Services
- [ ] Vercel account created ([vercel.com](https://vercel.com))
- [ ] Railway account created ([railway.app](https://railway.app)) OR
- [ ] Render account created ([render.com](https://render.com))
- [ ] MongoDB Atlas account created ([mongodb.com](https://www.mongodb.com/cloud/atlas))
- [ ] Google Cloud account for Books API ([console.cloud.google.com](https://console.cloud.google.com))
- [ ] Domain registrar account with your custom domain

### API Keys & Credentials
- [ ] Google Books API key generated
- [ ] MongoDB Atlas cluster created
- [ ] MongoDB connection string obtained
- [ ] JWT secret generated (64+ chars)
- [ ] Encryption key generated (32+ chars)
- [ ] Gmail app password created (if using email features)

## Frontend Deployment (Vercel)

### Initial Setup
- [ ] Install Vercel CLI: `npm install -g vercel`
- [ ] Login to Vercel: `vercel login`
- [ ] Navigate to project root: `cd /Users/jayson/Downloads/LeftOnRead`

### Deploy
- [ ] Run initial deployment: `vercel`
- [ ] Note the preview URL provided

### Configure Environment Variables
In Vercel Dashboard → Settings → Environment Variables, add:
- [ ] `VITE_API_URL` (your backend URL)
- [ ] `VITE_APP_NAME` = `LeftOnRead`
- [ ] `VITE_GOOGLE_BOOKS_API_KEY` (your API key)
- [ ] `VITE_APP_ENCRYPTION_KEY` (your encryption key)

### Domain Setup
- [ ] Add custom domain in Vercel Dashboard
- [ ] Configure DNS records:
  - [ ] A record pointing to Vercel IP
  - [ ] CNAME for www subdomain
- [ ] Wait for DNS propagation (can take up to 48 hours)
- [ ] Verify SSL certificate is issued (automatic)

### Production Deploy
- [ ] Deploy to production: `vercel --prod`
- [ ] Test deployment at your domain

## Backend Deployment (Railway)

### Initial Setup
- [ ] Install Railway CLI: `npm install -g @railway/cli`
- [ ] Login to Railway: `railway login`
- [ ] Navigate to backend: `cd apps/backend`

### Deploy
- [ ] Initialize Railway project: `railway init`
- [ ] Deploy backend: `railway up`
- [ ] Note your Railway backend URL

### Configure Environment Variables
Set in Railway Dashboard or CLI:
- [ ] `NODE_ENV=production`
- [ ] `PORT=5000`
- [ ] `MONGODB_URI` (your MongoDB connection string)
- [ ] `JWT_SECRET` (your generated secret)
- [ ] `JWT_EXPIRES_IN=7d`
- [ ] `FRONTEND_URL` (your Vercel domain)
- [ ] `GOOGLE_BOOKS_API_KEY` (your API key)
- [ ] `EMAIL_SERVICE=gmail` (if using email)
- [ ] `EMAIL_USER` (your email)
- [ ] `EMAIL_PASS` (your app password)

### Verify Deployment
- [ ] Check Railway logs: `railway logs`
- [ ] Test health endpoint: `https://your-app.railway.app/api/health`

## MongoDB Setup

### Cluster Configuration
- [ ] Free tier cluster created
- [ ] Database user created with strong password
- [ ] Database name set to `leftonread`
- [ ] Network access set to `0.0.0.0/0` (allow from anywhere)

### Connection
- [ ] Connection string copied
- [ ] Password replaced in connection string
- [ ] Connection string added to backend environment variables
- [ ] Test database connection

## Integration & Testing

### Backend URL Update
- [ ] Copy Railway backend URL
- [ ] Update `VITE_API_URL` in Vercel environment variables
- [ ] Redeploy frontend: `vercel --prod`

### Frontend URL Update
- [ ] Copy Vercel frontend URL
- [ ] Update `FRONTEND_URL` in Railway environment variables
- [ ] Redeploy backend if needed

### Functionality Testing
- [ ] Visit your custom domain
- [ ] Test user registration
- [ ] Test user login
- [ ] Test logout
- [ ] Test book search
- [ ] Test book clubs creation
- [ ] Test messaging features
- [ ] Test friend features
- [ ] Check browser console for errors
- [ ] Check network tab for failed API calls

### Performance Testing
- [ ] Page load times acceptable
- [ ] API response times acceptable
- [ ] Images loading properly
- [ ] Animations working smoothly

## Security Verification

### HTTPS & SSL
- [ ] Frontend using HTTPS
- [ ] Backend using HTTPS
- [ ] SSL certificates valid
- [ ] No mixed content warnings

### Environment Variables
- [ ] All secrets set in deployment platforms (not in code)
- [ ] `.env` files not committed to git
- [ ] Production secrets different from development

### CORS Configuration
- [ ] CORS properly configured in backend
- [ ] Only your frontend domain allowed
- [ ] Credentials enabled if needed

## Monitoring & Maintenance

### Set Up Monitoring
- [ ] Enable Vercel Analytics (if desired)
- [ ] Set up Railway monitoring
- [ ] Configure error tracking (Sentry, etc.)
- [ ] Set up uptime monitoring

### Documentation
- [ ] Document deployment process
- [ ] Save all credentials securely (use password manager)
- [ ] Document any issues encountered
- [ ] Create runbook for common operations

### Backup Strategy
- [ ] MongoDB automated backups enabled in Atlas
- [ ] Code backed up in Git repository
- [ ] Environment variables documented securely

## Post-Deployment

### Communication
- [ ] Share new URL with team/users
- [ ] Update any external links
- [ ] Update documentation with live URLs

### Optimization
- [ ] Review Vercel analytics
- [ ] Check Railway resource usage
- [ ] Monitor MongoDB performance
- [ ] Optimize as needed

## Troubleshooting

If something goes wrong, check:
- [ ] Vercel deployment logs
- [ ] Railway deployment logs
- [ ] MongoDB connection status
- [ ] Browser console errors
- [ ] Network tab in browser dev tools
- [ ] Environment variables are correct
- [ ] DNS records are properly configured

## Support Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Railway Documentation](https://docs.railway.app)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com)
- [Google Books API Documentation](https://developers.google.com/books)

---

**Estimated Total Time:** 20-30 minutes (excluding DNS propagation)

**Monthly Cost:** $0-5 with free tiers

