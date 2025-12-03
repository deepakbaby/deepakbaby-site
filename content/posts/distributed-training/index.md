---
title: "Distributed Training Techniques: DDP, Pipeline Parallelism, and FSDP"
date: 2025-12-01
draft: false
hero: dt.png
tags: ["deep learning", "distributed training", "DDP", "FSDP", "pipeline parallelism", "PyTorch"]
categories: ["Machine Learning"]
description: "A comprehensive guide to distributed training techniques in ML - understanding Data Distributed Parallel (DDP), Pipeline Parallelism, and Fully Sharded Data Parallel (FSDP) with their pros and cons."
---

Modern deep learning models have grown exponentially in size and complexity. GPT-4 has over a trillion parameters, and even "smaller" models like LLaMA-70B require substantial computational resources. Training or fine-tuning such models on a single GPU is often impossible; not just because of time constraints, but because the model itself may not fit in the memory of a single device. This is where **distributed training** becomes essential.

## Why Do We Need Distributed Training?

### The Memory Wall Problem

A modern GPU like the NVIDIA A100 has 80GB of memory. Sounds like a lot? Let's do some math:

- A model with 7 billion parameters in FP32 requires: $7B \times 4 \text{ bytes} = 28\text{GB}$
- But during training, we also need:
  - Gradients: another 28GB
  - Optimizer states (Adam has 2 momentum terms): 56GB more
  - Activations for backpropagation: varies, but often substantial

A 7B parameter model can easily require 150GB+ during training, far exceeding what a single GPU can handle.

### The Time Constraint

Even if a model fits in memory, training on a single GPU can take prohibitively long. Consider:

- Training GPT-3 on a single V100 GPU would take approximately **355 years**
- With distributed training across thousands of GPUs, this was reduced to **weeks**

### Types of Parallelism

Distributed training employs different parallelism strategies:

| Strategy | What's Parallelized | When to Use |
|----------|---------------------|-------------|
| **Data Parallelism** | Training data across replicas | Large datasets, model fits in single GPU |
| **Model/Tensor Parallelism** | Model layers across devices | Very large layers (e.g., attention in transformers) |
| **Pipeline Parallelism** | Model stages across devices | Deep models with many sequential layers |
| **Hybrid (3D Parallelism)** | Combination of above | Extremely large models (100B+ parameters) |

{{< vs 2>}}
This post dives deep into three fundamental approaches: **DDP**, **Pipeline Parallelism**, and **FSDP**.

---

## Distributed Data Parallel (DDP)

DDP is the most straightforward and commonly used approach for distributed training. The core idea is simple: replicate the entire model on each GPU, split the data batch across GPUs, and synchronize gradients.

### How DDP Works
Click the Play button to see a visualization of how DDP works.

<div style="margin: 0; padding: 0; border-radius: 0; overflow: hidden; background: transparent;">
  <iframe 
    src="/visualizations/ddp.html" 
    style="width: 100%; aspect-ratio: 16 / 9; border: none; display: block; margin: 0; padding: 0; min-height: 0;"
    allowfullscreen
    loading="lazy"
    frameborder="0"
    scrolling="no">
  </iframe>
</div>

1. **Model Replication**: Each GPU gets a complete copy of the model with identical initial weights
2. **Data Sharding**: The training batch is split equally among all GPUs
3. **Forward Pass**: Each GPU processes its data shard independently
4. **Backward Pass**: Each GPU computes gradients for its local data
5. **Gradient Synchronization**: All GPUs synchronize their gradients using **AllReduce**
6. **Weight Update**: Each GPU applies the synchronized gradients to update its local model

The magic happens in the **AllReduce** operation, which efficiently computes the average of gradients across all GPUs and distributes the result back to each GPU.

### AllReduce: The Heart of DDP

AllReduce is a collective communication operation that:
1. Takes input tensors from all processes
2. Applies a reduction operation (typically sum or average)
3. Distributes the result to all processes


### Pros of DDP

| Advantage | Description |
|-----------|-------------|
| ✅ **Simple Implementation** | Minimal code changes required; wrap model in `DistributedDataParallel` |
| ✅ **Linear Scaling** | Near-linear speedup with more GPUs for communication-bound scenarios |
| ✅ **No Model Changes** | Works with any model architecture without modifications |
| ✅ **Fault Tolerance** | Easy to checkpoint and resume training |
| ✅ **Overlapping Communication** | Gradient sync overlaps with backward computation |

### Cons of DDP

| Disadvantage | Description |
|--------------|-------------|
| ❌ **Memory Redundancy** | Full model replicated on each GPU |
| ❌ **Model Size Limit** | Model must fit entirely in single GPU memory |
| ❌ **Communication Overhead** | AllReduce scales with model size |
| ❌ **Synchronization Barrier** | All GPUs must wait for slowest one (stragglers) |

