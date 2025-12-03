---
title: "Slides: Distributed Training for ML"
date: 2025-12-03
draft: false
hero: presentation-hero.png
tags: ["deep learning", "distributed training", "DDP", "FSDP", "pipeline parallelism", "PyTorch", "presentation"]
categories: ["Machine Learning", "Presentations"]
description: "An interactive presentation exploring distributed training techniques including Data Distributed Parallel (DDP), Pipeline Parallelism, and Fully Sharded Data Parallel (FSDP) with animated visualizations."
---

Explore distributed training techniques through this interactive presentation. Navigate through the slides using arrow keys or the navigation controls.

## Topics Covered

- **Back to Basics**: Understanding neural network fundamentals
- **Why Distributed Training**: Memory constraints and scaling challenges
- **DDP (Data Distributed Parallel)**: Replicating models across GPUs
- **Pipeline Parallelism**: Splitting models across devices
- **FSDP (Fully Sharded Data Parallel)**: Advanced sharding techniques

## Slides

Use the arrow keys (← →) or click the navigation arrows to move between slides. Some slides include animations that you can step through using the animation controls at the bottom.

<div class="embedded-html-wrapper" data-src="/presentations/distributed_training_talk/main.html">
  <div class="embedded-html-toolbar">
    <span class="embedded-html-toolbar-label">Distributed training presentation</span>
    <button
      type="button"
      class="embedded-html-toolbar-button"
      data-action="open-new-tab"
      aria-label="Open the distributed training presentation in a new tab">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M14 3h7v7h-2V6.414l-9.293 9.293-1.414-1.414L17.586 5H14V3zM5 5h5v2H6v11h11v-4h2v5H5V5z" />
      </svg>
      <span class="sr-only">Open presentation in new tab</span>
    </button>
    <button
      type="button"
      class="embedded-html-toolbar-button"
      data-action="fullscreen"
      data-label-base="Enter fullscreen view for the presentation"
      data-label-active="Exit fullscreen view for the presentation"
      aria-label="Enter fullscreen view for the presentation">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 4h6v2H6v4H4V4zm10 0h6v6h-2V6h-4V4zm6 10v6h-6v-2h4v-4h2zm-10 6H4v-6h2v4h4v2z" />
      </svg>
      <span class="sr-only">Toggle fullscreen for presentation</span>
    </button>
  </div>
  <iframe 
    src="/presentations/distributed_training_talk/main.html" 
    loading="lazy"
    allowfullscreen
    title="Distributed training slides">
  </iframe>
</div>

