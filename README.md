<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# ARG-HIVE - AI Studio App

This contains everything you need to run and deploy your AI Studio app.

View your app in AI Studio: https://ai.studio/apps/drive/1mDrpiovsBRpz4JsYPcmeygy4mYKE5QUb

## Quick Start

**Prerequisites:** Node.js 20+

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

## Deployment Options

Multiple deployment options are available:

### 1. Vercel (Recommended)
```bash
# Using script
./scripts/deploy-vercel.sh

# Or manually
vercel --prod
```

### 2. Netlify
```bash
# Using script
./scripts/deploy-netlify.sh

# Or manually
netlify deploy --prod
```

### 3. Docker
```bash
# Using script
./scripts/deploy-docker.sh

# Or manually
docker-compose up -d
```

### 4. GitHub Actions
Push to main branch - automatic deployment configured!

## Documentation

For detailed deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md)

## Features

- React 19 + TypeScript
- Vite for fast builds
- Gemini AI integration
- Recharts for visualizations
- Lucide icons
- Production-ready Docker setup
- CI/CD with GitHub Actions

## Project Structure

```
ARG-HIVE/
├── components/       # React components
├── contexts/         # React contexts
├── utils/           # Utility functions
├── scripts/         # Deployment scripts
├── .github/         # GitHub Actions workflows
├── App.tsx          # Main app component
├── index.tsx        # Entry point
└── vite.config.ts   # Vite configuration
```

## License

MIT
