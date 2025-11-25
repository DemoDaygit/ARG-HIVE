#!/bin/bash

# Deploy script for Vercel
echo "🚀 Starting Vercel deployment..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Deploy
echo "📦 Deploying to Vercel..."
vercel --prod

echo ""
echo "🎉 Deployment complete!"
echo "⚠️  Don't forget to set GEMINI_API_KEY in Vercel dashboard!"
