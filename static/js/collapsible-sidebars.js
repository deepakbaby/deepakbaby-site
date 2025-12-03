/**
 * Collapsible Sidebars for Blog Posts
 * Handles sidebar toggle and TOC collapse
 */

(function() {
  'use strict';

  // Only run on blog post pages (kind-page)
  if (!document.body.classList.contains('kind-page')) {
    return;
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    initSidebarToggle();
    initTOCCollapse();
  }

  function initSidebarToggle() {
    const sidebarSection = document.querySelector('.sidebar-section');

    if (!sidebarSection) return;

    // Create toggle button
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'sidebar-toggle';
    toggleBtn.setAttribute('aria-label', 'Toggle Sidebar');
    toggleBtn.title = 'Toggle sidebar';
    document.body.appendChild(toggleBtn);

    // Load saved state
    const sidebarCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
    if (sidebarCollapsed) {
      sidebarSection.classList.add('collapsed');
    }

    // Toggle event
    toggleBtn.addEventListener('click', function() {
      const isCollapsed = sidebarSection.classList.toggle('collapsed');
      toggleBtn.title = isCollapsed ? 'Show sidebar' : 'Hide sidebar';
      localStorage.setItem('sidebarCollapsed', isCollapsed);
    });
  }

  function initTOCCollapse() {
    const tocInSidebar = document.querySelector('.toc-in-sidebar');

    if (!tocInSidebar) return;

    const tocHeading = tocInSidebar.querySelector('.toc-heading');

    if (!tocHeading) return;

    // Load saved state
    const tocCollapsed = localStorage.getItem('tocCollapsed') === 'true';
    if (tocCollapsed) {
      tocInSidebar.classList.add('collapsed');
    }

    // Toggle event
    tocHeading.addEventListener('click', function() {
      tocInSidebar.classList.toggle('collapsed');
      const isCollapsed = tocInSidebar.classList.contains('collapsed');
      localStorage.setItem('tocCollapsed', isCollapsed);
    });
  }
})();