### When to Use DDP

DDP is ideal when:
- Your model fits comfortably in a single GPU
- You want simple, robust distributed training
- You're scaling across multiple machines with fast interconnects

---

## Pipeline Parallelism

When models are too large to fit on a single GPU, we need to partition them across devices. Pipeline Parallelism splits the model into **stages**, where each stage runs on a different GPU.

### How Pipeline Parallelism Works
Click the Play button.

<div style="margin: 0; padding: 0; border-radius: 0; overflow: hidden; background: transparent;">
  <iframe 
    src="/visualizations/pipeline.html" 
    style="width: 100%; aspect-ratio: 16 / 9; border: none; display: block; margin: 0; padding: 0; min-height: 0;"
    allowfullscreen
    loading="lazy"
    frameborder="0"
    scrolling="no">
  </iframe>
</div>

1. **Model Partitioning**: Split model into N sequential stages
2. **Stage Assignment**: Each GPU handles one or more stages
3. **Micro-batching**: Split input batch into smaller micro-batches
4. **Pipeline Execution**: Process micro-batches in a pipelined fashion

#### The Bubble Problem

Naive pipeline parallelism has a significant issue, **pipeline bubbles**. Notice the `Device Utilization Timeline` in the above animation as training progresses. It shows "bubbles" where GPUs sit idle, waiting for data from previous stages, leading to wasted compute resources.

#### Reducing Bubbles with Micro-batching

The key optimization is to use **many micro-batches**:

$$\text{Bubble Fraction} = \frac{p - 1}{m}$$

Where $p$ is the number of pipeline stages and $m$ is the number of micro-batches. With more micro-batches, the bubble overhead becomes negligible.

### Pipeline Schedules

Different scheduling strategies minimize bubbles:

| Schedule | Description | Memory | Bubble Ratio |
|----------|-------------|--------|--------------|
| **GPipe** | All forward, then all backward | High (stores activations) | $(p-1)/m$ |
| **1F1B** | Alternates forward/backward | Lower | $(p-1)/m$ |
| **Interleaved 1F1B** | Virtual stages | Lowest | $(p-1)/(m \cdot v)$ |

### Pros of Pipeline Parallelism

| Advantage | Description |
|-----------|-------------|
| ✅ **Scales Model Size** | Train models larger than single GPU memory |
| ✅ **Lower Communication** | Only activations transferred between stages |
| ✅ **Works with Sequential Models** | Natural fit for transformer layers |
| ✅ **Memory Efficient** | Each GPU only holds subset of model |

### Cons of Pipeline Parallelism

| Disadvantage | Description |
|--------------|-------------|
| ❌ **Pipeline Bubbles** | Idle time reduces GPU utilization |
| ❌ **Complex Implementation** | Requires careful model partitioning |
| ❌ **Load Balancing** | Stages must have similar compute cost |
| ❌ **Increased Latency** | Forward pass must traverse all stages |
| ❌ **Gradient Staleness** | Some schedules have delayed gradient updates |

### When to Use Pipeline Parallelism

Pipeline parallelism shines when:
- Model doesn't fit on a single GPU but isn't excessively large
- Model has clear sequential structure (e.g., transformer blocks)
- You have limited inter-GPU bandwidth
- Combined with data parallelism for better scaling

---

## Fully Sharded Data Parallel (FSDP)

FSDP represents a paradigm shift in distributed training. Instead of replicating the entire model on each GPU (like DDP), FSDP **shards** the model parameters, gradients, and optimizer states across all GPUs.

### How FSDP Works

<div style="margin: 0; padding: 0; border-radius: 0; overflow: hidden; background: transparent;">
  <iframe 
    src="/visualizations/fsdp.html" 
    style="width: 100%; aspect-ratio: 16 / 9; border: none; display: block; margin: 0; padding: 0; min-height: 0;"
    allowfullscreen
    loading="lazy"
    frameborder="0"
    scrolling="no">
  </iframe>
</div>

FSDP follows a **gather-compute-scatter** pattern:

1. **Sharding**: Model parameters are partitioned across all GPUs
2. **AllGather**: Before forward pass, gather full parameters for current layer
3. **Forward Compute**: Execute layer with full parameters
4. **Discard**: After forward, discard non-local parameters to save memory
5. **Repeat** for backward pass: AllGather → Compute gradients → ReduceScatter
6. **ReduceScatter**: Distribute and reduce gradients back to shards

#### Memory Savings

The memory savings with FSDP are dramatic:

