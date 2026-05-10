---
title: "Attention Mechanisms, Part 1: From Seq2Seq to Transformers"
date: 2026-05-09
draft: false
hero: hero.png
tags: ["deep learning", "attention", "transformers", "sequence-to-sequence"]
categories: ["Machine Learning"]
description: "Part 1 of a series on attention mechanisms: from fixed-vector seq2seq models, through Bahdanau and Luong attention, to Attention Is All You Need."
---

This is the first post in a series on attention mechanisms. We start with neural machine translation in 2014 and follow the ideas forward: learned alignment, self-attention, efficient long-context variants, IO-aware kernels, and finally inference-time tricks such as KV-cache management.

The pattern to watch is bottleneck migration. Bahdanau attention fixed the fixed-vector problem in early encoder-decoder models. The Transformer removed recurrence, but made the quadratic attention matrix central. Later posts will pick up from there.

Before attention, neural translation systems asked one vector to carry an entire source sentence. An encoder RNN read the source token by token, compressed it into a final hidden state, and passed that state to a decoder RNN. This worked for short sentences, but degraded as sentences got longer.

## The Fixed-Vector Bottleneck

The early sequence-to-sequence systems from [Cho et al.](https://arxiv.org/abs/1406.1078) and [Sutskever, Vinyals, and Le](https://arxiv.org/abs/1409.3215) in 2014 used the same high-level recipe:

1. Read the source sequence with an encoder RNN.
2. Store the final encoder state as a fixed context vector.
3. Decode the target sequence from that vector.

That context vector is fixed-size no matter how long the input is. A five-word sentence and a fifty-word sentence both have to pass through the same narrow channel.

The encoder-decoder objective was simple:

$$p(y_1,\ldots,y_T \mid x_1,\ldots,x_S) = \prod_{t=1}^{T} p(y_t \mid y_1,\ldots,y_{t-1}, c)$$

Every output token is predicted from earlier output tokens and the same compressed source summary.

That compression was the problem. [Bahdanau, Cho, and Bengio](https://arxiv.org/abs/1409.0473) showed that translation quality dropped sharply for longer sentences. The model did not just need a better hidden state; it needed a way to look back at the source while decoding.

### Worked Example: One Vector, Two Jobs

Imagine an encoder state with only four dimensions:

| Source sentence | What the vector must preserve |
|---|---|
| "dogs chase cats" | subject, verb, object |
| "the agreement on the European Economic Area was signed in August 1992" | entities, dates, prepositions, ordering, long-range dependencies |

For the short sentence, a single vector can plausibly carry the core meaning. For the longer sentence, the vector has to remember both "European Economic Area" and "August 1992", plus where each belongs in the target language. The decoder has no direct address into the input; it only gets the final summary.

Long-sentence translation errors were not just a data problem. They followed from the architecture. The decoder had no mechanism for saying, "while generating this French word, look specifically at that English phrase."

## Bahdanau Attention: Learned Soft Alignment

[Bahdanau attention](https://arxiv.org/abs/1409.0473) fixed the bottleneck by changing the decoder's job. Instead of decoding from one source summary, the decoder computes a fresh context vector $c_i$ for each output step $i$.

The encoder is a bidirectional GRU, so each source token gets its own annotation:

$$h_j = [h_j^{\mathrm{fwd}}; h_j^{\mathrm{bwd}}]$$

Here, $h_j^{\mathrm{fwd}}$ summarizes the prefix up to source token $j$, and $h_j^{\mathrm{bwd}}$ summarizes the suffix after it. Concatenating them gives the decoder a source-token representation with both left and right context.

The decoder state $s_{i-1}$ asks: which source positions matter for the next target token?

$$e_{ij} = v_a^\top \tanh(W_a s_{i-1} + U_a h_j)$$

The score $e_{ij}$ is a learned compatibility between the decoder's current state and source token $j$.

Those scores become probabilities through a softmax:

$$\alpha_{ij} = \frac{\exp(e_{ij})}{\sum_k \exp(e_{ik})}$$

The context vector is a weighted average of source states:

$$c_i = \sum_j \alpha_{ij}h_j$$

For each output token, the model learns a soft pointer over the source sentence, then blends source representations according to that pointer.

{{< vs 2>}}

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

<div class="embedded-html-wrapper" data-src="/visualizations/attention-bahdanau-alignment.html">
  <div class="embedded-html-toolbar">
    <span class="embedded-html-toolbar-label">Bahdanau alignment visualization</span>
    <button type="button" class="embedded-html-toolbar-button" data-action="open-new-tab" aria-label="Open the Bahdanau alignment visualization in a new tab">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 3h7v7h-2V6.414l-9.293 9.293-1.414-1.414L17.586 5H14V3zM5 5h5v2H6v11h11v-4h2v5H5V5z" /></svg>
      <span class="sr-only">Open Bahdanau alignment visualization in new tab</span>
    </button>
    <button type="button" class="embedded-html-toolbar-button" data-action="fullscreen" data-label-base="Enter fullscreen view for the Bahdanau alignment visualization" data-label-active="Exit fullscreen view for the Bahdanau alignment visualization" aria-label="Enter fullscreen view for the Bahdanau alignment visualization">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h6v2H6v4H4V4zm10 0h6v6h-2V6h-4V4zm6 10v6h-6v-2h4v-4h2zm-10 6H4v-6h2v4h4v2z" /></svg>
      <span class="sr-only">Toggle fullscreen for Bahdanau alignment visualization</span>
    </button>
  </div>
  <iframe src="/visualizations/attention-bahdanau-alignment.html" loading="lazy" allowfullscreen frameborder="0" scrolling="no" title="Bahdanau attention alignment visualization"></iframe>
</div>

The heatmap shows the alignment directly. Rows are target tokens. Columns are source tokens. Each row sums to one. A bright cell means "the decoder leaned heavily on this source token while producing that target token."

This was a major break from older statistical machine translation pipelines. The alignment was no longer a separate pre-processing artifact; it was learned end-to-end as part of the model.

### A Tiny Numerical Attention Step

Suppose the decoder is about to produce a target word and assigns scores $[0.2, 1.7, 0.4, -0.3]$ to the source tokens ["the", "agreement", "signed", "1992"]. The softmax turns those scores into approximately $[0.14, 0.63, 0.17, 0.06]$.

The new context vector is therefore:

$$c_i = 0.14h_{\text{the}} + 0.63h_{\text{agreement}} + 0.17h_{\text{signed}} + 0.06h_{\text{1992}}$$

The decoder is still differentiable end-to-end. It does not choose one source token with a hard pointer; it blends evidence from all positions.

## Luong Attention: Faster Scores and Local Windows

[Luong, Pham, and Manning](https://arxiv.org/abs/1508.04025) kept the same alignment idea but simplified and compared scoring functions.

| Scoring function | Formula | Intuition |
|---|---|---|
| Dot | $\text{score}(s_t,h_j)=s_t^\top h_j$ | Compare decoder and encoder vectors directly |
| General | $\text{score}(s_t,h_j)=s_t^\top W_a h_j$ | Learn a projection before comparison |
| Concat | $\text{score}(s_t,h_j)=v_a^\top\tanh(W_a[s_t;h_j])$ | A small neural network over both vectors |

Bahdanau's additive attention is closest to the concat family. Luong's dot and general variants matter because they are cheaper: a batch of dot products can become one matrix multiplication.

That computational detail foreshadowed the Transformer. Once attention becomes a matrix multiply, hardware can do it efficiently and in parallel.

Luong attention also introduced a useful distinction:

| Mode | What it attends to | Why it matters |
|---|---|---|
| Global attention | All source positions | More flexible, more expensive |
| Local attention | A window around a predicted position $p_t$ | Cheaper and often enough for translation |

The local variant is an early hint of a theme that returns in Part 2: full attention is not always worth its cost.

Luong attention made attention feel less like a special alignment module and more like a computational primitive. Two ideas from this period kept resurfacing later: use matmul-friendly scores, and restrict the attended region when full attention is unnecessary.

## 2015-2017: Attention Becomes the Default

Bahdanau attention quickly became standard in competitive RNN encoder-decoder systems, especially in neural machine translation. It improved long-sentence translation and produced alignment heatmaps that researchers could inspect.

By 2016, attention-based encoder-decoder models were showing up across sequence modeling. [Google's Neural Machine Translation system](https://arxiv.org/abs/1609.08144) used an attention mechanism on top of deep LSTMs. [OpenNMT](https://aclanthology.org/P17-4012/) made attention-based neural translation easier to reproduce. Outside translation, attention appeared in image captioning through ["Show, Attend and Tell"](https://arxiv.org/abs/1502.03044), speech recognition through ["Listen, Attend and Spell"](https://arxiv.org/abs/1508.01211), and memory-style question answering through [end-to-end memory networks](https://arxiv.org/abs/1503.08895).

The common pattern was still recurrent: an RNN processed tokens sequentially, and attention helped it look back at useful inputs. Attention had become common, but it was still attached to recurrence.

[Attention Is All You Need](https://arxiv.org/abs/1706.03762) made a stronger claim. Instead of adding a better attention module to an RNN, it removed recurrence from the sequence model.

## 2017: Attention Is All You Need

The Transformer dropped recurrence entirely.

Instead of processing tokens one step at a time with an RNN, each layer computes attention among all tokens in parallel:

$$\text{Attention}(Q,K,V)=\text{softmax}\left(\frac{QK^\top}{\sqrt{d_k}}\right)V$$

Glossary:

| Term | Meaning |
|---|---|
| Query $Q$ | What this token is looking for |
| Key $K$ | What each token offers as an address |
| Value $V$ | The content that gets mixed into the output |

The $QK^\top$ matrix contains all pairwise token compatibility scores. Softmax turns each row into a distribution. Multiplying by $V$ blends token content according to those weights.

### Why Divide by Square Root of the Head Dimension?

If query and key dimensions are random with variance 1, their dot product has variance roughly $d_k$. With $d_k=64$, raw dot products are often large. Large logits push softmax toward near-one-hot outputs, which makes gradients small.

Scaling fixes the variance:

| Head dimension $d_k$ | Raw dot-product std. dev. | After dividing by $\sqrt{d_k}$ |
|---:|---:|---:|
| 4 | 2 | 1 |
| 64 | 8 | 1 |
| 512 | 22.6 | 1 |

The scale factor keeps the softmax in a useful range as the head dimension grows.

The scaled-dot version kept the matmul efficiency of Luong dot attention while avoiding softmax saturation at larger dimensions.

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

This is the algorithmic core of the Transformer. Part 3 will show why high-performance kernels execute the same computation in a very different way.

## Multi-Head Self-Attention

One attention distribution is useful. Several attention distributions in parallel are more expressive.

Multi-head attention projects the same input into $h$ separate query, key, and value spaces:

$$\text{head}_i=\text{Attention}(XW_i^Q, XW_i^K, XW_i^V)$$

Then the heads are concatenated and projected back:

$$\text{MultiHead}(X)=\text{Concat}(\text{head}_1,\ldots,\text{head}_h)W^O$$

The practical reason is specialization. One head might focus on nearby tokens. Another may track syntax. Another may link pronouns to nouns. Real heads are messier than textbook examples, but separate heads do learn different patterns.

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

Self-attention by itself is permutation-invariant. If you shuffle the input tokens and also shuffle the rows and columns of $Q$, $K$, and $V$, attention has no built-in notion that one token came before another.

The original Transformer added sinusoidal positional encodings:

$$PE(pos, 2i) = \sin(pos / 10000^{2i/d})$$

$$PE(pos, 2i + 1) = \cos(pos / 10000^{2i/d})$$

The point is to add a deterministic position signal to each token embedding. Without it, attention sees a set of tokens, not an ordered sequence.

## The Transformer Leap

The original Transformer architecture combined a few ingredients:

| Component | Purpose |
|---|---|
| Multi-head self-attention | Mix information between tokens |
| Feed-forward network | Apply per-token nonlinear computation |
| Residual connections | Preserve signal through deep stacks |
| LayerNorm | Stabilize optimization |
| Masked decoder attention | Prevent future-token leakage during generation |
| Positional encoding | Restore order information |

The claim in "Attention Is All You Need" was not that attention helps RNNs. It was that recurrence could be removed.

That gave Transformers two practical advantages:

| Constraint | RNN seq2seq | Transformer |
|---|---|---|
| Training parallelism | Sequential over tokens | Parallel over tokens within a layer |
| Long-range paths | Many recurrent steps | One attention hop |
| Alignment | Learned, but tied to decoding steps | Learned throughout every layer |

In 2017, this was computationally reasonable. The WMT'14 English-German experiments used sequence lengths around a few hundred tokens, and the base model trained in about 12 hours on 8 NVIDIA P100 GPUs.

## Why Quadratic Attention Was Fine Until It Wasn't

The self-attention matrix has $N^2$ entries per head. At first, that was acceptable: 512-token sequences were small enough that the attention matrix was not the dominant memory cost. But the numbers grow quadratically. Double the context, quadruple the matrix.

For BERT-base-like training with 12 layers and 12 heads, the attention probabilities alone are roughly:

$$12 \times 12 \times 512^2 \times 2\,\text{bytes} \approx 75\,\text{MB}$$

That is manageable. But at 8k tokens:

$$12 \times 12 \times 8192^2 \times 2\,\text{bytes} \approx 18\,\text{GB}$$

And this is only the attention matrix storage, not parameters, optimizer states, activations from other layers, or batch size.

The Transformer solved the RNN's sequential bottleneck by making token-token interactions explicit. But explicit all-pairs interaction created the next bottleneck: $O(N^2)$ memory and compute.

## Pros and Cons

| Method | Scoring cost | Parallelism | Sequence-length sensitivity | Best use |
|---|---:|---|---|---|
| Bahdanau additive attention | MLP per decoder/source pair | Decoder still sequential | Handles longer inputs better than fixed vector | Interpretable alignment in RNN encoder-decoder models |
| Luong dot/general attention | Matmul-friendly | Decoder still sequential | Global mode still attends to all source positions | Faster RNN attention, local alignment windows |
| Transformer self-attention | Large batched matmuls | High training parallelism | Quadratic in sequence length | General-purpose sequence modeling when context length is moderate |

The pattern is already visible: Bahdanau removed the fixed-vector bottleneck but kept recurrent decoding. Luong made attention cheaper but still lived inside RNNs. The Transformer removed recurrence, but paid with dense $N \times N$ attention.

## What Comes Next

By 2019, researchers wanted Transformers to read documents, code, images, and genomic sequences with thousands or tens of thousands of tokens. The dense attention matrix became the dominant cost.

The first wave of answers said: do not compute every pair. Use sparse patterns, hashing, low-rank projections, or kernel tricks. That approximation era is Part 2.

## References

- Sutskever, Vinyals, and Le, [Sequence to Sequence Learning with Neural Networks](https://arxiv.org/abs/1409.3215), 2014.
- Cho et al., [Learning Phrase Representations using RNN Encoder-Decoder for Statistical Machine Translation](https://arxiv.org/abs/1406.1078), 2014.
- Bahdanau, Cho, and Bengio, [Neural Machine Translation by Jointly Learning to Align and Translate](https://arxiv.org/abs/1409.0473), 2014.
- Luong, Pham, and Manning, [Effective Approaches to Attention-based Neural Machine Translation](https://arxiv.org/abs/1508.04025), 2015.
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
