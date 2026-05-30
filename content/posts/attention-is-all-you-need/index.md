---
title: "Attention Is All You Need: A Deep Dive into the Transformer"
date: 2026-05-29
draft: true
hero: hero.png
tags: ["deep learning", "attention", "transformers", "self-attention"]
categories: ["Machine Learning"]
description: "A dedicated walkthrough of the 2017 Transformer paper: scaled dot-product attention, multi-head self-attention, positional encoding, and why dropping recurrence changed everything."
---

This post is a guided deep dive into [Attention Is All You Need](https://arxiv.org/abs/1706.03762), the 2017 paper that replaced recurrence with stacked self-attention and became the base architecture behind modern language models.

I assume basic ML knowledge (vectors, matrix multiply, softmax), but not deep familiarity with Transformers. If you are new to attention itself, read the [first post in this series](/posts/attention-history-bahdanau-to-transformer/) first.

By 2017, attention had already improved RNN encoder-decoders. The decoder no longer had to compress the entire source into one vector; it could look back at the source states at each step. But both encoder and decoder were still RNNs, so token processing stayed sequential and long-range dependencies still traveled through many recurrent steps.

The key question became: what if attention is not an add-on to recurrence, but the main mechanism?

## Scaled Dot-Product Attention

The Transformer drops recurrence entirely. Instead of processing tokens one step at a time, each layer computes attention among all tokens in parallel:

$$\text{Attention}(Q,K,V)=\text{softmax}\left(\frac{QK^\top}{\sqrt{d_k}}\right)V$$

Glossary:

| Term | Meaning |
|---|---|
| Query $Q$ | What this token is looking for |
| Key $K$ | What each token offers as an address |
| Value $V$ | The content that gets mixed into the output |

If the input has shape `[tokens, d_model]`, then each head projects to:

- `Q`: `[tokens, d_k]`
- `K`: `[tokens, d_k]`
- `V`: `[tokens, d_v]`

Then:

- `QK^T` gives `[tokens, tokens]` pairwise scores
- row-wise softmax turns each row into attention weights
- multiplying by `V` mixes token content using those weights

### Why Divide by Square Root of the Head Dimension?

If query and key components are roughly zero-mean with variance 1, then their dot product has variance about $d_k$. As $d_k$ grows, raw logits get large, softmax saturates, and gradients become small.

Scaling fixes the variance:

| Head dimension $d_k$ | Raw dot-product std. dev. | After dividing by $\sqrt{d_k}$ |
|---:|---:|---:|
| 4 | 2 | 1 |
| 64 | 8 | 1 |
| 512 | 22.6 | 1 |

The scale factor keeps logits in a stable range as head dimension grows.

Here is the readable PyTorch version, without fused kernels:

```python
import math
import torch

def scaled_dot_product_attention(q, k, v, mask=None):
    # q, k, v: [batch, heads, tokens, head_dim]
    scores = q @ k.transpose(-2, -1)
    scores = scores / math.sqrt(q.size(-1))

    if mask is not None:
        scores = scores.masked_fill(mask == 0, float("-inf"))

    weights = torch.softmax(scores, dim=-1)
    return weights @ v
```

<div class="embedded-html-wrapper" data-src="/visualizations/qkv-walkthrough.html">
  <div class="embedded-html-toolbar">
    <span class="embedded-html-toolbar-label">QKV walkthrough on a 4-token example</span>
    <button type="button" class="embedded-html-toolbar-button" data-action="open-new-tab" aria-label="Open the QKV walkthrough in a new tab">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 3h7v7h-2V6.414l-9.293 9.293-1.414-1.414L17.586 5H14V3zM5 5h5v2H6v11h11v-4h2v5H5V5z" /></svg>
      <span class="sr-only">Open QKV walkthrough in new tab</span>
    </button>
    <button type="button" class="embedded-html-toolbar-button" data-action="fullscreen" data-label-base="Enter fullscreen view for the QKV walkthrough" data-label-active="Exit fullscreen view for the QKV walkthrough" aria-label="Enter fullscreen view for the QKV walkthrough">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h6v2H6v4H4V4zm10 0h6v6h-2V6h-4V4zm6 10v6h-6v-2h4v-4h2zm-10 6H4v-6h2v4h4v2z" /></svg>
      <span class="sr-only">Toggle fullscreen for QKV walkthrough</span>
    </button>
  </div>
  <iframe src="/visualizations/qkv-walkthrough.html" loading="lazy" allowfullscreen frameborder="0" scrolling="no" title="QKV walkthrough on a 4-token example"></iframe>
</div>

Use the visualization as a numerical trace:

1. token embeddings
2. linear projection to Q/K/V
3. score matrix (`QK^T`)
4. scaling by `sqrt(d_k)`
5. softmax per row
6. weighted sum with `V`

Each cell shows the exact value produced by the previous stage.

## Multi-Head Self-Attention

One attention distribution is useful. Multiple attention distributions in parallel are more expressive.

Multi-head attention projects the same input into $h$ separate query, key, and value spaces:

$$\text{head}_i=\text{Attention}(XW_i^Q, XW_i^K, XW_i^V)$$

Then the heads are concatenated and projected back:

$$\text{MultiHead}(X)=\text{Concat}(\text{head}_1,\ldots,\text{head}_h)W^O$$

The practical reason is specialization. One head may focus on nearby tokens, another on syntax-like structure, and another on coreference-like links. Real heads are noisier than textbook cartoons, but different heads do learn different patterns based on training data.

<div class="embedded-html-wrapper" data-src="/visualizations/attention-multihead-self.html">
  <div class="embedded-html-toolbar">
    <span class="embedded-html-toolbar-label">Multi-head self-attention visualization</span>
    <button type="button" class="embedded-html-toolbar-button" data-action="open-new-tab" aria-label="Open the multi-head self-attention visualization in a new tab">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 3h7v7h-2V6.414l-9.293 9.293-1.414-1.414L17.586 5H14V3zM5 5h5v2H6v11h11v-4h2v5H5V5z" /></svg>
      <span class="sr-only">Open multi-head self-attention visualization in new tab</span>
    </button>
    <button type="button" class="embedded-html-toolbar-button" data-action="fullscreen" data-label-base="Enter fullscreen view for the multi-head self-attention visualization" data-label-active="Exit fullscreen view for the multi-head self-attention visualization" aria-label="Enter fullscreen view for the multi-head self-attention visualization">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h6v2H6v4H4V4zm10 0h6v6h-2V6h-4V4zm6 10v6h-6v-2h4v-4h2zm-10 6H4v-6h2v4h4v2z" /></svg>
      <span class="sr-only">Toggle fullscreen for multi-head self-attention visualization</span>
    </button>
  </div>
  <iframe src="/visualizations/attention-multihead-self.html" loading="lazy" allowfullscreen frameborder="0" scrolling="no" title="Multi-head self-attention visualization"></iframe>
</div>

### Why Positional Encoding Is Necessary

Self-attention without positional information is permutation-equivariant: if you permute token order, outputs are permuted the same way. So the model has no built-in notion of absolute or relative order.

The original Transformer adds sinusoidal positional encodings:

$$PE(pos, 2i) = \sin\left(pos / 10000^{2i/d_{\text{model}}}\right)$$

$$PE(pos, 2i + 1) = \cos\left(pos / 10000^{2i/d_{\text{model}}}\right)$$

The point is to add a deterministic position signal to each token embedding. Without positional information, attention treats the input as an unordered set.

## The Transformer Architecture

The original Transformer architecture combined a few ingredients:

| Component | Purpose |
|---|---|
| Multi-head self-attention | Mix information between tokens |
| Feed-forward network | Apply per-token nonlinear computation |
| Residual connections | Preserve signal through deep stacks |
| LayerNorm | Stabilize optimization |
| Masked decoder attention | Prevent future-token leakage during generation |
| Positional encoding | Restore order information |

The core claim in "Attention Is All You Need" was not "attention helps RNNs." It was that recurrence can be removed.

That gave Transformers two practical advantages:

| Constraint | RNN seq2seq | Transformer |
|---|---|---|
| Training parallelism | Sequential over tokens | Parallel over tokens within a layer |
| Long-range paths | Many recurrent steps | One attention hop |
| Alignment | Learned, but tied to decoding steps | Learned throughout every layer |

In 2017, this was computationally reasonable. In the WMT'14 experiments, training examples were length-filtered (up to 100 subword tokens per side), and the base model trained in about 12 hours on 8 NVIDIA P100 GPUs.

<style>
.embedded-html-wrapper {
  position: relative;
  margin: 2rem 0;
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: radial-gradient(circle at top right, rgba(255, 255, 255, 0.05), rgba(10, 10, 10, 0.85));
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.45);
}