| Component | DDP Memory | FSDP Memory |
|-----------|-----------|-------------|
| Parameters | $\Phi$ per GPU | $\Phi / N$ per GPU |
| Gradients | $\Phi$ per GPU | $\Phi / N$ per GPU |
| Optimizer States | $2\Phi$ per GPU (Adam) | $2\Phi / N$ per GPU |
| **Total** | $4\Phi$ | $4\Phi / N$ |

Where $\Phi$ is model size and $N$ is number of GPUs.

For a 7B model on 8 GPUs:
- **DDP**: 28GB × 4 = 112GB per GPU (doesn't fit on 80GB A100!)
- **FSDP**: 112GB / 8 = 14GB per GPU ✓

#### Sharding Strategies

FSDP offers flexible sharding strategies:

| Strategy | What's Sharded | Memory | Communication |
|----------|---------------|--------|---------------|
| **FULL_SHARD** | Params, Grads, Optimizer | Minimum | Maximum |
| **SHARD_GRAD_OP** | Grads, Optimizer | Medium | Medium |
| **NO_SHARD** | Nothing (like DDP) | Maximum | Minimum |

### Pros of FSDP

| Advantage | Description |
|-----------|-------------|
| ✅ **Massive Memory Savings** | Linear reduction in memory with GPU count |
| ✅ **Train Huge Models** | Enable training of models that don't fit on single GPU |
| ✅ **Flexible Sharding** | Choose tradeoff between memory and communication |
| ✅ **Native PyTorch** | Well-integrated into PyTorch ecosystem |
| ✅ **Mixed Precision** | Works seamlessly with AMP/BF16 |
| ✅ **Activation Checkpointing** | Combines well with gradient checkpointing |

### Cons of FSDP

| Disadvantage | Description |
|--------------|-------------|
| ❌ **Communication Overhead** | More collective operations than DDP |
| ❌ **Complexity** | More configuration options to tune |
| ❌ **Debugging Difficulty** | Harder to debug distributed sharded state |
| ❌ **Checkpoint Complexity** | Saving/loading requires special handling |
| ❌ **Latency** | AllGather adds latency before each layer |

### When to Use FSDP

FSDP is the right choice when:
- Model doesn't fit on single GPU even with mixed precision
- You need to train models with billions of parameters
- You have fast GPU interconnects (NVLink, InfiniBand)
- Memory is the primary bottleneck

---

## Comparison Summary

| Aspect | DDP | Pipeline Parallel | FSDP |
|--------|-----|-------------------|------|
| **Memory per GPU** | Full model | Model / stages | Model / GPUs |
| **Communication** | AllReduce | Point-to-point | AllGather + ReduceScatter |
| **Complexity** | Low | Medium | Medium-High |
| **Model Size Limit** | Single GPU | Total GPU memory | Total GPU memory |
| **GPU Utilization** | High | Medium (bubbles) | High |
| **Best For** | Small-Medium models | Sequential models | Large models |

## Choosing the Right Strategy
{{< mermaid align="center" >}}
graph LR;
    A[Model] --> B{Fit on single GPU?}
    B --> |YES| G[Use DDP]
    B --> |NO| C{Do you have fast interconnect?}
    C --> |YES| E[Use FSDP]
    C --> |NO| F[Use Pipeline Parallel]
{{< /mermaid >}}


## Practical Recommendations

1. **Start with DDP** if your model fits on a single GPU. DDP is the simplest and most efficient.

2. **Switch to FSDP** when memory becomes the bottleneck. Start with `SHARD_GRAD_OP` for less communication overhead.

3. **Add Pipeline Parallelism** for very deep models, especially when combined with FSDP for each pipeline stage.

4. **Use 3D Parallelism** (Data + Pipeline + Tensor) for even bigger models (100B+ parameters).

5. **Profile and measure**: Use tools like PyTorch Profiler to identify bottlenecks.

## Conclusion

Distributed training is essential for working with state-of-the-art neural network models. Understanding these three fundamental approaches gives you the tools to train models of any size.

- **DDP** for simplicity and efficiency with smaller models
- **Pipeline Parallelism** for scaling deep sequential models
- **FSDP** for massive models that exceed single-GPU memory

---

## Further Reading

- [PyTorch DDP Documentation](https://pytorch.org/tutorials/intermediate/ddp_tutorial.html)
- [PyTorch FSDP Tutorial](https://pytorch.org/tutorials/intermediate/FSDP_tutorial.html)
- [GPipe Paper](https://arxiv.org/abs/1811.06965)
- [ZeRO: Memory Optimization Toward Training Trillion Parameter Models](https://arxiv.org/abs/1910.02054)
- [Megatron-LM: Training Multi-Billion Parameter Language Models](https://arxiv.org/abs/1909.08053)

