# 🎲 Board Game Recommender — CLI Deploy Guide

## What This Is

A single-page React app that helps users discover board games based on what they liked/disliked about games they've already played. It uses an element-based preference system with persistent localStorage profiles.

## The File

`board-game-recommender-v7.jsx` — This is the **only source file**. It's a single self-contained React component (~1,350 lines) with everything inline: data, logic, and UI. No separate CSS files, no API calls, no backend.

## Tech Requirements

- **Framework**: Vite + React (not Next.js — this is a single-page app with no routing or SSR needed)
- **Styling**: Tailwind CSS v3+ (the component uses Tailwind utility classes exclusively)
- **Storage**: `localStorage` (already built in, no backend/database needed)
- **Dependencies**: Just React and Tailwind. Nothing else.
- **Node**: 18+

## Setup Instructions

1. Scaffold a new Vite + React project with Tailwind CSS
2. Place the component file in `src/`
3. Update `App.jsx` to import and render `BoardGameRecommenderV7` as the only component
4. The component uses `export default` so import it as: `import BoardGameRecommenderV7 from './board-game-recommender-v7'`
5. Make sure the `body` and `html` have `min-height: 100vh` and no default margins/padding (the component handles its own full-screen gradient background)

## Tailwind Config Notes

- Uses standard Tailwind utility classes only (no custom config needed)
- Uses color opacity modifiers like `bg-emerald-500/20` — make sure Tailwind v3+ is configured
- Uses `backdrop-blur-lg` — this works out of the box in Tailwind v3+

## Vercel Deployment

- Deploy as a standard Vite project
- No environment variables needed
- No serverless functions needed
- No database connection needed
- Build command: `npm run build`
- Output directory: `dist`

## How The App Works (for context)

The app has 5 screens navigated via internal state (no router needed):

1. **Home** — Detects returning users via localStorage, shows taste profile or "Get Started"
2. **Select Games** — Grid of 37 board games to pick from, with search and complexity filters
3. **Rate Elements** — For each selected game, rate 4-6 experience elements as 👍 or 👎
4. **Results** — Shows personalized recommendations in tiers (Perfect / Great / Worth Exploring)
5. **Browse** — Search all 37 games with match %, sortable by match/rating/name/complexity

Users can save their profile to localStorage at any time via the nav bar button.

## Important: Don't Change These Things

- Don't split the component into multiple files — it's designed as a single file for simplicity
- Don't add React Router — navigation is handled via `useState` for `stage`
- Don't add a backend/database — localStorage is intentional for v1
- Don't swap Tailwind for another CSS solution — all 1,350 lines use Tailwind classes
- Keep the `export default` on the component

## Quick Test After Setup

After `npm run dev`, you should see:
- A dark gradient background (slate → indigo → slate)
- "🎲 Board Game Recommender" heading
- "Get Started →" button
- Three step icons at the bottom (🎮 👍👎 🎯)

If you see unstyled HTML, Tailwind isn't configured correctly.
