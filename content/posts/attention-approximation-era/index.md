---
title: "Attention Mechanisms, Part 3: Escaping N² — The Approximation Era"
date: 2026-09-19
draft: true
hero: hero.png
tags: ["deep learning", "attention", "transformers", "efficient transformers"]
categories: ["Machine Learning"]
description: "Part 3 of the attention series: the 2019–2021 wave of sub-quadratic attention — Sparse Transformer, Reformer, Longformer, BigBird, Linformer, and Performer — what each one approximated, and why most of them did not survive."
---

[Part 2](/posts/attention-is-all-you-need/) ended on the Transformer's bill: an $N \times N$ score table per head, per layer. At the sequence lengths of 2017 that bill was small enough to ignore. By 2019 it was the single line item standing between the field and longer context.

The response, roughly from 2019 to 2021, was a wave of architectures that all made the same bet: **the full attention matrix is mostly wasted, so do not compute it**. Some skipped entries by pattern. Some compressed the matrix. Some replaced the softmax kernel outright. For about two years this looked like the future of the Transformer.

Most of it is gone now. That is what makes the period worth studying — not as a list of failed ideas, but as a clean demonstration that the bottleneck everyone was optimizing was not the bottleneck that mattered.

<!-- TODO(viz): attention-pattern-zoo.html — 6-cell grid of N×N masks (dense / strided / sliding window / sliding+global / LSH-bucketed / low-rank) at matched N, with live computed-entry and FLOP counters. Embed here once built. -->

## The N² Wall, Quantified

The cost that hurt was not the matmul. It was **activation memory during training**: the attention probabilities have to be kept around for the backward pass, for every head and every layer.

For a BERT-large-ish configuration (24 layers, 16 heads, fp16), one sequence costs:

| $N$ | Per head | All heads, all layers |
|---:|---:|---:|
| 512 | 524 KB | 201 MB |
| 2k | 8.4 MB | 3.2 GB |
| 8k | 134 MB | 51.5 GB |
| 32k | 2.1 GB | 825 GB |
| 128k | 34.4 GB | 13.2 TB |

Each doubling of $N$ quadruples the bill, and this is before weights, gradients, optimizer state, or a batch dimension. At 8k a single sequence already exceeds an A100. At 32k the number stops being an engineering problem and becomes an arithmetic one.

Meanwhile the demand for length was arriving from every direction at once: GPT-2 at 1024 tokens, GPT-3 at 2048, and a long tail of tasks — full documents, codebases, genomic sequences, high-resolution images as token grids — that wanted 8k–16k and had no route to it.

So the field went looking for a cheaper matrix. Tay et al.'s [*Efficient Transformers: A Survey*](https://arxiv.org/abs/2009.06732) catalogued the result and gives the taxonomy this post follows: **fixed patterns, learned patterns, low-rank, and kernel methods**.

## Fixed Patterns: the Sparse Transformer

