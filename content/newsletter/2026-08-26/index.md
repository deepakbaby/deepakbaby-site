---
title: "AI Weekly: Astra Solves Unsolved Maths, EU AI Act Kicks In"
date: 2026-08-26
week_start: "2026-07-27"
week_end: "2026-08-23"
draft: false
highlights:
  - "OpenAI's unreleased Astra model solved 10 decade-old open mathematics problems for ~$2,000 in compute, producing machine-checkable Lean 4 proofs — then OpenAI paused its training over cyber-risk concerns."
  - "The EU AI Act became fully enforceable on August 2, while the White House finalised a voluntary safety testing framework the very next day — regulation and pragmatic governance converging on the same week."
  - "ChatGPT hit 1 billion weekly active users and Gemini hit 1 billion monthly users in the same week, as OpenAI cut GPT-5.6 Luna prices 80% and Meta returned to open weights with Muse Glimmer."
news:
  - category: "Models & Releases"
    color: "#3b82f6"
    items:
      - title: "Astra Solves 10 Open Math Problems, Then Gets Paused"
        summary:
          - "OpenAI's unreleased Astra model solved 10 longstanding problems in mathematics and theoretical computer science — each unsolved for over a decade — at a total compute cost of roughly $2,000, publishing machine-checkable Lean 4 proofs on GitHub on August 1."
          - "On August 18, OpenAI revealed it paused its largest planned RL training run for ~2 weeks after preliminary evidence that Astra may hit its 'Critical' cybersecurity capability threshold, publishing a new pacing framework requiring mandatory external evaluation before any cyber-critical model ships."
          - "A new 30-minute alert system triggers automatically if a model shows suspicious behaviour during training, and Sam Altman had already demoed Astra to Washington policymakers — underscoring how tightly policy and capability development are now linked."
        url: "https://openai.com/index/ten-advances-in-mathematics/"
      - title: "Meta Returns to Open Weights with Muse Glimmer"
        summary:
          - "Meta released Muse Glimmer on August 10: a 30-billion-parameter agentic model under Apache 2.0 licence, small enough to run on a single consumer GPU with 24 GB VRAM."
          - "It uses DFlash speculative decoding for 3.1× faster inference and is distilled from Muse Spark, making it the first open-weight model in Meta's Muse line and a reversal of the closed-API strategy seen with [Muse Spark 1.1 (Jul 12 edition)](/newsletter/2026-07-12/)."
          - "Zuckerberg used the launch as a policy pitch for open-source AI leadership, and Meta simultaneously announced plans to release Muse Spark 1.2 weights — signalling a broader return to the open-weights strategy."
        url: "https://research.meta.ai/blog/introducing-muse-glimmer-open-agentic-model"
      - title: "Gemini 3.7 Flash: Coding Workhorse at Half the Price"
        summary:
          - "Google released Gemini 3.7 Flash on August 13 — just three weeks after 3.6 Flash — calling it its most intelligent workhorse model yet for coding, agentic workflows, and document processing."
          - "API prices are halved through the end of 2026, and the model now powers Gemini Spark consumer agent, enabling it to consolidate files, draft emails, and update status documents autonomously."
          - "DeepSeek also shipped V4-Pro GA (August 12–13) in the same window, with vendor-reported benchmark gains of up to 49.9 percentage points — though no independent replication has confirmed those figures yet."
        url: "https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-3-7-flash/"
      - title: "GPT-5.6 Luna Drops 80% — and DeepSeek V4-Flash Goes Open"
        summary:
          - "OpenAI cut GPT-5.6 Luna prices by 80% on July 30 (to $0.20/$1.20 per million tokens) and GPT-5.6 Terra by 20%, responding to competitive pressure from cheaper frontier alternatives just three weeks after the models launched."
          - "The same week, DeepSeek released open weights for V4-Flash (July 31), continuing its hybrid open/closed strategy before the flagship V4-Pro reached GA on August 12–13."
          - "OpenAI also retired o3 from ChatGPT on August 26 after its 90-day sunset, completing the model generation turnover to the GPT-5.6 lineup."
        url: "https://openai.com/index/advancing-the-price-performance-frontier-with-gpt-5-6/"
  - category: "People & Business"
    color: "#8b5cf6"
    items:
      - title: "ChatGPT and Gemini Both Cross 1 Billion Users"
        summary:
          - "OpenAI confirmed ChatGPT surpassed 1 billion weekly active users around August 6 — seven months later than its internal target but still the fastest consumer app in history to reach that scale."
          - "Gemini crossed 1 billion monthly active users on August 11, announced by Sundar Pichai on X; it is Google's fastest-growing product ever and the 14th Google service to reach the milestone, with 63% of users engaging via voice."
          - "The milestones land on different metrics — weekly vs monthly — and reflect divergent engagement depths: ChatGPT users return multiple times per week, while Gemini's monthly count is boosted by deep Android and Workspace integration."
        url: "https://www.theverge.com/ai-artificial-intelligence/978113/chatgpt-gemini-1-billion-users"
      - title: "Anthropic Breaks Silence on Open Weights, Frames China Risk"
        summary:
          - "On July 27, Anthropic CEO Dario Amodei published a formal position paper clarifying that the company has never advocated a ban on open-weight models — breaking a silence that had left Anthropic as the last major frontier lab not to sign the 'Open Weights and American AI Leadership' coalition letter."
          - "Rather than banning open weights, Amodei called for mandatory pre-release safety testing, chip export controls, and distillation restrictions, citing the 2026 Intelligence Community Threat Assessment on China's military AI progress."
          - "The position generated significant pushback: critics noted Anthropic made a structurally similar argument itself six weeks earlier, and signing the letter while adding conditions would have been a more direct path — an episode that reveals the fracture lines in the industry's open-source consensus."
        url: "https://www.anthropic.com/news/position-open-weights-models"
      - title: "ChatGPT Work Gets Admin Plugin for Enterprise Management"
        summary:
          - "OpenAI launched an Admin plugin for ChatGPT Work on August 25, letting IT admins manage workspace activity, access controls, and usage data through a natural-language conversation interface."
          - "The plugin integrates with existing enterprise identity systems and lets admins take supported administrative actions — such as adjusting permissions or pulling usage reports — without leaving the chat interface."
          - "The launch accompanies the final retirement of o3 from ChatGPT (August 26) and the Assistants API, marking the completion of OpenAI's generational model turnover in its enterprise surface."
        url: "https://openai.com/index/introducing-admin-plugin/"
  - category: "Policy & Ethics"
    color: "#f59e0b"
    items:
      - title: "EU AI Act Fully Enforceable From August 2"
        summary:
          - "On August 2, 2026, the European Commission's AI Office and national authorities began enforcing the AI Act in full — including transparency requirements, GPAI model obligations, governance structures, and penalties for non-compliance."
          - "Every EU member state was also required to have established at least one national AI regulatory sandbox by this date, per Article 57 of the Act."
          - "The Digital Omnibus (Regulation 2026/1744), a companion measure, had entered force five days earlier on July 27 — meaning two layers of AI regulatory obligations activated simultaneously in the same week."
        url: "https://digital-strategy.ec.europa.eu/en/news/commission-starts-enforcing-ai-act-rules-and-new-transparency-requirements-2-august"
      - title: "White House Finalises Voluntary Frontier AI Safety Tests"
        summary:
          - "The Trump administration finalised a voluntary cybersecurity testing framework for frontier AI models on August 3, offering the government up to 30 days of pre-release access to covered models — explicitly not a licensing regime."
          - "OpenAI, Anthropic, Google, and Meta were invited to a White House meeting on August 4 to discuss the framework, which focuses on measuring offensive hacking capabilities before public deployment."
          - "The framework lands directly alongside OpenAI's own August 18 pacing paper, which independently proposed mandatory external evaluation at cyber-critical capability thresholds — suggesting convergence between lab self-governance and government frameworks."
        url: "https://www.reuters.com/world/us-finalizes-voluntary-ai-safety-tests-white-house-official-says-2026-08-03/"
      - title: "Anthropic Adds Invisible Text Watermarks to All Claude Models"
        summary:
          - "Anthropic announced on August 11 that it is embedding invisible, machine-readable watermarks into text generated by all new Claude models worldwide — not just in the EU — triggered by the EU AI Act's new transparency rules."
          - "The watermarks survive copy-and-paste and appear even when Claude has only lightly edited a human text; a companion C2PA signed-metadata system applies to generated files and images."
          - "Anthropic confirmed that translations produced by Claude carry a watermark (every word is chosen by the model), and that models launched before August 2 are under a transition period to add the capability — raising questions about detection limits and creative-industry liability."
        url: "https://www.anthropic.com/news/claude-text-watermark"
  - category: "Products & Hardware"
    color: "#10b981"
    items:
      - title: "OpenAI Pacing Paper: External Eval Before Cyber-Critical Models Ship"
        summary:
          - "OpenAI's August 18 pacing framework formalises a new pre-release gate: models that show evidence of reaching the 'Critical' cybersecurity capability threshold must undergo mandatory external evaluation before being shipped."
          - "A 30-minute automated alert system now monitors training runs for suspicious behaviour, and the largest planned RL run was placed on hold for ~2 weeks after preliminary Astra signals triggered the threshold."
          - "The framework is self-imposed but public, and comes in the same week as the White House voluntary safety testing announcement — creating a convergent governance moment that positions OpenAI ahead of potential mandatory regulation."
        url: "https://openai.com/index/pacing-model-development-cyber-capabilities/"
  - category: "Research & Resources"
    color: "#ec4899"
    items:
      - title: "Chain-of-Thought Monitorability: A Fragile Safety Opportunity"
        summary:
          - "A multi-organisation position paper led by Google DeepMind Alignment argues that the ability to monitor chain-of-thought reasoning is a new and time-limited opportunity for AI safety — one that could close as models become more capable of hiding reasoning."
          - "The paper places the 'necessity argument' for CoT monitoring front and centre: because CoT is currently the primary window into model intent, any architecture changes that obscure it (e.g., latent-space reasoning) would significantly reduce alignment options."
          - "The paper is directly relevant context for interpreting Astra's cyber-risk pause: OpenAI's new 30-minute monitoring system almost certainly relies on observable CoT signals, making this a live research and safety-engineering intersection."
        url: "https://gdmalignment.substack.com/p/agi-safety-and-alignment-at-google"
---
