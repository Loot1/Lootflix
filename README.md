# Lootflix

Lootflix is a personal TV tracking web app built with React and generated TMDB data.
It showcases watched series, personal ratings, comments, and type-based recommendations.

## Project Purpose

This project is designed to:
- Keep a personal catalog of watched TV series.
- Display favorites, watch history, and category carousels on the home page.
- Browse all series in a sortable table.
- Show a detailed page for each series with TMDB metadata and personal review notes.
- Generate static data and optimized images from TMDB using a local JSON library.

## Tech Stack

Frontend:
- React 19
- TypeScript
- Vite
- React Router
- React Bootstrap + Bootstrap 5
- React Slick / Slick Carousel

Tooling:
- ESLint
- TypeScript compiler (`tsc`)
- TSX (for TypeScript CLI execution)

Data generation pipeline:
- TMDB API integration (token or API key)
- `sharp` for image optimization (JPEG)
- Custom generator services in `generator/`

## Repository Structure

- `src/`: React application code (routes, components, styles, generated data).
- `src/generated/tmdb-media.generated.ts`: generated static media file consumed by the app.
- `public/generated/images/`: generated poster/backdrop assets.
- `generator/`: TMDB generation pipeline (API client, store, rate limiter, generator).
- `tmdb.library.json`: source library (entries, sections, custom types).
- `update-tmdb-data.ts`: CLI entry point for generation/update commands.

## Prerequisites

- Node.js 20+ recommended
- npm
- A TMDB credential:
  - `TMDB_TOKEN` (recommended), or
  - `TMDB_KEY`

## Environment Setup

Create a `.env` file at the project root:

```env
TMDB_TOKEN=your_tmdb_read_access_token
# or
TMDB_KEY=your_tmdb_api_key
```

## Installation

```bash
npm install
```

## Usage

Run the app in development mode:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview production build locally:

```bash
npm run preview
```

Lint the codebase:

```bash
npm run lint
```

## TMDB Data Workflow

Regenerate static data and images from `tmdb.library.json`:

```bash
npm run tmdb:update
```

Add a title to the library and regenerate:

```bash
npm run tmdb:add -- --title="Series Name" --section=favorites --mediaType=tv
```

Add a title without running full regeneration:

```bash
npm run tmdb:add -- --title="Series Name" --no-update
```

## Deployment

Deploy the `dist/` build to GitHub Pages:

```bash
npm run deploy
```

## Notes

- Generated content is localized in French (`fr-FR`) in the data workflow.
- API requests are rate-limited in the generator.
- Images are optimized during generation to keep the app lightweight.