.embedded-html-toolbar {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.5rem;
  padding: 0.75rem 0.9rem;
  background: rgba(4, 4, 4, 0.95);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(8px);
}

.embedded-html-toolbar-label {
  margin-right: auto;
  font-size: 0.9rem;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  color: #a7a7a7;
}

.embedded-html-toolbar-button {
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.15);
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
  position: relative;
  backdrop-filter: blur(6px);
}

.embedded-html-toolbar-button:hover {
  background: rgba(255, 255, 255, 0.16);
  transform: translateY(-1px);
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.35);
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
  background: rgba(255, 255, 255, 0.14);
  border-color: rgba(255, 255, 255, 0.3);
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.2);
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

.embedded-html-wrapper iframe {
  width: 100%;
  border: none;
  display: block;
  aspect-ratio: 16 / 9;
  min-height: 400px;
  background: #000;
}

@media (max-width: 768px) {
  .embedded-html-toolbar {
    flex-wrap: wrap;
    gap: 0.65rem;
  }

  .embedded-html-toolbar-label {
    width: 100%;
    margin: 0;
    text-align: center;
  }
}
</style>

<div class="embedded-html-wrapper" data-src="/visualizations/seq2seq-vs-bahdanau-vs-transformer.html">
  <div class="embedded-html-toolbar">
    <span class="embedded-html-toolbar-label">Seq2Seq vs Bahdanau vs Transformer</span>
    <button type="button" class="embedded-html-toolbar-button" data-action="open-new-tab" aria-label="Open the architecture comparison in a new tab">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 3h7v7h-2V6.414l-9.293 9.293-1.414-1.414L17.586 5H14V3zM5 5h5v2H6v11h11v-4h2v5H5V5z" /></svg>
      <span class="sr-only">Open architecture comparison in new tab</span>
    </button>
    <button type="button" class="embedded-html-toolbar-button" data-action="fullscreen" data-label-base="Enter fullscreen view for the architecture comparison" data-label-active="Exit fullscreen view for the architecture comparison" aria-label="Enter fullscreen view for the architecture comparison">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h6v2H6v4H4V4zm10 0h6v6h-2V6h-4V4zm6 10v6h-6v-2h4v-4h2zm-10 6H4v-6h2v4h4v2z" /></svg>
      <span class="sr-only">Toggle fullscreen for architecture comparison</span>
    </button>
  </div>
  <iframe src="/visualizations/seq2seq-vs-bahdanau-vs-transformer.html" loading="lazy" allowfullscreen frameborder="0" scrolling="no" title="Seq2Seq vs Bahdanau vs Transformer architectures"></iframe>