<style>
  .embedded-html-wrapper {
    margin: 2rem -2rem;
    border-radius: 0;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    background: #111;
    border: 1px solid rgba(255, 255, 255, 0.08);
  }

  .embedded-html-toolbar {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    background: rgba(3, 3, 3, 0.95);
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    color: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(10px);
  }

  .embedded-html-toolbar-label {
    margin-right: auto;
    font-size: 0.85rem;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: #b2b2b2;
  }

  .embedded-html-toolbar-button {
    background: rgba(255, 255, 255, 0.08);
    color: rgba(255, 255, 255, 0.9);
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 8px;
    padding: 0.35rem 0.7rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.25rem;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
    line-height: 1;
    backdrop-filter: blur(6px);
  }

  .embedded-html-toolbar-button:hover {
    background: rgba(255, 255, 255, 0.16);
    transform: translateY(-1px);
    box-shadow: 0 6px 14px rgba(0, 0, 0, 0.4);
  }

  .embedded-html-toolbar-button:active {
    transform: translateY(0);
  }

  .embedded-html-toolbar-button svg {
    width: 18px;
    height: 18px;
    fill: currentColor;
  }

  .embedded-html-toolbar-button[data-active="true"] {
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.25);
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.2);
  }

  .embedded-html-wrapper iframe {
    width: 100%;
    height: 85vh;
    min-height: 700px;
    border: none;
    display: block;
    background: #000;
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  /* Make presentation full width on wider screens */
  @media (min-width: 1200px) {
    .post-content > .embedded-html-wrapper {
      margin-left: -5rem !important;
      margin-right: -5rem !important;
    }
  }
  
  @media (min-width: 1400px) {
    .post-content > .embedded-html-wrapper {
      margin-left: -8rem !important;
      margin-right: -8rem !important;
    }
  }
</style>

<script>
(function() {
  function runInit() {
    const fullscreenButtons = document.querySelectorAll('.embedded-html-wrapper [data-action="fullscreen"]');
    const newTabButtons = document.querySelectorAll('.embedded-html-wrapper [data-action="open-new-tab"]');
    if (!fullscreenButtons.length && !newTabButtons.length) return;

    function getFullscreenElement() {
      return document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement || null;
    }

    function requestFullscreen(element) {
      if (!element) return Promise.resolve();
      if (element.requestFullscreen) return element.requestFullscreen();
      if (element.webkitRequestFullscreen) return element.webkitRequestFullscreen();
      if (element.msRequestFullscreen) return element.msRequestFullscreen();
      return Promise.resolve();
    }

    function exitFullscreen() {
      if (document.exitFullscreen) return document.exitFullscreen();
      if (document.webkitExitFullscreen) return document.webkitExitFullscreen();
      if (document.msExitFullscreen) return document.msExitFullscreen();
      return Promise.resolve();
    }

    function updateFullscreenUI() {
      const active = getFullscreenElement();
      fullscreenButtons.forEach(button => {
        const wrapper = button.closest('.embedded-html-wrapper');
        const isActive = wrapper && active === wrapper;
        const baseLabel = button.dataset.labelBase || button.getAttribute('aria-label') || 'Toggle fullscreen';
        const activeLabel = button.dataset.labelActive;
        button.dataset.active = isActive ? 'true' : 'false';
        button.setAttribute('aria-label', isActive && activeLabel ? activeLabel : baseLabel);
      });
    }

    fullscreenButtons.forEach(button => {
      button.addEventListener('click', () => {
        const wrapper = button.closest('.embedded-html-wrapper');
        if (!wrapper) return;
        const active = getFullscreenElement();
        if (active && active !== wrapper) {
          exitFullscreen().finally(() => requestFullscreen(wrapper));
        } else if (active === wrapper) {
          exitFullscreen();
        } else {
          requestFullscreen(wrapper);
        }
      });
    });

    newTabButtons.forEach(button => {
      button.addEventListener('click', () => {
        const wrapper = button.closest('.embedded-html-wrapper');
        const url = wrapper?.dataset.src;
        if (!url) return;
        window.open(url, '_blank', 'noopener');
      });
    });

    document.addEventListener('fullscreenchange', updateFullscreenUI);
    document.addEventListener('webkitfullscreenchange', updateFullscreenUI);
    document.addEventListener('msfullscreenchange', updateFullscreenUI);
    updateFullscreenUI();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runInit);
  } else {
    runInit();
  }
})();
</script>

{{< alert type="success" >}}
The visualizations and images on MNIST examples in the "Back to Basics" section are from the educational content at [3Blue1Brown](https://www.3blue1brown.com/).
{{< /alert >}}

---

## Key Takeaways

### Data Distributed Parallel (DDP)
- **Best for**: Models that fit in single GPU memory
- **How it works**: Full model replica on each GPU
- **Trade-off**: High memory usage but simple implementation

### Pipeline Parallelism
- **Best for**: Very deep sequential models
- **How it works**: Different layers on different GPUs
- **Trade-off**: Requires careful batch sizing to minimize idle time

### FSDP (Fully Sharded Data Parallel)
- **Best for**: Very large models (100B+ parameters)
- **How it works**: Shards model parameters, gradients, and optimizer states
- **Trade-off**: More complex but enables training of massive models

---

For a detailed written guide on these techniques, check out my [Distributed Training blog post](/posts/distributed-training/).

