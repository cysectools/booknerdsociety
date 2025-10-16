# Environment Variables Setup

## Frontend Environment Variables

Create a `.env.production` file in `apps/frontend/` with:

```bash
VITE_API_URL=https://your-backend-url.com
VITE_APP_NAME=LeftOnRead
VITE_GOOGLE_BOOKS_API_KEY=your-google-books-api-key
VITE_APP_ENCRYPTION_KEY=your-secure-encryption-key-min-32-chars
```

### Setting Environment Variables in Vercel Dashboard

1. Go to your Vercel project dashboard
2. Click on "Settings" → "Environment Variables"
3. Add the following variables:

| Variable Name | Value | Environment |
|--------------|-------|-------------|
| `VITE_API_URL` | Your backend URL (e.g., `https://your-app.railway.app`) | Production, Preview, Development |
| `VITE_APP_NAME` | `LeftOnRead` | Production, Preview, Development |
| `VITE_GOOGLE_BOOKS_API_KEY` | Your Google Books API key | Production, Preview, Development |
| `VITE_APP_ENCRYPTION_KEY` | A secure 32+ character string | Production, Preview, Development |

## Backend Environment Variables

For your backend deployment (Railway, Render, etc.), set these variables:

```bash
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/leftonread?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-min-64-chars
JWT_EXPIRES_IN=7d
FRONTEND_URL=https://yourdomain.com
GOOGLE_BOOKS_API_KEY=your-google-books-api-key
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
```

### Getting Required API Keys

#### Google Books API Key
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable "Books API"
4. Go to "Credentials" → "Create Credentials" → "API Key"
5. Copy your API key

#### MongoDB Atlas URI
1. Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Click "Connect" → "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your database password
6. Replace `<database>` with `leftonread`

#### JWT Secret
Generate a secure random string:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

#### Gmail App Password (for email features)
1. Go to your Google Account settings
2. Enable 2-Step Verification
3. Go to App Passwords
4. Generate a new app password for "Mail"
5. Use this password (not your regular Gmail password)

## Quick Setup Commands

### Generate Secrets
```bash
# Generate JWT Secret
echo "JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")"

# Generate Encryption Key
echo "VITE_APP_ENCRYPTION_KEY=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")"
```

## Security Notes

⚠️ **NEVER commit `.env` files to git!**
⚠️ **Use different secrets for development and production**
⚠️ **Rotate secrets regularly**
⚠️ **Use environment variable management tools in production**

