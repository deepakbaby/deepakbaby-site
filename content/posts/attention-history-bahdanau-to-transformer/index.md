---
title: "Attention Mechanisms, Part 1: From Seq2Seq to Learned Alignment"
date: 2026-05-09
draft: false
hero: hero.png
tags: ["deep learning", "attention", "sequence-to-sequence", "machine translation"]
categories: ["Machine Learning"]
description: "Part 1 of a series on attention mechanisms: the move from fixed-vector seq2seq models to Bahdanau and Luong attention, and the rapid spread of attention across translation, captioning, speech, and QA."
---

Most of the interesting things we ask neural networks to do look the same from a distance: take a sequence in, produce a sequence out. Translate an English sentence into French -> sequence of English words in,  a sequence of French words out. Caption an image or transcribe a recording of speech -> sequence of pixels/recording-samples to a sequence of words. Summarize a paragraph or answer a question grounded in a story -> words in, words out.

Researchers call this family of tasks **sequence-to-sequence** (or *seq2seq*) problems. The main challenge of solving a seq2seq problem is that the two sequences rarely match up neatly: a three-word English phrase might need seven words in French, a few seconds of audio collapse into a short sentence, and a paragraph shrinks to a one-line summary. The lengths differ, and so does the order. So the model has to figure out, on its own, which parts of the input are responsible for which parts of the output; which French word is really standing in for which English one. That correspondence between pieces of the input and pieces of the output is what we'll call **alignment**, and getting it right turns out to be the heart of the whole problem.

Modern large language models sit squarely in the same frame; a prompt goes in, a continuation comes out, one token at a time. The input might be words, pixels, or audio frames; the output is almost always a sequence of tokens that has its own length, its own ordering, and only a loose, learned correspondence to the input. By the early 2010s, researchers had started asking whether one general neural architecture could learn all of these mappings end to end; without language-specific rules, hand-built pipelines, or modality-specific tricks. The answer, and the mechanism that made it work; and that still powers today's LLMs; is what this post is about: **attention**.

This is the first post in a planned series on attention. It covers the 2014–2016 arc: from RNN encoder-decoder models, through learned soft alignment, to attention spreading across translation, image captioning, speech recognition, and question answering. Later posts will follow the story further as attention runs into new bottlenecks; approximate variants, IO-aware kernels, and inference-time tricks; but each post is meant to stand on its own.

{{< vs 2>}}

<iframe src="/visualizations/attention-history-timeline-simple.html" loading="lazy" frameborder="0" scrolling="no" title="Attention timeline (2014–2017)" style="width: 100%; border: none; background: transparent; display: block; height: 220px; margin: 1.5rem 0;"></iframe>

Machine translation is a natural backdrop for the attention story because it spent two decades pushing against the same problem attention eventually solved: how to map a variable-length input sequence to a variable-length output sequence with possibly different word order, vocabulary, and structure.

