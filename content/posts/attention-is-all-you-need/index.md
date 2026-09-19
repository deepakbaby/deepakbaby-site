---
title: "Attention Mechanisms, Part 2: Attention Is All You Need"
date: 2026-05-29
draft: false
hero: hero.png
tags: ["deep learning", "attention", "transformers", "self-attention"]
categories: ["Machine Learning"]
description: "A dedicated walkthrough of the 2017 Transformer paper: scaled dot-product attention, multi-head self-attention, sinusoidal positional encoding, the encoder-decoder stack, and why dropping recurrence changed everything."
---

In [Part 1](/posts/attention-history-bahdanau-to-transformer/) we saw the key idea of attention: do not compress the whole source sentence into one vector. Keep a vector for each source token, and let the decoder look back at the useful ones. In Bahdanau attention, the decoder state asks a question, the encoder states act like memory, and the answer is a weighted blend of source tokens.

That was already most of the Transformer hiding in plain sight. The remaining question was: if attention is the useful part, why keep the recurrent machinery around it? RNNs still process tokens one by one, which makes training hard to parallelize. They also pass information through a chain of hidden states, so long-range relationships still have to survive many updates.

In 2017, [Vaswani et al.](https://arxiv.org/abs/1706.03762) took the next step: remove recurrence and make attention the main computation.

{{< vs 2>}}

<iframe src="/visualizations/attention-history-timeline-simple.html" loading="lazy" frameborder="0" scrolling="no" title="Attention timeline (2014–2017)" style="width: 100%; border: none; background: transparent; display: block; height: 220px; margin: 1.5rem 0;"></iframe>

## From Bahdanau Attention to Self-Attention

Bahdanau attention still wrapped a recurrent network: the decoder state $s_i$ queried the encoder's per-token vectors and got back a weighted sum. So remove the RNN and ask what is left. We still need tokens to ask questions, and we still need a memory to answer from. The Transformer makes each token do both jobs. Every token produces a query, a key, and a value. Its query asks what it needs; other tokens' keys say what they offer; their values carry the information to be mixed in.

That turns attention from a decoder reading the source into tokens reading each other. A recurrent model passes information along a chain. Self-attention builds the pairwise token relationships directly, so token 50 can look at token 1 in one attention step.

That is the main leap:

> **Core idea.** Bahdanau attention let one decoder state read the source. Self-attention lets every token read every other token.

This does **not** mean text generation becomes fully parallel. Autoregressive decoding still produces one token at a time: token $t$ cannot be generated until tokens $1,\ldots,t-1$ exist. The big parallelism gain is during training, where teacher forcing gives the model the whole target sequence and the causal mask prevents cheating. It also helps during **prefill** at inference: the prompt tokens can be processed together before one-token-at-a-time decoding begins.

Everything else in the Transformer supports that idea:

- **multi-head attention** gives the model several ways to compare tokens,
- **positional encoding** tells the model the order of the tokens,
- **feed-forward layers** let each token process what it just gathered.

## Scaled Dot-Product Attention

The heart of the model is one compact equation:

$$\text{Attention}(Q,K,V)=\text{softmax}\!\left(\frac{QK^\top}{\sqrt{d_k}}\right)V$$

In Bahdanau attention, the decoder state played the role of the query and the encoder states played the role of the memory. The Transformer makes this more systematic. Each token creates three vectors:

- **Query**: what am I looking for?
- **Key**: what do I contain?
- **Value**: what information should I pass along if someone attends to me?

The equation is that lookup in matrix form, and it is the same softmax-weighted sum from Part 1. The difference is that the tokens now attend to each other inside one sequence, which is why it is called **self-attention**.

Concretely, let $X$ be the input matrix. It has shape `[N, d_model]`: one row per token. Three learned projections produce:

- `Q = X·Wq` → `[N, d_k]`
- `K = X·Wk` → `[N, d_k]`
- `V = X·Wv` → `[N, d_v]`

Then the attention step is just three operations:

- `QKᵀ` gives an `[N, N]` grid of scores. Row $i$ says: "how much does token $i$ care about each token?"
- a row-wise softmax turns each row into attention weights that sum to 1,
- multiplying by `V` replaces each token with a weighted blend of all token values.

### Why Divide by the Square Root of the Head Dimension?

The division by $\sqrt{d_k}$ is easy to miss, but it matters. Assume query and key components are independent with mean 0 and variance 1; then their dot product has mean 0 and variance $d_k$. Scores therefore grow with head width, and large scores push softmax toward one-hot, into the region where its gradients nearly vanish. Dividing by $\sqrt{d_k}$ restores unit variance:

| Head dimension $d_k$ | Raw dot-product std. dev. ($\sqrt{d_k}$) | After dividing by $\sqrt{d_k}$ |
|---:|---:|---:|
| 4 | 2.0 | 1.0 |
| 64 | 8.0 | 1.0 |
| 512 | 22.6 | 1.0 |

### A Tiny Numerical Trace

Suppose one query produces these raw scores against four tokens:

$$[2.0,\ 8.0,\ 1.0,\ 3.0]$$

Here $d_k = 64$, so $\sqrt{d_k}=8$. After dividing by 8, the scores become:

$$[0.25,\ 1.0,\ 0.125,\ 0.375]$$

Softmax now gives a useful spread: roughly $[0.19,\ 0.41,\ 0.17,\ 0.22]$. The second token gets the most attention, but the others still matter. Without scaling, softmax gives roughly $[0.002,\ 0.990,\ 0.001,\ 0.007]$. Almost everything goes to the second token, so the model has a much weaker learning signal for the rest.

Here is the readable reference implementation — no fused kernels, just the math (a later post will show why this exact loop is slow on real hardware):

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

Self-attention gives every token a way to read the whole sentence. But if we use only one attention map, each token has to compress all its reasons for looking around into one pattern. That is too narrow. A word may need its syntactic parent, the previous word, a matching pronoun, and a delimiter token for different reasons.

The natural fix is not to make one attention map more complicated. It is to give the model several simpler attention maps.

A **head** is one complete self-attention operation with its own learned $W^Q$, $W^K$, and $W^V$ matrices. So head 1 does not use the same queries, keys, and values as head 2. They both see the same input tokens, but they project those tokens into different spaces before computing attention. That is how two heads can look at the same sentence and produce different attention patterns.

Nothing assigns a head its specialty. The projections are learned from the training objective; the architecture simply leaves room for different patterns to emerge.

Mathematically, each head is:

$$\text{head}_i=\text{Attention}(XW_i^Q,\, XW_i^K,\, XW_i^V)$$

$$\text{MultiHead}(X)=\text{Concat}(\text{head}_1,\ldots,\text{head}_h)\,W^O$$

The base Transformer uses $d_{\text{model}}=512$ and $h=8$ heads, so each head works in 64 dimensions. The eight outputs are concatenated back to 512 dimensions, then mixed with one final projection. That is the clever part: the model gets multiple views without multiplying its width by eight. Real heads are not always clean or human-readable, but many do learn recognizable roles: previous-token links, delimiters, syntax, coreference.

Head count is a tradeoff at fixed $d_{\text{model}}$. Too few, and different relationships compete for the same attention pattern. Too many, and each head gets too narrow to form useful queries and keys — 512 dimensions split 32 ways leaves only 16 each — with some heads going redundant.

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

The Transformer reuses the same attention operation in three places. Only the source of $Q$, $K$, and $V$ changes.

| Where | Queries from | Keys / values from | What it does |
|---|---|---|---|
| Encoder self-attention | the source tokens | the source tokens | every source token reads every other source token |
| Decoder masked self-attention | generated tokens so far | generated tokens so far | each output position reads only itself and earlier positions |
| Encoder-decoder cross-attention | the decoder | the **encoder** output | this is Bahdanau attention from Part 1 — the decoder reading the source |

The **mask** is what keeps generation honest. During training, we feed the target sentence all at once so training can be parallel. But token $i$ must not look at future tokens. So we set future attention scores to $-\infty$. Softmax then turns those positions into zero weight.

## Positional Encoding: Telling Tokens Where They Are

Self-attention is permutation-equivariant: shuffle the input rows and the output rows shuffle the same way, with nothing to signal that one token came before another. Without position information, "dog bites man" and "man bites dog" are the same vectors in a different order. An RNN got order for free by reading tokens one at a time; a Transformer has to be told. The original does this by **adding** a position vector to each token embedding before the first layer.

The paper used fixed sine and cosine waves:

$$PE(pos, 2i) = \sin\!\left(\frac{pos}{10000^{\,2i/d_{\text{model}}}}\right), \qquad PE(pos, 2i+1) = \cos\!\left(\frac{pos}{10000^{\,2i/d_{\text{model}}}}\right)$$

Think of each dimension as a wave. Some waves change quickly, so they help tell nearby positions apart. Other waves change slowly, so they help track broader position. Together, the waves form a fingerprint for each position. A useful analogy is a binary counter: low bits change fast, high bits change slowly. Positional encoding does something similar, but with smooth waves instead of bits.

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

> **A 2-position worked example.** In the fastest wave pair, position 0 gives $(\sin 0, \cos 0) = (0, 1)$ and position 1 gives $(\sin 1, \cos 1) \approx (0.84, 0.54)$. That changes a lot. In a slower pair with divisor 100, position 1 gives $(\sin 0.01, \cos 0.01) \approx (0.01, 1.0)$. That barely changes. Nearby tokens differ mostly in fast waves and agree mostly in slow waves.

Modern models often use learned or rotary position embeddings instead. We will meet RoPE in a later post. The job is the same: give attention a sense of order.

## Putting It Together: The Transformer Block

Now we can assemble the Transformer block. The encoder repeats the same layer 6 times. Each encoder layer has two parts:

1. multi-head self-attention, then
2. a position-wise **feed-forward network** (FFN).

The FFN is applied to each token separately. It is two linear layers with a ReLU in between. In the base model it expands from 512 dimensions to 2048, then back to 512. The decoder adds one extra part: **cross-attention**. First it attends to previous output tokens. Then it attends to the encoder output. Then it runs the FFN.

Every sub-layer also has a residual connection and layer normalization. In the original paper, this looked like:

$$\text{LayerNorm}(x + \text{Sublayer}(x))$$

Many later LLMs move layer norm before the sub-layer, but the 2017 Transformer used the form above.

A useful way to read the block is:

> **Attention is communication. FFN is computation.**  
> Each layer says: look around, then think locally.

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

The numbers are a useful reality check on how modest the original was. The base model had about 65M parameters; the "big" model about 213M.

| | Base | Big |
|---|---|---|
| Layers (each side) $N$ | 6 | 6 |
| $d_{\text{model}}$ | 512 | 1024 |
| Heads $h$ | 8 | 16 |
| FFN width $d_{ff}$ | 2048 | 4096 |
| Dropout | 0.1 | 0.3 |
| Training | ~12 h, 8× P100 | 3.5 days, 8× P100 |

Training used Adam, 4000 warmup steps, label smoothing, byte-pair encoding, and batches of roughly 25k source plus 25k target tokens. The headline result was strong: the **big** model reached **28.4 BLEU on WMT'14 English→German** and **41.8 BLEU on English→French**, while the **base** model reached 27.3 BLEU on English→German after about 12 hours on 8 P100s. The important point is not just the score. It is that a model with no recurrence beat strong recurrent translation systems while training with much more parallel work per batch.

## RNN Attention vs. the Transformer

| Property | RNN + attention (Part 1) | Transformer |
|---|---|---|
| Training / prefill parallelism | sequential over tokens | **parallel** over tokens within a layer |
| Autoregressive decoding | sequential over generated tokens | also sequential over generated tokens |
| Longest dependency path | $O(N)$ recurrent steps | **$O(1)$ per layer** — one attention hop |
| Order information | implicit (from recurrence) | explicit (positional encoding) |
| Compute / memory per layer | $O(N)$ | $O(N^2)$ in sequence length |
| Where attention lives | bolted onto the decoder | the entire mechanism, in every layer |

The wins are parallel training and one-hop long-range connections. The cost is the $N \times N$ attention table. In 2017, with sequences of a few hundred tokens, that was a good trade.

## Why Quadratic Attention Was Fine — Until It Wasn't

Self-attention builds a square table: $N^2$ entries per head. This is the whole problem:

> Double the context length, and the attention table gets four times larger.

For a BERT-base-like setup (12 layers, 12 heads) at $N=512$, the attention probabilities for one sequence in fp16 come to roughly

$$12 \times 12 \times 512^2 \times 2\,\text{bytes} \approx 75\,\text{MB}.$$

That is manageable. But push the context to 8k tokens and the same expression becomes:

$$12 \times 12 \times 8192^2 \times 2\,\text{bytes} \approx 19\,\text{GB}$$

And that is only the attention matrix term — it excludes model weights, optimizer state, other activations, gradients, and batch size. Making every token-token interaction explicit is what removed the RNN's sequential bottleneck, and it is exactly what created the quadratic one.

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

The rest of the series is about fighting that square table. The next post covers the sparse, low-rank, and kernel approximations that tried to avoid building it at all. After that comes FlashAttention, which keeps attention exact and instead changes how it moves through memory. Later still, the series turns to inference, where the bottleneck shifts again: this time to the KV cache.

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
