---
title: "Distributed Training Slides"
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

## Interactive Presentation

Use the arrow keys (← →) or click the navigation arrows to move between slides. Some slides include animations that you can step through using the animation controls at the bottom.

<div style="margin: 2rem -2rem; border-radius: 0; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15); background: #1a1a1a;">
  <iframe 
    src="/presentations/distributed_training_talk/main.html" 
    style="width: 100%; height: 85vh; min-height: 700px; border: none; display: block;"
    allowfullscreen
    loading="lazy">
  </iframe>
</div>

<style>
  /* Make presentation full width on wider screens */
  @media (min-width: 1200px) {
    .post-content > div[style*="margin: 2rem -2rem"] {
      margin-left: -5rem !important;
      margin-right: -5rem !important;
    }
  }
  
  @media (min-width: 1400px) {
    .post-content > div[style*="margin: 2rem -2rem"] {
      margin-left: -8rem !important;
      margin-right: -8rem !important;
    }
  }
</style>

{{< alert type="success" >}}
The visualizations and animations in the "Back to Basics" section of this presentation are from the educational content at [3Blue1Brown](https://www.3blue1brown.com/).
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

