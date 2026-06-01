# Attention Optimization Blog Series — Plan

A 4-part chronological series on the evolution of attention, from Bahdanau (2014) to today's IO-aware and inference-era optimizations. Each post follows the structure of `content/posts/distributed-training/index.md`: intro → mechanism → diagrams/visualization → pros/cons table → when-to-use → references. Each post stands alone, cross-links the others, and ships with **one or more focused HTML visualizations** in `static/visualizations/` — use as many as the material warrants (the distributed-training post used three). When a concept has a clear visual story (an algorithm step, a data-layout comparison, a timing diagram), give it its own visualization rather than overloading one.

## Audience and pedagogical bar

**Target reader**: a machine-learning student or early-career engineer who knows what a transformer is at a high level (Q/K/V, softmax, multi-head) but has not implemented attention from scratch and has never read a CUDA kernel. They should finish each post able to (a) explain the technique to a peer, (b) recognize when to use it, and (c) read the cited paper without getting lost.

Each post must therefore include:
- **Intuition first, math second.** Every equation gets a one-sentence plain-English gloss before or after.
- **A worked numerical example** for every non-trivial algorithm (e.g. online softmax stepping through 2 tiles of 4 elements with actual numbers; a 2-token KV cache shrinking under MQA/GQA/MLA).
- **A "why does this matter?" callout** per technique — concrete dollar/latency/memory impact, not just asymptotic complexity.
- **Visual-first explanations.** If a concept is easier to see than to read, it gets a diagram or a visualization. Posts should feel closer to a Distill article than a paper summary — text is the connective tissue between visuals, not the other way around.
- **Glossary callouts** for jargon on first use (HBM, SRAM, SM, warp, tensor core, MFU, KV cache, RoPE) — short inline definitions, not a separate appendix.

## Shared conventions

- **Hugo front matter**: same shape as `distributed-training/index.md` (title, date, hero, tags, categories, description).
- **Visualizations**: built as a **React + Vite + Framer Motion** stack (see "Visualization tech stack" below). Build output lands in `static/visualizations/<name>/` and is embedded via the existing `embedded-html-wrapper` iframe pattern (copy from `distributed-training/index.md`). Same dark style, 16:9 aspect ratio, Play / Pause / Step controls where the animation is sequential, fullscreen + new-tab buttons. Each visualization includes a short on-canvas legend so it makes sense without reading the surrounding prose.
- **Static diagrams** (Mermaid, SVG, or annotated tables) are encouraged in addition to interactive visualizations — use them for taxonomies, timelines, and side-by-side comparisons where animation adds nothing.
- **Tone**: technical but narrative — each section answers "what bottleneck did this solve, and what new bottleneck did it create?"
- **Math**: KaTeX inline (`$...$`) and display (`$$...$$`), as in the existing post. Always pair with intuition.
- **Code snippets**: minimal PyTorch (10–20 lines) showing the API surface for each technique (e.g. `F.scaled_dot_product_attention` with the FlashAttention backend, `transformers` GQA config, `vllm.LLM` paged config). Not full implementations — just enough that the reader can try it.
- **Tags suggestion**: `["deep learning", "attention", "transformers", "<part-specific>"]`. Categories: `["Machine Learning"]`.
- **Hero image**: placeholder `hero.png` per post directory; user supplies later.

## Visualization tech stack

The series prioritizes **visual polish** over bundle size. Each visualization is a small single-page React app, built independently and dropped into Hugo as static assets.

### Stack

- **React 18 + Vite** — one Vite project per visualization (or a small monorepo with shared packages). Vite gives instant HMR during dev and a tiny optimized build. React chosen over Svelte for ecosystem breadth (D3 wrappers, Framer Motion, Three.js bindings).
- **TypeScript** — non-negotiable for math-heavy components (tile indices, softmax state, KV layout) where a typo silently corrupts a frame.
- **Framer Motion** — primary animation library. Layout animations (`layout` + `LayoutGroup`), spring physics, gesture controls, `AnimatePresence` for enter/exit. Almost all sequenced animations should use Framer rather than CSS keyframes.
- **GSAP** — for any timeline-choreographed sequence longer than ~3 steps (the FlashAttention tiling viz, the Ring Attention rotation). GSAP's `Timeline` API beats hand-rolling sequencing in React state.
- **D3 (modular imports only)** — `d3-scale`, `d3-shape`, `d3-interpolate`, `d3-color`. Use D3 for *math* (scales, paths, interpolators), not for DOM manipulation. React owns the DOM.
- **Tailwind CSS** — inside each viz app, with a shared preset (`@deepakbaby/viz-theme`) defining the dark palette, typography, and motion tokens used in `distributed-training/`.
- **Three.js + react-three-fiber** — only if a viz genuinely benefits from 3D (e.g. a 3D GPU memory hierarchy or rotating ring topology). Default to 2D SVG/Canvas; opt in to 3D deliberately.
- **Recharts or Visx** — avoided. Custom SVG with D3 scales gives more control and a more distinctive look than chart libraries.

### Project layout

```
visualizations/                           # source (gitignored from Hugo build)
  shared/
    package.json                          # @deepakbaby/viz-shared
    src/
      components/                         # GPUBlock, MemoryBar, AttentionCell,
      hooks/                              #   TimelineScrubber, PlayControls
      theme/                              # tailwind preset, motion tokens
  flash-attention-tiling/
    package.json
    vite.config.ts                        # base: '/visualizations/flash-attention-tiling/'
    index.html
    src/
      App.tsx
      ...
  kv-cache-evolution/
  paged-attention-blocks/
  ...

static/visualizations/                    # build output (committed)
  flash-attention-tiling/
    index.html
    assets/index-<hash>.js
    assets/index-<hash>.css
  ...
```

### Build integration

- Top-level `package.json` script: `"build:viz": "pnpm -r --filter './visualizations/*' build"`.
- Each viz's `vite.config.ts` sets `base: '/visualizations/<name>/'` and `build.outDir: '../../static/visualizations/<name>'`.
- Netlify `netlify.toml` build command becomes `npm run build:viz && hugo --gc --minify`.
- Local dev: `pnpm --filter <viz-name> dev` runs Vite on `localhost:5173` independently of Hugo for fast iteration; once happy, build and reload Hugo.
- The Hugo embed snippet stays unchanged from `distributed-training/index.md` — only the `data-src` and iframe `src` change to `/visualizations/<name>/` (with trailing slash).

### Shared component library (`@deepakbaby/viz-shared`)

Components reused across the four posts — building these well in Part 1 pays off through Part 4.

| Component | Used in | Purpose |
|---|---|---|
| `<PlayControls>` | all | Play / Pause / Step / Reset / speed slider, keyboard shortcuts |
| `<TimelineScrubber>` | all | Click-to-scrub through animation steps |
| `<MemoryBar>` | Parts 2, 3, 4 | Animated bar showing HBM/SRAM/KV cache usage with byte counter |
| `<GPUBlock>` | Parts 3, 4 | Stylized GPU device card (label, SM grid, memory pool) |
| `<AttentionCell>` / `<AttentionGrid>` | Parts 1, 2, 3 | Single attention-matrix cell with Framer `layout` animation |
| `<TokenChip>` | Parts 1, 4 | Token "pill" with optional embedding visualization |
| `<EquationCallout>` | all | KaTeX equation with live-substituted values from animation state |
| `<HeadBadge>` | Parts 1, 4 | Color-coded attention-head indicator |
| `<RingTopology>` | Part 4 | N-device ring layout with rotating data flow |