[Child et al. (2019)](https://arxiv.org/abs/1904.10509) made the first credible sub-quadratic Transformer at scale. The observation is simple: in a trained dense model, most attention weight concentrates on a small, fairly structured subset of positions. So fix that subset in advance and compute only those entries.

Two patterns, composed across heads or layers:

- **Strided** — each token attends to the $\sqrt{N}$ preceding tokens and then to every $\sqrt{N}$-th token before that. Natural for data with a periodic structure, like images flattened row-major.
- **Fixed** — each token attends within its own block, plus a small set of designated summary columns that every block can see.

Either way the count of computed entries drops from $O(N^2)$ to $O(N\sqrt{N})$. It was enough to train on sequences of ~12k tokens across images, audio, and text — at a time when 1k was normal.

The catch was the implementation. Block-sparse attention that actually runs fast needs custom CUDA kernels, and the resulting code was difficult to modify, difficult to combine with mixed precision, and difficult for anyone outside the originating lab to reproduce. This becomes a recurring theme: **a sparsity pattern is cheap on paper and expensive in a kernel**.

## Learned Patterns: Reformer

If the useful entries are the ones with large $q_i^\top k_j$, why fix the pattern in advance instead of finding those pairs at runtime? [Kitaev, Kaiser & Levskaya (2020)](https://arxiv.org/abs/2001.04451) answer with locality-sensitive hashing.

The mechanism:

1. Tie queries and keys (**shared-QK attention**) so that a single hash can speak for both.
2. Hash every vector with random rotations, so that vectors with a large dot product land in the same bucket with high probability.
3. Sort by bucket, chunk, and attend only within a chunk and its neighbour.

Because softmax is dominated by its largest terms, attending only to same-bucket tokens recovers most of the mass at $O(N \log N)$ cost.

Reformer pairs this with **reversible layers**, borrowed from RevNets: store only the final activations and recompute intermediates during the backward pass by running the layer in reverse. That attacks the same activation-memory problem from the other side, and — worth flagging — recomputation rather than storage is exactly the idea that FlashAttention later takes seriously.

What went wrong was partly hardware and partly task. Hashing, sorting, and chunking are branch-heavy, irregular operations on a device that wants dense regular matmuls, so the asymptotic win did not translate into a wall-clock win at practical $N$. And on tasks needing precise long-range lookup, a token whose match hashed into a different bucket is simply not retrievable.

<!-- TODO(viz): lsh-attention-bucketing.html — 2D scatter of query/key vectors, random rotation animates them into colored buckets, only same-bucket pairs connect. -->

## Sliding Windows: Longformer and BigBird

[Longformer](https://arxiv.org/abs/2004.05150) (Beltagy, Peters & Cohan, 2020) made the least clever bet of the group, and it is the one that survived.

Each token attends to a window of $w$ neighbours. A small, task-chosen set of tokens — `[CLS]`, question tokens — additionally attend globally and are attended to globally. Cost is $O(N \cdot w)$, linear in $N$ for fixed $w$.

With $w=512$, per head:

| $N$ | Dense | Sliding window | Reduction |
|---:|---:|---:|---:|
| 8k | 134 MB | 8.4 MB | 16× |
| 32k | 2.1 GB | 33.6 MB | 64× |
| 128k | 34.4 GB | 134 MB | 256× |

The obvious objection is that a token can only see $w$ neighbours. The answer is depth: stacking local attention widens the receptive field the same way stacked convolutions do. After $L$ layers the effective context is roughly $L \cdot w$ — so 12 layers at $w=512$ reach ~6k tokens, even though no single attention operation ever looks past 512.

**BigBird** ([Zaheer et al., 2020](https://arxiv.org/abs/2007.14062)) adds a third component — a few random keys per query — to the window-plus-global recipe, and comes with theory: the resulting sparse attention is a universal approximator of sequence-to-sequence functions and is Turing complete, properties dense attention has and most approximations lose.

Sliding-window attention is still in production today — Mistral, Gemma, and others ship it — which makes it the clear survivor of this era. The reason is worth naming: it is the one scheme here that is *hardware-shaped*. A window is a dense block. Dense blocks are what GPUs are good at.

## Low Rank: Linformer

[Wang et al. (2020)](https://arxiv.org/abs/2006.04768) attack the problem from linear algebra instead of sparsity. Their observation: the softmax attention matrix is empirically close to low-rank, so it can be factored rather than sparsified.

Linformer learns two projections $E, F \in \mathbb{R}^{k \times N}$ that compress $K$ and $V$ along the **sequence** dimension before attention:

$$\text{head} = \text{softmax}\!\left(\frac{Q(EK)^\top}{\sqrt{d_k}}\right)(FV)$$

The score matrix becomes $N \times k$ instead of $N \times N$. With $k = 256$, a head at $N=32$k drops from 2.1 GB to 16.8 MB.

The catch is structural, and it is severe: $E$ and $F$ have $N$ as an axis, so the maximum sequence length is baked into the weights at training time. A Linformer trained at 4k cannot be handed 8k. Everything else in the Transformer stack is length-agnostic; this is not, and that alone disqualified it from general-purpose language modelling. Quality also degraded on retrieval-style tasks, which is what you would expect when the mechanism's whole premise is that fine detail in the attention matrix is discardable.

## Kernels: Performer and FAVOR+

The most mathematically satisfying attempt. [Choromanski et al. (2021)](https://arxiv.org/abs/2009.14794) observe that softmax attention is a kernel method in disguise: the unnormalized weight between token $i$ and $j$ is $\exp(q_i^\top k_j)$, and any kernel can in principle be written as an inner product of feature maps.

If we can find $\phi(\cdot)$ such that

$$\phi(q)^\top \phi(k) \approx \exp(q^\top k)$$

then attention becomes a product of three ordinary matrices — and matrix products are associative. That is the whole trick:

$$\underbrace{\phi(Q)\left(\phi(K)^\top V\right)}_{\text{never forms } N \times N} \quad \text{instead of} \quad \underbrace{\left(\phi(Q)\phi(K)^\top\right)V}_{\text{forms } N \times N}$$

Bracketing right-to-left, $\phi(K)^\top V$ is $r \times d$ — independent of $N$ — and multiplying $\phi(Q)$ by it is $O(N r d)$. The $N \times N$ matrix is never materialized, not because we skipped entries, but because we never had a reason to build it.

Concretely, at $N=8192$, $r=256$, $d=64$, per head: the dense path costs about $8.6 \times 10^9$ multiply-adds, the associative path about $2.7 \times 10^8$ — roughly **32× fewer**. The crossover is at $N \approx r$; below that, dense is cheaper.

The "+" in FAVOR+ is where the engineering lives. A naive random-feature map for the exponential kernel produces estimates that can go negative, and negative weights inside a softmax-like normalizer make the variance explode. Performer uses **positive** random features to keep every estimate non-negative, and **orthogonal** random features to cut the estimator's variance further.

```python
import torch

def linear_attention(q, k, v, phi):
    # q, k, v: [batch, heads, tokens, head_dim]
    qp, kp = phi(q), phi(k)               # [.., tokens, r]

    kv = torch.einsum("bhnr,bhnd->bhrd", kp, v)   # [.., r, d]  <- N drops out
    z = kp.sum(dim=-2)                            # [.., r]     normalizer
    num = torch.einsum("bhnr,bhrd->bhnd", qp, kv)
    den = torch.einsum("bhnr,bhr->bhn", qp, z).unsqueeze(-1)
    return num / (den + 1e-6)

# A crude but valid feature map; FAVOR+ uses positive orthogonal random features.
phi = lambda x: torch.nn.functional.elu(x) + 1
```

Note what the causal case costs. With a mask, the running $\phi(K)^\top V$ has to be accumulated prefix-by-prefix, which turns the elegant single matmul into a sequential scan — fast in theory, awkward in practice, and a direct ancestor of the recurrent formulations that state-space models revived.

## Honourable Mentions

- **Linear Transformer** ([Katharopoulos et al., 2020](https://arxiv.org/abs/2006.16236)) — the same associativity insight with a simpler feature map, plus the observation that causal linear attention *is* an RNN with a matrix-valued hidden state, giving $O(1)$ memory per decoding step. The most durable idea of the group; it resurfaces in Mamba and friends.
- **Synthesizer** (Tay et al., 2020) — dispenses with query-key interaction altogether and learns or randomizes the attention weights directly. Worked better than it had any right to, which was itself a useful result about how much of attention's benefit is content-dependent.
- **Routing Transformer** ([Roy et al., 2020](https://arxiv.org/abs/2003.05997)) — content-based sparsity via online k-means clustering instead of hashing.

<!-- TODO(viz): attention-complexity-scaling.html — log-log memory/FLOPs vs N for dense O(N²), sparse O(N√N), Reformer O(N log N), Linformer/Performer O(N), with real-hardware reference lines and era markers (GPT-2 1k, Longformer 4k, Gemini 1M). -->

## Why Most of These Faded

Three reasons, in increasing order of importance.

**They did not clearly win on quality.** The [Long Range Arena](https://arxiv.org/abs/2011.04006) benchmark (Tay et al., 2020) was built to settle this and largely did: across its six long-context tasks, no efficient variant dominated, several trailed vanilla attention on tasks requiring precise retrieval, and the ranking shuffled by task. An approximation that is sometimes worse and never much better is a hard sell.

**Asymptotics are not wall-clock.** $O(N \log N)$ with irregular memory access and poor tensor-core utilization can lose to $O(N^2)$ running at 40% of peak. Several of these methods were slower than the thing they replaced at the sequence lengths people actually used, and every one of them added implementation surface that had to be maintained against a moving PyTorch and CUDA target.

**The premise was wrong.** This is the one that mattered. The entire era assumed the $N^2$ matrix had to be *avoided*, because computing it meant storing it. In 2022 FlashAttention showed that assumption was an artifact of how attention was implemented, not a property of attention. Once exact attention became memory-linear and fast, approximating it bought nothing and cost accuracy.

| Method | Complexity | Core idea | Survived? |
|---|---|---|---|
| Sparse Transformer | $O(N\sqrt{N})$ | fixed strided / block patterns | Partly — as an ancestor of block-sparse kernels |
| Reformer | $O(N \log N)$ | LSH bucketing + reversible layers | No |
| Longformer | $O(N \cdot w)$ | sliding window + global tokens | **Yes** — standard in production models |
| BigBird | $O(N \cdot w)$ | window + global + random | Partly — theory is still cited |
| Linformer | $O(N \cdot k)$ | low-rank projection of K, V | No — fixed max length was fatal |
| Performer | $O(N \cdot r d)$ | random-feature kernel + associativity | Partly — lives on in linear-attention/SSM work |
| Linear Transformer | $O(N \cdot r d)$ | feature-map kernel, recurrent decoding | **Yes** — as an SSM precursor |

## The Bridge: Attention Never Needed O(N²) Memory

The turn arrives in a paper that proposes no new architecture at all.

[Rabe & Staats (2021)](https://arxiv.org/abs/2112.05682), *Self-attention Does Not Need $O(n^2)$ Memory*, point out that the $N \times N$ matrix is an artifact of evaluation order. Softmax can be computed by streaming: keep a running maximum and a running sum, process keys in chunks, and rescale the accumulated output as each chunk arrives. The result is **numerically identical** to standard attention — not an approximation — with $O(\log N)$ memory for a single query and $O(\sqrt{N})$ for self-attention.

The paper landed with less noise than the architectures above, because it offered no new modelling capability. What it offered was a reframing: the problem was never the arithmetic, it was the decision to write the intermediate matrix to memory.

That reframing is the subject of Part 4, where FlashAttention takes the same insight, asks what it costs to move bytes between HBM and on-chip SRAM, and makes exact attention both faster and memory-linear — ending this era by making it unnecessary.

## References

- Tay et al., [Efficient Transformers: A Survey](https://arxiv.org/abs/2009.06732), 2020.
- Child et al., [Generating Long Sequences with Sparse Transformers](https://arxiv.org/abs/1904.10509), 2019.
- Kitaev, Kaiser & Levskaya, [Reformer: The Efficient Transformer](https://arxiv.org/abs/2001.04451), ICLR 2020.
- Beltagy, Peters & Cohan, [Longformer: The Long-Document Transformer](https://arxiv.org/abs/2004.05150), 2020.
- Zaheer et al., [Big Bird: Transformers for Longer Sequences](https://arxiv.org/abs/2007.14062), NeurIPS 2020.
- Wang et al., [Linformer: Self-Attention with Linear Complexity](https://arxiv.org/abs/2006.04768), 2020.
- Choromanski et al., [Rethinking Attention with Performers](https://arxiv.org/abs/2009.14794), ICLR 2021.
- Katharopoulos et al., [Transformers are RNNs](https://arxiv.org/abs/2006.16236), ICML 2020.
- Roy et al., [Efficient Content-Based Sparse Attention with Routing Transformers](https://arxiv.org/abs/2003.05997), 2020.
- Tay et al., [Long Range Arena: A Benchmark for Efficient Transformers](https://arxiv.org/abs/2011.04006), 2020.
- Rabe & Staats, [Self-attention Does Not Need O(n²) Memory](https://arxiv.org/abs/2112.05682), 2021.
