#!/usr/bin/env node

/**
 * Fetch citation counts for publications at build time
 * Uses Crossref API and Semantic Scholar API (both free, no auth required)
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// Configuration
const PUBLICATIONS_FILE = path.join(__dirname, '../data/publications.yaml');
const CACHE_FILE = path.join(__dirname, '../data/.citations-cache.json');
const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
const REQUEST_DELAY = 1000; // Delay between API requests to be polite

// Load existing cache
function loadCache() {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      const cache = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
      return cache;
    }
  } catch (error) {
    console.warn('Could not load cache:', error.message);
  }
  return {};
}

// Save cache
function saveCache(cache) {
  try {
    fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));
    console.log('✓ Cache saved');
  } catch (error) {
    console.error('Failed to save cache:', error.message);
  }
}

// Make HTTP GET request
function httpGet(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'PersonalWebsite/1.0' } }, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(new Error('Invalid JSON response'));
          }
        } else {
          reject(new Error(`HTTP ${res.statusCode}`));
        }
      });
    }).on('error', reject);
  });
}

// Fetch citations from Crossref
async function fetchCrossrefCitations(doi) {
  try {
    const url = `https://api.crossref.org/works/${encodeURIComponent(doi)}`;
    const data = await httpGet(url);
    return data.message['is-referenced-by-count'] || 0;
  } catch (error) {
    console.warn(`  Crossref failed for ${doi}:`, error.message);
    return null;
  }
}

// Fetch citations from Semantic Scholar (backup)
async function fetchSemanticScholarCitations(doi) {
  try {
    const url = `https://api.semanticscholar.org/graph/v1/paper/DOI:${encodeURIComponent(doi)}?fields=citationCount`;
    const data = await httpGet(url);
    return data.citationCount || 0;
  } catch (error) {
    console.warn(`  Semantic Scholar failed for ${doi}:`, error.message);
    return null;
  }
}

// Fetch citations with fallback
async function fetchCitationCount(doi) {
  console.log(`  Fetching citations for DOI: ${doi}`);

  // Try Crossref first
  let count = await fetchCrossrefCitations(doi);

  // Fallback to Semantic Scholar if Crossref fails
  if (count === null) {
    console.log('  Trying Semantic Scholar...');
    count = await fetchSemanticScholarCitations(doi);
  }

  if (count !== null) {
    console.log(`  ✓ Found ${count} citations`);
  } else {
    console.log('  ✗ Could not fetch citations');
  }

  return count;
}

// Delay helper
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Extract DOIs from YAML content
function extractDOIs(yamlContent) {
  const doiRegex = /doi:\s*["']?([^"'\n]+)["']?/g;
  const dois = [];
  let match;

  while ((match = doiRegex.exec(yamlContent)) !== null) {
    dois.push(match[1].trim());
  }

  return dois;
}

// Update YAML with citation counts
function updateYAMLWithCitations(yamlContent, citationMap) {
  let updatedContent = yamlContent;
  let updatedCount = 0;

  // Remove existing citation counts first to avoid duplicates
  updatedContent = updatedContent.replace(/\n\s*citations:\s*\d+/g, '');

  // Add new citation counts after DOI lines
  for (const [doi, count] of Object.entries(citationMap)) {
    if (count !== null && count !== undefined) {
      const doiPattern = new RegExp(`(doi:\\s*["']?${doi.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["']?)`, 'g');
      updatedContent = updatedContent.replace(doiPattern, `$1\n    citations: ${count}`);
      updatedCount++;
    }
  }

  return { content: updatedContent, count: updatedCount };
}

// Main function
async function main() {
  console.log('📚 Fetching citation counts for publications...\n');

  // Load publications file
  let yamlContent;
  try {
    yamlContent = fs.readFileSync(PUBLICATIONS_FILE, 'utf8');
  } catch (error) {
    console.error('Failed to read publications file:', error.message);
    process.exit(1);
  }

  // Extract DOIs
  const dois = extractDOIs(yamlContent);
  console.log(`Found ${dois.length} publications with DOIs\n`);

  if (dois.length === 0) {
    console.log('No DOIs found, exiting');
    return;
  }

  // Load cache
  const cache = loadCache();
  const citationMap = {};
  const now = Date.now();

  // Fetch citations
  for (let i = 0; i < dois.length; i++) {
    const doi = dois[i];
    console.log(`[${i + 1}/${dois.length}] Processing ${doi}`);

    // Check cache
    const cached = cache[doi];
    if (cached && (now - cached.timestamp) < CACHE_DURATION) {
      console.log(`  ✓ Using cached value: ${cached.count} citations`);
      citationMap[doi] = cached.count;
    } else {
      // Fetch from API
      const count = await fetchCitationCount(doi);

      if (count !== null) {
        citationMap[doi] = count;
        cache[doi] = { count, timestamp: now };
      } else {
        // Keep old cached value if API fails
        if (cached) {
          console.log(`  ! Using stale cache: ${cached.count} citations`);
          citationMap[doi] = cached.count;
        }
      }

      // Be polite to APIs - wait between requests
      if (i < dois.length - 1) {
        await delay(REQUEST_DELAY);
      }
    }

    console.log('');
  }

  // Save cache
  saveCache(cache);

  // Update YAML file
  console.log('Updating publications file...');
  const { content: updatedContent, count: updatedCount } = updateYAMLWithCitations(yamlContent, citationMap);

  try {
    fs.writeFileSync(PUBLICATIONS_FILE, updatedContent);
    console.log(`✓ Updated ${updatedCount} publications with citation counts`);
  } catch (error) {
    console.error('Failed to write publications file:', error.message);
    process.exit(1);
  }

  console.log('\n✨ Done!');
}

// Run if called directly
if (require.main === module) {
  main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = { main };
