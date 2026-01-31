# 🎲 Board Game Recommender

A single-page React app that helps users discover board games based on their preferences.

## Local Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deploy to Vercel

This project is ready to deploy to Vercel:

```bash
# Option 1: Use Vercel CLI
npm install -g vercel
vercel

# Option 2: Connect via Vercel Dashboard
# 1. Push this repo to GitHub
# 2. Go to vercel.com
# 3. Import your repository
# 4. Vercel will auto-detect the Vite configuration
```

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **localStorage** - Persistent user preferences (no backend needed)

## Project Structure

```
├── src/
│   ├── board-game-recommender-v7.jsx  # Main component
│   ├── App.jsx                        # App wrapper
│   ├── main.jsx                       # Entry point
│   └── index.css                      # Tailwind imports
├── index.html                         # HTML template
├── vite.config.js                     # Vite configuration
├── tailwind.config.js                 # Tailwind configuration
└── vercel.json                        # Vercel deployment config
```

## Features

- 5-stage recommendation flow
- 37 board games database
- Element-based preference system
- Persistent localStorage profiles
- Search and filter functionality
- Match percentage scoring
