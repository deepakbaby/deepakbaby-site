---
title: "Attention Mechanisms, Part 2: Attention Is All You Need"
date: 2026-05-29
draft: false
hero: hero.png
tags: ["deep learning", "attention", "transformers", "self-attention"]
categories: ["Machine Learning"]
description: "A dedicated walkthrough of the 2017 Transformer paper: scaled dot-product attention, multi-head self-attention, sinusoidal positional encoding, the encoder-decoder stack, and why dropping recurrence changed everything."
---

In [Part 1](/posts/attention-history-bahdanau-to-transformer/) we watched attention grow up as a helper. Bahdanau and Luong bolted it onto recurrent encoder-decoders to fix the *fixed-vector bottleneck*: instead of squeezing an entire sentence through one summary vector, the decoder could look back and read a fresh, weighted blend of the source at every step. It worked beautifully, and by 2016 attention was everywhere in sequence modeling. But it was always a passenger. The engine underneath was still a recurrent network, grinding through tokens one at a time.

That sequential engine had two stubborn costs. First, **you cannot parallelize across time**: step $t$ needs the hidden state from step $t-1$, so a 100-token sentence is 100 unavoidable sequential operations, no matter how many GPUs you own. Second, **long-range information has to survive a long walk**: for the model to relate the first word to the fiftieth, a signal must thread through fifty recurrent updates without being forgotten or distorted.