Early systems were rule-based, hand-coded by linguists. From the early 1990s onward, the field switched to **statistical machine translation (SMT)**. Systems like [IBM Models 1–5](https://aclanthology.org/J93-2003/) and later phrase-based systems such as [Moses](https://aclanthology.org/P07-2045/) decomposed translation into a pipeline of separate modules. A word/phrase alignment step learned which source words corresponded to which target words; this was the job of the famous IBM "alignment models". A translation model scored how likely a source phrase was to translate to a particular target phrase. A separate language model, usually an n-gram model trained on monolingual target-language text, scored how fluent a candidate output sentence sounded on its own. Finally, a decoder searched over combinations of phrase translations to maximize the combined score.

This pipeline produced the dominant systems of the 2000s and early 2010s. But each stage was trained or estimated separately, and the alignment step in particular relied on heuristics and pre-processing that did not generalize well to new domains or languages.

## Sequence-to-Sequence Learning

In 2014, two papers reframed translation as a single end-to-end neural problem. [Cho et al.](https://arxiv.org/abs/1406.1078) introduced the **encoder-decoder** framing using GRUs, and [Sutskever, Vinyals, and Le](https://arxiv.org/abs/1409.3215) showed it could match strong phrase-based systems on WMT'14 English-French using deep LSTMs.

The recipe was strikingly simple. An encoder RNN reads the source sentence one token at a time and updates a hidden state:

$$h_t = f_{\text{enc}}(h_{t-1}, x_t)$$

After the last source token, the final hidden state $h_S$ is treated as a fixed-size **context vector** $c$ that summarizes the source. A decoder RNN then generates the target sentence one token at a time, conditioned on $c$ and its own previous outputs:

$$s_t = f_{\text{dec}}(s_{t-1}, y_{t-1}, c), \quad p(y_t \mid y_{<t}, x) = \text{softmax}(W s_t)$$

The model is trained end to end by maximizing the log-likelihood of the target sentence given the source. There are no separate alignment models, phrase tables, or hand-crafted features. Everything that translation needs to know; vocabulary correspondences, reordering, agreement, fluency; must be packed into the parameters of the encoder, decoder, and the embedding tables, and routed through that one context vector at decoding time.

That was both the breakthrough and, almost immediately, the limitation.

<iframe src="/visualizations/seq2seq-encoder-decoder.html" loading="lazy" frameborder="0" scrolling="no" title="Sequence-to-sequence encoder-decoder architecture" style="width: 100%; border: none; background: transparent; display: block; height: 360px; margin: 1.5rem 0;"></iframe>

Step through the animation to watch the data flow. The encoder reads the input words $x_t$ one at a time, each one updating the single fixed context vector $c$. Decoding is then seeded with a special start-of-sequence token `<sos>` and runs **autoregressively**: the decoder emits one word at a time, and each word it produces is fed back in as the input for the next step, until it finally emits an end-of-sequence token `<eos>` to stop.

## The Fixed-Vector Bottleneck

The context vector $c$ is fixed-size regardless of input length. A five-word sentence and a fifty-word sentence both have to pass through the same narrow channel. Every output token is predicted from earlier output tokens and the same compressed source summary:

$$p(y_1,\ldots,y_T \mid x_1,\ldots,x_S) = \prod_{t=1}^{T} p(y_t \mid y_1,\ldots,y_{t-1}, c)$$

That compression was the problem. [Bahdanau, Cho, and Bengio](https://arxiv.org/abs/1409.0473) showed that translation quality dropped sharply for longer sentences. The model did not just need a better hidden state; it needed a way to look back at the source while decoding.

### Worked Example: One Vector, Two Jobs

Imagine an encoder state with only four dimensions:

| Source sentence | What the vector must preserve |
|---|---|
| "dogs chase cats" | subject, verb, object |
| "the agreement on the European Economic Area was signed in August 1992" | entities, dates, prepositions, ordering, long-range dependencies |

For the short sentence, a single vector can plausibly carry the core meaning. For the longer sentence, the vector has to remember both "European Economic Area" and "August 1992", plus where each belongs in the target language. The decoder has no direct address into the input; it only gets the final summary.

Long-sentence translation errors were not just a data problem. They followed from the architecture. The decoder had no mechanism for saying, "while generating this French word, look specifically at that English phrase."

[Bahdanau attention](https://arxiv.org/abs/1409.0473) fixed the bottleneck by changing the decoder's job. Instead of decoding from one source summary, the encoder produces a high-resolution **Memory Matrix ($H$)** containing context-aware vectors for every source token. The decoder then computes a fresh **context vector $c_i$** for each output step $i$ by querying this matrix.

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

<iframe src="/visualizations/attention-bahdanau-alignment.html" loading="lazy" frameborder="0" scrolling="no" title="Bahdanau attention alignment visualization" style="width: 100%; border: none; background: transparent; display: block; height: 520px; margin: 1.5rem 0;"></iframe>

The visualization above illustrates this data flow. On the left, input words are encoded into a multi-vector **Memory Matrix ($H$)**. During each scoring phase, the previous decoder state **$s_{i-1}$** (shown on the feedback arc) is combined with each source annotation to produce alignment scores $\alpha_{ij}$, visualized as brighter/thicker attention beams. Those weighted annotations are then summed into the per-step **context vector $c_i$**, which is passed into the decoder to generate the next target token.

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

<iframe src="/visualizations/luong-attention-variants.html" loading="lazy" frameborder="0" scrolling="no" title="Luong attention variants" style="width: 100%; border: none; background: transparent; display: block; height: 540px; margin: 1.5rem 0;"></iframe>

The first tab compares the three scoring functions on the same query/key pair, including parameter count and per-pair compute. The second tab toggles between global attention (all source tokens contribute) and local attention (only a window around the predicted alignment $p_t$), with a slider for the half-width $D$.

## 2015-2017: Attention Becomes the Default

Bahdanau attention quickly became standard in competitive RNN encoder-decoder systems, especially in neural machine translation. It improved long-sentence translation and produced alignment heatmaps that researchers could inspect.

By 2016, attention-based encoder-decoder models were showing up across sequence modeling. [Google's Neural Machine Translation system](https://arxiv.org/abs/1609.08144) used an attention mechanism on top of deep LSTMs. [OpenNMT](https://aclanthology.org/P17-4012/) made attention-based neural translation easier to reproduce. Outside translation, attention appeared in image captioning through ["Show, Attend and Tell"](https://arxiv.org/abs/1502.03044), speech recognition through ["Listen, Attend and Spell"](https://arxiv.org/abs/1508.01211), and memory-style question answering through [end-to-end memory networks](https://arxiv.org/abs/1503.08895).

The common pattern was still recurrent: an RNN processed tokens sequentially, and attention helped it look back at useful inputs. Attention had become common, but it was still attached to recurrence.

<div class="embedded-html-wrapper" data-src="/visualizations/attention-applications.html">
  <div class="embedded-html-toolbar">
    <span class="embedded-html-toolbar-label">Where attention was used (2014–2017)</span>
    <button type="button" class="embedded-html-toolbar-button" data-action="open-new-tab" aria-label="Open the attention applications gallery in a new tab">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 3h7v7h-2V6.414l-9.293 9.293-1.414-1.414L17.586 5H14V3zM5 5h5v2H6v11h11v-4h2v5H5V5z" /></svg>
      <span class="sr-only">Open attention applications gallery in new tab</span>
    </button>
    <button type="button" class="embedded-html-toolbar-button" data-action="fullscreen" data-label-base="Enter fullscreen view for the attention applications gallery" data-label-active="Exit fullscreen view for the attention applications gallery" aria-label="Enter fullscreen view for the attention applications gallery">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h6v2H6v4H4V4zm10 0h6v6h-2V6h-4V4zm6 10v6h-6v-2h4v-4h2zm-10 6H4v-6h2v4h4v2z" /></svg>
      <span class="sr-only">Toggle fullscreen for attention applications gallery</span>
    </button>
  </div>
  <iframe src="/visualizations/attention-applications.html" loading="lazy" allowfullscreen frameborder="0" scrolling="no" title="Where attention was used (2014–2017)"></iframe>
</div>

Click between the tabs to see what was being attended to in each setting. The mechanism is the same softmax-weighted sum; only the source of "things to attend over" changes.

## Pros and Cons

| Method | Scoring cost | Parallelism | Sequence-length sensitivity | Best use |
|---|---:|---|---|---|
| Bahdanau additive attention | MLP per decoder/source pair | Decoder still sequential | Handles longer inputs better than fixed vector | Interpretable alignment in RNN encoder-decoder models |
| Luong dot/general attention | Matmul-friendly | Decoder still sequential | Global mode still attends to all source positions | Faster RNN attention, local alignment windows |

The pattern is already visible: Bahdanau removed the fixed-vector bottleneck but kept recurrent decoding. Luong made attention cheaper but still lived inside RNNs. Both lived as **add-ons to recurrence**.

## What Comes Next

The next paper in the timeline made a stronger claim. Instead of adding a better attention module to an RNN, it removed recurrence entirely. That paper is "Attention Is All You Need"; one of the most cited papers in modern machine learning and the architecture behind nearly every large model since. It is the subject of the next post in this series.

## References

- Sutskever, Vinyals, and Le, [Sequence to Sequence Learning with Neural Networks](https://arxiv.org/abs/1409.3215), 2014.
- Cho et al., [Learning Phrase Representations using RNN Encoder-Decoder for Statistical Machine Translation](https://arxiv.org/abs/1406.1078), 2014.
- Bahdanau, Cho, and Bengio, [Neural Machine Translation by Jointly Learning to Align and Translate](https://arxiv.org/abs/1409.0473), 2014.
- Luong, Pham, and Manning, [Effective Approaches to Attention-based Neural Machine Translation](https://arxiv.org/abs/1508.04025), 2015.
- Xu et al., [Show, Attend and Tell: Neural Image Caption Generation with Visual Attention](https://arxiv.org/abs/1502.03044), 2015.
- Chan et al., [Listen, Attend and Spell](https://arxiv.org/abs/1508.01211), 2015.
- Sukhbaatar et al., [End-to-End Memory Networks](https://arxiv.org/abs/1503.08895), 2015.
- Wu et al., [Google's Neural Machine Translation System](https://arxiv.org/abs/1609.08144), 2016.

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