Theme tokens (single source of truth):
```ts
export const colors = {
  bg: '#0a0a0a', panel: '#141414', border: '#2a2a2a',
  hbm: '#ef4444',  // red — slow memory
  sram: '#10b981', // green — fast memory
  active: '#3b82f6', muted: '#6b7280',
  heads: ['#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'],
};
export const motion = {
  spring: { type: 'spring', stiffness: 260, damping: 26 },
  ease:   [0.22, 1, 0.36, 1], // expo-out
};
```

### Polish checklist (apply to every viz)

- Springy entry animations on first paint (`AnimatePresence` + `initial={{opacity:0, y:8}}`).
- Hover/focus states on every interactive element with subtle scale (`whileHover={{scale: 1.03}}`).
- Smooth value transitions on numeric counters (`useMotionValue` + `animate()` over `useState`).
- High-contrast active state when an element is the current focus of explanation.
- Subtle particle / gradient backgrounds where appropriate (radial gradient à la the existing `embedded-html-wrapper` style).
- Reduced-motion support via `prefers-reduced-motion` (snap to end states instead of animating).
- Mobile breakpoint: at <640px, stack panels vertically and hide secondary controls behind a toggle. *(Per memory: always verify mobile.)*
- Lighthouse: each viz bundle <200 KB gzipped after tree-shaking; lazy-load Three.js / GSAP only where used.

### When to break the rules

- **Static SVG diagrams** (taxonomy trees, hardware spec tables) don't need React — embed as Hugo partials or inline SVG in markdown.
- **Mermaid** is fine for simple flowcharts (already used in `distributed-training/index.md`); don't React-ify those.

## Cross-post narrative arc

Each post ends with a "what comes next" hook into the following part. The opening of each post recaps the previous bottleneck in 2–3 sentences so a reader can drop in mid-series.

The series-wide thesis: **every attention innovation is a response to the bottleneck the previous generation exposed**. Bahdanau exposed that fixed-size context vectors lose information → self-attention. Self-attention exposed O(N²) memory → approximations. Approximations exposed that exact attention with better IO wins → FlashAttention. FlashAttention solved training → KV cache became the inference bottleneck → MQA/GQA/MLA/PagedAttention.

---

## Part 1 — From Bahdanau to Transformer (2014–2017)

**Slug**: `attention-history-bahdanau-to-transformer`
**Suggested title**: "From Alignment to Attention: How Transformers Replaced the RNN (2014–2017)"
**Recommended visualizations**: 2–3 (alignment matrix, scoring-function comparison, multi-head self-attention)

### Detailed outline

