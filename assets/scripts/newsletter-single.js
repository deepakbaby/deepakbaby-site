function initNewsletterCopyButtons() {
  document.querySelectorAll('.nl-copy-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault()
      const url = btn.getAttribute('data-url')
      if (!url || !navigator.clipboard) return

      navigator.clipboard.writeText(url).then(() => {
        const original = btn.innerHTML
        btn.classList.add('copied')
        btn.innerHTML = '<svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>'
        setTimeout(() => {
          btn.classList.remove('copied')
          btn.innerHTML = original
        }, 1600)
      }).catch(() => {})
    })
  })
}

function initNewsletterHearts() {
  const heartBtns = document.querySelectorAll('.nl-heart-btn')
  if (!heartBtns.length) return

  let heartedIssues = {}
  try {
    heartedIssues = JSON.parse(localStorage.getItem('nl_hearted_issues')) || {}
  } catch (e) {}

  heartBtns.forEach((btn) => {
    const issueId = btn.getAttribute('data-issue-id')
    const countSpan = btn.querySelector('.heart-count')
    if (!issueId || !countSpan) return

    if (heartedIssues[issueId]) {
      btn.classList.add('hearted')
    }

    fetch('/.netlify/functions/hearts?id=' + encodeURIComponent(issueId))
      .then((r) => r.json())
      .then((data) => { countSpan.textContent = data.count })
      .catch(() => {})

    btn.addEventListener('click', (e) => {
      e.preventDefault()
      let isHearted = Boolean(heartedIssues[issueId])
      const action = isHearted ? 'unlike' : 'like'
      isHearted = !isHearted

      if (isHearted) {
        heartedIssues[issueId] = true
        btn.classList.add('hearted')
      } else {
        delete heartedIssues[issueId]
        btn.classList.remove('hearted')
      }

      try {
        localStorage.setItem('nl_hearted_issues', JSON.stringify(heartedIssues))
      } catch (e) {}

      fetch('/.netlify/functions/hearts?id=' + encodeURIComponent(issueId), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      })
        .then((r) => r.json())
        .then((data) => { countSpan.textContent = data.count })
        .catch(() => {})
    })
  })
}

function initNewsletterJumpRail() {
  const railInner = document.querySelector('.nl-jump-rail-inner')
  const links = Array.from(document.querySelectorAll('.nl-jump-link'))
  if (!links.length) return

  const sections = links
    .map((link) => document.getElementById(link.dataset.target || ''))
    .filter(Boolean)

  if (!sections.length) return
  const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  let activeId = ''

  const centerActiveLink = (activeLink) => {
    if (!activeLink || !railInner || window.innerWidth > 767) return

    const railRect = railInner.getBoundingClientRect()
    const linkRect = activeLink.getBoundingClientRect()
    const targetLeft = railInner.scrollLeft + (linkRect.left - railRect.left) - ((railRect.width / 2) - (linkRect.width / 2))

    railInner.scrollTo({
      left: Math.max(0, targetLeft),
      behavior: prefersReducedMotion ? 'auto' : 'smooth'
    })
  }

  const activate = (id, center = true) => {
    if (!id || id === activeId) return
    activeId = id

    let nextActiveLink = null
    links.forEach((link) => {
      const active = link.dataset.target === id
      link.classList.toggle('active', active)
      link.setAttribute('aria-current', active ? 'true' : 'false')
      if (active) nextActiveLink = link
    })

    if (center) centerActiveLink(nextActiveLink)
  }

  const updateActiveFromScroll = () => {
    const jumpRail = document.querySelector('.nl-jump-rail')
    const offset = (jumpRail ? jumpRail.offsetHeight : 0) + 100
    const scrollY = window.scrollY
    const viewportBottom = scrollY + window.innerHeight
    const fullHeight = document.documentElement.scrollHeight

    if (viewportBottom >= fullHeight - 2) {
      activate(sections[sections.length - 1].id)
      return
    }

    let current = sections[0].id
    sections.forEach((section) => {
      if (section.offsetTop - offset <= scrollY) {
        current = section.id
      }
    })

    activate(current)
  }

  links.forEach((link) => {
    link.addEventListener('click', () => {
      activate(link.dataset.target)
    })
  })

  window.addEventListener('scroll', updateActiveFromScroll, { passive: true })
  window.addEventListener('resize', updateActiveFromScroll)
  updateActiveFromScroll()
}

document.addEventListener('DOMContentLoaded', () => {
  if (!document.body.classList.contains('type-newsletter')) return

  initNewsletterCopyButtons()
  initNewsletterHearts()
  initNewsletterJumpRail()
})
