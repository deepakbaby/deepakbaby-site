// Minimal core application - NO heavy libraries
// Only core utilities (lightweight)
import './core'

// NOTE: Features (mermaid, katex, highlight.js) are NOT imported here
// They add 2MB+ to the bundle. Load them via CDN or separate bundles if needed.

// Lightweight vanilla JS for Bootstrap components (no library needed)
document.addEventListener('DOMContentLoaded', () => {
  // Navbar toggle
  const navbarToggler = document.querySelector('[data-bs-toggle="collapse"]');
  const navbarCollapse = document.querySelector('.navbar-collapse');

  if (navbarToggler && navbarCollapse) {
    navbarToggler.addEventListener('click', (e) => {
      e.stopPropagation();
      navbarCollapse.classList.toggle('show');
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.navbar') && navbarCollapse.classList.contains('show')) {
        navbarCollapse.classList.remove('show');
      }
    });
  }

  // Dropdown toggles
  document.querySelectorAll('[data-bs-toggle="dropdown"]').forEach(toggle => {
    const dropdown = toggle.nextElementSibling;

    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      // Close other dropdowns
      document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
        if (menu !== dropdown) menu.classList.remove('show');
      });

      dropdown?.classList.toggle('show');
    });
  });

  // Close dropdowns when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('[data-bs-toggle="dropdown"]')) {
      document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
        menu.classList.remove('show');
      });
    }
  });

  // Tooltip implementation (lightweight, CSS-based)
  document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(el => {
    const title = el.getAttribute('title') || el.getAttribute('data-bs-original-title');
    if (title) {
      el.setAttribute('data-tooltip', title);
      el.removeAttribute('title');
    }
  });

  // ScrollSpy functionality (lightweight version)
  const scrollSpyTarget = document.querySelector('[data-bs-spy="scroll"]')?.getAttribute('data-bs-target');
  if (scrollSpyTarget) {
    const toc = document.querySelector(scrollSpyTarget);
    const sections = document.querySelectorAll('h1[id], h2[id], h3[id], h4[id]');

    if (toc && sections.length > 0) {
      const onScroll = () => {
        let current = '';
        sections.forEach(section => {
          const sectionTop = section.offsetTop;
          if (window.pageYOffset >= sectionTop - 100) {
            current = section.getAttribute('id');
          }
        });

        toc.querySelectorAll('a').forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
          }
        });
      };

      window.addEventListener('scroll', onScroll);
      onScroll();
    }
  }
});

// Navbar scroll effects (inline - very lightweight)
const updateNavBar = () => {
  const topNavbar = document.getElementById('top-navbar')
  const navbarToggler = document.getElementById('navbar-toggler')
  const themeIcon = document.getElementById('navbar-theme-icon-svg')

  if (window.scrollY > 40) {
    topNavbar?.classList.remove('transparent-navbar')
    topNavbar?.classList.add('shadow')
    navbarToggler?.classList.remove('navbar-dark')
    navbarToggler?.classList.add('navbar-light')
    themeIcon?.classList.remove('svg-inverted')

    const mainLogo = document.getElementById('main-logo')
    if (mainLogo) {
      const logoURL = mainLogo.getAttribute('src')
      document.getElementById('logo')?.setAttribute('src', logoURL)
    }
  } else {
    topNavbar?.classList.remove('shadow')
    topNavbar?.classList.add('transparent-navbar')
    navbarToggler?.classList.remove('navbar-light')
    navbarToggler?.classList.add('navbar-dark')
    themeIcon?.classList.add('svg-inverted')

    const invertedLogo = document.getElementById('inverted-logo')
    if (invertedLogo) {
      const logoURL = invertedLogo.getAttribute('src')
      document.getElementById('logo')?.setAttribute('src', logoURL)
    }
  }
}

document.addEventListener('DOMContentLoaded', function () {
  const topNavbar = document.getElementById('top-navbar')
  if (topNavbar?.classList.contains('homepage')) {
    document.addEventListener('scroll', updateNavBar)
    updateNavBar()
  }

  const navMain = document.getElementsByClassName('navbar-collapse')
  Array.from(navMain).forEach(function (el) {
    el.addEventListener('click', function (e) {
      if (e.target.tagName === 'A' && !e.target.classList.contains("dropdown-toggle")) {
        el.classList.add('collapse')
        el.classList.remove('show')
      }
    })
  })
})
