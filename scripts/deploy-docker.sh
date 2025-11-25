#!/bin/bash

# Deploy script for Docker
echo "🚀 Starting Docker deployment..."

# Stop and remove existing container
echo "📦 Stopping existing container..."
docker-compose down 2>/dev/null || true

# Build the image
echo "🔨 Building Docker image..."
docker-compose build

# Start the container
echo "▶️  Starting container..."
docker-compose up -d

# Check status
echo "✅ Checking container status..."
docker-compose ps

echo ""
echo "🎉 Deployment complete!"
echo "📱 Application is running at: http://localhost"
echo ""
echo "To view logs, run: docker-compose logs -f"
echo "To stop, run: docker-compose down"
