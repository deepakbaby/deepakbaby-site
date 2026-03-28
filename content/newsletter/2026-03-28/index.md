---
title: "AI Weekly: Judge Stops Pentagon's Anthropic Blacklist, Claude Mythos Leaked"
date: 2026-03-28
week_start: "2026-03-22"
week_end: "2026-03-28"
draft: false
highlights:
  - "A federal judge blocked the Pentagon's attempt to blacklist Anthropic as a national security threat, ruling the government likely retaliated against Anthropic for its public AI safety stance."
  - "Internal details about Anthropic's next flagship model 'Claude Mythos' leaked via a CMS blunder — Anthropic confirmed it is in testing and represents a 'step change' in capabilities."
  - "LiteLLM v1.82.8 was found to contain a malicious PyPI package harvesting SSH keys and cloud credentials — a wake-up call for the AI developer supply chain."
news:
  - category: "Models & Releases"
    color: "#3b82f6"
    items:
      - title: "Claude Mythos: Anthropic's Next Flagship Accidentally Leaked"
        summary:
          - "Nearly 3,000 internal Anthropic assets leaked via a CMS misconfiguration, revealing 'Claude Mythos' — an upcoming model described as a 'step change' in capabilities."
          - "Anthropic confirmed to Fortune it is actively testing Mythos, which was internally flagged for significant cybersecurity implications."
          - "The accidental disclosure is one of the highest-profile pre-release AI model leaks in recent memory."
        url: "https://fortune.com/2026/03/26/anthropic-says-testing-mythos-powerful-new-ai-model-after-data-leak-reveals-its-existence-step-change-in-capabilities/"
      - title: "Mistral Voxtral TTS: Open-Weight Voice Model Beats ElevenLabs"
        summary:
          - "Mistral released Voxtral TTS, a 3B open-weight text-to-speech model that outperforms ElevenLabs Flash v2.5 in human preference tests."
          - "It runs on approximately 3GB RAM with 90ms time-to-first-audio and supports 9 languages — making it practical for local and edge deployment."
          - "The release accelerates the open-source TTS race and directly challenges commercial voice API providers."
        url: "https://venturebeat.com/orchestration/mistral-ai-just-released-a-text-to-speech-model-it-says-beats-elevenlabs-and"
      - title: "Gemini 3.1 Flash Live: Google's Real-Time Voice and Audio Model"
        summary:
          - "Google launched Gemini 3.1 Flash Live, its highest-quality audio model yet — with lower latency, better tone understanding, and a 90.8% score on ComplexFuncBench Audio."
          - "Available now via the Gemini Live API in AI Studio and through Gemini Live and Search Live in 200+ countries."
          - "All audio output is watermarked at generation — a proactive stance against AI-generated misinformation at scale."
        url: "https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-3-1-flash-live/"
      - title: "Cohere Transcribe: Open-Source State-of-the-Art ASR"
        summary:
          - "Cohere released Transcribe, an open-source automatic speech recognition model trained from scratch to minimise word error rate under real-world production conditions."
          - "It has a manageable inference footprint for GPU and local deployment, and is also available via Cohere's Model Vault managed platform."
          - "The release positions Cohere in the speech intelligence space alongside Whisper and ElevenLabs as audio becomes a core enterprise AI modality."
        url: "https://cohere.com/blog/transcribe"
  - category: "People & Business"
    color: "#8b5cf6"
    items:
      - title: "Jensen Huang: 'AGI Has Been Achieved'"
        summary:
          - "NVIDIA CEO Jensen Huang stated in a viral video that AGI has been achieved, triggering fierce debate about definitions across r/singularity and r/MachineLearning."
          - "Critics noted the claim conflates benchmark performance with general intelligence; supporters pointed to GPT-5.4 exceeding human baselines on several productivity tasks."
          - "The clip landed the same week as the Claude Mythos leak, amplifying an already AGI-heavy news cycle."
        url: "https://youtu.be/vif8NQcjVf0"
  - category: "Policy & Ethics"
    color: "#f59e0b"
    items:
      - title: "LiteLLM PyPI Supply Chain Attack Harvested SSH Keys and Cloud Credentials"
        summary:
          - "LiteLLM v1.82.8 on PyPI contained a malicious .pth file that silently harvested SSH keys, cloud credentials, and secrets on every Python process startup."
          - "Discovered when the package was pulled as a transitive dependency via a Cursor MCP plugin — the malware's accidental fork bomb crashed the machine and triggered the investigation."
          - "Package has been yanked; anyone who installed it should rotate SSH keys and cloud credentials immediately."
        url: "https://futuresearch.ai/blog/litellm-pypi-supply-chain-attack/"
      - title: "Federal Judge Blocks Pentagon's Anthropic Blacklisting"
        summary:
          - "Federal judge Rita Lin granted Anthropic a preliminary injunction on March 26, blocking a Pentagon directive that had labelled Anthropic a 'supply chain risk' and 'national security threat.'"
          - "The judge ruled the government likely violated the law and found evidence the blacklisting was retaliation for Anthropic's public AI safety advocacy."
          - "The ruling sets a significant precedent for AI companies resisting politically motivated federal overreach on procurement."
        url: "https://www.reuters.com/world/us-judge-blocks-pentagons-anthropic-blacklisting-now-2026-03-26/"
  - category: "Products & Hardware"
    color: "#10b981"
    items:
      - title: "Claude Gets Computer Use and Dispatch"
        summary:
          - "Anthropic launched computer use in Claude Cowork and Claude Code — Claude can now point, click, scroll, and control your browser and screen when no API connector exists."
          - "Dispatch pairs with this, letting you assign Claude tasks from your phone and receive updates as it works autonomously."
          - "Available in research preview for Pro and Max subscribers; Claude always requests explicit permission before taking any action."
        url: "https://claude.com/blog/dispatch-and-computer-use"
      - title: "Claude Code AutoDream: Background Agent Tidies Your Memory Files"
        summary:
          - "AutoDream is a new Claude Code background sub-agent that automatically consolidates, prunes, and reorganises memory files across sessions."
          - "Triggered automatically or manually via the /dream command, it ensures each session starts with a clean, relevant memory slate."
          - "Complements AutoMemory and is especially useful for long-running projects where context accumulates over weeks."
        url: "https://www.geeky-gadgets.com/claude-autodream-memory-files/"
      - title: "Intel Arc Pro B70: 32GB VRAM GPU for $949"
        summary:
          - "Intel's Arc Pro B70 ships March 31 with 32GB VRAM at $949 MSRP and 608 GB/s bandwidth — near NVIDIA RTX 5070 territory at a fraction of the cost."
          - "The local AI community is excited about the headroom to run 27B+ models at 4-bit quantisation on a single consumer card."
          - "If the drivers hold up, the B70 could meaningfully disrupt NVIDIA's near-monopoly on local LLM GPU hardware."
        url: "https://www.pcmag.com/news/intel-targets-ai-workstations-with-memory-stuffed-arc-pro-b70-and-b65-gpus"
  - category: "Research & Resources"
    color: "#ec4899"
    items:
      - title: "V-JEPA 2.1: Meta's Dense Self-Supervised Video Model"
        summary:
          - "Meta AI released V-JEPA 2.1, learning dense spatial and temporal representations for both images and video from a unified self-supervised objective."
          - "Key innovations: dense predictive loss across visible and masked tokens, deep self-supervision across intermediate encoder layers, and stronger global scene understanding."
          - "Continues the JEPA world-model research line from LeCun, Ballas, and Bardes — the same team behind AMI Labs."
        url: "https://arxiv.org/abs/2603.14482"
      - title: "LeWM: Simple Stable JEPA World Model That Trains from Pixels"
        summary:
          - "LeWorldModel (LeWM) is a JEPA-based world model that trains end-to-end from raw pixels using just two loss terms and a Gaussian regularizer (SIGReg) to prevent collapse."
          - "Eliminates the need for pre-trained encoders, EMA, or complex multi-term losses that make existing JEPA methods brittle."
          - "Achieves competitive control and planning performance at a fraction of the compute cost of prior approaches."
        url: "https://le-wm.github.io/"
      - title: "Google TurboQuant: Extreme LLM Compression via Vector Quantization"
        summary:
          - "Google Research released TurboQuant, a theoretically-grounded set of quantization algorithms for massively compressing LLMs and vector search engines."
          - "Targets the KV-cache bottleneck and high-dimensional vector memory that dominate production inference costs."
          - "Enables faster similarity lookups and lower memory footprint at scale without sacrificing output quality."
        url: "https://research.google/blog/turboquant-redefining-ai-efficiency-with-extreme-compression/"
      - title: "Andrew Ng's Context Hub: Stop Agents Hallucinating APIs"
        summary:
          - "Context Hub (chub) is a CLI tool giving coding agents versioned, curated API docs so they stop hallucinating library interfaces mid-task."
          - "Agents can annotate documentation gaps locally and vote docs up or down, feeding improvements back to maintainers over time."
          - "Works with Claude Code, Codex, and any agent harness via a simple prompt or SKILL.md integration."
        url: "https://github.com/andrewyng/context-hub"
---
