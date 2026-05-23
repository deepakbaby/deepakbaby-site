---
title: "AI Weekly: Karpathy Joins Anthropic, Google I/O Drops Gemini Spark"
date: 2026-05-24
week_start: "2026-05-18"
week_end: "2026-05-24"
draft: false
highlights:
  - "Andrej Karpathy joins Anthropic's pretraining team — one of the most significant talent moves in AI history, as the OpenAI co-founder and former Tesla AI Director returns to frontier R&D."
  - "Google I/O 2026 delivers Gemini 3.5 Flash (4× faster, half the cost of rivals) and Gemini Spark, a 24/7 personal agent running across Gmail, Calendar, Drive, Maps, and more."
  - "OpenAI's reasoning model autonomously disproves an 80-year-old Erdős conjecture with a polynomial improvement — peer mathematicians say AI has gone beyond being just an assistant."
news:
  - category: "Models & Releases"
    color: "#3b82f6"
    items:
      - title: "Gemini 3.5 Flash and Spark Agent Launch at I/O"
        summary:
          - "Google I/O 2026 (May 19) unveiled [Gemini 3.5 Flash](https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-3-5/) — 4× faster than other frontier models at under half the cost, topping Terminal-Bench 2.1 (76.2%), GDPval-AA (1656 Elo), and CharXiv Reasoning (84.2%)."
          - "Gemini Spark launches on 3.5 Flash + Antigravity harness: a 24/7 personal agent handling multi-step tasks across Gmail, Calendar, Drive, Docs, Sheets, YouTube, and Maps with Tasks, Skills, and Schedules modes — running in the background even when devices are off."
          - "Sundar Pichai also announced Gemini Omni (any-modality model starting with video), Ask YouTube (semantic video search), Docs Live (voice-to-doc), and [SynthID expansion](https://blog.google/innovation-and-ai/sundar-pichai-io-2026/) with OpenAI, Kakao, and ElevenLabs joining; Gemini Spark rolls out to AI Ultra subscribers in the US; 3.5 Pro is in internal testing for next month."
        url: "https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-3-5/"
      - title: "Cohere Releases Command A+ Under Apache 2.0"
        summary:
          - "Cohere open-sourced [Command A+](https://cohere.com/blog/command-a-plus) (command-a-plus-05-2026): a 218B total / 25B active MoE with 128K context, supporting text, image, and tool use under Apache 2.0."
          - "It unifies all previous Command A variants (Reasoning, Vision, Translate) into one model, delivers up to 63% higher throughput versus Command A Reasoning, and runs on 2× H100s or 1× B200 at W4A4 quantization with near-lossless quality."
          - "Scoring 37 on the Artificial Analysis Intelligence Index (outperforming other open models), the release is framed around sovereign AI — customers can run the full stack within their own environments; available on HuggingFace in BF16, FP8, and W4A4."
        url: "https://cohere.com/blog/command-a-plus"
      - title: "Qwen 3.7 Announced at Alibaba Cloud Summit"
        summary:
          - "Alibaba announced [Qwen 3.7](https://www.aimadetools.com/blog/qwen-3-7-complete-guide/) at the Alibaba Cloud Summit in Hangzhou (May 20–21), with two variants: Qwen3.7-Max (text flagship) and Qwen3.7-Plus (multimodal with vision)."
          - "The API launched immediately; open weights availability is to be confirmed, and the announcement generated heavily upvoted discussion on r/LocalLLaMA."
          - "The release continues the rapid cadence from Alibaba following [Qwen 3.6 27B](/newsletter/2026-04-25/) earlier in April, when the dense model notably outperformed the 397B MoE variant."
        url: "https://www.aimadetools.com/blog/qwen-3-7-complete-guide/"
  - category: "People & Business"
    color: "#8b5cf6"
    items:
      - title: "Andrej Karpathy Joins Anthropic Pretraining Team"
        summary:
          - "Andrej Karpathy — OpenAI co-founder and former Tesla AI Director — announced he is [joining Anthropic's pretraining team](https://www.cnbc.com/amp/2026/05/19/anthropic-hires-openai-cofounder-andrej-karpathy-former-tesla-ai-lead.html), the group responsible for Claude models acquiring core knowledge and capabilities."
          - "Karpathy said: 'I think the next few years at the frontier of LLMs will be especially formative. I am very excited to get back to R&D,' ending his independent phase of running courses and YouTube content since leaving Tesla."
          - "His name featured prominently during the Musk v. Altman trial that concluded the same week; this move is a significant talent signal coming shortly after [Anthropic's ARR overtook OpenAI's](/newsletter/2026-04-11/) for the first time in April."
        url: "https://www.cnbc.com/amp/2026/05/19/anthropic-hires-openai-cofounder-andrej-karpathy-former-tesla-ai-lead.html"
      - title: "Anthropic Acquires Stainless — SDK and MCP Tooling"
        summary:
          - "Anthropic [acquired Stainless](https://www.anthropic.com/news/anthropic-acquires-stainless) (founded 2022), the company that has auto-generated every official Anthropic SDK — covering TypeScript, Python, Go, Java, and Kotlin — since the earliest API days."
          - "Stainless generates SDKs, CLIs, and MCP servers from API specs and is used by hundreds of companies; CEO Alex Rattray stays on, and Anthropic's stated rationale is that agents are only as capable as what they can connect to."
          - "The acquisition brings the premier tooling layer for building on MCP in-house to Anthropic, who created the protocol — deepening Claude's developer experience and agent connectivity; see also [Gemini Spark](#) launching the same week as Google's competing agent platform push."
        url: "https://www.anthropic.com/news/anthropic-acquires-stainless"
      - title: "Meta Lays Off 8,000 in AI Restructuring Wave"
        summary:
          - "Meta executed [layoffs of 8,000 employees](https://www.reuters.com/world/meta-lays-out-plans-may-20-layoffs-restructuring-internal-document-says-2026-05-18/) (roughly 10% of its workforce) starting May 20 in three global batches — combined with 7,000 transfers to AI units, the total workforce impact reaches approximately 20%."
          - "Additional rounds are expected in August and fall 2026 per [CNBC](https://www.cnbc.com/amp/2026/05/18/metas-layoffs-starting-this-week-underscore-zuckerbergs-ai-reality-.html); Zuckerberg's tone was markedly different from the 2022 mea culpa — no apology, with cuts framed as a strategic AI pivot rather than a pandemic overhiring correction."
          - "Part of a broader AI-driven restructuring wave alongside Coinbase's [14% cuts in May](/newsletter/2026-05-10/) and similar rounds at Snap, Block, and Atlassian; Meta itself separately faces IP tension this week over the [Heretic Llama derivatives notice](#)."
        url: "https://www.reuters.com/world/meta-lays-out-plans-may-20-layoffs-restructuring-internal-document-says-2026-05-18/"
  - category: "Policy & Ethics"
    color: "#f59e0b"
    items:
      - title: "Project Glasswing Finds 10,000+ Critical Bugs in First Month"
        summary:
          - "Anthropic's first update on [Project Glasswing](https://www.anthropic.com/research/glasswing-initial-update) — the industry coalition (AWS, Apple, Broadcom, Cisco, CrowdStrike, Google, JPMorganChase, Linux Foundation, Microsoft, NVIDIA, Palo Alto) launched in April to secure critical software before AI can weaponize it — reports 10,000+ high/critical-severity vulnerabilities found in under a month."
          - "Partners can now share Mythos findings under responsible-disclosure norms, formalising a vulnerability exchange layer across the coalition."
          - "This continues the [Glasswing thread from the April 11 edition](/newsletter/2026-04-11/), when the project found zero-days in every major OS and browser including a 27-year-old OpenBSD bug; the scale of findings in month one underscores how much unpatched critical infrastructure exists."
        url: "https://www.anthropic.com/research/glasswing-initial-update"
      - title: "Meta Sends Legal Notice to Heretic Llama Project"
        summary:
          - "Meta served a legal notice to the [Heretic Free Software Project](https://www.reddit.com/r/LocalLLaMA/comments/1tjmvx6/heretic_has_been_served_a_legal_notice_by_meta_inc/) — which published Llama derivatives — forcing removal of the weights; Heretic is now mirroring on Codeberg in Germany."
          - "The move generated r/LocalLLaMA's top post of the week and highlights ongoing open-source vs. corporate IP tension, even as Meta itself faces copyright lawsuits in multiple jurisdictions."
          - "The timing is notable given Meta's simultaneous 8,000-person layoffs and AI pivot — the company is tightening IP control while [restructuring around AI](/newsletter/2026-05-24/) and a week after the Musk v. Altman trial exposed how open-source licensing commitments can erode."
        url: "https://www.reddit.com/r/LocalLLaMA/comments/1tjmvx6/heretic_has_been_served_a_legal_notice_by_meta_inc/"
  - category: "Products & Hardware"
    color: "#10b981"
    items:
      - title: "OpenAI and Dell Bring Codex to Hybrid and On-Prem Enterprise"
        summary:
          - "OpenAI and Dell Technologies [partnered](https://openai.com/index/dell-codex-enterprise-partnership/) to deploy Codex in hybrid and on-premises enterprise environments, extending AI coding agents to air-gapped and regulated industries."
          - "The deal targets sectors — defence, finance, healthcare — where sending code to a cloud API is not permissible, removing the key barrier to enterprise Codex adoption at scale."
          - "It complements the [OpenAI Gartner Magic Quadrant recognition](https://openai.com/index/gartner-2026-agentic-coding-leader/) announced the same week, which placed OpenAI as a Leader in the new Enterprise AI Coding Agents category."
        url: "https://openai.com/index/dell-codex-enterprise-partnership/"
      - title: "OpenAI Named Gartner Magic Quadrant Leader for AI Coding Agents"
        summary:
          - "Gartner placed OpenAI as a Leader in its inaugural [Magic Quadrant for Enterprise AI Coding Agents](https://openai.com/index/gartner-2026-agentic-coding-leader/) — a new category covering coding assistants, AI-native IDEs, terminal-based agents, and agentic platforms."
          - "The category's creation signals that enterprise buyers now treat AI coding agents as a distinct procurement class, not an add-on to existing developer tools."
          - "Frontier model providers are entering direct competition with application-layer vendors; see also [OpenAI + Dell on-prem Codex](https://openai.com/index/dell-codex-enterprise-partnership/) launching the same week to push deeper into regulated enterprise accounts."
        url: "https://openai.com/index/gartner-2026-agentic-coding-leader/"
  - category: "Research & Resources"
    color: "#ec4899"
    items:
      - title: "OpenAI Model Disproves 80-Year-Old Erdős Conjecture"
        summary:
          - "OpenAI's [general-purpose reasoning model autonomously disproved](https://openai.com/index/model-disproves-discrete-geometry-conjecture/) the 'unit distance problem' conjecture posed by Paul Erdős in 1946 — providing an infinite family of counterexamples with a polynomial improvement over known bounds."
          - "Peer mathematicians described the result as 'AI has gone beyond being just an assistant,' marking a milestone for autonomous mathematical discovery rather than AI-assisted proof verification."
          - "The result is notable for being a genuine disproof, not a proof — finding counterexamples to a conjecture that had stood for 80 years is a harder, more open-ended task than verifying a known theorem."
        url: "https://openai.com/index/model-disproves-discrete-geometry-conjecture/"
---
