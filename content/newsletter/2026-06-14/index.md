---
title: "AI Weekly: US Gov Pulls Fable 5, Anthropic's Biggest Launch Yet"
date: 2026-06-14
week_start: "2026-06-08"
week_end: "2026-06-14"
draft: false
highlights:
  - "Anthropic launched Claude Fable 5 and Mythos 5 — the most capable models yet — only for the US government to force their suspension four days later over jailbreak concerns."
  - "OpenAI filed a confidential S-1 with the SEC, opening the door to what could be one of history's largest AI IPOs."
  - "Apple unveiled AFM 3 at WWDC, a co-built Google family of foundation models powering an entirely new Siri with deep personal context."
news:
  - category: "Models & Releases"
    color: "#3b82f6"
    items:
      - title: "Claude Fable 5 + Mythos 5: State-of-the-Art Launch"
        summary:
          - "Anthropic launched Fable 5 (general release) and Mythos 5 (trusted access only) on June 9 — both the same underlying Mythos-class model, priced at $10/M input and $50/M output, less than half the Mythos Preview rate."
          - "Capabilities set new records across nearly every major benchmark: Stripe compressed two months of Ruby codebase migration into a single day, and the model beat all others on Hebbia Finance Benchmark, CursorBench, and ViBench."
          - "Mythos 5 accelerated protein design ~10x and conducted autonomous genomics research for a week, producing a model that outperformed a Science-published paper at 100× smaller size — though both models were [suspended by government order](/newsletter/2026-06-14/) just four days after launch."
        url: "https://www.anthropic.com/news/claude-fable-5-mythos-5"
      - title: "Apple Intelligence 3.0: AFM 3 Family at WWDC"
        summary:
          - "Apple unveiled AFM 3 at WWDC 2026 — a family of five foundation models co-built with Google, including an on-device 20B sparse model (AFM 3 Core Advanced) that activates only 1–4B params and runs on 16GB Apple silicon via flash storage."
          - "Server-side models on Private Cloud Compute include AFM 3 Cloud Pro for agentic and complex reasoning tasks, running on NVIDIA GPUs in Google Cloud; human preference evals show AFM 3 Cloud preferred at 64.7% vs 8.7% baseline."
          - "Consumer highlights include an entirely new Siri with deep personal context, a Foundation Models framework for third-party developers (free, offline, on-device), and HomeKit Secure Video AI search — details at the [Apple Intelligence product page](https://www.apple.com/apple-intelligence/)."
        url: "https://machinelearning.apple.com/research/introducing-third-generation-of-apple-foundation-models"
      - title: "Xiaomi MiMo-V2.5-Pro Breaks 1000 TPS on 1T Model"
        summary:
          - "Xiaomi and TileRT achieved 1000–1200 tokens/sec decode on a 1-trillion-parameter MoE model running on a standard 8-GPU node — no wafer-scale (Cerebras) or SRAM-heavy (Groq) hardware required."
          - "A limited-access API launched June 9–23, priced at 3× standard rates but delivering roughly 10× the speed of conventional inference."
          - "The result challenges the assumption that extreme token throughput requires exotic hardware, potentially opening high-speed 1T-scale inference to commodity data center deployments."
        url: "https://mimo.xiaomi.com/blog/mimo-tilert-1000tps"
  - category: "People & Business"
    color: "#8b5cf6"
    items:
      - title: "OpenAI Files Confidential S-1 with SEC"
        summary:
          - "OpenAI submitted a confidential draft S-1 to the SEC on June 8, signaling a potential IPO path — though the company notes it hasn't decided on timing and may remain private longer."
          - "The filing keeps the IPO option open and continues the trajectory established by the [Anthropic confidential S-1 filing from last week](/newsletter/2026-06-07/), suggesting both frontier labs are preparing for eventual public listings."
          - "If it proceeds, an OpenAI IPO would rank among the largest in history given its current valuation trajectory following the $122B raise in March 2026."
        url: "https://openai.com/index/openai-submits-confidential-s-1/"
      - title: "OpenAI Acquires Ona for Persistent Codex Execution"
        summary:
          - "OpenAI acquired Ona — a cloud development environment platform with 2M developers — to give Codex persistent, secure cloud execution that continues working even after a user's laptop is closed."
          - "Codex now has 5M+ weekly active users, up 400% year-over-year, making the acquisition a significant infrastructure bet on agentic coding at scale."
          - "The deal extends OpenAI's coding agent infrastructure, complementing the [Symphony orchestration spec and Codex GA on AWS](/newsletter/2026-06-07/) announced last week."
        url: "https://openai.com/index/openai-to-acquire-ona/"
      - title: "Anthropic Launches Claude Corps National Fellowship"
        summary:
          - "Anthropic launched Claude Corps on June 11 — a national fellowship program for early-career people passionate about extending AI benefits to communities across America."
          - "The program represents Anthropic's first structured workforce and civic engagement initiative, distinct from its research and enterprise focus."
          - "The launch comes the same week as the [US government's suspension of Fable 5 and Mythos 5](https://www.anthropic.com/news/fable-mythos-access), underscoring the contrast between Anthropic's public-benefit mission and its regulatory battles."
        url: "https://www.anthropic.com/news/claude-corps"
  - category: "Policy & Ethics"
    color: "#f59e0b"
    items:
      - title: "US Government Forces Anthropic to Suspend Fable 5 and Mythos 5"
        summary:
          - "On June 13 at 5:21pm ET, the US government issued an export control directive requiring Anthropic to suspend all access to Fable 5 and Mythos 5 for any foreign national — including Anthropic employees — effectively disabling both models globally."
          - "The government cited a 'narrow, non-universal jailbreak' consisting of prompting the model to read a codebase and fix flaws; Anthropic publicly disagreed, noting the capability is 'widely available from other models including GPT-5.5' and is used daily by defenders, with no universal jailbreak found in thousands of red-teaming hours pre-launch."
          - "Anthropic warned that applying this standard industry-wide would 'essentially halt all new model deployments for all frontier providers' — a striking turn given that [Anthropic's own policy paper from June 10](https://www.anthropic.com/policy-on-the-ai-exponential) had called for government authority to block unsafe deployments, just under fairer principles."
        url: "https://www.anthropic.com/news/fable-mythos-access"
      - title: "Anthropic Calls for Government Authority to Block Dangerous AI"
        summary:
          - "On June 10 — three days before the government acted — Anthropic published a sweeping policy proposal calling for legal authority for governments to block dangerous AI deployments, covering models trained with >10^25 FLOPs at companies with >$500M AI revenue or >$1B R&D spend."
          - "The proposal covers bio risk, cyber risk, and catastrophic harm categories, and directly informed the framework the government then invoked against Anthropic's own models."
          - "Anthropic explicitly stated the June 13 government action did not follow 'transparent, fair, clear, technically-grounded' principles — illustrating the difficult position of a lab that advocated for oversight and was then subject to it under disputed criteria."
        url: "https://www.anthropic.com/policy-on-the-ai-exponential"
      - title: "Fable 5 Technical Report: Restrictions on Competing LLM Dev"
        summary:
          - "Anthropic's Fable 5 technical report (page 13) confirms that the model has intentional restrictions when asked to assist in developing competing large language models — a disclosure that generated significant discussion on r/LocalLLaMA this week."
          - "The revelation fueled debate about AI sovereignty and the practical necessity of locally-runnable open models, with many users citing it as justification for preferring open-weight alternatives."
          - "The restriction sits alongside the [government-ordered suspension of Fable 5](https://www.anthropic.com/news/fable-mythos-access) as a second capability constraint imposed on the same model in the same week, from opposite directions."
        url: "https://www-cdn.anthropic.com/d00db56fa754a1b115b6dd7cb2e3c342ee809620.pdf"
  - category: "Products & Hardware"
    color: "#10b981"
    items:
      - title: "DiffusionGemma: 1000+ Tokens/Sec via Parallel Block Decoding"
        summary:
          - "Google released DiffusionGemma (Apache 2.0, experimental) — a 26B MoE (3.8B active) diffusion-based text model that generates 256-token blocks simultaneously rather than sequentially, achieving 1000+ tokens/sec on H100 and 700+ on RTX 5090 in 18GB VRAM quantized."
          - "The bidirectional attention architecture enables capabilities autoregressive models structurally struggle with: code infilling, amino acid sequence generation, math graphs, and closing complex markdown — a fine-tuned version also solves Sudoku correctly."
          - "Ecosystem integrations include MLX, vLLM (Red Hat), HuggingFace Transformers, Unsloth, and NVIDIA NeMo, with llama.cpp support coming — best suited for speed-critical local and interactive workflows rather than cloud high-QPS serving."
        url: "https://blog.google/innovation-and-ai/technology/developers-tools/diffusion-gemma-faster-text-generation/"
      - title: "OpenAI Academy Launches AI-at-Work Course Library"
        summary:
          - "OpenAI Academy released a new library of courses on June 12 focused on workplace AI adoption, targeting professionals across roles and industries."
          - "The launch is part of OpenAI's broader enterprise and skills push, complementing the [Codex for Every Role plugins and Codex Sites](/newsletter/2026-06-07/) announced last week."
          - "As AI tool adoption becomes a competitive differentiator, structured upskilling programs from frontier labs represent a new front in the enterprise race alongside Microsoft Copilot and Google Workspace AI."
        url: "https://openai.com/index/academy-courses-applying-ai-at-work/"
  - category: "Research & Resources"
    color: "#ec4899"
    items:
      - title: "Anthropic Research: Claude Agents Conducting Autonomous Biology"
        summary:
          - "Anthropic published research on June 8 documenting Claude's capabilities as an autonomous biology agent — conducting genomics research over multi-day sessions, generating novel molecular hypotheses, and achieving protein design outcomes that matched or beat skilled human operators on 9 of 14 targets."
          - "The most striking result: an autonomous genomics run produced a model that outperformed a Science-published paper at 100× smaller parameter size — a capability highlighted in both the [Fable 5 launch](https://www.anthropic.com/news/claude-fable-5-mythos-5) and the [Mythos 5 trusted access biology program](https://www.anthropic.com/news/claude-fable-5-mythos-5)."
          - "The research represents a significant milestone for agentic AI in life sciences, though its implications are now entangled with the [government suspension of Fable 5 and Mythos 5](https://www.anthropic.com/news/fable-mythos-access) over concerns about AI-assisted technical capabilities."
        url: "https://www.anthropic.com/research/agents-in-biology"
---
