# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio and blog site for Dr. Deepak Baby, built with Hugo static site generator. Features academic publications with automated citation fetching, multilingual support (English/Bengali), and responsive design with dark mode.

## Build Commands

```bash
# Local development (install dependencies first time)
hugo mod tidy && hugo mod npm pack && npm install
hugo server

# Production build
hugo --gc --minify

# Fetch citation counts manually
node scripts/fetch-citations.js
```

**Hugo Extended version is required** (latest version recommended).

## Architecture

**Tech Stack:**
- Hugo (static site generator with Go templating)
- Tailwind CSS + Bootstrap 5 + SCSS
- Vanilla JavaScript (intentionally minimal dependencies)
- PostCSS (autoprefixer, cssnano)

**Key Directories:**
- `/assets/styles/` - SCSS files, entry point: `application.template.scss`
- `/assets/scripts/` - JavaScript modules, entry point: `application.js`
- `/layouts/` - Hugo templates (Go templating)
- `/layouts/partials/sections/` - Homepage section templates
- `/data/` - YAML configuration (publications, section content per language)
- `/content/` - Markdown content (posts, publications, notes)

**Data-Driven Design:**
- Homepage sections configured via YAML in `/data/en/sections/`
- Publications defined in `/data/publications.yaml` with DOIs
- Citation counts auto-fetched from Crossref/Semantic Scholar APIs

## Citation System

The `scripts/fetch-citations.js` script automatically fetches citation counts:
- Runs during Netlify builds
- Uses Crossref API (primary) with Semantic Scholar fallback
- Caches results for 7 days in `/data/.citations-cache.json`
- Updates `/data/publications.yaml` with citation counts

## Deployment

- **Primary:** Netlify (automatic deploys from main branch)
- **Secondary:** GitHub Pages (gh-pages branch via GitHub Actions)
- PR previews available on Netlify with Lighthouse checks

## CI/CD

- PR workflow: Hugo build, Lighthouse performance checks, Lychee link checker
- Merge to main: Hugo module updates, build, deploy to GitHub Pages