**1. Pre-attention: the information bottleneck**
- Sutskever, Vinyals & Le (2014), *Sequence to Sequence Learning with Neural Networks*, [arXiv:1409.3215](https://arxiv.org/abs/1409.3215). LSTM encoder squeezes the entire source sentence into a single fixed-length vector $c$; decoder LSTM unrolls from $c$.
- Cho et al. (2014), *Learning Phrase Representations using RNN Encoder–Decoder*, [arXiv:1406.1078](https://arxiv.org/abs/1406.1078). Coined "encoder-decoder" framing.
- The bottleneck thesis: BLEU degraded sharply on sentences > 30 tokens (figure to recreate from Bahdanau 2014, Fig. 2). The fixed vector cannot store unbounded source content.
- Worked example: show the same encoder vector being asked to reconstruct a 5-word vs a 50-word sentence — intuition for why this fails.

**2. Bahdanau attention (2014) — soft alignment**
- Bahdanau, Cho & Bengio (2014), *Neural Machine Translation by Jointly Learning to Align and Translate*, [arXiv:1409.0473](https://arxiv.org/abs/1409.0473). ICLR 2015.
- Architecture: bidirectional GRU encoder produces $h_j = [\overrightarrow{h_j}; \overleftarrow{h_j}]$ per source token. Decoder state $s_{i-1}$ queries all encoder states.
- Additive (concat) scoring:
  $$e_{ij} = v_a^\top \tanh(W_a s_{i-1} + U_a h_j), \quad \alpha_{ij} = \frac{\exp(e_{ij})}{\sum_k \exp(e_{ik})}, \quad c_i = \sum_j \alpha_{ij} h_j$$
- Plain-English gloss: "for each output token, learn a soft pointer over source tokens; the context vector is a weighted average of encoder states".
- Famous alignment heatmap to recreate: French↔English in Bahdanau Fig. 3 ("the agreement on the European Economic Area was signed in August 1992"). Diagonal-ish but with reorderings the model learned.
- Why this paper changed everything: alignment is **learned end-to-end** rather than via separate IBM word-alignment models.

**3. Luong attention (2015) — multiplicative variants and global/local**
- Luong, Pham & Manning (2015), *Effective Approaches to Attention-based Neural Machine Translation*, [arXiv:1508.04025](https://arxiv.org/abs/1508.04025). EMNLP 2015.
- Three scoring functions:
  - **dot**: $\text{score}(s_t, h_j) = s_t^\top h_j$
  - **general**: $\text{score}(s_t, h_j) = s_t^\top W_a h_j$
  - **concat** (≈ Bahdanau): $v_a^\top \tanh(W_a [s_t; h_j])$
- **Global vs local attention**: local restricts the window around a predicted alignment position $p_t$ — first hint that "attend to everything" is wasteful.
- Why multiplicative wins computationally: a single matmul vs an MLP per (i,j) pair. Foreshadows the dot-product choice in Vaswani.

**4. "Attention Is All You Need" (2017) — the leap**
- Vaswani et al. (2017), [arXiv:1706.03762](https://arxiv.org/abs/1706.03762). NeurIPS 2017.
- The radical claim: drop recurrence entirely; attention alone is enough.
- **Scaled dot-product attention**:
  $$\text{Attention}(Q,K,V) = \text{softmax}\!\left(\frac{QK^\top}{\sqrt{d_k}}\right) V$$
  - Why $\sqrt{d_k}$? Without it, dot-product magnitudes scale with $d_k$, pushing softmax into saturated regions where gradients vanish. Worked example: sample two random $d=64$ vectors, show variance of dot product ≈ $d$, then divide by $\sqrt{d}$ to recover unit variance.
- **Multi-head attention**: $h$ parallel heads with separate projections $W_i^Q, W_i^K, W_i^V \in \mathbb{R}^{d_\text{model} \times d_k}$, concatenated and projected. Intuition: each head can specialize (positional, syntactic, coreference).
- **Positional encoding**: sinusoidal $\text{PE}_{(pos,2i)} = \sin(pos/10000^{2i/d})$ — needed because attention is permutation-invariant.
- The architecture: encoder/decoder stacks of (multi-head attn → FFN → residual + LayerNorm), with masked self-attention in the decoder.
- Training cost in 2017 dollars: WMT'14 EN-DE in 12 hours on 8× P100. Modest by today's standards — N was ~512.

**5. Why O(N²) was fine in 2017 and stopped being fine**
- Memory of the attention matrix: $N^2$ floats per head. At N=512, FP16: 0.5 MB per head — trivial.
- Activation memory during backprop: $O(N^2 \cdot h \cdot L)$ where $h$=heads, $L$=layers. For BERT-base (L=12, h=12, N=512): ~38 MB per sample — fine.
- Then GPT-2 (N=1024), GPT-3 (N=2048), Longformer benchmarks (N=4096), and suddenly the same number quadruples each step.
- Foreshadow: by 2020 the field had two camps — "approximate to escape N²" (Part 2) and "make exact attention IO-aware" (Part 3).

**6. Pros/cons summary table** (Bahdanau / Luong / Transformer)
- Columns: scoring cost, parallelism, sequence-length sensitivity, parameter count, when to use.

**7. Hook into Part 2**: by 2019, sequences of 4k–16k tokens (longer documents, code, genomic data) made the N² activation matrix the dominant memory cost. The first wave of solutions said: "approximate it."

### References (Part 1)
- [arXiv:1409.3215](https://arxiv.org/abs/1409.3215) — Sutskever et al., Seq2Seq
- [arXiv:1406.1078](https://arxiv.org/abs/1406.1078) — Cho et al., RNN Encoder-Decoder
- [arXiv:1409.0473](https://arxiv.org/abs/1409.0473) — Bahdanau et al.
- [arXiv:1508.04025](https://arxiv.org/abs/1508.04025) — Luong et al.
- [arXiv:1706.03762](https://arxiv.org/abs/1706.03762) — Vaswani et al.
- [The Annotated Transformer (Harvard NLP)](http://nlp.seas.harvard.edu/annotated-transformer/) — companion implementation
- [The Illustrated Transformer (Jay Alammar)](https://jalammar.github.io/illustrated-transformer/) — for inspiration on visual exposition style

### Visualization specs

**Viz 1 — `attention-bahdanau-alignment.html`**
- Recreate Bahdanau's alignment heatmap. Source on x-axis, target on y-axis, cells colored by $\alpha_{ij}$.
- Step animation: each click reveals one decoder timestep, showing (a) the decoder state $s_{i-1}$ as a query, (b) scores $e_{ij}$ as a row of bars, (c) softmax → $\alpha_{ij}$ row of the heatmap fills in, (d) context vector $c_i$ as weighted sum visual.
- Side panel shows the equation with current values substituted.
- Default sentence pair: the canonical "the agreement on the European Economic Area..." pair, but allow toggling to a shorter pair for clarity.

**Viz 2 — `attention-scoring-functions.html`**
- Three side-by-side panels: additive (Bahdanau), dot, scaled-dot.
- Slider for $d_k$ (4 → 512) showing how raw dot-product variance grows and softmax saturates (output entropy collapses to 0); the scaled version stays well-behaved.
- Live numerical readout: variance of scores, entropy of softmax.
- Pedagogical purpose: makes the $\sqrt{d_k}$ choice tangible.

**Viz 3 — `attention-multihead-self.html`**
- Single sentence (e.g. "The animal didn't cross the street because it was too tired"), 4 heads.
- For each head, show its attention pattern as edges of varying thickness between tokens. Heads pre-configured to display archetypal patterns: positional (attend to previous token), syntactic (attend to head word), coreference (it → animal), broadcast (attend to [SEP]/[CLS]).
- Toggle heads on/off; click a token to highlight only its outgoing attention.
- Short text caption per head explains what kind of pattern it has learned (and notes these are illustrative, taken from real BERT-head analyses, e.g. Clark et al. 2019).

### Suggested code snippet
- 15-line PyTorch implementation of scaled dot-product attention (no fused kernel) — the readable reference implementation that sets up Part 3's "and here's why this is slow".

---

## Part 2 — The Approximation Era (2019–2021)

**Slug**: `attention-approximation-era`
**Suggested title**: "Escaping N²: The Approximate-Attention Era (2019–2021)"
**Recommended visualizations**: 2–3 (pattern grid, complexity scaling chart, LSH bucketing animation)

### Detailed outline

**1. The N² wall, quantified**
- Activation memory of one attention matrix: $N^2 \times \text{bytes}$ per head per layer (FP16 = 2 B).
- Worked table:
  | N | per-head FP16 size | × 16 heads × 24 layers (BERT-large-ish) |
  |---|---|---|
  | 512 | 0.5 MB | ~190 MB |
  | 2k | 8 MB | ~3 GB |
  | 8k | 128 MB | ~50 GB |
  | 32k | 2 GB | ~770 GB (impossible) |
- The 2019–2020 ambition: scale to documents (8k–16k) and beyond. The community bet on **approximation**.
- Survey reference: Tay et al. (2020), *Efficient Transformers: A Survey*, [arXiv:2009.06732](https://arxiv.org/abs/2009.06732). Use its taxonomy (fixed patterns, learned patterns, low-rank, kernel, recurrence) as a scaffold.

**2. Sparse Transformer (Child et al., 2019)**
- *Generating Long Sequences with Sparse Transformers*, [arXiv:1904.10509](https://arxiv.org/abs/1904.10509). OpenAI.
- Two patterns: **strided** (every k-th token) and **fixed** (block-local + a small set of global columns). Combined to give O(N√N) attention.
- Trained 12k-token models on images, audio, text — the first credible sub-quadratic transformer.
- Custom CUDA kernels; complex to reproduce — important context for why later "drop-in PyTorch" approaches were attractive.

**3. Reformer (Kitaev, Kaiser & Levskaya, 2020)**
- [arXiv:2001.04451](https://arxiv.org/abs/2001.04451). ICLR 2020.
- Two ideas:
  - **LSH attention**: hash queries and keys with random rotations; tokens in the same bucket attend to each other. Approximate softmax(QK^T) by only computing high-similarity pairs. Complexity $O(N \log N)$.
  - **Reversible layers** (RevNet-style): recompute activations in backward pass instead of storing — cuts activation memory.
- Limitation: hashing + sorting is awkward on GPUs; quality regressed on tasks requiring precise long-range lookup.

**4. Longformer (Beltagy, Peters & Cohan, 2020)**
- [arXiv:2004.05150](https://arxiv.org/abs/2004.05150). The "sliding window + global tokens" pattern that **actually survived** (reused in BigBird, Mistral SWA).
- Pattern: each token attends to a window of $w$ neighbors; a small set of designated tokens (e.g. [CLS], question tokens) attend globally and are attended to globally.
- Receptive field grows linearly with depth (after $L$ layers, effective context $\approx L \cdot w$). Intuition: a stack of local attentions emulates global attention.
- Complexity: $O(N \cdot w)$.
- Companion: **BigBird** (Zaheer et al. 2020, [arXiv:2007.14062](https://arxiv.org/abs/2007.14062)) — sliding + global + random; theoretical universal approximator.

**5. Linformer (Wang et al., 2020)**
- *Linformer: Self-Attention with Linear Complexity*, [arXiv:2006.04768](https://arxiv.org/abs/2006.04768).
- Insight: the softmax attention matrix is approximately low-rank.
- Mechanism: learned projections $E, F \in \mathbb{R}^{k \times N}$ compress K and V from $N \times d$ down to $k \times d$. Attention becomes $\text{softmax}(QK'^\top/\sqrt{d}) V'$ at cost $O(N \cdot k)$.
- Catch: $k$ is fixed at training time → not great for variable-length sequences; quality drops on retrieval tasks.

**6. Performer / FAVOR+ (Choromanski et al., 2021)**
- *Rethinking Attention with Performers*, [arXiv:2009.14794](https://arxiv.org/abs/2009.14794). ICLR 2021.
- Replace softmax kernel $\exp(q^\top k)$ with a positive random-feature map $\phi(\cdot)$ such that $\phi(q)^\top \phi(k) \approx \exp(q^\top k)$.
- Trick: matrix associativity — compute $\phi(K)^\top V$ first ($d \times d$ matrix), then $\phi(Q) \cdot (\phi(K)^\top V)$. Cost $O(N \cdot d^2)$ — truly linear in $N$.
- Worked example: walk through associativity reorder with $N=4, d=2$ to make it concrete.

**7. Honorable mentions**
- **Synthesizer** (Tay et al. 2020) — learned attention without query-key dot products at all.
- **Linear Transformer** (Katharopoulos et al. 2020, [arXiv:2006.16236](https://arxiv.org/abs/2006.16236)) — feature-map kernels, recurrent inference; precursor to today's state-space-model interest.
- **Routing Transformer** (Roy et al. 2020) — k-means clustering for content-based sparsity.

**8. Why most of these faded**
- Quality regressions on retrieval-heavy tasks ([Long Range Arena benchmark](https://arxiv.org/abs/2011.04006), Tay et al. 2020) — Performer and Linformer underperformed on tasks needing precise lookup.
- Custom kernels were brittle, hard to integrate with mixed precision / gradient checkpointing.
- The killer: in 2022 FlashAttention made **exact** attention fast and memory-linear, removing most of the motivation.
- Survival: **sliding window** (Mistral, Longformer, Gemma) and **MoE-like routing** ideas persisted; full-on linear/kernel attention is now niche, mostly in long-context state-space hybrids (Mamba etc.).

**9. The bridge to Part 3: Rabe & Staats (2021)**
- *Self-attention Does Not Need O(n²) Memory*, [arXiv:2112.05682](https://arxiv.org/abs/2112.05682). Google Research.
- Showed an algorithm with **O(log N)** memory for inference and **O(√N)** for training while computing **exact** attention via lazy softmax accumulation.
- The community's lightbulb: maybe we don't need to approximate — we just need to be smarter about how we use memory. Sets up FlashAttention's IO-aware reframing.

**10. Pros/cons summary tables**
- Per-method pros/cons (one row per method).
- "Did it survive?" verdict column.

### References (Part 2)
- [arXiv:1904.10509](https://arxiv.org/abs/1904.10509) — Sparse Transformer
- [arXiv:2001.04451](https://arxiv.org/abs/2001.04451) — Reformer
- [arXiv:2004.05150](https://arxiv.org/abs/2004.05150) — Longformer
- [arXiv:2007.14062](https://arxiv.org/abs/2007.14062) — BigBird
- [arXiv:2006.04768](https://arxiv.org/abs/2006.04768) — Linformer
- [arXiv:2009.14794](https://arxiv.org/abs/2009.14794) — Performer
- [arXiv:2006.16236](https://arxiv.org/abs/2006.16236) — Linear Transformer
- [arXiv:2009.06732](https://arxiv.org/abs/2009.06732) — Efficient Transformers Survey (Tay et al.)
- [arXiv:2011.04006](https://arxiv.org/abs/2011.04006) — Long Range Arena benchmark
- [arXiv:2112.05682](https://arxiv.org/abs/2112.05682) — Rabe & Staats, "Attention does not need O(n²) memory"

### Visualization specs

**Viz 1 — `attention-pattern-zoo.html`**
- 6-cell grid of N×N attention masks at the same N: **Dense / Strided (Sparse Transformer) / Sliding window (Longformer) / Sliding+Global (BigBird) / LSH-bucketed (Reformer) / Low-rank (Linformer)**.
- Slider for $N$ (256 → 8192). Each cell colors only the "computed" entries.
- Live counters per cell: number of computed entries, FLOPs, peak memory.
- Pedagogical aim: visceral sense of what each pattern *omits*.

**Viz 2 — `attention-complexity-scaling.html`**
- Log-log plot of memory/FLOPs vs $N$ for: dense O(N²), Sparse O(N√N), Reformer O(N log N), Linformer/Performer O(N).
- Slider for $N$ up to $10^6$, dot moves along each curve. Y-axis annotated with concrete sizes ("8 MB", "1 GB", "single A100 limit").
- Toggles to overlay 2017 GPT-2 (N=1024), 2020 Longformer (N=4096), 2024 Gemini (N=1M) markers.

**Viz 3 — `lsh-attention-bucketing.html`** (optional, only if length permits)
- 2D scatter of token query/key vectors after random projection. Animation: rotation hashes them into buckets (colored regions); only same-bucket tokens connect. Good intuition pump for why LSH approximates softmax.

### Suggested code snippet
- A 10-line "naive Performer" using $\phi(x) = \text{ReLU}(Wx)$ to demonstrate the associativity trick; compare wall-clock vs PyTorch SDPA at $N=8192$.

---

## Part 3 — FlashAttention and the IO-Aware Revolution (2022–2024)

**Slug**: `flash-attention-deep-dive`
**Suggested title**: "FlashAttention: Why Exact Attention Won the Speed Race (2022–2024)"
**Recommended visualizations**: 3–4 (memory hierarchy, tiling + online softmax, FA2 parallelism, FA3 warp specialization)

### Detailed outline

**1. The reframing: memory-bound, not compute-bound**
- Glossary callouts up front: **HBM** (off-chip DRAM, big but slow), **SRAM** (on-chip per-SM scratchpad, tiny but ~10× faster), **SM** (streaming multiprocessor, GPU's "core"), **tensor core** (matrix-multiply unit), **MFU** (model FLOPs utilization).
- Hardware spec table to embed:
  | | A100 80GB SXM | H100 80GB SXM5 |
  |---|---|---|
  | HBM | 80 GB HBM2e, 2.0 TB/s | 80 GB HBM3, 3.35 TB/s |
  | SRAM / SM | 164 KB | 228 KB |
  | L2 | 40 MB | 50 MB |
  | FP16/BF16 tensor TFLOPs | 312 | 989 |
  | FP8 tensor TFLOPs | — | 1979 |
  | New features | TF32, BF16 | FP8, TMA, WGMMA, async barriers |
- Roofline argument: A100 needs ~150 FLOPs/byte to be compute-bound on FP16 matmul; H100 needs ~330. Standard attention reuses each K,V vector only $d$ times → bandwidth-bound, achieves 5–10% of peak.
- Why standard `softmax(QK^T)V` is so slow: writes the $N \times N$ matrix to HBM **twice** (S, then P), reads it back during backward. At $N=8k$, that's gigabytes of round-trip traffic per head per layer.

**2. FlashAttention v1 — three ideas, one algorithm**
- Dao, Fu, Ermon, Rudra, Ré (2022), *FlashAttention: Fast and Memory-Efficient Exact Attention with IO-Awareness*, [arXiv:2205.14135](https://arxiv.org/abs/2205.14135). NeurIPS 2022.
- **Idea 1 — Tiling.** Split Q into row blocks $B_r \times d$ and K,V into column blocks $B_c \times d$, sized so that one tile of each fits in SRAM (~100 KB budget). Outer loop over K,V blocks; inner loop over Q blocks. Compute $S_{ij} = Q_i K_j^\top$ entirely in SRAM, never materializing the full $S$ in HBM.
- **Idea 2 — Online softmax** (Milakov & Gimelshein 2018, [arXiv:1805.02867](https://arxiv.org/abs/1805.02867)). Maintain per-row running max $m$ and running sum $\ell$. When a new tile arrives:
  $$m^{\text{new}} = \max(m^{\text{old}}, \tilde m_j), \quad \ell^{\text{new}} = e^{m^{\text{old}} - m^{\text{new}}} \ell^{\text{old}} + e^{\tilde m_j - m^{\text{new}}} \tilde\ell_j$$
  $$O^{\text{new}} = \text{diag}(e^{m^{\text{old}}-m^{\text{new}}}) O^{\text{old}} + e^{\tilde m_j - m^{\text{new}}} \tilde P_j V_j$$
  Plain English: rescale the previous partial output by the change in max, then add the contribution of the new tile.
- **Idea 3 — Recomputation in backward.** Store only $O(N)$ softmax statistics $(m, \ell)$ per row, not the $O(N^2)$ probability matrix $P$. In the backward pass, recompute attention on-chip from Q, K, V, $m$, $\ell$. Cheaper than HBM round-trips.
- **Worked example to include in post:** 2 tiles of 4 elements each, real numbers, walk through $m$, $\ell$, $O$ updates after each tile.
- IO complexity: $O(N^2 d^2 / M)$ HBM accesses (where $M$ = SRAM size) vs $\Omega(N^2 + Nd)$ for standard. Memory drops from $O(N^2)$ to $O(N)$.
- Reported speedups: 7.6× on GPT-2 attention layer; 3× end-to-end on BERT-large; 15% wall-clock training speedup at the time (jumped much higher with v2).
- Supported GPUs at launch: Ampere (A100), Turing (T4), Volta (V100). FP16/BF16 only.

**3. FlashAttention v2 — milking the SMs**
- Dao (2023), *FlashAttention-2: Faster Attention with Better Parallelism and Work Partitioning*, [arXiv:2307.08691](https://arxiv.org/abs/2307.08691).
- Companion: [Hazy Research blog post](https://hazyresearch.stanford.edu/blog/2023-07-17-flash2).
- **Change 1 — fewer non-matmul FLOPs.** On A100, every non-matmul FLOP costs **16×** a tensor-core matmul FLOP. v1's online softmax rescaled the output $O$ on every block; v2 defers the rescale until the very end of the row (one rescale per row). Big win because softmax was the bottleneck even after v1.
- **Change 2 — parallelism over the sequence dimension.** v1 only parallelized over (batch × heads), so for long-context inference with batch=1 you'd leave most of the 108 SMs idle. v2 swaps loops so Q is the outer loop (each Q block independent) and parallelizes Q across SMs.
- **Change 3 — better warp partitioning.** v1 split K,V across warps in a thread block, requiring inter-warp communication via shared memory to combine partial outputs. v2 splits Q across warps; each warp computes its slice of $O$ independently.
- Results: ~**2× over v1** on A100. **50–73% of theoretical FP16 peak** (up to ~225 TFLOPs/s). End-to-end **72% MFU** on GPT-style training.
- Supported GPUs: Ampere, Ada (RTX 4090), Hopper (works but doesn't exploit Hopper features → only ~35% of H100 peak).

**4. FlashAttention v3 — Hopper unlocked**
- Shah, Bikshandi, Zhang, Thakkar, Ramani, Dao (2024), *FlashAttention-3: Fast and Accurate Attention with Asynchrony and Low-precision*, [arXiv:2407.08608](https://arxiv.org/abs/2407.08608).
- Companions: [Tri Dao blog post](https://tridao.me/blog/2024/flash3/), [Colfax Research deep-dive](https://research.colfax-intl.com/flashattention-3-fast-and-accurate-attention-with-asynchrony-and-low-precision/), [PyTorch blog announcement](https://pytorch.org/blog/flashattention-3/).
- Hopper-only rewrite. Three new techniques:
  - **Producer-consumer async / warp specialization.** Dedicate one warpgroup (4 warps) as a "producer" issuing async TMA loads of K,V tiles into shared memory. Other warpgroups are "consumers" running WGMMA matmuls and softmax. Hides memory latency behind compute via Hopper's async barriers.
  - **Interleaved (ping-pong) matmul + softmax overlap.** While warpgroup 1 runs softmax on iteration $i$, warpgroup 2 runs the next GEMM for iteration $i+1$ on tensor cores. Hides slow non-matmul softmax behind fast tensor-core matmul.
  - **FP8 with block quantization + incoherent processing.** Naive FP8 destroys attention accuracy because softmax exponentiates outliers. v3 applies a Hadamard rotation to Q and K before quantizing — spreads outliers across dimensions — then quantizes per-block. Result: **2.6× lower numerical error** vs naive per-tensor FP8.
- Results on H100:
  - BF16: **~740 TFLOPs/s** (~75% of peak), some configs hit 840 TF/s — **1.5–2.0× faster than FA2** on H100.
  - FP8: **~1.2 PFLOPs/s** (close to theoretical 1.98 PF peak).
- Supported GPUs: **Hopper only (H100, H200)**. Ampere/Ada continue using FA2.

**5. Hardware support matrix (table to embed)**
| Architecture | GPU examples | FA1 | FA2 | FA3 | FP8 |
|---|---|---|---|---|---|
| Volta | V100 | ✓ | — | — | — |
| Turing | T4 | ✓ | — | — | — |
| Ampere | A100, A6000, RTX 30xx | ✓ | ✓ | — | — |
| Ada | RTX 4090, L40 | ✓ | ✓ | — | — |
| Hopper | H100, H200 | ✓ | ✓ | ✓ | ✓ |
| Blackwell | B100, B200 | ✓ | ✓ | (FA3+ in dev) | ✓ |

**6. Benchmarks (table, from research dossier)**
- A100, 8k context, 13B-class forward+backward:
  | Implementation | TFLOPs/s | % of peak |
  |---|---|---|
  | PyTorch eager | ~30 | ~10% |
  | FA1 | ~120 | ~38% |
  | FA2 | 200–230 | 65–73% |
- H100, head-dim 128, BF16:
  | Implementation | TFLOPs/s | % of peak |
  |---|---|---|
  | FA2 (Hopper) | ~330 | ~35% |
  | FA3 BF16 | 740–840 | 75–85% |
  | FA3 FP8 | ~1200 | ~60% of FP8 peak |
- Memory savings, single head FP16, scaling with N:
  | N | Standard attn matrix | FA |
  |---|---|---|
  | 2k | 8 MB | O(N) — small win |
  | 8k | 128 MB | linear |
  | 32k | 2 GB | linear |
  | 128k | 32 GB per head per layer (infeasible) | linear |

**7. How to use it** (code snippet section)
- PyTorch 2.x: `torch.nn.functional.scaled_dot_product_attention(q, k, v, is_causal=True)` automatically dispatches to the FlashAttention backend on supported GPUs. Force selection via `torch.backends.cuda.sdp_kernel(enable_flash=True, enable_mem_efficient=False, enable_math=False)`.
- HuggingFace: `attn_implementation="flash_attention_2"` in `from_pretrained`.
- Direct: `pip install flash-attn` (Tri Dao's package); FA3 currently lives in the same repo's `hopper/` subdir.

**8. Hook into Part 4**
- Training is now ~80% MFU; the bottleneck has migrated. At inference, the **KV cache** dominates — it's linear in context but multiplied by batch, layers, and heads. Llama 3 70B at 128k context: 320 GB without GQA. The next era is about shrinking and managing that cache.

### References (Part 3)
- [arXiv:2205.14135](https://arxiv.org/abs/2205.14135) — FlashAttention v1
- [arXiv:2307.08691](https://arxiv.org/abs/2307.08691) — FlashAttention v2
- [arXiv:2407.08608](https://arxiv.org/abs/2407.08608) — FlashAttention v3
- [arXiv:1805.02867](https://arxiv.org/abs/1805.02867) — Online softmax (Milakov & Gimelshein)
- [arXiv:2112.05682](https://arxiv.org/abs/2112.05682) — Rabe & Staats (precursor)
- [Tri Dao FA3 blog](https://tridao.me/blog/2024/flash3/)
- [Colfax FA3 writeup](https://research.colfax-intl.com/flashattention-3-fast-and-accurate-attention-with-asynchrony-and-low-precision/)
- [PyTorch FA3 announcement](https://pytorch.org/blog/flashattention-3/)
- [NVIDIA Hopper architecture deep-dive](https://developer.nvidia.com/blog/nvidia-hopper-architecture-in-depth/)
- [NVIDIA Hopper Tuning Guide](https://docs.nvidia.com/cuda/hopper-tuning-guide/index.html)
- [Hazy Research FA2 blog](https://hazyresearch.stanford.edu/blog/2023-07-17-flash2)
- [flash-attention GitHub](https://github.com/Dao-AILab/flash-attention)
- [xFormers MEA docs](https://facebookresearch.github.io/xformers/components/ops.html) — alternative implementation of the Rabe & Staats algorithm

### Visualization specs

**Viz 1 — `gpu-memory-hierarchy.html`**
- Static-but-interactive diagram of the GPU memory hierarchy (registers → SRAM/shared mem → L2 → HBM → host DRAM). Each level annotated with capacity and bandwidth for A100 and H100 (toggle).
- Animated "data round-trip" arrows show standard attention bouncing the $N \times N$ matrix to HBM and back, with a stopwatch. Toggle to FA path: data stays in SRAM, stopwatch barely moves.
- Pedagogical anchor for the whole post.

**Viz 2 — `flash-attention-tiling.html`** (the centerpiece)
- Center stage: Q matrix on the left, K and V matrices on top. All tiles colored.
- Outer loop animates over K,V blocks; inner loop over Q blocks. Highlight box shows which tiles are currently in SRAM.
- Side panel shows the **online softmax state per Q row**: running max $m_i$, running sum $\ell_i$, current partial output $O_i$ — numbers update at each step, with the rescale formula displayed beside them.
- Toggle "Standard attention" vs "FlashAttention": standard mode shows the full $N \times N$ matrix being written to HBM (red flash + counter ticking up MB); FlashAttention mode shows only SRAM writes (green) and a flat HBM counter.
- Memory and FLOP counters on the right. Play / Pause / Step / Speed slider.

**Viz 3 — `fa1-vs-fa2-parallelism.html`**
- Two SM utilization timelines side by side. FA1 with batch=1, long N: most SMs sit idle (lots of grey). FA2: SMs all busy because Q is parallelized.
- Slider for batch size; show that for batch ≥ 16 they look similar but for batch=1 (typical inference) FA2 dominates.

**Viz 4 — `fa3-warp-specialization.html`** (optional, advanced — skip if length is a concern)
- Timeline of warpgroups within an SM: producer warpgroup issues TMA loads (blue), consumer warpgroups run WGMMA (green) and softmax (orange), with overlapping bars showing the ping-pong schedule.
- Toggle "FA2 (sync)" vs "FA3 (async)" to see how the same workload compresses in time.

### Suggested code snippets
- 5 lines: `F.scaled_dot_product_attention` with backend forced to flash; print achieved TFLOPs.
- 10 lines: a "naive online softmax" pure-PyTorch implementation (no kernel) — pedagogical, runs on CPU, demonstrates the math.

---

## Part 4 — The Inference Era (2023–now)

**Slug**: `attention-inference-optimizations`
**Suggested title**: "Serving the Beast: KV-Cache Tricks, PagedAttention, and Ring Attention (2023–now)"
**Recommended visualizations**: 3–4 (KV cache evolution, paged blocks, sliding window receptive field, ring rotation)

### Detailed outline

**1. Why inference is different from training**
- Training: forward + backward, batch sizes large, attention compute dominates.
- Inference (autoregressive decoding): one token at a time, batch sizes often small, the dominant memory cost is the **KV cache** — the stored K and V tensors for all previous tokens, reused at each generation step.
- Glossary: **KV cache** (per-layer, per-head storage of past K, V), **prefill** (initial pass over the prompt), **decode** (one-token-at-a-time generation), **TTFT** (time to first token), **TPOT** (time per output token).
- The KV cache budget formula:
  $$\text{KV bytes} = 2 \cdot N \cdot L \cdot H_{kv} \cdot d_{head} \cdot \text{bytes per element}$$
  where 2 = K+V, $N$=context, $L$=layers, $H_{kv}$=KV heads, $d_{head}$=head dim.
- Worked example to embed: Llama 3 70B (L=80, $H_{kv}$=8 with GQA, $d_{head}$=128, FP16) → ~320 KB per token → 128k context = **40 GB just for one request's KV cache**. Without GQA: 320 GB. The cache, not the weights, becomes the constraint.

**2. Multi-Query Attention (MQA)**
- Shazeer (2019), *Fast Transformer Decoding: One Write-Head is All You Need*, [arXiv:1911.02150](https://arxiv.org/abs/1911.02150).
- One K and one V head shared across **all** Q heads. KV cache shrinks by $H$× (number of heads).
- Quality regression: noticeably worse perplexity and downstream metrics on large-scale models. Used by PaLM and Falcon but not Llama.

**3. Grouped-Query Attention (GQA)**
- Ainslie, Lee-Thorp, de Jong, Zemlyanskiy, Lebrón, Sanghai (2023), *GQA: Training Generalized Multi-Query Transformer Models*, [arXiv:2305.13245](https://arxiv.org/abs/2305.13245). EMNLP 2023.
- Compromise between MHA and MQA: $G$ groups of Q heads share one K,V head each. Llama 2 70B and Llama 3 use $G=8$ with 64 Q heads → 8× KV reduction.
- "Uptraining" recipe: convert an existing MHA checkpoint to GQA by mean-pooling K,V projections within each group, then continue training for ~5% of original compute — recovers quality.
- The default since 2023: Llama 2/3, Mistral, Mixtral, Gemma, Qwen all use GQA.

**4. Multi-head Latent Attention (MLA)**
- DeepSeek-AI (2024), *DeepSeek-V2: A Strong, Economical, and Efficient Mixture-of-Experts Language Model*, [arXiv:2405.04434](https://arxiv.org/abs/2405.04434). Refined further in DeepSeek-V3.
- Compress each token to a small **latent KV vector** $c_t \in \mathbb{R}^{d_c}$ (typical $d_c$ ≈ 512) via $c_t = W_{DKV} x_t$. Cache only $c_t$.
- Reconstruct full K, V on the fly: $K = W_{UK} c_t$, $V = W_{UV} c_t$. The up-projections $W_{UK}, W_{UV}$ can be **absorbed into $W_Q$ and $W_O$ at inference** so we never materialize full K/V — the matmul math goes through the latent.
- **Decoupled RoPE.** RoPE doesn't commute with the absorbed projection (it's position-dependent). Solution: keep a small separate "decoupled" portion of K with RoPE applied directly, concatenated with the absorbed portion.
- Numbers: 93.3% KV cache reduction vs MHA; **5.76× higher generation throughput** vs DeepSeek 67B dense baseline; quality matches or exceeds MHA.
- Reference write-up: [Sebastian Raschka's MLA explainer](https://magazine.sebastianraschka.com/p/multi-head-latent-attention).

**5. KV cache comparison table (to embed)**
Llama 3 70B-like config (L=80, $H_q$=64, $d_{head}$=128, FP16):
| Scheme | KV heads | KV bytes/token | 8k cache | 32k cache | 128k cache |
|---|---|---|---|---|---|
| MHA | 64 | 2.5 MB | 20 GB | 80 GB | **320 GB** |
| MQA | 1 | 40 KB | 320 MB | 1.25 GB | 5 GB |
| GQA (G=8) | 8 | 320 KB | 2.5 GB | 10 GB | **40 GB** |
| MLA ($d_c$=512) | — | ~21 KB | 168 MB | 670 MB | **2.7 GB** |

**6. PagedAttention / vLLM**
- Kwon, Li, Zhuang, Sheng, Zheng, Yu, Gonzalez, Zhang, Stoica (2023), *Efficient Memory Management for Large Language Model Serving with PagedAttention*, [arXiv:2309.06180](https://arxiv.org/abs/2309.06180). SOSP 2023.
- The problem: prior LLM servers pre-allocated contiguous KV buffers per request sized for `max_seq_len`. Result: **60–80% memory waste** to internal fragmentation (request shorter than reservation), external fragmentation (gaps between requests), and reservation for unknown future length.
- The fix (OS virtual memory analogy):
  - Split KV cache into fixed-size **blocks** (e.g. 16 tokens per block).
  - Each request has a **block table** mapping logical block index → physical block address.
  - Physical blocks live anywhere in the GPU memory pool — non-contiguous.
  - **Copy-on-write** sharing for parallel sampling and beam search: shared prefix is one set of physical blocks; only divergent suffixes get copied.
- Results: <4% waste; **2–4× higher throughput** vs FasterTransformer / Orca at same latency. Now the standard ([vLLM](https://github.com/vllm-project/vllm), [TGI](https://github.com/huggingface/text-generation-inference) PagedAttention backend, TensorRT-LLM all adopted).
- Companion: **Continuous batching** (Yu et al., Orca, OSDI 2022) — orthogonal but usually paired.

**7. Sliding Window Attention at inference (Mistral)**
- Mistral 7B (2023), [announcement](https://mistral.ai/news/announcing-mistral-7b). $w$=4096 sliding window. Even though training context is 8k, the KV cache need only be the rolling window.
- Inference KV cache size becomes constant in $N$ once $N > w$ — huge for long-running chat sessions.
- Quality holds because the receptive field grows with depth ($L \cdot w$ effective context).

**8. Ring Attention — when one device isn't enough**
- Liu, Zaharia, Abbeel (2023), *Ring Attention with Blockwise Transformers for Near-Infinite Context*, [arXiv:2310.01889](https://arxiv.org/abs/2310.01889). ICLR 2024.
- Sequence parallelism: shard Q, K, V across $P$ devices along the sequence dimension. Each device holds its Q shard fixed, and K,V shards rotate around a logical ring.
- At each step: device $p$ runs blockwise FlashAttention against the K,V shard currently in residence, then forwards it to neighbour $p+1$ while receiving from $p-1$.
- Communication is fully hidden when block compute time ≥ block transfer time → near-zero overhead.
- Enables training/inference at million-token contexts; cited as a key ingredient in Gemini 1.5's 1M-token context.
- Follow-up: Meta's *Context Parallelism for Scalable Million-Token Inference*, [arXiv:2411.01783](https://arxiv.org/abs/2411.01783).

**9. Speculative decoding (brief mention, points to a future post)**
- Leviathan et al. 2023, [arXiv:2211.17192](https://arxiv.org/abs/2211.17192). Draft model proposes $k$ tokens, target model verifies in one forward pass. Multiplicative with everything else; complementary to KV-cache work.

**10. Pros/cons summary tables**
- One per technique, plus a "stack them" diagram showing that real production serving uses GQA + Paged + (sometimes Ring) + speculative decoding together.

**11. Closing — what's next**
- Hardware codesign (Blackwell's FP4, larger SRAM).
- Hybrid attention/SSM (Mamba-2, Jamba) — attention only where it earns its keep.
- Retrieval and KV cache compression as parallel cache-shrinking strategies.
- Training-inference asymmetry as a permanent feature: optimization will keep diverging.

### References (Part 4)
- [arXiv:1911.02150](https://arxiv.org/abs/1911.02150) — MQA
- [arXiv:2305.13245](https://arxiv.org/abs/2305.13245) — GQA
- [arXiv:2405.04434](https://arxiv.org/abs/2405.04434) — DeepSeek-V2 (MLA)
- [arXiv:2309.06180](https://arxiv.org/abs/2309.06180) — PagedAttention
- [arXiv:2310.01889](https://arxiv.org/abs/2310.01889) — Ring Attention
- [arXiv:2411.01783](https://arxiv.org/abs/2411.01783) — Meta Context Parallelism
- [arXiv:2211.17192](https://arxiv.org/abs/2211.17192) — Speculative decoding
- [Mistral 7B announcement](https://mistral.ai/news/announcing-mistral-7b)
- [vLLM repo](https://github.com/vllm-project/vllm)
- [Sebastian Raschka MLA explainer](https://magazine.sebastianraschka.com/p/multi-head-latent-attention)
- [HuggingFace Llama 3.1 long-context blog](https://huggingface.co/blog/llama31)
- Orca (continuous batching), OSDI 2022 — Yu, Jeong, Kim, Kim, Chun.

### Visualization specs

**Viz 1 — `kv-cache-evolution.html`**
- Single token visualized as a row of head-colored blocks for each scheme: **MHA** (64 full K + 64 full V blocks), **MQA** (1 K + 1 V), **GQA** (8 K + 8 V, with brackets showing which Q heads share each), **MLA** (one tiny latent vector + tiny RoPE tail).
- Slider: context length 1k → 128k. Live counter: "GB used per request" for each scheme.
- Dropdown: model preset (Llama 3 8B / Llama 3 70B / DeepSeek-V2).
- Pedagogical aim: feel the order-of-magnitude differences viscerally.

**Viz 2 — `paged-attention-blocks.html`**
- Top: a contiguous "naive" KV memory pool with 3 concurrent requests, each with reserved fragmented chunks; large grey "wasted" regions highlighted, waste percentage updates.
- Bottom: same workload under PagedAttention. A pool of fixed-size physical blocks; per-request block tables drawn as arrows mapping logical → physical. Shared prefix illustrated with two block tables pointing to the same physical blocks, then diverging on copy-on-write.
- Toggle a "new request arrives mid-stream" event: naive mode rejects it (OOM); paged mode allocates blocks anywhere there's room.
- Counters: GPU memory utilization, requests served.

**Viz 3 — `sliding-window-receptive-field.html`** (smaller, optional)
- Stack of $L$ layers, window $w=4$ for clarity. Animate how a token at position 0 in layer 0 propagates information forward; by layer $L$ it has influenced tokens up to position $L \cdot w$.
- Slider for $L$ and $w$; live "effective context" readout. Demystifies how local attention recovers global reach with depth.

**Viz 4 — `ring-attention-rotation.html`**
- 4 GPU devices arranged in a ring. Each holds a Q shard (fixed) and a K,V shard (rotating).
- Animate one full rotation: at each step, every GPU runs blockwise FlashAttention on its current Q against the K,V shard in residence (compute bar fills), simultaneously sending its K,V to the next device (comm bar fills).
- Show overlapping compute and comm bars to make "communication hidden under compute" tangible.
- Counter: total wall time vs naive all-gather alternative.

### Suggested code snippets
- 6 lines: HuggingFace `AutoConfig` showing GQA's `num_key_value_heads` field for Llama 3.
- 10 lines: minimal vLLM serving snippet (`llm = LLM(model=..., gpu_memory_utilization=0.9)`).
- 5 lines: enabling Mistral's sliding window via `transformers` config.

---

## Build order recommendation

1. **Part 1 first** — anchors the series, lowest visualization complexity (alignment matrix is well-trodden ground). Calibrate length and tone here.
2. **Part 3 next** (skip ahead) — highest reader demand, hardest visualization. Worth front-loading the difficult one while context is fresh.
3. **Part 2** — fill in the historical bridge.
4. **Part 4** — most material, but by then the visualization patterns are well-established.

## Series-wide reference index (one-stop list for reuse)

### Foundational papers
- Sutskever et al. 2014, Seq2Seq — [arXiv:1409.3215](https://arxiv.org/abs/1409.3215)
- Cho et al. 2014, RNN encoder-decoder — [arXiv:1406.1078](https://arxiv.org/abs/1406.1078)
- Bahdanau et al. 2014, attention for NMT — [arXiv:1409.0473](https://arxiv.org/abs/1409.0473)
- Luong et al. 2015, attention variants — [arXiv:1508.04025](https://arxiv.org/abs/1508.04025)
- Vaswani et al. 2017, Attention Is All You Need — [arXiv:1706.03762](https://arxiv.org/abs/1706.03762)

### Approximate attention era
- Sparse Transformer — [arXiv:1904.10509](https://arxiv.org/abs/1904.10509)
- Reformer — [arXiv:2001.04451](https://arxiv.org/abs/2001.04451)
- Longformer — [arXiv:2004.05150](https://arxiv.org/abs/2004.05150)
- BigBird — [arXiv:2007.14062](https://arxiv.org/abs/2007.14062)
- Linformer — [arXiv:2006.04768](https://arxiv.org/abs/2006.04768)
- Performer — [arXiv:2009.14794](https://arxiv.org/abs/2009.14794)
- Linear Transformer — [arXiv:2006.16236](https://arxiv.org/abs/2006.16236)
- Efficient Transformers Survey — [arXiv:2009.06732](https://arxiv.org/abs/2009.06732)
- Long Range Arena — [arXiv:2011.04006](https://arxiv.org/abs/2011.04006)
- Rabe & Staats (O(√N) memory) — [arXiv:2112.05682](https://arxiv.org/abs/2112.05682)

### IO-aware exact attention
- Online softmax (Milakov & Gimelshein) — [arXiv:1805.02867](https://arxiv.org/abs/1805.02867)
- FlashAttention v1 — [arXiv:2205.14135](https://arxiv.org/abs/2205.14135)
- FlashAttention v2 — [arXiv:2307.08691](https://arxiv.org/abs/2307.08691)
- FlashAttention v3 — [arXiv:2407.08608](https://arxiv.org/abs/2407.08608)
- Tri Dao FA3 blog — https://tridao.me/blog/2024/flash3/
- Colfax FA3 — https://research.colfax-intl.com/flashattention-3-fast-and-accurate-attention-with-asynchrony-and-low-precision/
- PyTorch FA3 — https://pytorch.org/blog/flashattention-3/
- Hazy Research FA2 — https://hazyresearch.stanford.edu/blog/2023-07-17-flash2
- flash-attention repo — https://github.com/Dao-AILab/flash-attention
- xFormers MEA — https://facebookresearch.github.io/xformers/components/ops.html

### Inference-era / KV cache
- MQA — [arXiv:1911.02150](https://arxiv.org/abs/1911.02150)
- GQA — [arXiv:2305.13245](https://arxiv.org/abs/2305.13245)
- DeepSeek-V2 / MLA — [arXiv:2405.04434](https://arxiv.org/abs/2405.04434)
- PagedAttention / vLLM — [arXiv:2309.06180](https://arxiv.org/abs/2309.06180)
- Ring Attention — [arXiv:2310.01889](https://arxiv.org/abs/2310.01889)
- Meta Context Parallelism — [arXiv:2411.01783](https://arxiv.org/abs/2411.01783)
- Speculative decoding — [arXiv:2211.17192](https://arxiv.org/abs/2211.17192)
- Mistral 7B (sliding window) — https://mistral.ai/news/announcing-mistral-7b
- vLLM repo — https://github.com/vllm-project/vllm
- Sebastian Raschka MLA — https://magazine.sebastianraschka.com/p/multi-head-latent-attention
- Llama 3.1 long-context — https://huggingface.co/blog/llama31

### Hardware and reference reading
- NVIDIA Hopper architecture — https://developer.nvidia.com/blog/nvidia-hopper-architecture-in-depth/
- Hopper Tuning Guide — https://docs.nvidia.com/cuda/hopper-tuning-guide/index.html
- The Annotated Transformer — http://nlp.seas.harvard.edu/annotated-transformer/
- The Illustrated Transformer (Jay Alammar) — https://jalammar.github.io/illustrated-transformer/

## Glossary (reuse across posts)

- **HBM** — High Bandwidth Memory; off-chip GPU DRAM. A100: 80 GB @ 2 TB/s; H100: 80 GB @ 3.35 TB/s.
- **SRAM / shared memory** — On-chip per-SM scratchpad. ~164 KB (A100), ~228 KB (H100). ~10× faster than HBM.
- **SM** — Streaming Multiprocessor. A100 has 108; H100 has 132.
- **Tensor Core** — Matrix-multiply-and-accumulate unit. The thing FlashAttention is trying to keep busy.
- **WGMMA** — Warpgroup matrix multiply on Hopper. A new async tensor-core instruction.
- **TMA** — Tensor Memory Accelerator on Hopper. Async bulk copy from HBM to SRAM.
- **MFU** — Model FLOPs Utilization. Achieved FLOPs ÷ peak FLOPs.
- **KV cache** — Stored K and V tensors from past tokens, reused at each generation step.
- **Prefill / Decode** — Two inference phases: process prompt (compute-bound, big batched matmuls) vs generate one token at a time (memory-bound on KV cache).
- **TTFT / TPOT** — Time to first token / time per output token. The two latency metrics that matter.
- **RoPE** — Rotary Position Embedding (Su et al., 2021). Applies position via rotation in complex plane; position-dependent and doesn't commute with arbitrary linear projections (key MLA design constraint).
- **Roofline** — Performance model plotting achievable FLOPs vs arithmetic intensity (FLOPs/byte). Below the ridge: memory-bound. Above: compute-bound.

## Per-part deliverables checklist

For each part:
- [ ] `content/posts/<slug>/index.md` with full Hugo front matter
- [ ] One Vite project per visualization under `visualizations/<name>/`, building to `static/visualizations/<name>/`
- [ ] Shared components added to `visualizations/shared/` if reusable
- [ ] Hero image placeholder noted (user provides)
- [ ] Cross-links updated in sibling posts' "Further reading" / "Series" sections
- [ ] `pnpm build:viz && hugo server` smoke test (visualization renders, no console errors, mobile layout OK, reduced-motion fallback works)
- [ ] Lighthouse pass (bundle <200 KB gzipped, no CLS from late-loading viz)

## One-time setup (before Part 1)

- [ ] Add `visualizations/` directory with pnpm workspace (`pnpm-workspace.yaml`)
- [ ] Create `@deepakbaby/viz-shared` package with theme tokens and core components
- [ ] Wire `npm run build:viz` into `package.json` and Netlify build command
- [ ] Add `static/visualizations/` to `.gitignore` *only* if generated (decide: commit build output for simplicity, or build on Netlify)
- [ ] Document the dev loop in `CLAUDE.md` so future sessions know how to iterate
