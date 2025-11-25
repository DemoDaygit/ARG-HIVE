<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# ARG-HIVE - AI Studio App

This contains everything you need to run and deploy your AI Studio app.

View your app in AI Studio: https://ai.studio/apps/drive/1mDrpiovsBRpz4JsYPcmeygy4mYKE5QUb

## Quick Start

**Prerequisites:** Node.js 20+

### Easy Setup (Recommended)
```bash
# 1. Install dependencies
npm install

# 2. Setup environment (interactive)
./scripts/setup-env.sh

# 3. Run the app
npm run dev
```

### Manual Setup
1. Install dependencies:
   ```bash
   npm install
   ```

2. Set the `GEMINI_API_KEY` in `.env.local`:
   ```bash
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
   Get your API key: https://aistudio.google.com/app/apikey

3. Run the app:
   ```bash
   npm run dev
   ```

## 🔒 Secure Deployment (Recommended)

**IMPORTANT:** Never expose your API key in client-side code!

We provide **secure deployment options** with server-side API proxy:

### 1. Vercel (Easiest - 30 seconds) ⭐
```bash
vercel --prod
# Then add GEMINI_API_KEY in Vercel Dashboard → Settings → Environment Variables
```
✅ API key stays on server (safe!)
✅ Automatic HTTPS & scaling
✅ Free tier available

### 2. Netlify (Fast - 1 minute)
```bash
netlify deploy --prod
# Then add GEMINI_API_KEY in Netlify → Site settings → Environment variables
```
✅ API key stays on server (safe!)
✅ Serverless functions included
✅ Free tier available

### 3. Docker with Backend (Self-hosted)
```bash
# Secure deployment with Express backend
./scripts/deploy-secure-docker.sh
```
✅ API key stays on server (safe!)
✅ Full stack in one container
✅ Works on any VPS/Cloud

### 4. GitHub Actions (Automated)
Push to main branch - automatic deployment configured!

## 📚 Documentation

- **[SECURE_DEPLOYMENT.md](SECURE_DEPLOYMENT.md)** - 🔒 **Безопасный деплой без раскрытия API ключа** (ЧИТАТЬ ОБЯЗАТЕЛЬНО!)
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Подробные инструкции по всем вариантам деплоя

## Deployment Comparison

| Method | Security | Setup Time | Cost | Best For |
|--------|----------|------------|------|----------|
| **Vercel** | 🔒 Secure | 30 sec | Free tier | Quick deploy |
| **Netlify** | 🔒 Secure | 1 min | Free tier | JAMstack apps |
| **Docker** | 🔒 Secure | 2 min | VPS cost | Self-hosting |
| Client-only | ❌ **UNSAFE** | Fast | Free | ⚠️ Never use! |

## Features

- 🔒 **Secure API proxy** - API ключ хранится на сервере
- ⚛️ React 19 + TypeScript
- ⚡ Vite for fast builds
- 🤖 Gemini AI integration
- 📊 Recharts for visualizations
- 🎨 Lucide icons
- 🐳 Production-ready Docker setup
- 🚀 CI/CD with GitHub Actions
- 🌐 Serverless functions (Vercel/Netlify)
- 📦 Full-stack Express backend option

## Project Structure

```
ARG-HIVE/
├── api/                    # Vercel serverless functions
├── netlify/functions/      # Netlify serverless functions
├── server/                 # Express backend (for Docker)
├── components/             # React components
├── contexts/               # React contexts
├── utils/                  # Utility functions
│   └── geminiClient.ts    # 🔒 Secure API client
├── scripts/                # Deployment scripts
│   ├── deploy-vercel.sh
│   ├── deploy-netlify.sh
│   ├── deploy-secure-docker.sh
│   └── setup-env.sh
├── .github/workflows/      # GitHub Actions CI/CD
├── Dockerfile              # Frontend-only Docker
├── Dockerfile.fullstack    # 🔒 Secure full-stack Docker
└── docker-compose.fullstack.yml
```

## License

MIT
