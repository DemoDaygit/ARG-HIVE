#!/bin/bash

# Безопасный деплой с backend proxy (Docker)
echo "🔒 Starting SECURE Docker deployment with backend proxy..."

# Проверка наличия .env.production
if [ ! -f .env.production ]; then
    echo "❌ .env.production file not found!"
    echo ""
    echo "Creating .env.production from template..."
    cat > .env.production << EOF
# Production Environment Variables
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3000
NODE_ENV=production
EOF
    echo ""
    echo "⚠️  Please edit .env.production and add your real GEMINI_API_KEY!"
    echo "Then run this script again."
    exit 1
fi

# Проверка что ключ установлен
if grep -q "your_gemini_api_key_here" .env.production; then
    echo "⚠️  Warning: .env.production still contains placeholder API key!"
    echo "Please edit .env.production and add your real GEMINI_API_KEY"
    echo ""
    read -p "Continue anyway? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Остановка существующих контейнеров
echo "📦 Stopping existing containers..."
docker-compose -f docker-compose.fullstack.yml down 2>/dev/null || true

# Сборка образа
echo "🔨 Building Docker image with backend..."
docker-compose -f docker-compose.fullstack.yml build

# Запуск контейнера
echo "▶️  Starting container..."
docker-compose -f docker-compose.fullstack.yml up -d

# Проверка статуса
echo "✅ Checking container status..."
docker-compose -f docker-compose.fullstack.yml ps

echo ""
echo "🎉 Secure deployment complete!"
echo "📱 Application: http://localhost:3000"
echo "🔌 API Proxy: http://localhost:3000/api/gemini"
echo "🔒 API Key is safely stored on the server!"
echo ""
echo "To view logs: docker-compose -f docker-compose.fullstack.yml logs -f"
echo "To stop: docker-compose -f docker-compose.fullstack.yml down"
