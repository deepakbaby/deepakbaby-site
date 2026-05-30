---
title: "AI Weekly: Anthropic Hits $965B, Opus 4.8 Rewrites Agent Benchmarks"
date: 2026-05-31
week_start: "2026-05-25"
week_end: "2026-05-31"
draft: false
highlights:
  - "Anthropic raised $65B at a $965B valuation — nearly a trillion-dollar company — while ARR crossed $47B, up from $12B just three months ago."
  - "Claude Opus 4.8 launched with Dynamic Workflows enabling hundreds of parallel subagents, becoming the only model to complete every case on the Super-Agent benchmark."
  - "DeepMind CEO Demis Hassabis declared humanity stands in the 'foothills of the singularity' with AGI potentially 4 years away, as industry leaders publicly challenged the AI layoff narrative."
news:
  - category: "Models & Releases"
    color: "#3b82f6"
    items:
      - title: "Claude Opus 4.8: Super-Agent Benchmark, Dynamic Workflows"
        summary:
          - "Anthropic released Opus 4.8 at the same price as 4.7 — it's the only model to complete every case on the Super-Agent benchmark end-to-end, hitting 84% on Online-Mind2Web and a new high on Legal Agent Benchmark (first to break 10% all-pass)."
          - "Alignment improvements are significant: 4× less likely to let code flaws pass unremarked, lower misaligned behavior than 4.7, and new highs on prosocial traits; Mythos-class models are flagged for general release 'in coming weeks'."
          - "New capabilities shipping alongside: Dynamic Workflows (hundreds of parallel subagents in one Claude Code session for codebase-scale migrations), Effort Control in claude.ai (low/default/extra/max), and mid-task system entries via Messages API without breaking prompt cache."
        url: "https://www.anthropic.com/news/claude-opus-4-8"
      - title: "StepFun 3.7 Flash: 196B MoE Beats Flash Tier, Runs on 128GB RAM"
        summary:
          - "StepFun dropped Step 3.7 Flash — a 196B total / 11B active MoE with built-in 1.8B ViT for vision — that outperforms DeepSeek V4 Flash (56.26% vs 55.6%) and Gemini 3.5 Flash on SWE-Bench Pro."
          - "The model runs fully locally on 128GB RAM, making it one of the few flash-tier competitors accessible to prosumer hardware; it also scores 92.82% F1 on DeepSearchQA, approaching GPT-5.5's 93.98%."
          - "Available now on OpenRouter and NVIDIA NIM for cloud inference; the local option challenges the assumption that frontier-competitive MoE models require datacenter hardware."
        url: "https://static.stepfun.com/blog/step-3.7-flash/"
      - title: "Gemini Omni Flash: Any-Modality Output Now in APIs"
        summary:
          - "Google officially launched Gemini Omni Flash at I/O 2026 (May 19), rolling out to developers and enterprise via APIs in coming weeks — the model generates outputs in any modality from any input, starting with video, then image and text."
          - "It combines Gemini intelligence with Veo generative media technology, and is available in the Gemini app, Google Flow, and YouTube Shorts; Gemini 3.5 Flash also launched at 4× the speed of comparable frontier models at under half the cost."
          - "The launch follows the Google I/O 2026 preview [covered in the May 24 edition](/newsletter/2026-05-24/), representing the shift from leaked demo to developer-accessible product."
        url: "https://blog.google/innovation-and-ai/sundar-pichai-io-2026/"
  - category: "People & Business"
    color: "#8b5cf6"
    items:
      - title: "Anthropic Raises $65B Series H at $965B Valuation"
        summary:
          - "Anthropic closed a $65B Series H led by Altimeter, Dragoneer, Greenoaks, and Sequoia — pushing its post-money valuation to $965B and making it the world's most valuable private AI company; ARR crossed $47B in May, up from ~$12B at the [February Series G](/newsletter/2026-05-03/)."
          - "The round includes strategic chip and memory partners Micron, Samsung, and SK hynix, plus $15B of previously committed hyperscaler investments (including $5B from Amazon); compute commitments span Amazon (5GW), Google+Broadcom (5GW next-gen TPU from 2027), and SpaceX Colossus 1 and 2."
          - "Claude is now available across all three major clouds — AWS (primary), Google Cloud, and Azure — with funds earmarked for safety/interpretability research, compute expansion, and product partnerships."
        url: "https://www.anthropic.com/news/series-h"
      - title: "Mistral Announces Physics AI Stack for Airbus, BMW, ASML"
        summary:
          - "At the AI Now Summit (May 28), Mistral unveiled a physics AI stack for industrial engineering built on its May 22 acquisition of Emmi; partners include Airbus (across commercial, helicopter, defence, and space divisions), BMW Group (crash simulation Large Industry Model), and ASML (semiconductor design optimisation)."
          - "Mistral also announced Les Ulis — a 10MW inference data center in Essonne, France opening Q3 2026, its first owned compute infrastructure — reinforcing its sovereign AI and full data-control positioning."
          - "The industrial pivot and owned compute represent a significant strategic evolution for Mistral, complementing [Vibe's consumer/developer rebranding](#) announced the same day."
        url: "https://mistral.ai/news/ai-now-summit-2026/"
      - title: "Jensen Huang and Hassabis Push Back on AI Layoff Narrative"
        summary:
          - "NVIDIA CEO Jensen Huang called CEOs blaming layoffs on AI 'irresponsible' and 'lazy,' telling Channel NewsAsia 'AI has just arrived, how is it possible they're already losing jobs?' — echoing Google DeepMind CEO Demis Hassabis, who called AI-driven developer layoffs a 'lack of imagination' from employers."
          - "Analysis suggests the real driver for many companies is capital reallocation to GPU budgets rather than genuine AI displacement; cited evidence includes 80% of companies that cut jobs for AI seeing zero improvement in returns, Klarna firing 700 then quietly rehiring, and 29% of employees at AI-layoff companies actively sabotaging adoption."
          - "The narrative connects directly to the [Meta 8,000 and Coinbase 14% layoff stories from prior editions](/newsletter/2026-05-24/), where AI was explicitly cited as justification even as broader strategic pivots drove the decisions."
        url: "https://www.thestateofbrand.com/news/jensen-huang-ai-layoffs"
      - title: "Hassabis: AGI in 4 Years, 'Foothills of the Singularity'"
        summary:
          - "Google DeepMind CEO Demis Hassabis said at and after Google I/O 2026 that humanity stands in the 'foothills of the singularity,' with AGI potentially arriving within 4 years — or sooner — citing growing confidence the industry has found the right technical path."
          - "Hassabis also stated the industry has only a few years left to prepare for AGI, framing the current moment as a critical window for safety, governance, and societal readiness work."
          - "The statement is the most specific AGI timeline claim from a major lab CEO in 2026, and was reported in detail by both [Axios](https://www.axios.com/2026/05/26/deepmind-ceo-demis-hassabis) and [MIT Technology Review](https://www.technologyreview.com/)."
        url: "https://www.axios.com/2026/05/26/deepmind-ceo-demis-hassabis"
      - title: "Meta Launches Paid Tiers for Instagram, Facebook, WhatsApp"
        summary:
          - "Meta officially launched Plus subscriptions globally — Instagram Plus ($3.99/mo), Facebook Plus ($3.99/mo), WhatsApp Plus ($2.99/mo) — alongside AI plans under the 'Meta One' brand: Meta One Plus ($7.99/mo) and Meta One Premium ($19.99/mo) with deeper compute/reasoning and expanded image/video generation."
          - "AI plan testing starts next month in Singapore, Guatemala, and Bolivia; the proprietary model powering the AI tier is Muse Spark, from Meta Superintelligence Labs and Alexandr Wang — [first launched in April](/newsletter/2026-04-11/)."
          - "The monetization push marks a structural shift for Meta's consumer apps, which have been ad-only for two decades, and signals that frontier AI features will be paywalled even on mass-market platforms."
        url: "https://techcrunch.com/2026/05/27/meta-officially-launches-instagram-facebook-and-whatsapp-subscriptions-with-more-to-come-including-ai-plans/"
  - category: "Policy & Ethics"
    color: "#f59e0b"
    items:
      - title: "BadHost CVE-2026-48710: Critical Vuln Hits Millions of AI Agents"
        summary:
          - "CVE-2026-48710 ('BadHost') is a critical vulnerability in Starlette (325M downloads/week, the base of FastAPI) — a single HTTP Host header injection bypasses path-based authorization, threatening vLLM, LiteLLM, Text Generation Inference, MCP servers, agent harnesses, eval dashboards, and model-management UIs."
          - "Discoverers say the CVSS 7.0 rating is 'critically understated'; the patch is Starlette 1.0.1 released May 29, and an online scanner is available at mcp-scan.nemesis.services."
          - "BadHost continues the [AI supply chain security thread from April–May editions](/newsletter/2026-05-10/), highlighting that the infrastructure layer running AI workloads carries its own growing attack surface."
        url: "https://arstechnica.com/information-technology/2026/05/millions-of-ai-agents-imperiled-by-critical-vulnerability-in-open-source-package/"
      - title: "OpenAI Rosalind Biodefense Program Opens to Developers and US Gov"
        summary:
          - "OpenAI opened its Rosalind Biodefense program — trusted developers can now apply to build biodefense and pandemic preparedness applications using GPT-Rosalind, OpenAI's frontier reasoning model for life sciences; access is also expanding to US government and allied partners."
          - "Launch partners include Fourth Eon Biosecurity (DNA synthesis screening), Lawrence Livermore National Laboratory (medical countermeasures), Johns Hopkins APL (protein-engineering platform), and CEPI (100 Days Mission, Ebola preparedness)."
          - "The program is global and open to academic, nonprofit, government, and mission-driven companies — distinct from [GPT-Rosalind's initial introduction in the April 18 edition](/newsletter/2026-04-18/) as a research model, this marks its transition to a structured access and partner program."
        url: "https://openai.com/index/strengthening-societal-resilience-with-rosalind-biodefense/"
  - category: "Products & Hardware"
    color: "#10b981"
    items:
      - title: "Mistral Vibe: Le Chat Reborn as Unified Work + Code Agent"
        summary:
          - "Mistral rebranded Le Chat as Vibe — a unified agent for work and code; Work Mode delivers long-horizon productivity with enterprise knowledge search (Google Workspace, Outlook, SharePoint, Slack, GitHub), document synthesis, and reusable skills via open standards; Code Mode at code.mistral.ai ships GitHub-integrated coding agents with reviewable PRs."
          - "New developer additions include a VS Code extension with side-panel agent, and Vibe CLI updates: /teleport (move live session between terminal and cloud), session-scoped permissions, editable agent plans, and custom subagents."
          - "Pricing spans Free to Enterprise ($24.99/user/mo for Team); all existing Le Chat plans, history, and settings carry over — the rebrand positions Mistral directly against [Codex](https://openai.com/index/building-self-improving-tax-agents-with-codex/) and Claude Code in the coding agent wars."
        url: "https://mistral.ai/news/vibe-agent/"
      - title: "OpenAI Codex Agents Self-Improve on Tax Filing, Cut Time 60%"
        summary:
          - "OpenAI published an engineering deep-dive showing how Codex agents can be built to self-improve on tax filing tasks — a feedback loop where agents evaluate their outputs against test cases and iteratively refine their code, cutting filing time by 60%."
          - "The system demonstrates a concrete vertical use-case for agentic coding beyond software development, with self-evaluation driving improvement rather than human-in-the-loop correction at each step."
          - "The post extends the [Codex agentic expansion thread](/newsletter/2026-05-17/) that began with Codex mobile/desktop and continues with domain-specific deployments across legal, finance, and compliance."
        url: "https://openai.com/index/building-self-improving-tax-agents-with-codex/"
  - category: "Research & Resources"
    color: "#ec4899"
    items:
      - title: "SkillOpt: Microsoft Research Trains Agent Skills Like Neural Weights"
        summary:
          - "Microsoft Research introduced SkillOpt — the first systematic optimizer for agent skill documents, treating the skill text as an external trainable state; a separate optimizer model converts scored rollouts into bounded add/delete/replace edits on a skill document, only accepting edits that strictly improve a held-out validation score."
          - "Results across 6 benchmarks, 7 models, and 3 harnesses (direct chat, Codex, Claude Code): best or tied on all 52 evaluated cells; on GPT-5.5, no-skill accuracy lifted +23.5 points (direct chat), +24.8 (Codex), +19.1 (Claude Code), with optimized skills transferring across model scales."
          - "The textual learning-rate budget, rejected-edit buffer, and epoch-wise meta updates make skill training stable with zero extra inference calls at deployment; code is open at [aka.ms/skillopt](https://aka.ms/skillopt)."
        url: "https://arxiv.org/abs/2605.23904"
      - title: "NVIDIA LocateAnything: 10x Faster Visual Grounding via Parallel Box Decoding"
        summary:
          - "NVIDIA Research introduced LocateAnything with Parallel Box Decoding (PBD), which decodes the full bounding box (x1,y1,x2,y2) as a single atomic step rather than token-by-token — delivering 12.7 boxes/sec on H100, 10× faster than Qwen3-VL and 2.5× faster than Rex-Omni."
          - "The model achieves SOTA on ScreenSpot-Pro GUI grounding (60.3 mean F1), DocLayNet (76.8), and LVIS dense detection; trained on LocateAnything-Data with 138M samples, 785M boxes, and 12M images covering detection, GUI grounding, OCR, layout, and referring comprehension."
          - "Three inference modes (Fast/Slow/Hybrid) make it suitable for robotics, on-device GUI agents, and document understanding; the architecture is built on Moon-ViT + Qwen2.5 backbone."
        url: "https://research.nvidia.com/labs/lpr/locate-anything/"
      - title: "PrismML Bonsai Image 4B: 1-bit Diffusion Runs in Browser via WebGPU"
        summary:
          - "PrismML released Bonsai Image 4B in binary and ternary variants — 1-bit/ternary text-to-image diffusion transformers that weigh only ~3GB versus FLUX.2 Klein 4B's ~16GB, making local deployment dramatically more accessible."
          - "The model runs 100% in-browser via WebGPU with a live demo at [huggingface.co/spaces/webml-community/bonsai-image-webgpu](https://huggingface.co/spaces/webml-community/bonsai-image-webgpu), no install required."
          - "Apache 2.0 licensed and trending on r/LocalLLaMA, Bonsai Image represents the latest push in the [extreme local inference thread](/newsletter/2026-05-17/) — bringing frontier-quality generation to commodity hardware and even browsers."
        url: "https://huggingface.co/collections/prism-ml/bonsai-image"
---