</div>

Press Play and watch the same signal path in all three architectures:

- Seq2Seq pushes source information through one bottleneck vector.
- Bahdanau attention lets each decoder step read from all encoder states.
- Transformer self-attention lets every token read from every other token within a layer, in parallel.

## Why Quadratic Attention Was Fine Until It Wasn't

The self-attention matrix has $N^2$ entries per head. At first, that was acceptable: 512-token sequences were small enough that the attention matrix was not the dominant memory cost. But the numbers grow quadratically. Double the context, quadruple the matrix.

For BERT-base-like training (12 layers, 12 heads), storing attention probabilities alone in fp16 is roughly:

$$12 \times 12 \times 512^2 \times 2\,\text{bytes} \approx 75\,\text{MB} \; (\approx 72\,\text{MiB})$$

That is manageable. But at 8k tokens:

$$12 \times 12 \times 8192^2 \times 2\,\text{bytes} \approx 19.3\,\text{GB} \; (\approx 18\,\text{GiB})$$

And this is only the attention matrix storage, not parameters, optimizer states, activations from other layers, or batch size.

Transformer solved the RNN's sequential bottleneck by making token-token interactions explicit. But explicit all-pairs interaction created the next bottleneck: $O(N^2)$ memory and compute. The next post in this series picks up from there (sparse attention, linear attention, and kernel tricks).

## References

- Vaswani et al., [Attention Is All You Need](https://arxiv.org/abs/1706.03762), 2017.
- Clark et al., [What Does BERT Look at? An Analysis of BERT's Attention](https://arxiv.org/abs/1906.04341), 2019.
- Harvard NLP, [The Annotated Transformer](http://nlp.seas.harvard.edu/annotated-transformer/).
- Jay Alammar, [The Illustrated Transformer](https://jalammar.github.io/illustrated-transformer/).

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
