# Dynamic Citation Counts System

This directory contains scripts to automatically fetch and update citation counts for your publications.

## Overview

The citation fetching system automatically retrieves citation counts from academic databases at build time, ensuring your publication metrics are always up-to-date without manual intervention.

## How It Works

1. **Build-Time Fetching**: When you build your site (locally or on Netlify), the script runs automatically
2. **API Sources**: Uses free APIs (no authentication required):
   - **Crossref API** (primary): Official DOI registry with citation data
   - **Semantic Scholar API** (fallback): Comprehensive academic search engine
3. **Smart Caching**: Citation counts are cached for 7 days to minimize API calls
4. **Automatic Updates**: The YAML file is automatically updated with citation counts

## Files

- `fetch-citations.js` - Main script that fetches citations and updates publications.yaml
- `../data/.citations-cache.json` - Cache file (auto-generated, gitignored by default)

## Usage

### Automatic (Recommended)

The script runs automatically during builds:

```bash
# Local build
npm run build

# Or direct Hugo build (script runs first)
hugo
```

### Manual

You can also run the script manually:

```bash
# Run the citation fetcher
npm run fetch-citations

# Or directly
node scripts/fetch-citations.js
```

## How It Works in Detail

### 1. DOI Extraction
The script scans your `data/publications.yaml` file and extracts all DOIs.

### 2. API Fetching
For each DOI:
- First tries Crossref API (most reliable)
- Falls back to Semantic Scholar if Crossref fails
- Waits 1 second between requests (API rate limiting)

### 3. Caching
- Citation counts are cached with a timestamp
- Cache is valid for 7 days
- Stale cache is used if API fails (better than no data)

### 4. YAML Update
The script automatically adds `citations: <count>` after each DOI in your YAML file.

## Configuration

You can modify these constants in `fetch-citations.js`:

```javascript
const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days
const REQUEST_DELAY = 1000; // 1 second between requests
```

## API Details

### Crossref API
- **Endpoint**: `https://api.crossref.org/works/{DOI}`
- **Rate Limit**: Polite pool (50 requests/second max, we use 1/second)
- **No Authentication Required**
- **Coverage**: All DOI-registered publications

### Semantic Scholar API
- **Endpoint**: `https://api.semanticscholar.org/graph/v1/paper/DOI:{DOI}`
- **Rate Limit**: 100 requests/5 minutes for public access
- **No Authentication Required**
- **Coverage**: 200M+ papers from all domains

## Netlify Integration

The script is integrated into Netlify builds via `netlify.toml`:

```toml
[build]
command = "node scripts/fetch-citations.js && hugo --gc --minify"
```

This ensures citations are always fresh when deploying to production.

## Cache Management

### Viewing the Cache
```bash
cat data/.citations-cache.json
```

### Clearing the Cache
```bash
rm data/.citations-cache.json
```

The cache will be rebuilt on the next run.

### Committing the Cache (Optional)

By default, the cache is gitignored. If you want to commit it (useful for faster builds):

1. Remove the line from `.gitignore`:
   ```
   data/.citations-cache.json
   ```

2. Commit the cache:
   ```bash
   git add data/.citations-cache.json
   git commit -m "Add citation cache"
   ```

## Troubleshooting

### Script Fails to Fetch Citations

**Problem**: Script completes but shows errors for some DOIs

**Solution**: This is normal! Some DOIs may not have citation data yet, or the APIs may be temporarily unavailable. The script will:
- Use cached data if available
- Continue processing other DOIs
- Show warnings but won't fail the build

### Build Times Are Slow

**Problem**: Netlify builds take too long

**Solutions**:
1. Commit the cache file (removes need to fetch fresh data every build)
2. Increase `CACHE_DURATION` to refresh less frequently
3. The script only fetches uncached or expired entries

### Citation Counts Seem Wrong

**Problem**: Numbers don't match Google Scholar

**Explanation**: Different databases track citations differently:
- **Crossref**: Only tracks citations in DOI-registered publications
- **Semantic Scholar**: Broader coverage but may differ from Google Scholar
- **Google Scholar**: Most comprehensive but no official API

For most accurate counts, Crossref is preferred as it's the official DOI registry.

## PlumX Integration

In addition to citation counts, your publications page includes PlumX widgets that show:
- Usage metrics (views, downloads)
- Captures (bookmarks, favorites)
- Mentions (news, blogs, Wikipedia)
- Social media engagement
- Citation metrics

PlumX widgets load dynamically from the DOI and require no additional configuration.

## Future Enhancements

Possible improvements:
1. Add OpenCitations API as another source
2. Support for other identifiers (PMID, arXiv IDs)
3. Fetch additional metrics (Altmetric scores, etc.)
4. GitHub Actions workflow for scheduled updates
5. Support for Google Scholar (requires scraping or paid APIs)

## Resources

- [Crossref REST API Documentation](https://api.crossref.org/)
- [Semantic Scholar API Documentation](https://api.semanticscholar.org/)
- [PlumX Metrics Documentation](https://plu.mx/plum/developers/widgets)
- [DOI System](https://www.doi.org/)
