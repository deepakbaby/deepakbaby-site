// Import only required Bootstrap components (tree-shakeable)
import Collapse from 'bootstrap/js/dist/collapse';
import Dropdown from 'bootstrap/js/dist/dropdown';
import ScrollSpy from 'bootstrap/js/dist/scrollspy';
import Tooltip from 'bootstrap/js/dist/tooltip';

// Font Awesome CSS loaded via <head> instead of JS for better performance
import feather from 'feather-icons'

import './core'
import './features'
import './sections'
import './pages'

feather.replace();

// Initialize Bootstrap components
document.addEventListener('DOMContentLoaded', () => {
  // Initialize tooltips
  const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  tooltipTriggerList.map(tooltipTriggerEl => new Tooltip(tooltipTriggerEl));
});