In 2017, [Vaswani et al.](https://arxiv.org/abs/1706.03762) asked the obvious-in-hindsight question: if attention is the part doing the useful relating, *what if we throw the recurrence away and keep only attention?* The answer — "Attention Is All You Need" — became the base architecture behind essentially every large model since. This post is a guided tour of that paper.

I assume the basics (vectors, matrix multiply, softmax) but not deep familiarity with Transformers. If attention itself is new to you, read [Part 1](/posts/attention-history-bahdanau-to-transformer/) first.

{{< vs 2>}}

<iframe src="/visualizations/attention-history-timeline-simple.html" loading="lazy" frameborder="0" scrolling="no" title="Attention timeline (2014–2017)" style="width: 100%; border: none; background: transparent; display: block; height: 220px; margin: 1.5rem 0;"></iframe>

## From Recurrence to Pure Attention

A recurrent decoder mixes information *through time*: token 50 sees token 1 only because the hidden state carried something forward across 49 updates. Self-attention mixes information *directly*: in one layer, every token computes a weighted relationship with every other token, in a single batched matrix multiply. The "distance" between any two tokens drops from $O(N)$ recurrent steps to a single attention hop, and the whole operation is one parallel GPU kernel instead of a sequential loop.

Everything else in the Transformer exists to make that one idea work: to give it different *kinds* of relationships (multi-head attention), to tell it *where* each token sits (positional encoding), and to give each token room to *think* on its own (the feed-forward network). We'll take them one at a time.

## Scaled Dot-Product Attention

The heart of the model is one compact equation:

$$\text{Attention}(Q,K,V)=\text{softmax}\!\left(\frac{QK^\top}{\sqrt{d_k}}\right)V$$

In plain English: **each token writes a query describing what it is looking for; every token also advertises a key; we match queries against keys to get attention weights, then use those weights to pull together a blend of the tokens' values.** It is the same softmax-weighted sum from Part 1 — only now a token's query is matched against *every token in the same sequence*, including itself. That is what "self" in self-attention means.

The three roles are worth pinning down, because the whole mechanism is just a clever lookup:

| Term | Role | Loose analogy |
|---|---|---|
| Query $Q$ | what this token is looking for | the search box you type into |
| Key $K$ | what each token advertises | the title/tag a document is indexed under |
| Value $V$ | the content that actually gets mixed in | the document body you retrieve |

Concretely, if the input is $X$ with shape `[N, d_model]` (one row per token), three learned projections produce

- `Q = X·Wq` → `[N, d_k]`
- `K = X·Wk` → `[N, d_k]`
- `V = X·Wv` → `[N, d_v]`

and then:

- `QKᵀ` gives an `[N, N]` grid of pairwise scores — row $i$ is "how much does token $i$ care about each token?"
- a row-wise softmax turns each row into attention weights that sum to 1,
- multiplying by `V` replaces each token with a weighted blend of all token values.

### Why Divide by the Square Root of the Head Dimension?

This is the one genuinely subtle term in the formula, and it is easy to motivate. Suppose the query and key components are roughly independent, zero-mean, and unit-variance. A dot product sums $d_k$ such products, so its variance is about $d_k$ and its standard deviation about $\sqrt{d_k}$. As the head dimension grows, the *raw* scores spread out — and large scores push softmax into a saturated corner where one weight is ~1, the rest ~0, and the gradient nearly vanishes. Dividing by $\sqrt{d_k}$ rescales the scores back to roughly unit variance, keeping softmax in its responsive range:

| Head dimension $d_k$ | Raw dot-product std. dev. ($\sqrt{d_k}$) | After dividing by $\sqrt{d_k}$ |
|---:|---:|---:|
| 4 | 2.0 | 1.0 |
| 64 | 8.0 | 1.0 |
| 512 | 22.6 | 1.0 |

> **Why this matters.** Without the scale factor, a model with $d_k=64$ feeds softmax logits that are ~8× too large; the attention distribution collapses to near one-hot early in training and stops learning useful gradients. The fix costs one division and is the difference between a model that trains and one that stalls.

### A Tiny Numerical Trace

Concrete numbers make it click. Say a query produces raw scores $[2.0,\ 8.0,\ 1.0,\ 3.0]$ against four tokens, with $d_k = 64$ so $\sqrt{d_k}=8$.

Divide by 8 → $[0.25,\ 1.0,\ 0.125,\ 0.375]$. Softmax of *those* is a gentle, informative distribution $\approx [0.17,\ 0.37,\ 0.15,\ 0.20]$ — the second token wins but the others still contribute and still receive gradient. Softmax of the *unscaled* scores $[2,8,1,3]$ is $\approx [0.0024,\ 0.985,\ 0.0009,\ 0.018]$: the second token swallows essentially all the weight, and the model can barely tell the others apart. Same scores, one division, completely different learning signal.

Here is the readable reference implementation — no fused kernels, just the math (Part 3 of this series will show why this exact loop is slow on real hardware):

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

## Multi-Head Self-Attention

One attention distribution forces a token to settle on a single way of relating to the rest of the sentence. But language has many kinds of relationship at once — a verb agrees with its subject, a pronoun refers to a noun, an adjective modifies its neighbor. Multi-head attention lets the model run several attention operations **in parallel**, each in its own learned subspace:

$$\text{head}_i=\text{Attention}(XW_i^Q,\, XW_i^K,\, XW_i^V)$$

$$\text{MultiHead}(X)=\text{Concat}(\text{head}_1,\ldots,\text{head}_h)\,W^O$$

The accounting is neat and deliberately cost-neutral. The base Transformer uses $d_{\text{model}}=512$ and $h=8$ heads, with each head working in a slim $d_k = d_v = 512/8 = 64$ dimensions. So each head attends in a 64-dim subspace, the eight 64-dim outputs concatenate back to 512, and a final projection $W^O$ mixes them. **Eight cheap heads cost about the same as one full-width head, but give the model eight independent relationship patterns instead of one.** Real heads are noisier than the textbook story, but probing studies do find heads that specialize — some track the previous token, some track syntactic dependencies, some resolve coreference.

The visualization below shows four heads over one sentence; toggle heads and click a token to isolate its outgoing attention.

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

A subtle but important point: the Transformer uses this *one* attention operation in **three** places, differing only in where $Q$, $K$, and $V$ come from.

| Where | Queries from | Keys / values from | What it does |
|---|---|---|---|
| Encoder self-attention | the source tokens | the source tokens | every source token reads every other source token |
| Decoder masked self-attention | generated tokens so far | generated tokens so far | each output token reads earlier outputs only (no peeking ahead) |
| Encoder-decoder cross-attention | the decoder | the **encoder** output | this is Bahdanau attention from Part 1 — the decoder reading the source |

The **mask** in the decoder is what makes generation honest: during training we feed the whole target sentence at once for parallelism, so we must forbid position $i$ from attending to positions $>i$. The implementation is exactly the `masked_fill(..., -inf)` line in the code above — set the forbidden scores to $-\infty$ so softmax sends them to zero.

## Positional Encoding: Telling Tokens Where They Are

Self-attention has a curious blind spot. Look back at the equation: it is a sum over tokens, and a sum does not care about order. Shuffle the input rows and the output rows shuffle the same way, but nothing else changes — the mechanism is **permutation-equivariant**. To attention, "dog bites man" and "man bites dog" are the same bag of tokens. Recurrence got order for free, because it processed tokens in sequence; pure attention has to be *told* where each token sits.

The Transformer's answer is to **add** a position vector to each token embedding before the first layer. The clever part is how those vectors are built — from sines and cosines of geometrically increasing wavelength:

$$PE(pos, 2i) = \sin\!\left(\frac{pos}{10000^{\,2i/d_{\text{model}}}}\right), \qquad PE(pos, 2i+1) = \cos\!\left(\frac{pos}{10000^{\,2i/d_{\text{model}}}}\right)$$

Each dimension is a wave. Low dimensions have short wavelengths and oscillate quickly from one position to the next; high dimensions have wavelengths of thousands of positions and barely move. The result is a unique, smooth "fingerprint" for every position — think of it as a continuous generalization of a binary counter, where the low bit flips every step and higher bits flip ever more slowly. Crucially, because $\sin$ and $\cos$ of a shifted angle are linear combinations of the originals, the encoding of position $pos+k$ is a fixed linear function of the encoding at $pos$ — so the model can *learn to read relative distance* directly from these features.

Explore it below: hover the heatmap to pick a **dimension** (a column → see its wave across positions) or a **position** (a row → see the full vector that gets added to that token).

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

> **A 2-position worked example.** Take dimension pair $i=0$ (so $2i=0$, divisor $10000^{0}=1$). Position 0 gives $(\sin 0, \cos 0) = (0, 1)$; position 1 gives $(\sin 1, \cos 1) \approx (0.84, 0.54)$. This fast pair changes a lot between neighboring positions. Now take a high pair, say $2i/d_{\text{model}} = 0.5$ (divisor $= 100$): position 0 gives $(\sin 0, \cos 0)=(0,1)$ and position 1 gives $(\sin 0.01, \cos 0.01)\approx(0.01, 1.0)$ — almost identical. Nearby tokens agree on the slow dimensions and differ on the fast ones, which is exactly the signal the model needs to tell "one apart" from "fifty apart."

(Modern models often swap these fixed sinusoids for *learned* or *rotary* position embeddings — RoPE, which we'll meet in Part 4 — but the job is identical: restore the order information that attention discards.)

## Putting It Together: The Transformer Block

With the pieces in hand, the full architecture is almost anticlimactic — it is the same small block stacked $N=6$ times on each side. Each **encoder layer** is two sub-layers:

1. multi-head self-attention, then
2. a position-wise **feed-forward network** (FFN): two linear layers with a ReLU in between, applied to each token independently, widening from $d_{\text{model}}=512$ out to $d_{ff}=2048$ and back.

Each **decoder layer** inserts a third sub-layer — encoder-decoder cross-attention — between its masked self-attention and its FFN. Every sub-layer is wrapped in the same two-part envelope: a **residual connection** (add the input back to the output) and **layer normalization**. Written out, each sub-layer computes $\text{LayerNorm}(x + \text{Sublayer}(x))$.

| Component | What it contributes |
|---|---|
| Multi-head self-attention | mixes information *between* tokens |
| Feed-forward network ($d_{ff}=2048$) | per-token nonlinear "thinking" after the mix |
| Residual connections | give gradients and signal a clean path through deep stacks |
| Layer normalization | keeps activations well-scaled and training stable |
| Masked decoder attention | prevents a token from seeing its own future during training |
| Positional encoding | restores the order information attention is blind to |

Attention does the *communication*; the FFN does the *computation*. Stack six of these blocks, and a token's representation has been refined by six rounds of "look around, then think."

The visualization below traces the same signal path through all three architectures from this series — the seq2seq bottleneck, Bahdanau's per-step reads, and the Transformer's all-pairs parallel mixing.

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

### What It Cost in 2017

The numbers are a useful reality check on how modest the original was. The base model has ~65M parameters; the "big" model ~213M.

| | Base | Big |
|---|---|---|
| Layers (each side) $N$ | 6 | 6 |
| $d_{\text{model}}$ | 512 | 1024 |
| Heads $h$ | 8 | 16 |
| FFN width $d_{ff}$ | 2048 | 4096 |
| Dropout | 0.1 | 0.3 |
| Training | ~12 h, 8× P100 | 3.5 days, 8× P100 |

Training used the Adam optimizer with a warmup-then-decay learning-rate schedule (4000 warmup steps), label smoothing of 0.1, and length-filtered WMT'14 examples. The payoff: the big model reached **28.4 BLEU on WMT'14 English→German** and **41.8 BLEU on English→French**, beating the previous best (including ensembles) at a fraction of the training cost. That result is what turned "drop the recurrence" from a provocative idea into the new default.

## RNN Attention vs. the Transformer

| Property | RNN + attention (Part 1) | Transformer |
|---|---|---|
| Training parallelism | sequential over tokens | **parallel** over tokens within a layer |
| Longest dependency path | $O(N)$ recurrent steps | **$O(1)$** — one attention hop |
| Order information | implicit (from recurrence) | explicit (positional encoding) |
| Compute / memory per layer | $O(N)$ | $O(N^2)$ in sequence length |
| Where attention lives | bolted onto the decoder | the entire mechanism, in every layer |

The Transformer wins decisively on the two costs that crippled RNNs — parallelism and long-range paths — and pays for it with a new line item: that $O(N^2)$ in the last row. In 2017, with $N$ around 512, nobody minded.

## Why Quadratic Attention Was Fine — Until It Wasn't

The self-attention matrix has $N^2$ entries per head, and you store one per head per layer during training. The trouble is the *quadratic*: double the context, quadruple the matrix.

For a BERT-base-like setup (12 layers, 12 heads) at $N=512$, the attention probabilities in fp16 come to roughly

$$12 \times 12 \times 512^2 \times 2\,\text{bytes} \approx 75\,\text{MB},$$

which is nothing. But push the context to 8k tokens and the same expression explodes:

$$12 \times 12 \times 8192^2 \times 2\,\text{bytes} \approx 19\,\text{GB}$$

— and that is *only* the attention scores, before parameters, optimizer state, other activations, or any batch dimension. The Transformer cured the RNN's sequential bottleneck by making all token-token interactions explicit; in doing so it created the next bottleneck, $O(N^2)$ memory and compute.

The rest of the series is the story of fighting that quadratic. **Part 3** covers the first wave — sparse, low-rank, and kernel approximations that tried to dodge the $N^2$ — and then FlashAttention, which kept attention *exact* but made it IO-aware and fast. **Part 4** moves to the inference era, where the bottleneck migrates again, this time to the KV cache.

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
