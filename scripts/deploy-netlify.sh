#!/bin/bash

# Deploy script for Netlify
echo "🚀 Starting Netlify deployment..."

# Check if Netlify CLI is installed
if ! command -v netlify &> /dev/null; then
    echo "❌ Netlify CLI not found. Installing..."
    npm install -g netlify-cli
fi

# Build
echo "🔨 Building application..."
npm run build

# Deploy
echo "📦 Deploying to Netlify..."
netlify deploy --prod

echo ""
echo "🎉 Deployment complete!"
echo "⚠️  Don't forget to set GEMINI_API_KEY in Netlify dashboard!"
