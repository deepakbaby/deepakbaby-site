/**
 * Collapsible Sidebars for Blog Posts
 * Adds toggle buttons to collapse/expand the left sidebar and TOC
 */

(function() {
  'use strict';

  // Only run on blog post pages (kind-page)
  if (!document.body.classList.contains('kind-page')) {
    return;
  }

  // Run immediately if DOM is already loaded, otherwise wait for it
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCollapsibleSidebars);
  } else {
    // DOM is already loaded, run immediately
    initCollapsibleSidebars();
  }

  function initCollapsibleSidebars() {
    const sidebarSection = document.querySelector('.sidebar-section');
    const tocSection = document.querySelector('.toc-section');
    const wrapper = document.querySelector('.wrapper');

    if (!wrapper) return;

    // Create and add sidebar toggle button
    if (sidebarSection) {
      const sidebarCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
      const sidebarToggle = createToggleButton('sidebar-toggle', 'Toggle Posts Sidebar', sidebarCollapsed ? '»' : '«');
      document.body.appendChild(sidebarToggle);

      // Load saved state
      if (sidebarCollapsed) {
        sidebarSection.classList.add('collapsed');
        sidebarToggle.classList.add('collapsed');
      }

      // Toggle event
      sidebarToggle.addEventListener('click', function() {
        sidebarSection.classList.toggle('collapsed');
        sidebarToggle.classList.toggle('collapsed');
        const isCollapsed = sidebarSection.classList.contains('collapsed');
        sidebarToggle.innerHTML = isCollapsed ? '»' : '«';
        localStorage.setItem('sidebarCollapsed', isCollapsed);
        updateContentWidth();
      });
    }

    // TOC is now in the left sidebar - make its heading collapsible
    const tocInSidebar = document.querySelector('.toc-in-sidebar');
    if (tocInSidebar) {
      const tocHeading = tocInSidebar.querySelector('.toc-heading');
      
      if (tocHeading) {
        // Load saved TOC collapsed state
        const tocCollapsed = localStorage.getItem('tocInSidebarCollapsed') === 'true';
        if (tocCollapsed) {
          tocInSidebar.classList.add('collapsed');
        }

        tocHeading.addEventListener('click', function() {
          tocInSidebar.classList.toggle('collapsed');
          localStorage.setItem('tocInSidebarCollapsed', tocInSidebar.classList.contains('collapsed'));
        });
      }
    }

    // Remove the old TOC toggle button since TOC is now in left sidebar
    // (No right-side TOC toggle needed anymore)

    // Initial content width update
    updateContentWidth();
  }

  function createToggleButton(className, tooltip, initialIcon) {
    const button = document.createElement('button');
    button.className = className;
    button.setAttribute('aria-label', tooltip);
    button.setAttribute('data-tooltip', tooltip);
    button.setAttribute('title', tooltip);
    button.innerHTML = initialIcon;
    return button;
  }

  function updateContentWidth() {
    const contentSection = document.querySelector('.content-section');
    const sidebarSection = document.querySelector('.sidebar-section');

    if (!contentSection) return;

    const sidebarCollapsed = sidebarSection?.classList.contains('collapsed');

    // Update body classes for CSS fallback
    document.body.classList.toggle('sidebar-collapsed', sidebarCollapsed);

    // Apply inline styles - TOC is now in left sidebar, so only sidebar matters
    if (sidebarCollapsed) {
      contentSection.style.flex = '1 1 100%';
      contentSection.style.maxWidth = '100%';
      contentSection.style.paddingLeft = '3rem';
      contentSection.style.paddingRight = '3rem';
    } else {
      contentSection.style.flex = '';
      contentSection.style.maxWidth = '';
      contentSection.style.paddingLeft = '';
      contentSection.style.paddingRight = '';
    }
  }

  // Keyboard shortcut: Press '[' to toggle left sidebar, ']' to toggle TOC
  document.addEventListener('keydown', function(e) {
    // Don't trigger if user is typing in an input
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
      return;
    }

    if (e.key === '[') {
      const sidebarToggle = document.querySelector('.sidebar-toggle');
      if (sidebarToggle) sidebarToggle.click();
    } else if (e.key === ']') {
      const tocToggle = document.querySelector('.toc-toggle');
      if (tocToggle) tocToggle.click();
    }
  });
})();

/**
 * Zoomable Visualization Containers
 * Automatically adds zoom controls to .viz-container elements
 */
