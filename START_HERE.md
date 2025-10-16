# 🚀 Deploy LeftOnRead to Vercel - START HERE

Welcome! This guide will help you deploy your LeftOnRead application to production with your custom domain.

## 📋 What You'll Need (5 minutes to gather)

- ✅ Your custom domain name (you already have this!)
- ✅ A Vercel account (free - [sign up here](https://vercel.com))
- ✅ A Railway account for backend (free tier - [sign up here](https://railway.app))
- ✅ MongoDB Atlas account (free tier - [sign up here](https://mongodb.com/cloud/atlas))
- ✅ Google Books API key ([get one here](https://console.cloud.google.com))

## 🎯 Three Simple Steps

### Step 1: Generate Your Secrets (1 minute)

Run this command from the project root:

```bash
npm run generate:secrets
```

This will create secure secrets for your deployment. **Save these somewhere safe!**

### Step 2: Quick Setup Script (2 minutes)

Run the automated setup:

```bash
./vercel-setup.sh
```

Or manually:

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel
```

### Step 3: Follow the Detailed Guide (15 minutes)

Open **[QUICK_START_DEPLOYMENT.md](./QUICK_START_DEPLOYMENT.md)** and follow the step-by-step instructions.

**Or use the interactive checklist:** [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)

## 📚 All Available Guides

| Guide | Purpose | Time |
|-------|---------|------|
| **[QUICK_START_DEPLOYMENT.md](./QUICK_START_DEPLOYMENT.md)** | Step-by-step deployment (recommended) | 20 min |
| **[DEPLOYMENT.md](./DEPLOYMENT.md)** | Detailed guide with all options | 30 min |
| **[ENV_SETUP.md](./ENV_SETUP.md)** | Environment variables reference | 5 min |
| **[DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)** | Interactive checklist | - |

## ⚡ Super Quick Deploy (for experienced users)

```bash
# 1. Generate secrets
npm run generate:secrets

# 2. Deploy frontend to Vercel
npm install -g vercel
vercel login
vercel --prod

# 3. Deploy backend to Railway
npm install -g @railway/cli
cd apps/backend
railway login
railway init
railway up

# 4. Set environment variables in dashboards
# Vercel: VITE_API_URL, VITE_APP_NAME, VITE_GOOGLE_BOOKS_API_KEY, VITE_APP_ENCRYPTION_KEY
# Railway: NODE_ENV, MONGODB_URI, JWT_SECRET, FRONTEND_URL, GOOGLE_BOOKS_API_KEY

# 5. Connect your domain in Vercel Dashboard
```

## 🎥 Deployment Overview

```
┌─────────────────────────────────────────────────┐
│  1. Frontend (React + Vite)                     │
│     └─> Deploy to Vercel                        │
│     └─> Connect your custom domain              │
│                                                  │
│  2. Backend (Node.js + Express + Socket.io)     │
│     └─> Deploy to Railway                       │
│     └─> Get backend URL                         │
│                                                  │
│  3. Database                                     │
│     └─> MongoDB Atlas (cloud database)          │
│     └─> Get connection string                   │
│                                                  │
│  4. Connect Everything                          │
│     └─> Set environment variables               │
│     └─> Test your deployment                    │
└─────────────────────────────────────────────────┘
```

## 💰 Cost Breakdown

| Service | Free Tier | Paid (if needed) |
|---------|-----------|------------------|
| **Vercel** | ✅ Unlimited websites | $20/mo for team features |
| **Railway** | ✅ $5 free credit/month | $5/mo minimum |
| **MongoDB Atlas** | ✅ 512MB storage | $9/mo for 2GB |
| **Total** | **$0/month** | ~$5-15/month if you exceed free tier |

## 🆘 Need Help?

- **Issue with deployment?** Check [DEPLOYMENT.md](./DEPLOYMENT.md#troubleshooting)
- **Environment variables confusing?** See [ENV_SETUP.md](./ENV_SETUP.md)
- **Want a checklist?** Use [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)

## ✨ What Happens After Deployment

Once deployed, your app will be:
- ✅ Live at your custom domain
- ✅ Secured with HTTPS (automatic)
- ✅ Globally distributed (fast worldwide)
- ✅ Auto-scaled (handles traffic spikes)
- ✅ Continuously deployed (push to deploy)

## 🎉 Ready to Deploy?

**Start here:** [QUICK_START_DEPLOYMENT.md](./QUICK_START_DEPLOYMENT.md)

---

**Questions?** Open an issue or check the detailed guides above.

**Estimated total time:** 20-30 minutes ⏱️

