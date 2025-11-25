#!/bin/bash

# Скрипт для настройки переменных окружения

echo "🔧 Environment Setup for ARG-HIVE"
echo "=================================="
echo ""

# Функция для запроса API ключа
get_api_key() {
    echo "Please enter your Gemini API Key:"
    echo "(Get it from: https://aistudio.google.com/app/apikey)"
    read -p "API Key: " api_key
    echo "$api_key"
}

# Создание .env.local (для разработки)
echo "Setting up .env.local (for local development)..."
if [ -f .env.local ]; then
    echo "⚠️  .env.local already exists"
    read -p "Overwrite? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Skipping .env.local"
    else
        api_key=$(get_api_key)
        cat > .env.local << EOF
# Gemini API Key
GEMINI_API_KEY=$api_key
EOF
        echo "✅ .env.local created"
    fi
else
    api_key=$(get_api_key)
    cat > .env.local << EOF
# Gemini API Key
GEMINI_API_KEY=$api_key
EOF
    echo "✅ .env.local created"
fi

echo ""

# Создание .env.production (для продакшена)
echo "Setting up .env.production (for production deployment)..."
if [ -f .env.production ]; then
    echo "⚠️  .env.production already exists"
    read -p "Overwrite? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Skipping .env.production"
    else
        if [ -z "$api_key" ]; then
            api_key=$(get_api_key)
        fi
        cat > .env.production << EOF
# Production Environment Variables
GEMINI_API_KEY=$api_key
PORT=3000
NODE_ENV=production
EOF
        echo "✅ .env.production created"
    fi
else
    if [ -z "$api_key" ]; then
        api_key=$(get_api_key)
    fi
    cat > .env.production << EOF
# Production Environment Variables
GEMINI_API_KEY=$api_key
PORT=3000
NODE_ENV=production
EOF
    echo "✅ .env.production created"
fi

echo ""
echo "🎉 Environment setup complete!"
echo ""
echo "⚠️  IMPORTANT SECURITY NOTES:"
echo "1. Never commit .env.local or .env.production to Git"
echo "2. These files are already in .gitignore"
echo "3. For Vercel/Netlify, add GEMINI_API_KEY in their dashboards"
echo "4. Keep your API keys secret!"
echo ""
echo "Next steps:"
echo "- For local dev: npm run dev"
echo "- For Docker: ./scripts/deploy-secure-docker.sh"
echo "- For Vercel: ./scripts/deploy-vercel.sh (then add key in dashboard)"
echo "- For Netlify: ./scripts/deploy-netlify.sh (then add key in dashboard)"
