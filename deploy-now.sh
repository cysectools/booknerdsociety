#!/bin/bash

# Quick deployment script for LeftOnRead
# This commits your changes and prepares for Vercel deployment

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║          LeftOnRead - Quick Deployment Script                ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

# Show status
echo "📋 Changes to commit:"
git status --short

echo ""
read -p "Do you want to commit and push these changes? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]
then
    echo ""
    echo "📦 Adding all changes..."
    git add .
    
    echo "💾 Committing changes..."
    git commit -m "Configure Vercel deployment - frontend only

- Updated vercel.json to build only frontend
- Fixed backend TypeScript errors
- Added comprehensive deployment documentation
- Created deployment helper scripts
- Backend will be deployed separately to Railway"
    
    echo "🚀 Pushing to GitHub..."
    git push
    
    echo ""
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║                    ✅ PUSH COMPLETE!                          ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo ""
    echo "Vercel will automatically start deploying your frontend!"
    echo ""
    echo "📋 NEXT STEPS:"
    echo ""
    echo "1. Go to your Vercel dashboard to watch the deployment"
    echo "2. Set environment variables in Vercel (see ENV_SETUP.md)"
    echo "3. Deploy your backend to Railway (see QUICK_START_DEPLOYMENT.md)"
    echo "4. Connect your custom domain in Vercel dashboard"
    echo ""
    echo "📖 For detailed instructions: open START_HERE.md"
    echo ""
else
    echo ""
    echo "Deployment cancelled. No changes were committed or pushed."
    echo ""
    echo "To deploy later, run:"
    echo "  git add ."
    echo "  git commit -m 'Configure Vercel deployment'"
    echo "  git push"
    echo ""
fi

echo "════════════════════════════════════════════════════════════════"

