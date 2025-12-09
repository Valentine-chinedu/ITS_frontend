# Geometry Intelligent Tutor (Frontend)

A Next.js app for visual, ontology-based geometry learning and practice. Mark mastered concepts, get recommendations, and solve practice problems linked to a backend.

## Features

- Visual concept mastery tracking
- Ontology-driven recommendations
- Practice problems with instant feedback
- Shape images for concepts (SVG/PNG)

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm

### Install dependencies

```bash
npm install
```

### Run the development server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
app/
	components/ShapeImage.tsx   # Displays concept images with fallback
	lib/config.ts               # Backend URL config
	problems/page.tsx           # Practice problems UI
	page.tsx                    # Main concept mastery UI
public/
	shapes/                     # Place SVG/PNG images here (e.g. triangle.svg)
		_default.svg              # Default placeholder image
```

## Shape Images

- Add SVGs (preferred) or PNGs to `public/shapes/` named by concept (e.g. `triangle.svg`).
- If an image is missing, `_default.svg` will be shown.

## Troubleshooting Images

- If images do not display, ensure your files are named correctly and placed in `public/shapes/`.
- The fallback uses `_default.svg` for missing images.

## Backend

- Set the backend API URL in `app/lib/config.ts` (`BACKEND_URL`).
- The frontend expects endpoints `/concepts`, `/next-concepts`, `/problems`, and `/check-answer`.

## License

MIT
