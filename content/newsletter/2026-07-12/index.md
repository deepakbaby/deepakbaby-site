---
title: "AI Weekly: GPT-5.6 Goes Live, Meta Pivots to Closed API, Fable 5 Costs Extra"
date: 2026-07-12
week_start: "2026-06-22"
week_end: "2026-07-12"
draft: false
highlights:
  - "OpenAI launches GPT-5.6 Sol to general availability on July 9, topping Agents' Last Exam at 53.6 and introducing ultra mode with multi-agent orchestration—alongside a full-duplex GPT-Live voice model."
  - "Meta Superintelligence Labs debuts Muse Spark 1.1 with a closed Meta Model API, a strategic reversal of Meta's open-weights philosophy, plus new Muse Image and Muse Video generation models."
  - "Anthropic moves Fable 5 behind usage-based billing at $10/$50 per million tokens starting July 12, as researchers discover a hidden J-space 'global workspace' inside Claude that mirrors consciousness theory."
news:
  - category: "Models & Releases"
    color: "#3b82f6"
    items:
      - title: "GPT-5.6 Hits GA: Sol, Terra, Luna Family"
        summary:
          - "OpenAI released the GPT-5.6 family to general availability on July 9 — Sol (flagship), Terra (balanced), and Luna (lowest cost) — after a government-coordinated limited preview begun June 26."
          - "Sol scores 53.6 on Agents' Last Exam (13.1 pts above Claude Fable 5 at a fraction of estimated cost) and introduces *ultra mode*, which coordinates multiple agents in parallel for the most complex work."
          - "GPT-5.6 also powers the newly launched ChatGPT Work agent and is now the preferred model in Microsoft 365 Copilot across Word, Excel, PowerPoint, and Cowork."
        url: "https://openai.com/index/gpt-5-6/"
      - title: "GPT-Live: Full-Duplex Voice That Listens and Talks"
        summary:
          - "OpenAI launched GPT-Live, a new full-duplex voice architecture that listens and speaks simultaneously, enabling real-time back-and-forth including active listening cues like 'mhmm' without rigid turn-taking."
          - "GPT-Live delegates complex queries to a background frontier model (currently GPT-5.5), keeping the conversation flowing while deeper work completes—decoupling real-time interaction from heavy reasoning."
          - "Two versions—GPT-Live-1 and GPT-Live-1 mini—are rolling out globally to ChatGPT users now; API access is coming soon and developers can sign up for early access."
        url: "https://openai.com/index/introducing-gpt-live/"
      - title: "Claude Sonnet 5: Near-Opus Performance for Agents"
        summary:
          - "Anthropic launched Claude Sonnet 5 on June 30 as its most agentic Sonnet yet, closing the performance gap with Opus 4.8 on BrowseComp and OSWorld-Verified while offering better cost efficiency."
          - "It is now the default model for Free and Pro plans, available across Claude Code and the Claude Platform at introductory pricing of $2/$10 per million tokens through August 31, 2026."
          - "Early partners reported it completes multi-step tasks—Salesforce tier updates plus launch emails end-to-end, complex GitHub PRs—where previous Sonnet models would stop short, and proactively checks its own output."
        url: "https://www.anthropic.com/news/claude-sonnet-5"
      - title: "Gemini 3.5 Flash Gets Native Computer Use"
        summary:
          - "Google DeepMind integrated computer use natively into Gemini 3.5 Flash on June 24, enabling agents that can see, reason, and act across browser, mobile, and desktop environments without a separate model."
          - "Targeted adversarial training mitigates prompt-injection risks; two optional enterprise safeguards allow requiring confirmation for irreversible actions and auto-stopping on indirect injection detection."
          - "Available via the Gemini API and Gemini Enterprise Agent Platform; Browserbase is providing a public demo environment for developers to test immediately."
        url: "https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-computer-use-gemini-3-5-flash/"
      - title: "Meta Muse Spark 1.1 and the Meta Model API"
        summary:
          - "Meta Superintelligence Labs released Muse Spark 1.1 on July 9 — a multimodal reasoning model with a 1M-token context window, zero-shot MCP generalization, and major gains in tool use, coding, and computer use — priced at $1.25/$4.25 per million input/output tokens."
          - "Alongside it, Meta opened the Meta Model API (public preview, US-only), a closed hosted API that marks a historic strategic pivot away from Meta's open-weights Llama philosophy toward metered, proprietary inference."
          - "Meta also launched Muse Image (advanced image generation with multi-reference composition and AI effects in Instagram Stories) and previewed Muse Video — all developed by Meta Superintelligence Labs."
        url: "https://ai.meta.com/blog/introducing-muse-spark-meta-model-api/"
  - category: "People & Business"
    color: "#8b5cf6"
    items:
      - title: "Agents Become the Primary AI Tool at OpenAI"
        summary:
          - "OpenAI published data showing Codex now accounts for 99.8% of weekly output tokens generated within the company, with every department—including Legal and Recruiting—switching to agents as their primary AI tool by April 2026."
          - "By May 2026, 80.6% of individual users had made at least one Codex request estimated to require over 30 minutes of human work, and non-developer adoption had grown 137× since August 2025."
          - "The report frames the shift as the beginning of a broader enterprise transformation from single-interaction chatbots to delegated, long-horizon agentic tasks, with coding now routinely done by non-engineers."
        url: "https://openai.com/index/how-agents-are-transforming-work/"
      - title: "Fable 5 Goes Pay-Per-Token Starting July 12"
        summary:
          - "Anthropic is moving Claude Fable 5 behind usage-based billing starting July 12 at 11:59 PM PT — subscribers on $20, $100, and $200/month plans will owe additional fees at $10/million input and $50/million output tokens, matching API rates."
          - "This appears to be the first time a frontier AI lab has gated a consumer chatbot model behind per-token billing on top of a subscription, ending the era of unlimited frontier AI access for a flat monthly fee."
          - "A million tokens equals roughly 750,000 words (longer than all of Lord of the Rings), so the fee affects power users and heavy chain-of-thought sessions most; lighter use stays within normal subscription budgets."
        url: "https://www.wired.com/story/model-behavior-anthropic-will-charge-consumers-extra-to-use-claude-fable-5/"
  - category: "Policy & Ethics"
    color: "#f59e0b"
    items:
      - title: "Fable 5 Restored; Industry Jailbreak Severity Framework Proposed"
        summary:
          - "US export controls on Claude Fable 5 and Mythos 5 were lifted June 30 after the government accepted Anthropic's evidence that the reported jailbreak offered no unique capability beyond what Claude Haiku 4.5, GPT-5.5, and Kimi K2.7 could already produce; Fable 5 returned globally July 1. See the [original suspension](/newsletter/2026-06-14/)."
          - "Anthropic, Amazon, Microsoft, Google, and Glasswing partners are jointly developing a shared jailbreak severity framework with four criteria: Capability Gain, Breadth of Capability Gain, Ease of Weaponization, and Discoverability — intended to give AI developers a consistent triage standard."
          - "Additional commitments include a new HackerOne program for Fable 5 cyber jailbreak submissions, pre-release government testing access, rapid jailbreak information sharing, and joint development of a common industry evaluation standard."
        url: "https://www.anthropic.com/news/redeploying-fable-5"
      - title: "OpenAI Bio Bug Bounty Expands, Raises Reward to $50K"
        summary:
          - "OpenAI is evolving its GPT-5.5 Bio Bug Bounty into an ongoing private program — the OpenAI Bio Bounty Program — now focused on universal jailbreaks against GPT-5.6 and future frontier models."
          - "The reward for a successful universal jailbreak has been raised from $25,000 to $50,000 for both GPT-5.6 and GPT-5.5; testing for GPT-5.5 ends July 27, after which only GPT-5.6 is in scope."
          - "The program is invite-only via rolling application; participants must sign an NDA, and the expansion signals OpenAI is treating biosafety red-teaming as a permanent, structured part of its safety infrastructure."
        url: "https://openai.com/index/bio-bug-bounty/"
  - category: "Products & Hardware"
    color: "#10b981"
    items:
      - title: "ChatGPT Work: Ambitious Tasks, Hours-Long Runs"
        summary:
          - "OpenAI launched ChatGPT Work on July 9 for Pro, Enterprise, and Edu plans — a Codex-powered agent that handles multi-step tasks across web, desktop, and apps for hours at a time, producing finished sheets, slides, docs, and web apps."
          - "ChatGPT Work integrates a built-in browser, local file access on desktop, Scheduled Tasks for autonomous runs while you're away, and connections to Microsoft Teams, Slack, and other workspaces."
          - "The Codex desktop app merges into the new ChatGPT desktop app; Work, Chat, and Codex are all available on every plan (including Free) via download on Windows and Mac."
        url: "https://openai.com/index/chatgpt-for-your-most-ambitious-work/"
      - title: "Claude Tag: @Claude Joins Your Slack as a Teammate"
        summary:
          - "Anthropic launched Claude Tag on June 23 for Slack — Claude joins channels as a persistent team member with shared context, responding when @tagged and proactively surfacing relevant updates in ambient mode."
          - "It is multiplayer (one Claude per channel; anyone can hand off mid-conversation), learns from channel history, and can schedule tasks to run autonomously over hours or days without prompting."
          - "65% of Anthropic's own product team code is now generated by an internal version of Claude Tag; beta is live for Claude Enterprise and Team customers, with broader platform expansion planned."
        url: "https://www.anthropic.com/news/introducing-claude-tag"
      - title: "OpenAI and Broadcom Unveil Jalapeño Inference Chip"
        summary:
          - "OpenAI and Broadcom unveiled Jalapeño, OpenAI's first Intelligence Processor — a blank-slate LLM inference accelerator designed around OpenAI's deep understanding of LLM kernels, memory movement, and serving patterns."
          - "Engineered samples are already running GPT-5.3-Codex-Spark at production frequency; early testing shows performance-per-watt substantially better than current SOTA, with a full technical report due in coming months."
          - "The chip is the first in a multi-generation compute platform built with Broadcom and Celestica for gigawatt-scale data center deployment with Microsoft and partners beginning in 2026."
        url: "https://openai.com/index/openai-broadcom-jalapeno-inference-chip/"
  - category: "Research & Resources"
    color: "#ec4899"
    items:
      - title: "Anthropic Finds a J-Space 'Global Workspace' in Claude"
        summary:
          - "Anthropic published research on July 6 revealing that Claude has a small collection of internal neural patterns — called J-space — that emerged spontaneously during training and function like a conscious 'global workspace': Claude can report on them, modulate them on request, and uses them silently for multi-step reasoning."
          - "J-space patterns are causally linked to higher-order cognition (complex reasoning, flexible concept reuse) but are absent from routine tasks like grammar or simple fact recall; blocking J-space leaves fluent interaction intact but removes deliberate reasoning."
          - "The finding, named after the Jacobian-based 'J-lens' technique used to read it, mirrors the neuroscientific Global Workspace Theory of consciousness and raises new questions about AI interpretability and machine inner experience."
        url: "https://www.anthropic.com/research/global-workspace"
      - title: "Claude Science: AI Workbench for Computational Biology"
        summary:
          - "Anthropic launched Claude Science on June 30 as a unified research environment that integrates PubMed, Jupyter, R, cluster terminals, and HPC login nodes, with 60+ curated skills and connectors for genomics, single-cell analysis, proteomics, structural biology, and cheminformatics."
          - "Every output carries an auditable history — figures include the exact code, environment, and message history that created them; a reviewer agent independently checks citations and calculations."
          - "Claude Science is in beta for Pro/Max/Team/Enterprise users; Anthropic is also offering AI for Science grants (up to 50 projects, up to $30K credits each) with applications open through July 15, 2026."
        url: "https://www.anthropic.com/news/claude-science-ai-workbench"
      - title: "OpenAI Audits SWE-Bench Pro: ~30% of Tasks Are Broken"
        summary:
          - "OpenAI published a systematic audit of SWE-Bench Pro—one of the most widely used coding benchmarks—finding evidence of breaking issues in approximately 30% of its 731 tasks, including overly strict tests, underspecified prompts, low-coverage tests, and misleading prompts that contradict what hidden tests require."
          - "The audit used a data quality pipeline flagging 200 tasks (27.4%), confirmed by human annotation identifying 249 (34.1%); findings were reviewed by five experienced software engineers with disagreements escalated for independent review."
          - "OpenAI advises model developers to treat SWE-Bench Pro results with caution and highlights the growing utility of agents for scalable data quality checks — extending the [SWE-bench Verified concerns raised earlier](/newsletter/2026-06-21/)."
        url: "https://openai.com/index/separating-signal-from-noise-coding-evaluations/"
---
