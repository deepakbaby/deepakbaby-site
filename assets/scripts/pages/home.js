// CSS-only typing animation - no ityped library needed
document.addEventListener('DOMContentLoaded', () => {
  const $ul = document.getElementById('typing-carousel-data')?.children
  if ($ul == null || $ul.length === 0) return

  const strings = Array.from($ul).map($el => $el.textContent)
  const typingEl = document.getElementById('ityped')

  if (!typingEl || strings.length === 0) return

  let currentIndex = 0
  let charIndex = 0
  let isDeleting = false
  const typingSpeed = 100
  const deletingSpeed = 50
  const pauseTime = 2000

  function type() {
    const currentString = strings[currentIndex]

    if (isDeleting) {
      typingEl.textContent = currentString.substring(0, charIndex - 1)
      charIndex--
    } else {
      typingEl.textContent = currentString.substring(0, charIndex + 1)
      charIndex++
    }

    let timeout = isDeleting ? deletingSpeed : typingSpeed

    if (!isDeleting && charIndex === currentString.length) {
      timeout = pauseTime
      isDeleting = true
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false
      currentIndex = (currentIndex + 1) % strings.length
    }

    setTimeout(type, timeout)
  }

  // Add cursor using CSS
  typingEl.classList.add('typing-cursor')

  // Start typing
  setTimeout(type, 200)
})
