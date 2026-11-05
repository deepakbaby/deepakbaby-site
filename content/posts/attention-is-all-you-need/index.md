---
title: "Attention Mechanisms, Part 2: Attention Is All You Need"
date: 2026-11-05
draft: false
hero: hero.png
tags: ["deep learning", "attention", "transformers", "self-attention"]
categories: ["Machine Learning"]
description: "A walkthrough of the 2017 Transformer paper: scaled dot-product attention, multi-head self-attention, sinusoidal positional encoding, the encoder-decoder stack, and the effect of removing recurrence."
---

In [Part 1](/posts/attention-history-bahdanau-to-transformer/) we saw the key idea of attention: do not compress the whole source sentence into one vector. Keep a vector for each source token, and let the decoder look back at the useful ones. In Bahdanau attention, the decoder state asks a question, the encoder states act like memory, and the answer is a weighted blend of source tokens.

Bahdanau attention already had several components that the Transformer would reuse. But the surrounding RNN still processed tokens one by one, which limited parallelism during training. It also passed information through a chain of hidden states, so connecting two distant tokens required many sequential updates.

In 2017, [Vaswani et al.](https://arxiv.org/abs/1706.03762) removed recurrence and used attention to exchange information between token positions.

{{< vs 2>}}

<iframe src="/visualizations/attention-history-timeline-simple.html" loading="lazy" frameborder="0" scrolling="no" title="Attention timeline (2014–2017)" style="width: 100%; border: none; background: transparent; display: block; height: 220px; margin: 1.5rem 0;"></iframe>

## From Bahdanau Attention to Self-Attention

Bahdanau attention still wrapped a recurrent network: the decoder state $s_i$ queried the encoder's per-token vectors and received a weighted sum. After removing the RNN, the model still needed a way to choose and combine information. The Transformer lets every token produce a query, a key, and a value. The query represents what that token is looking for. The keys are used for matching, and the values contain the information that will be combined.

In Bahdanau attention, a decoder state reads the source tokens. In self-attention, every token can read every other token in the same sequence. A recurrent model passes information along a chain; self-attention connects token 50 to token 1 within one layer.

The change is therefore in who issues the queries: one decoder state in Bahdanau attention, versus every token in self-attention.

This does **not** mean text generation becomes fully parallel. Autoregressive decoding still produces one token at a time: token $t$ cannot be generated until tokens $1,\ldots,t-1$ exist. The big parallelism gain is during training, where teacher forcing gives the model the whole target sequence and the causal mask prevents cheating. It also helps during **prefill** at inference: the prompt tokens can be processed together before one-token-at-a-time decoding begins.

The Transformer adds several components around self-attention:

- **multi-head attention** gives the model several ways to compare tokens,
- **positional encoding** tells the model the order of the tokens,
- **feed-forward layers** transform each token independently after attention.

## Scaled Dot-Product Attention

The attention operation is:

$$\text{Attention}(Q,K,V)=\text{softmax}\!\left(\frac{QK^\top}{\sqrt{d_k}}\right)V$$

In Bahdanau attention, the decoder state played the role of the query and the encoder states played the role of the memory. The Transformer makes this more systematic. Each token creates three vectors:

- **Query**: what am I looking for?
- **Key**: what do I contain?
- **Value**: what information should I pass along if someone attends to me?

This is the same softmax-weighted sum used in Part 1, written in matrix form. Here the queries, keys, and values come from the same sequence, which makes it **self-attention**.

Concretely, let $X$ be the input matrix. It has shape `[N, d_model]`: one row per token. Three learned projections produce:

- `Q = X·W_Q` → `[N, d_k]`
- `K = X·W_K` → `[N, d_k]`
- `V = X·W_V` → `[N, d_v]`

Then the attention step is just three operations:

- `QKᵀ` gives an `[N, N]` grid of scores. Row $i$ says: "how much does token $i$ care about each token?"
- a row-wise softmax turns each row into attention weights that sum to 1,
- multiplying by `V` replaces each token with a weighted blend of all token values.

### Why Divide by the Square Root of the Head Dimension?

If query and key components have variance 1, their dot product has variance $d_k$. Wider heads therefore produce larger scores. Large scores make softmax nearly one-hot, leaving weak gradients for almost every key. Dividing by $\sqrt{d_k}$ brings the score variance back near 1.

For one query with $d_k=64$, $\sqrt{d_k}=8$:

| | Scores entering softmax | Softmax probabilities |
|---|---|---|
| Without scaling | $[2,\ 8,\ 1,\ 3]$ | $[0.002,\ 0.990,\ 0.001,\ 0.007]$ |
| Divide by 8 | $[0.25,\ 1,\ 0.125,\ 0.375]$ | $[0.19,\ 0.41,\ 0.17,\ 0.22]$ |

Scaling keeps the second token strongest without erasing the learning signal from the other three.

The following reference implementation shows the operations directly. Part 3 will compare this form with fused implementations used on GPUs.

```python
import math
import torch

def scaled_dot_product_attention(q, k, v, mask=None):
    # q, k, v: [batch, heads, tokens, head_dim]
    scores = q @ k.transpose(-2, -1)      # [.., tokens, tokens]
    scores = scores / math.sqrt(q.size(-1))

    if mask is not None:
        scores = scores.masked_fill(mask == 0, float("-inf"))

    weights = torch.softmax(scores, dim=-1)
    return weights @ v

# In modern PyTorch you'd call the fused version directly:
#   torch.nn.functional.scaled_dot_product_attention(q, k, v, is_causal=True)
```

Step through a live 4-token example below — every cell is the exact value produced by the previous stage, from embeddings through projection, scoring, scaling, softmax, and the weighted sum.

<style>
.embedded-html-wrapper {
  position: relative;
  margin: 2rem 0;
  border-radius: 2px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: #0e1018;
}

.embedded-html-toolbar {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.5rem;
  padding: 0.55rem 0.75rem;
  background: #0e1018;
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
  font-family: "IBM Plex Mono", ui-monospace, monospace;
  color: rgba(255, 255, 255, 0.9);
}

.embedded-html-toolbar-label {
  margin-right: auto;
  font-size: 0.72rem;
  letter-spacing: 0.01em;
  color: #b8b8b8;
}

.embedded-html-toolbar-button {
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 2px;
  padding: 0.3rem 0.55rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: border-color 0.18s ease, background 0.18s ease;
  line-height: 1;
  position: relative;
}

.embedded-html-toolbar-button:hover {
  background: rgba(88, 196, 221, 0.08);
  border-color: rgba(88, 196, 221, 0.55);
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

<div class="embedded-html-wrapper" data-src="/visualizations/attention-qkv-3d.html">
  <div class="embedded-html-toolbar">
    <span class="embedded-html-toolbar-label">Build one attention head in 3D</span>
    <button type="button" class="embedded-html-toolbar-button" data-action="open-new-tab" aria-label="Open the 3D attention walkthrough in a new tab">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 3h7v7h-2V6.414l-9.293 9.293-1.414-1.414L17.586 5H14V3zM5 5h5v2H6v11h11v-4h2v5H5V5z" /></svg>
      <span class="sr-only">Open 3D attention walkthrough in new tab</span>
    </button>
    <button type="button" class="embedded-html-toolbar-button" data-action="fullscreen" data-label-base="Enter fullscreen view for the 3D attention walkthrough" data-label-active="Exit fullscreen view for the 3D attention walkthrough" aria-label="Enter fullscreen view for the 3D attention walkthrough">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h6v2H6v4H4V4zm10 0h6v6h-2V6h-4V4zm6 10v6h-6v-2h4v-4h2zm-10 6H4v-6h2v4h4v2z" /></svg>
      <span class="sr-only">Toggle fullscreen for 3D attention walkthrough</span>
    </button>
  </div>
  <iframe src="/visualizations/attention-qkv-3d.html" loading="lazy" allowfullscreen frameborder="0" scrolling="no" title="Interactive 3D walkthrough of one attention head"></iframe>
</div>

## Multi-Head Self-Attention

With one attention head, each token produces one distribution over the sequence. That single distribution must combine different relationships, such as the previous token, a syntactic parent, a matching pronoun, or a delimiter.

Multi-head attention computes several attention distributions using separate learned projections.

A **head** is one complete self-attention operation with its own learned $W^Q$, $W^K$, and $W^V$ matrices. So head 1 does not use the same queries, keys, and values as head 2. They both see the same input tokens, but they project those tokens into different spaces before computing attention. That is how two heads can look at the same sentence and produce different attention patterns.

Nothing assigns a head its specialty. The projections are learned from the training objective; the architecture simply leaves room for different patterns to emerge.

Mathematically, each head is:

$$\text{head}_i=\text{Attention}(XW_i^Q,\, XW_i^K,\, XW_i^V)$$

$$\text{MultiHead}(X)=\text{Concat}(\text{head}_1,\ldots,\text{head}_h)\,W^O$$

The base Transformer uses $d_{\text{model}}=512$ and $h=8$ heads, so each head works in 64 dimensions. Concatenating the eight head outputs restores a width of 512, and a final projection $W^O$ mixes information across heads. Individual heads are not always easy to interpret, although analyses have found patterns involving previous tokens, delimiters, syntax, and coreference.

Head count is a tradeoff at fixed $d_{\text{model}}$. Too few, and different relationships compete for the same attention pattern. Too many, and each head gets too narrow to form useful queries and keys — 512 dimensions split 32 ways leaves only 16 each — with some heads going redundant.

The visualization below steps through four illustrative heads over the same sentence, then shows how their outputs are concatenated and projected.

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

### The Same Mechanism, Three Jobs

The Transformer reuses the same attention operation in three places. Only the source of $Q$, $K$, and $V$ changes.

| Where | Queries from | Keys / values from | What it does |
|---|---|---|---|
| Encoder self-attention | the source tokens | the source tokens | every source token reads every other source token |
| Decoder masked self-attention | generated tokens so far | generated tokens so far | each output position reads only itself and earlier positions |
| Encoder-decoder cross-attention | the decoder | the **encoder** output | this is Bahdanau attention from Part 1 — the decoder reading the source |

The **causal mask** prevents token $i$ from using future tokens. During training, the full target sentence can still be processed in parallel: future attention scores are set to $-\infty$, and softmax turns those positions into zero weight.

## Positional Encoding: Telling Tokens Where They Are

Self-attention is permutation-equivariant: if the input rows are shuffled, the output rows shuffle in the same way. The operation itself does not indicate which token came first. An RNN encodes order through its sequence of state updates. The original Transformer instead **adds** a position vector to each token embedding before the first layer.

The paper used fixed sine and cosine waves:

$$PE(pos, 2i) = \sin\!\left(\frac{pos}{10000^{\,2i/d_{\text{model}}}}\right), \qquad PE(pos, 2i+1) = \cos\!\left(\frac{pos}{10000^{\,2i/d_{\text{model}}}}\right)$$

Each dimension follows a wave with a different frequency. High-frequency dimensions change noticeably between nearby positions, while low-frequency dimensions change over longer ranges. Their combined values give each position a distinct vector. This resembles a binary counter, where low bits change often and high bits change slowly, except that positional encoding uses smooth waves.

Step through a fast wave pair, a slow pair, the full position fingerprint, and the final addition to a token embedding. On the heatmap step, hover or tap a cell to inspect one position and dimension.

<div class="embedded-html-wrapper" data-src="/visualizations/positional-encoding.html">
  <div class="embedded-html-toolbar">
    <span class="embedded-html-toolbar-label">Sinusoidal positional encoding</span>
    <button type="button" class="embedded-html-toolbar-button" data-action="open-new-tab" aria-label="Open the positional encoding visualization in a new tab">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 3h7v7h-2V6.414l-9.293 9.293-1.414-1.414L17.586 5H14V3zM5 5h5v2H6v11h11v-4h2v5H5V5z" /></svg>
      <span class="sr-only">Open positional encoding visualization in new tab</span>
    </button>
    <button type="button" class="embedded-html-toolbar-button" data-action="fullscreen" data-label-base="Enter fullscreen view for the positional encoding visualization" data-label-active="Exit fullscreen view for the positional encoding visualization" aria-label="Enter fullscreen view for the positional encoding visualization">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h6v2H6v4H4V4zm10 0h6v6h-2V6h-4V4zm6 10v6h-6v-2h4v-4h2zm-10 6H4v-6h2v4h4v2z" /></svg>
      <span class="sr-only">Toggle fullscreen for positional encoding visualization</span>
    </button>
  </div>
  <iframe src="/visualizations/positional-encoding.html" loading="lazy" allowfullscreen frameborder="0" scrolling="no" title="Sinusoidal positional encoding visualization"></iframe>
</div>

> **A 2-position worked example.** In the fastest wave pair, position 0 gives $(\sin 0, \cos 0) = (0, 1)$ and position 1 gives $(\sin 1, \cos 1) \approx (0.84, 0.54)$. That changes a lot. In a slower pair with divisor 100, position 1 gives $(\sin 0.01, \cos 0.01) \approx (0.01, 1.0)$. That barely changes. Nearby tokens differ mostly in fast waves and agree mostly in slow waves.

Modern models often use learned position embeddings or rotary position embeddings instead. We will cover RoPE in Part 4. These methods all provide position information that self-attention does not contain by itself.

## Putting It Together: The Transformer Block

Now we can assemble the Transformer block. The encoder repeats the same layer 6 times. Each encoder layer has two parts:

1. multi-head self-attention, then
2. a position-wise **feed-forward network** (FFN).

The FFN is applied to each token separately. It is two linear layers with a ReLU in between. In the base model it expands from 512 dimensions to 2048, then back to 512. The decoder adds one extra part: **cross-attention**. First it attends to previous output tokens. Then it attends to the encoder output. Then it runs the FFN.

Every sub-layer also has a residual connection and layer normalization. In the original paper, this looked like:

$$\text{LayerNorm}(x + \text{Sublayer}(x))$$

Many later LLMs move layer normalization before the sub-layer, but the 2017 Transformer used the form above. Self-attention combines information across token positions. The FFN then applies the same nonlinear transformation to each position independently. Residual connections preserve the input to each sub-layer, while layer normalization controls the scale of its output.

The visualization below assembles the original encoder-decoder Transformer one sub-layer at a time. It also separates the work that runs in parallel during training and prefill from autoregressive generation, which still emits one token at a time.

<div class="embedded-html-wrapper" data-src="/visualizations/transformer-block-walkthrough.html">
  <div class="embedded-html-toolbar">
    <span class="embedded-html-toolbar-label">Build the 2017 Transformer</span>
    <button type="button" class="embedded-html-toolbar-button" data-action="open-new-tab" aria-label="Open the Transformer block walkthrough in a new tab">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 3h7v7h-2V6.414l-9.293 9.293-1.414-1.414L17.586 5H14V3zM5 5h5v2H6v11h11v-4h2v5H5V5z" /></svg>
      <span class="sr-only">Open Transformer block walkthrough in new tab</span>
    </button>
    <button type="button" class="embedded-html-toolbar-button" data-action="fullscreen" data-label-base="Enter fullscreen view for the Transformer block walkthrough" data-label-active="Exit fullscreen view for the Transformer block walkthrough" aria-label="Enter fullscreen view for the Transformer block walkthrough">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h6v2H6v4H4V4zm10 0h6v6h-2V6h-4V4zm6 10v6h-6v-2h4v-4h2zm-10 6H4v-6h2v4h4v2z" /></svg>
      <span class="sr-only">Toggle fullscreen for Transformer block walkthrough</span>
    </button>
  </div>
  <iframe src="/visualizations/transformer-block-walkthrough.html" loading="lazy" allowfullscreen frameborder="0" scrolling="no" title="Guided walkthrough of the original Transformer encoder and decoder blocks"></iframe>
</div>

### What It Cost in 2017

The base model had about 65M parameters, and the "big" model had about 213M.

| | Base | Big |
|---|---|---|
| Layers (each side) $N$ | 6 | 6 |
| $d_{\text{model}}$ | 512 | 1024 |
| Heads $h$ | 8 | 16 |
| FFN width $d_{ff}$ | 2048 | 4096 |
| Dropout | 0.1 | 0.3 |
| Training | ~12 h, 8× P100 | 3.5 days, 8× P100 |

Training used Adam, 4000 warmup steps, label smoothing, byte-pair encoding, and batches of roughly 25k source plus 25k target tokens. The **big** model reached **28.4 BLEU on WMT'14 English→German** and **41.8 BLEU on English→French**. The **base** model reached 27.3 BLEU on English→German after about 12 hours on 8 P100s. These results exceeded the recurrent translation systems compared in the paper while allowing parallel processing of tokens during training.

## RNN Attention vs. the Transformer

| Property | RNN + attention (Part 1) | Transformer |
|---|---|---|
| Training / prefill parallelism | sequential over tokens | **parallel** over tokens within a layer |
| Autoregressive decoding | sequential over generated tokens | also sequential over generated tokens |
| Longest dependency path | $O(N)$ recurrent steps | **$O(1)$ per layer** — one attention hop |
| Order information | implicit (from recurrence) | explicit (positional encoding) |
| Compute / memory per layer | $O(N)$ | $O(N^2)$ in sequence length |
| Where attention lives | bolted onto the decoder | the entire mechanism, in every layer |

The Transformer allows parallel token processing during training and connects any two positions within one layer. It also creates an $N \times N$ attention table. For the sequence lengths used in the original paper, this cost was manageable.

## Why Quadratic Attention Was Fine — Until It Wasn't

Self-attention builds a square table with $N^2$ entries per head. Doubling the context length therefore makes the attention table four times larger.

For a BERT-base-like setup (12 layers, 12 heads) at $N=512$, the attention probabilities for one sequence in fp16 come to roughly

$$12 \times 12 \times 512^2 \times 2\,\text{bytes} \approx 75\,\text{MB}.$$

That is manageable. But push the context to 8k tokens and the same expression becomes:

$$12 \times 12 \times 8192^2 \times 2\,\text{bytes} \approx 19\,\text{GB}$$

This estimate covers only the attention probabilities. It excludes model weights, optimizer state, other activations, gradients, and batch size. Explicitly computing every token-token interaction removes recurrence, but introduces quadratic scaling in sequence length.

The visualization below builds the square from the mechanism itself: one query token compares against all keys, which fills one row of $QK^\top$; repeat that for every query token, and the full $N \times N$ table appears.

<div class="embedded-html-wrapper" data-src="/visualizations/attention-quadratic-scaling.html">
  <div class="embedded-html-toolbar">
    <span class="embedded-html-toolbar-label">Why dense attention becomes quadratic</span>
    <button type="button" class="embedded-html-toolbar-button" data-action="open-new-tab" aria-label="Open the quadratic attention scaling visualization in a new tab">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 3h7v7h-2V6.414l-9.293 9.293-1.414-1.414L17.586 5H14V3zM5 5h5v2H6v11h11v-4h2v5H5V5z" /></svg>
      <span class="sr-only">Open quadratic attention scaling visualization in new tab</span>
    </button>
    <button type="button" class="embedded-html-toolbar-button" data-action="fullscreen" data-label-base="Enter fullscreen view for the quadratic attention scaling visualization" data-label-active="Exit fullscreen view for the quadratic attention scaling visualization" aria-label="Enter fullscreen view for the quadratic attention scaling visualization">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h6v2H6v4H4V4zm10 0h6v6h-2V6h-4V4zm6 10v6h-6v-2h4v-4h2zm-10 6H4v-6h2v4h4v2z" /></svg>
      <span class="sr-only">Toggle fullscreen for quadratic attention scaling visualization</span>
    </button>
  </div>
  <iframe src="/visualizations/attention-quadratic-scaling.html" loading="lazy" allowfullscreen frameborder="0" scrolling="no" title="Quadratic attention scaling visualization"></iframe>
</div>

The next post covers sparse, low-rank, and kernel approximations, followed by FlashAttention. FlashAttention keeps the attention result exact while changing how intermediate data moves through GPU memory. Part 4 covers inference and the KV cache.

## References

- Vaswani et al., [Attention Is All You Need](https://arxiv.org/abs/1706.03762), 2017.
- Bahdanau, Cho, and Bengio, [Neural Machine Translation by Jointly Learning to Align and Translate](https://arxiv.org/abs/1409.0473), 2014.
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
