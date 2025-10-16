#!/bin/bash

# Vercel Deployment Setup Script for LeftOnRead
# This script helps you deploy your app to Vercel

set -e

echo "🚀 LeftOnRead - Vercel Deployment Setup"
echo "========================================"
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Vercel CLI not found. Installing..."
    npm install -g vercel
    echo "✅ Vercel CLI installed successfully!"
else
    echo "✅ Vercel CLI is already installed"
fi

echo ""
echo "🔐 Generating deployment secrets..."
node generate-secrets.js

echo ""
echo "📝 Next Steps:"
echo ""
echo "1. Login to Vercel:"
echo "   vercel login"
echo ""
echo "2. Deploy your app:"
echo "   vercel"
echo ""
echo "3. Set environment variables in Vercel Dashboard:"
echo "   - Go to your project in Vercel"
echo "   - Settings → Environment Variables"
echo "   - Add the variables shown above"
echo ""
echo "4. Deploy to production:"
echo "   vercel --prod"
echo ""
echo "5. Connect your custom domain:"
echo "   - Vercel Dashboard → Domains"
echo "   - Add your domain and configure DNS"
echo ""
echo "📖 For detailed instructions, see:"
echo "   - QUICK_START_DEPLOYMENT.md"
echo "   - DEPLOYMENT.md"
echo ""
echo "========================================"

