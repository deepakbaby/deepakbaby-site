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
  initNewsletterJumpRail()
})
