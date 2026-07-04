---
title: "AI Weekly: Fable 5 Returns, GPT-5.6 Previews, Sonnet 5 Goes Agentic"
date: 2026-07-05
week_start: "2026-06-22"
week_end: "2026-07-05"
draft: false
highlights:
  - "Fable 5 and Mythos 5 return globally after US lifts export controls, with Anthropic, Amazon, Microsoft, and Google jointly proposing an industry-wide jailbreak severity framework."
  - "OpenAI previews GPT-5.6 Sol in a first-ever government-coordinated limited launch, topping Terminal-Bench 2.1 and introducing ultra mode with multi-subagent orchestration."
  - "Claude Sonnet 5 launches as the most agentic Sonnet to date, closing the gap with Opus 4.8 at a fraction of the cost, and becomes the new default for Free and Pro users."
news:
  - category: "Models & Releases"
    color: "#3b82f6"
    items:
      - title: "GPT-5.6 Sol: Government-Coordinated Limited Preview"
        summary:
          - "OpenAI previews the GPT-5.6 series — Sol (flagship), Terra (2× cheaper than 5.5), and Luna (lowest cost) — in a limited launch coordinated in advance with the US government before broad rollout in coming weeks."
          - "Sol sets a new SOTA on Terminal-Bench 2.1 (command-line agentic workflows) and GeneBench v1, and introduces max reasoning effort plus an *ultra mode* that leverages multiple subagents to tackle complex work in parallel."
          - "Launched alongside the Daybreak cyber suite with the strongest safeguards to date; OpenAI stated this government-preview approach should not become the long-term default but is a short-term step toward broader access."
        url: "https://openai.com/index/previewing-gpt-5-6-sol/"
      - title: "Claude Sonnet 5: Near-Opus Performance for Agents"
        summary:
          - "Anthropic launched Claude Sonnet 5 on June 30 as its most agentic Sonnet yet — closing the performance gap with Opus 4.8 on BrowseComp and OSWorld-Verified while offering better cost efficiency."
          - "It is now the default model for Free and Pro plans, available across Claude Code and the Claude Platform at introductory pricing of $2/$10 per million tokens through August 31, 2026."
          - "Early partners reported it completes multi-step tasks (Salesforce tier updates + launch emails end-to-end, complex GitHub PRs) where previous Sonnet models would stop short, and proactively checks its own output."
        url: "https://www.anthropic.com/news/claude-sonnet-5"
      - title: "Gemini 3.5 Flash Gets Native Computer Use"
        summary:
          - "Google DeepMind integrated computer use natively into Gemini 3.5 Flash on June 24, enabling agents that can see, reason, and act across browser, mobile, and desktop environments without a separate model."
          - "Targeted adversarial training mitigates prompt-injection risks; two optional enterprise safeguards allow requiring confirmation for irreversible actions and auto-stopping on indirect injection detection."
          - "Available via the Gemini API and Gemini Enterprise Agent Platform; Browserbase is providing a public demo environment for developers to test immediately."
        url: "https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-computer-use-gemini-3-5-flash/"
      - title: "Gemma 4 12B Runs Locally on 16 GB Laptops"
        summary:
          - "Google released Gemma 4 12B as part of its June AI roundup — a locally runnable open model with a unified architecture combining vision and native voice in a single system on everyday 16 GB hardware."
          - "Also released: Gemini Omni Flash (any-modality input/output, now in API public preview) and Nano Banana 2 Lite (fastest and cheapest Gemini Image model), both extending the agentic video and image developer stack."
          - "Android 17 also launched, with floating app windows, Screen Reactions for pip recording, and biometric remote phone-lock as part of the same June product wave."
        url: "https://blog.google/innovation-and-ai/technology/developers-tools/introducing-gemma-4-12b/"
  - category: "People & Business"
    color: "#8b5cf6"
    items:
      - title: "Agents Become the Primary AI Tool at OpenAI"
        summary:
          - "OpenAI published data showing Codex now accounts for 99.8% of weekly output tokens generated within the company, with every department — including Legal and Recruiting — switching to agents as their primary AI tool by April 2026."
          - "By May 2026, 80.6% of individual users had made at least one Codex request estimated to require over 30 minutes of human work, and non-developer adoption had grown 137× since August 2025."
          - "The report frames the shift as the beginning of a broader enterprise transformation from single-interaction chatbots to delegated, long-horizon agentic tasks, with coding now routinely done by non-engineers."
        url: "https://openai.com/index/how-agents-are-transforming-work/"
  - category: "Policy & Ethics"
    color: "#f59e0b"
    items:
      - title: "Fable 5 Restored; Industry Jailbreak Severity Framework Proposed"
        summary:
          - "US export controls on Claude Fable 5 and Mythos 5 were lifted June 30 after the government accepted Anthropic's evidence that the reported jailbreak offered no unique capability beyond what Claude Haiku 4.5, Sonnet 4.6, GPT-5.5, and Kimi K2.7 could already produce; Fable 5 returned globally on July 1, Mythos 5 restored to US Glasswing partners (approved June 26). See the [original suspension](/newsletter/2026-06-14/)."
          - "Anthropic, Amazon, Microsoft, Google, and Glasswing partners are jointly developing a shared jailbreak severity framework with four criteria: Capability Gain, Breadth of Capability Gain, Ease of Weaponization, and Discoverability — intended to give AI developers a consistent triage standard and help communicate risk to government."
          - "Additional commitments include a new HackerOne program for Fable 5 cyber jailbreak submissions, pre-release government testing access, rapid jailbreak information sharing, and joint development of a common industry evaluation standard."
        url: "https://www.anthropic.com/news/redeploying-fable-5"
  - category: "Products & Hardware"
    color: "#10b981"
    items:
      - title: "Claude Tag: @Claude Joins Your Slack as a Teammate"
        summary:
          - "Anthropic launched Claude Tag on June 23 for Slack — Claude joins channels as a persistent team member with shared context, responding when @tagged and proactively surfacing relevant updates in ambient mode."
          - "It is multiplayer (one Claude per channel; anyone can hand off mid-conversation), learns from channel history, and can schedule tasks to run autonomously over hours or days without prompting."
          - "65% of Anthropic's own product team code is now generated by an internal version of Claude Tag; beta is live for Claude Enterprise and Team customers, with broader platform expansion planned."
        url: "https://www.anthropic.com/news/introducing-claude-tag"
      - title: "OpenAI Daybreak: GPT-5.5-Cyber, Codex Security, Patch the Planet"
        summary:
          - "OpenAI expanded Daybreak with the full release of GPT-5.5-Cyber (85.6% on CyberGym vs 81.8% for GPT-5.5), an updated Codex Security plugin that has scanned 30 million commits across 30,000+ codebases since March."
          - "Patch the Planet, co-founded with Trail of Bits and HackerOne, recruits open-source maintainers to move from vulnerability findings to fixes; initial participants include cURL, Go, Python, Sigstore, and pyca/cryptography."
          - "The strategic framing: AI has shifted the bottleneck in cybersecurity from *finding* vulnerabilities to *patching* them, and Daybreak aims to democratize patching at machine speed for defenders worldwide."
        url: "https://openai.com/index/daybreak-securing-the-world/"
      - title: "OpenAI and Broadcom Unveil Jalapeño Inference Chip"
        summary:
          - "OpenAI and Broadcom unveiled Jalapeño, OpenAI's first Intelligence Processor — a blank-slate LLM inference accelerator designed around OpenAI's deep understanding of LLM kernels, memory movement, and serving patterns."
          - "Engineered samples are already running GPT-5.3-Codex-Spark at production frequency; early testing shows performance-per-watt substantially better than current SOTA, with a full technical report due in coming months."
          - "The chip is the first in a multi-generation compute platform built with Broadcom and Celestica for gigawatt-scale data center deployment with Microsoft and partners beginning in 2026."
        url: "https://openai.com/index/openai-broadcom-jalapeno-inference-chip/"
  - category: "Research & Resources"
    color: "#ec4899"
    items:
      - title: "Claude Science: AI Workbench for Computational Biology"
        summary:
          - "Anthropic launched Claude Science on June 30 as a unified research environment that integrates PubMed, Jupyter, R, cluster terminals, and HPC login nodes, with 60+ curated skills and connectors for genomics, single-cell analysis, proteomics, structural biology, and cheminformatics."
          - "Every output carries an auditable history — figures include the exact code, environment, and message history that created them; a reviewer agent independently checks citations and calculations."
          - "Claude Science is in beta for Pro/Max/Team/Enterprise users; Anthropic is also offering AI for Science grants (up to 50 projects, up to $30K credits each) with applications open through July 15, 2026."
        url: "https://www.anthropic.com/news/claude-science-ai-workbench"
      - title: "OpenAI Releases GeneBench-Pro Research Benchmark"
        summary:
          - "GeneBench-Pro is a 129-question research-level benchmark across 10 domains of computational biology, testing whether models can make the judgment-heavy 'research taste' decisions that real-world science requires — handling ambiguity, revising assumptions, and choosing the right analysis path."
          - "Problems are constructed synthetically (known causal structure, simulated data-generating process), eliminating the common benchmark failure of arbitrary author-choice shortcuts; 82 of 129 questions were externally verified."
          - "GPT-5.6 Sol showed strong improvements on GeneBench v1 at the time of the Sol preview, positioning computational biology as a key frontier capability domain alongside cybersecurity and coding."
        url: "https://openai.com/index/introducing-genebench-pro/"
      - title: "Anthropic Economic Index: AI Mirrors Daily Human Rhythms"
        summary:
          - "The June 2026 Economic Index introduced hourly-granularity sampling and an output classifier distinguishing chat from agentic Cowork sessions, revealing that Claude usage precisely mirrors human schedules: sleep advice peaks at 5 am, recipes at 6 pm, tax queries surge before April 15."
          - "Personal use climbs from ~35% on weekdays to ~50% on weekends, with the shift largest in high-income countries; the first Economic Index Survey shows that the most automation-heavy Claude users are simultaneously the most optimistic about AI's impact on pay, job security, and meaning."
          - "Anthropic notes the shift from chat transcripts to long-running agentic sessions as the new primary unit of AI economic activity, updating its data pipeline to reflect how Claude Code and Cowork have changed what 'a Claude session' means."
        url: "https://www.anthropic.com/research/economic-index-june-2026-report"
---