(function() {
  'use strict';

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initVizContainers);
  } else {
    initVizContainers();
  }

  function initVizContainers() {
    const containers = document.querySelectorAll('.viz-container');
    containers.forEach((container, index) => {
      setupZoomableViz(container, index);
    });
  }

  function setupZoomableViz(container, index) {
    const iframe = container.querySelector('iframe');
    if (!iframe) return;

    const vizId = container.dataset.vizId || `viz-${index}`;
    let zoomLevel = 100;
    let baseWidth = 1200; // Default, will be updated from iframe content
    let baseHeight = 600;

    // Create zoom controls
    const controls = document.createElement('div');
    controls.className = 'zoom-controls';
    controls.innerHTML = `
      <button class="zoom-out" title="Zoom Out (−)">−</button>
      <span class="zoom-level">100%</span>
      <button class="zoom-in" title="Zoom In (+)">+</button>
      <button class="zoom-fit" title="Fit to Width">Fit</button>
      <button class="zoom-reset" title="Reset to 100%">100%</button>
      <span class="zoom-label">Scroll to pan</span>
    `;

    // Create wrapper for scrollable iframe
    const wrapper = document.createElement('div');
    wrapper.className = 'iframe-wrapper';
    
    // Move iframe into wrapper
    container.insertBefore(controls, iframe);
    wrapper.appendChild(iframe);
    container.appendChild(wrapper);

    // Style the container
    container.classList.add('zoomable-iframe-container');

    // Try to get dimensions from iframe content after load
    iframe.addEventListener('load', function() {
      try {
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        const body = iframeDoc.body;
        const html = iframeDoc.documentElement;
        
        // Get the actual content dimensions
        baseWidth = Math.max(
          body.scrollWidth, body.offsetWidth,
          html.clientWidth, html.scrollWidth, html.offsetWidth,
          1200
        );
        baseHeight = Math.max(
          body.scrollHeight, body.offsetHeight,
          html.clientHeight, html.scrollHeight, html.offsetHeight,
          600
        );
        
        // Set iframe dimensions to match content exactly
        iframe.style.width = baseWidth + 'px';
        iframe.style.height = baseHeight + 'px';
        iframe.style.minWidth = baseWidth + 'px';
        iframe.style.minHeight = baseHeight + 'px';
        
        // Auto-fit to container width on load
        setTimeout(() => fitToWidth(), 100);
      } catch (e) {
        // Cross-origin, use defaults
        iframe.style.width = '1200px';
        iframe.style.height = '600px';
        fitToWidth();
      }
    });

    function updateZoom() {
      const scale = zoomLevel / 100;
      iframe.style.transform = `scale(${scale})`;
      iframe.style.transformOrigin = 'top left';
      
      // Ensure iframe maintains its base size (transform handles visual scaling)
      // The iframe will be larger than wrapper, enabling scrolling
      iframe.style.width = baseWidth + 'px';
      iframe.style.height = baseHeight + 'px';
      
      // Calculate visible scaled dimensions for reference
      const scaledWidth = baseWidth * scale;
      const scaledHeight = baseHeight * scale;
      
      // Wrapper takes container width - scrolling will show full content
      // The wrapper height should accommodate the scaled visual height
      wrapper.style.height = scaledHeight + 'px';
      // Width stays at 100% (set by CSS) - overflow auto handles scrolling
      
      controls.querySelector('.zoom-level').textContent = `${zoomLevel}%`;
    }

    function fitToWidth() {
      const containerWidth = container.clientWidth || wrapper.parentElement.clientWidth || 800;
      const iframeWidth = baseWidth || 1200;
      zoomLevel = Math.round((containerWidth / iframeWidth) * 100);
      zoomLevel = Math.max(25, Math.min(200, zoomLevel));
      updateZoom();
      
      // Scroll to top-left after fitting
      wrapper.scrollLeft = 0;
      wrapper.scrollTop = 0;
    }

    // Button handlers
    controls.querySelector('.zoom-out').addEventListener('click', () => {
      if (zoomLevel > 25) { zoomLevel -= 10; updateZoom(); }
    });

    controls.querySelector('.zoom-in').addEventListener('click', () => {
      if (zoomLevel < 200) { zoomLevel += 10; updateZoom(); }
    });

    controls.querySelector('.zoom-fit').addEventListener('click', fitToWidth);

    controls.querySelector('.zoom-reset').addEventListener('click', () => {
      zoomLevel = 100;
      updateZoom();
      wrapper.scrollLeft = 0;
      wrapper.scrollTop = 0;
    });

    // Initial setup
    iframe.style.transformOrigin = 'top left';
    iframe.style.display = 'block';
  }
})();

