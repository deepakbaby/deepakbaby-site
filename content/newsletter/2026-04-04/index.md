---
title: "AI Weekly: OpenAI Raises $122B, Claude Code Source Leaked and Trojanised"
date: 2026-04-04
week_start: "2026-03-29"
week_end: "2026-04-04"
draft: false
highlights:
  - "OpenAI closed a $122 billion funding round — the largest in AI history — as the company doubles down on its next phase of frontier model development."
  - "Claude Code's full source code (512k lines) leaked via an npm source map file, and attackers immediately exploited the window to inject a Remote Access Trojan into a malicious axios package."
  - "Google launched Gemma 4 under Apache 2.0 — four vision-capable reasoning models for edge and mobile, directly targeting Meta Llama's hold on open-model developers."
news:
  - category: "Models & Releases"
    color: "#3b82f6"
    items:
      - title: "Google Launches Gemma 4: Apache 2.0 Open Models for Edge AI"
        summary:
          - "Google DeepMind released Gemma 4 — four vision-capable reasoning models (2B, 4B, 31B, and a 26B-A4B MoE) under Apache 2.0, a major licence upgrade from previous Gemma restrictions."
          - "Built for autonomous agents on mobile, IoT, and personal computers, with native function calling and integrations across Android Studio, LiteRT, Vertex AI, GKE Agent Sandbox, and AICore Developer Preview."
          - "A new Gallery App on the Play Store lets anyone try an agentic Gemma experience offline — signalling Google's push to bring frontier AI to everyday devices."
        url: "https://deepmind.google/models/gemma/gemma-4/"
      - title: "Microsoft Launches MAI-Transcribe-1, MAI-Voice-1, and MAI-Image-2"
        summary:
          - "Microsoft AI (Mustafa Suleyman) launched three in-house foundational models: MAI-Transcribe-1 (beats OpenAI Whisper on 25 languages), MAI-Voice-1 (generates 60 seconds of audio in 1 second), and MAI-Image-2 (top-3 on Arena.ai image benchmarks)."
          - "All three were built by teams of under 10 engineers and are available via Microsoft Foundry and the MAI Playground — Suleyman's AI self-sufficiency push paying off."
          - "Already shipping inside Copilot Audio Expressions and Copilot Podcasts, extending the audio AI race that saw Cohere, Mistral, and Google all launch voice models in the past two weeks."
        url: "https://microsoft.ai/news/today-were-announcing-3-new-world-class-mai-models-available-in-foundry/"
      - title: "Microsoft Harrier-OSS-v1: SOTA Multilingual Embedding Family"
        summary:
          - "Microsoft released Harrier-OSS-v1, a family of open multilingual text embedding models (270M, 0.6B, 27B) hitting state-of-the-art on Multilingual MTEB v2."
          - "Uses a decoder-only architecture with last-token pooling and L2 normalisation; the 27B variant has 5,376 dimensions and supports 32K context."
          - "Released open-source, competing directly with Google's Gemini Embedding 2 (covered Mar 14) in the multilingual retrieval space."
        url: "https://huggingface.co/microsoft/harrier-oss-v1-27b"
      - title: "Google Veo 3.1 Lite: Same Speed as Fast, Under Half the Cost"
        summary:
          - "Google released Veo 3.1 Lite, its most cost-effective video generation model — under 50% the price of Veo 3.1 Fast at identical speed."
          - "Rounds out the Veo 3.1 family (Full, Fast, Lite), giving developers a clear tiered pricing structure for high-volume video applications."
          - "Arrives the same week as Google Lyria 3, Gemma 4, and MAI-Voice-1 — underscoring how rapidly the generative media model market is commoditising."
        url: "https://blog.google/innovation-and-ai/technology/ai/veo-3-1-lite/"
  - category: "People & Business"
    color: "#8b5cf6"
    items:
      - title: "OpenAI Raises $122 Billion — Largest AI Funding Round in History"
        summary:
          - "OpenAI closed a $122 billion funding round, the largest in AI history, to accelerate its next phase of frontier model development and infrastructure buildout."
          - "The raise comes as OpenAI crosses $25B ARR and pivots sharply toward coding tools and enterprise after dropping Sora and the Atlas browser project."
          - "Combined with Oracle's $156B AI capex commitment and Meta's $115B infrastructure spend, it signals a full-scale hyperscaler arms race with no signs of slowing."
        url: "https://openai.com/index/accelerating-the-next-phase-ai/"
      - title: "Oracle Cuts Thousands of Jobs to Fund $156B AI Buildout"
        summary:
          - "Oracle began layoffs affecting thousands of employees on March 31, with restructuring costs up to $2.1 billion — funded by $45-50B in new debt and equity raised in 2026 alone."
          - "The cuts free capital for Oracle's $156B AI data centre commitment, the largest infrastructure bet by any non-hyperscaler in AI history."
          - "Oracle's stock rose 2% on the announcement, reflecting a now-familiar pattern: investors reward AI infrastructure bets over headcount, continuing the trend set by Meta's 15k layoffs (covered Mar 15)."
        url: "https://www.cnbc.com/2026/03/31/oracle-layoffs-ai-spending.html"
      - title: "China Launches Automated Humanoid Robot Production Line — 10,000/Year"
        summary:
          - "An undisclosed Chinese manufacturer launched the first fully automated humanoid robot production line, capable of producing one robot every 30 minutes — 10,000 per year."
          - "UBTECH, AgiBot, and Unitree are now at similar output rates, signalling a step-change in Chinese humanoid robot manufacturing capacity."
          - "The announcement arrived the same week a US hospital CEO publicly declared readiness to replace radiologists with AI — two signals of AI-driven labour displacement converging."
        url: "https://www.reddit.com/r/singularity/comments/1s79p8i/china_announces_its_first_automated_manufacturing/"
  - category: "Policy & Ethics"
    color: "#f59e0b"
    items:
      - title: "Claude Code Source Leaked, Then Immediately Trojanised via npm"
        summary:
          - "Security researcher Chaofan Shou found Anthropic's full Claude Code CLI (1,900 files, 512k+ lines) exposed via a 60MB source map file left in the npm package — the second Anthropic security incident in one week after the Claude Mythos CMS leak (covered Mar 28)."
          - "Attackers exploited the window within hours, injecting a Remote Access Trojan into malicious axios versions (v1.14.1/0.30.4) in npm between 00:21–03:29 UTC March 31 — anyone who updated Claude Code during that window should rotate credentials immediately."
          - "Analysis of the leaked source revealed an ANTI_DISTILLATION_CC flag that silently injects fake tool definitions into API requests, frustration-detection regexes, and a hidden 'undercover mode' — giving researchers an unprecedented look inside a frontier coding agent."
        url: "https://alex000kim.com/posts/2026-03-31-claude-code-source-leak/"
      - title: "CEO of America's Largest Public Hospital Ready to Replace Radiologists with AI"
        summary:
          - "The CEO of America's largest public hospital system publicly stated he is ready to replace radiologists with AI, citing accuracy, speed, and cost advantages."
          - "The announcement is one of the most direct statements by a major health system executive about near-term AI-driven job displacement in a licensed medical profession."
          - "Coming alongside China's humanoid robot production line announcement, it marks a week where AI labour displacement moved from theory to operational planning."
        url: "https://radiologybusiness.com/topics/artificial-intelligence/ceo-americas-largest-public-hospital-system-says-hes-ready-replace-radiologists-ai"
  - category: "Products & Hardware"
    color: "#10b981"
    items:
      - title: "gstack: YC CEO Garry Tan Ships 600k Lines with This Claude Code Setup"
        summary:
          - "Garry Tan (President & CEO of Y Combinator) open-sourced gstack — 15 slash-command tools that turn Claude Code into a virtual engineering team: CEO, designer, eng manager, QA lead, security officer, and release engineer."
          - "Tan claims 10,000–20,000 lines of production code per day part-time, with 600k+ lines in 60 days across 3 projects — citing Peter Steinberger's OpenClaw (247k stars) as inspiration."
          - "The repo hit 54k+ stars within days of launch, extending the coding agent tooling wave that includes Everything Claude Code (90k stars, covered Mar 21) and OpenAI Codex Plugins."
        url: "https://github.com/garrytan/gstack"
      - title: "OpenAI Brings Plugins to Codex — And Publishes an Official Claude Code Plugin"
        summary:
          - "OpenAI launched a Plugins system for Codex — bundles of skills, MCP servers, and app integrations that mirror what Claude Code has offered for months, per Ars Technica."
          - "In a striking move, OpenAI simultaneously published an official Claude Code plugin (codex-plugin-cc) allowing Claude Code users to delegate tasks to Codex — the first cross-company coding agent integration."
          - "Together, the two announcements signal that coding agents are converging toward an interoperable ecosystem rather than walled gardens."
        url: "https://arstechnica.com/ai/2026/03/openai-brings-plugins-to-codex-closing-some-of-the-gap-with-claude-code/"
  - category: "Research & Resources"
    color: "#ec4899"
    items:
      - title: "PivotRL: NVIDIA's Agentic Post-Training with 4x Fewer Rollouts"
        summary:
          - "NVIDIA Research published PivotRL, a turn-level RL algorithm for post-training LLMs on long-horizon agentic tasks that matches full E2E RL accuracy with 4x fewer rollout turns."
          - "The key insight is Pivot Filtering — selecting only turns with high reward variance and low mean, maximising the training signal per compute dollar."
          - "Already deployed in production powering NVIDIA Nemotron-3-Super-120B-A12B, making this an immediately practical result for teams doing agentic post-training at scale."
        url: "https://arxiv.org/abs/2603.21383"
      - title: "Stanford CS25 Transformers Course Now Open to the Public"
        summary:
          - "Stanford's CS25 — the AI community's most-watched seminar series on Transformers and foundation models — is now fully open to the public for Spring 2026."
          - "Sessions run Thursdays at 4:30pm PDT via Zoom and in-person, with speakers confirmed from OpenAI, Anthropic, Google DeepMind, and NVIDIA."
          - "Free access to Stanford-quality frontier AI education; consistently one of the most-referenced course series on r/MachineLearning."
        url: "https://web.stanford.edu/class/cs25/"
      - title: "Andrew Ng's Context Hub: Stop Coding Agents Hallucinating APIs"
        summary:
          - "Context Hub (chub) is a CLI giving coding agents versioned, curated API docs so they stop hallucinating library interfaces mid-task — 7k+ stars on launch."
          - "Agents annotate documentation gaps locally and vote docs up or down, feeding improvements back to maintainers over time."
          - "Works with Claude Code, Codex, and any agent harness as a simple skill or SKILL.md integration — a natural companion to gstack and Everything Claude Code."
        url: "https://github.com/andrewyng/context-hub"
---
