// Lightweight native search - no Fuse.js needed
window.addEventListener('DOMContentLoaded', () => {
  const summaryInclude = 60

  const searchQuery = param('keyword')
  if (searchQuery) {
    document.getElementById('search-box').value = searchQuery
    executeSearch(searchQuery)
  } else {
    const node = document.createElement('p')
    node.textContent = 'Please enter a word or phrase above'
    document.getElementById('search-results')?.append(node)
  }

  function executeSearch (searchQuery) {
    const url = window.location.href.split('/search/')[0] + '/index.json'

    fetch(url).then(response => response.json()).then(function (data) {
      const results = simpleSearch(data, searchQuery)

      document.getElementById('search-box').value = searchQuery
      if (results.length > 0) {
        populateResults(results, searchQuery)
      } else {
        const node = document.createElement('p')
        node.textContent = 'No matches found'
        document.getElementById('search-results')?.append(node)
      }
    })
  }

  // Simple native search without Fuse.js
  function simpleSearch(pages, query) {
    const lowerQuery = query.toLowerCase()
    const results = []

    pages.forEach(page => {
      let score = 0
      const matches = []

      // Search in title (highest weight)
      if (page.title && page.title.toLowerCase().includes(lowerQuery)) {
        score += 10
        matches.push({ key: 'title', value: page.title })
      }

      // Search in summary
      if (page.summary && page.summary.toLowerCase().includes(lowerQuery)) {
        score += 5
        matches.push({ key: 'summary', value: page.summary })
      }

      // Search in content
      if (page.contents && page.contents.toLowerCase().includes(lowerQuery)) {
        score += 3
        matches.push({ key: 'contents', value: page.contents })
      }

      // Search in tags
      if (page.tags && page.tags.some(tag => tag.toLowerCase().includes(lowerQuery))) {
        score += 2
        matches.push({ key: 'tags', value: page.tags.join(', ') })
      }

      if (score > 0) {
        results.push({ item: page, score, matches })
      }
    })

    // Sort by score
    return results.sort((a, b) => b.score - a.score)
  }

  function populateResults (results, searchQuery) {
    const searchResultsEl = document.getElementById('search-results')

    results.forEach(function (value, key) {
      const contents = value.item.contents || ''
      let snippet = ''

      // Find snippet containing search term
      const lowerContents = contents.toLowerCase()
      const lowerQuery = searchQuery.toLowerCase()
      const index = lowerContents.indexOf(lowerQuery)

      if (index !== -1) {
        const start = Math.max(0, index - summaryInclude)
        const end = Math.min(contents.length, index + searchQuery.length + summaryInclude)
        snippet = (start > 0 ? '...' : '') + contents.substring(start, end) + (end < contents.length ? '...' : '')
      } else {
        snippet = contents.substring(0, summaryInclude * 2)
      }

      // Get template
      const templateDefinition = document.getElementById('search-result-template').innerHTML

      // Format tags
      function adaptTags() {
        const tags = value.item.tags
        let string = ''
        if (tags) tags.forEach((t) => {
          string += '<li class="rounded"><a href="/tags/' + t.toLowerCase() + '/" class="btn btn-sm btn-info">' + t + "</a></li>"
        })
        return string
      }

      const output = render(templateDefinition, {
        key,
        title: value.item.title,
        hero: value.item.hero,
        date: value.item.date,
        summary: value.item.summary,
        link: value.item.permalink,
        tags: adaptTags(),
        categories: value.item.categories,
        snippet
      })

      const dom = new DOMParser().parseFromString(output, 'text/html')
      searchResultsEl.append(dom.getElementsByClassName('post-card')[0])

      // Simple highlight without Mark.js
      const summaryEl = document.getElementById('summary-' + key)
      if (summaryEl) {
        const regex = new RegExp('(' + searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi')
        summaryEl.innerHTML = summaryEl.innerHTML.replace(regex, '<mark>$1</mark>')
      }
    })
  }

  function param (name) {
    return decodeURIComponent((location.search.split(name + '=')[1] || '').split('&')[0]).replace(/\+/g, ' ')
  }

  function render (templateString, data) {
    let conditionalMatches, copy
    const conditionalPattern = /\$\{\s*isset ([a-zA-Z]*) \s*\}(.*)\$\{\s*end\s*}/g
    copy = templateString
    while ((conditionalMatches = conditionalPattern.exec(templateString)) !== null) {
      if (data[conditionalMatches[1]]) {
        copy = copy.replace(conditionalMatches[0], conditionalMatches[2])
      } else {
        copy = copy.replace(conditionalMatches[0], '')
      }
    }
    templateString = copy
    let key, find, re
    for (key in data) {
      find = '\\$\\{\\s*' + key + '\\s*\\}'
      re = new RegExp(find, 'g')
      templateString = templateString.replace(re, data[key])
    }
    return templateString
  }
})
