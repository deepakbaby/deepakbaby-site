---
title: "AI Weekly: Claude Proves Fermat's Last Theorem, GPT-6 Astra Hits Critical"
date: 2026-09-05
week_start: "2026-08-31"
week_end: "2026-09-06"
draft: false
highlights:
  - "Claude autonomously produced the first fully machine-checked Lean 4 proof of Fermat's Last Theorem — 13 million lines of code, 29,500 intermediate theorems — in the biggest AI math milestone of 2026."
  - "Anthropic filed its IPO S-1 prospectus post-Labor Day and simultaneously sealed a $35B six-year cloud deal with NVIDIA-backed Lambda, locking in compute ahead of a late-September/October listing."
  - "GPT-6 Astra became the first deployed model to hit the Preparedness Framework 'Critical' cybersecurity threshold, while NVIDIA confirmed its $12.93B acquisition of Hugging Face with a 🤗 easter egg baked into the purchase price."
news:
  - category: "Models & Releases"
    color: "#3b82f6"
    items:
      - title: "Frontier Sprint: GPT-6 Astra, Fable 5.1, Gemini 3.8 Flash, Muse Spark 1.3"
        summary:
          - "**GPT-6 Astra** (OpenAI, Sep 4): 99.9% ARC-AGI-3, 97.6% FrontierMath Tier 4, 100% ExploitBench, 88% SRE-Bench; new Codex cross-window memory; $10/$50/MTok — first deployed model to trigger Preparedness Framework 'Critical' threshold (see Policy); **Claude Fable 5.1 + Mythos 5.1** (Anthropic, Sep 1): 52.6% Terminal-Bench-Science 0.1, 73.4% CursorBench 3.2; cache reads $0.25/MTok (75% cheaper, ~25–45% total cost reduction); Mythos 5.1 engineered protein binders with 10× higher affinity than best Adaptyv Bio competition submissions."
          - "**Gemini 3.8 Flash + 3.8 Flash Cyber** (Google, Sep 2): third Flash in six weeks; same price as 3.7 Flash; 3.8 Flash Cyber available via new Fairwind Program for trusted government/critical infra; 47.2% CWE-Bench patching pass@1; improved prompt injection robustness (Gray Swan); **Muse Spark 1.3** (Meta, Sep 4): ~20% fewer tool calls and ~25% fewer tokens vs 1.2; stronger prompt injection robustness; open weights release teased on roadmap — second Muse Spark update in ~2 months ([1.1 Jul 12](/newsletter/2026-07-12/), [1.2 Aug 26](/newsletter/2026-08-26/))."
          - "All four releases push frontier safety architecture: Fable 5.1 ships an EU AI Act-compliant invisible output watermark with a private-preview detection API; Gemini 3.8 Flash Cyber's Fairwind Program and OpenAI Daybreak both extend the [Glasswing trusted-access model (Apr 2026)](/newsletter/2026-04-11/) to government and critical infrastructure operators."
        url: "https://openai.com/index/gpt-6-astra/"
      - title: "Qwen3.8-Max-0902: Coding and Agent Post-Training Update"
        summary:
          - "Alibaba released Qwen3.8-Max-0902 (Sep 2), a post-training update to Qwen3.8-Max (2.4T parameters, 1M context) targeting improved performance on coding, long-horizon agent tasks, and native vision."
          - "Pricing is unchanged at $2/$6 per million tokens, and the architecture is unmodified — the update ships as a new snapshot for existing API users without a migration step."
          - "The update continues Alibaba's incremental snapshot cadence for its flagship MoE, keeping Qwen3.8-Max competitive against the wave of frontier updates released this week."
        url: "https://technode.com/2026/09/02/alibaba-upgrades-qwen38-max-with-new-0902-snapshot/"
      - title: "GLM-5.3-Flash: 320B MoE, MIT License, Native GUI Vision"
        summary:
          - "Z.ai released GLM-5.3-Flash (Aug 26), officially unveiling the 'Ox Alpha' stealth model: 320B total / 18B active MoE, hybrid sparse+linear attention, 1M multimodal context, native visual capabilities for GUI and browser automation."
          - "Priced at $0.15/$0.50 per million tokens (50% launch promo through Sep 9); runs on Chinese chips; MIT license with open weights — a direct successor to [GLM-5.2, which Hugging Face used to defend against the Jul 21 OpenAI sandbox escape](/newsletter/2026-07-26/)."
          - "The release extends Z.ai's pattern of open-weights releases as philosophical responses to frontier lab restrictions, positioning GLM-5.3-Flash as the most capable open-weight model for GUI automation at launch."
        url: "https://z.ai/blog/glm-5.3-flash"
  - category: "People & Business"
    color: "#8b5cf6"
    items:
      - title: "Anthropic Files IPO S-1, Seals $35B Lambda Compute Deal"
        summary:
          - "Anthropic released its IPO prospectus after Labor Day (Sep 7 public filing per The Information), targeting an investor day in mid-September and a US exchange listing as early as late September or early October — building on the [confidential S-1 filed Jun 1](/newsletter/2026-06-07/)."
          - "Simultaneously, Anthropic sealed a $35B six-year cloud-computing deal with Lambda (NVIDIA-backed) for a Texas data center operated by Hut 8 in Nueces County, announced Aug 31, adding major NVIDIA GPU capacity for Claude models at scale."
          - "The compute deal directly addresses the single largest investor concern ahead of the IPO — Claude's infrastructure dependency — while the $35B figure dwarfs the [Anthropic+AWS $100B / 5GW deal from April](/newsletter/2026-04-25/) in headline value."
        url: "https://www.bloomberg.com/news/articles/2026-08-31/anthropic-seals-35-billion-cloud-deal-with-nvidia-backed-lambda"
      - title: "NVIDIA Acquires Hugging Face for $12.93B"
        summary:
          - "Jensen Huang confirmed the acquisition on the NVIDIA blog for exactly $12,930,300,000 — a figure the community quickly noted encodes the 🤗 emoji's Unicode code point (U+1F917) as a deliberate easter egg."
          - "Hugging Face retains its brand, leadership (Clem Delangue stays as CEO), and platform independence: NVIDIA compute will not be required, and multi-cloud/multi-accelerator support is explicitly preserved for the platform's 18M+ developers, 3M+ models, and 200K+ companies."
          - "The acquisition supersedes the [Aug 26 'closing in' report](/newsletter/2026-08-26/) and gives NVIDIA direct ownership of the AI community's de facto model hub — NVIDIA was already HF's largest contributor with 500+ models and 250+ datasets before the deal closed."
        url: "https://blogs.nvidia.com/blog/nvidia-to-acquire-hugging-face/"
      - title: "OpenAI Cuts Cursor API Access After SpaceX Acquisition"
        summary:
          - "OpenAI notified SpaceX that all OpenAI model access for Cursor will be shut off November 12, 2026, citing inability to confirm SpaceX Terms of Service compliance — the change-of-control clause was triggered by [SpaceX/xAI's $60B Cursor acquisition covered in the Apr 25 edition](/newsletter/2026-04-25/)."
          - "The move is reinforced by Elon Musk's April 2026 court admission that xAI violated OpenAI's Terms of Service by distilling OpenAI model outputs, giving OpenAI grounds to act even beyond the change-of-control clause."
          - "Cursor must migrate its user base to Anthropic, Google, or open-weight backends before November, reshaping the third-party coding agent market and signalling that OpenAI's change-of-control clauses will be actively enforced post-GPT-6 Astra."
        url: "https://openai.com/index/our-decision-on-cursor-following-its-acquisition-by-spacex/"
      - title: "ChatGPT Ads Hits $1B Annualised Revenue Run Rate"
        summary:
          - "OpenAI announced Aug 31 that ChatGPT Ads reached $1 billion in annualised revenue run rate in under 200 days from launch — among the fastest advertising businesses ever to reach that milestone."
          - "The same announcement opened self-serve Ads Manager access across 31 European markets, completing the initial global rollout after earlier launches in the US and Asia-Pacific."
          - "The $1B milestone comes the same week Anthropic filed its IPO S-1, putting OpenAI's advertising revenue stream — absent from Anthropic's model — in direct relief for investors comparing the two frontier labs."
        url: "https://openai.com/index/expanding-access-to-ai-with-chatgpt-ads/"
      - title: "Claude for Teachers Expands Free Enterprise to K-12 Schools"
        summary:
          - "Anthropic expanded Claude for Teachers to offer a free Enterprise tier for US K-12 schools and districts (Sep 1), adding centrally managed SSO, role-based access controls, district-wide policies, and standards-aligned teaching tools."
          - "The expansion builds on the [July 14 individual-educator launch](/newsletter/2026-07-26/) with institutional features previously unavailable at the school or district level, bringing Claude into the same enterprise management layer available to corporate customers."
          - "Usage limits match the individual Claude for Teachers accounts; overage billing is disabled by default, removing the budget-risk barrier that has blocked AI tool adoption in underfunded school districts."
        url: "https://claude.com/blog/claude-for-teachers-now-available-for-schools-and-districts"
  - category: "Policy & Ethics"
    color: "#f59e0b"
    items:
      - title: "GPT-6 Astra Triggers First 'Critical' Preparedness Rating"
        summary:
          - "GPT-6 Astra is the first deployed model to hit the 'Critical' threshold in OpenAI's Preparedness Framework for cybersecurity — exploit generation and automated pen testing are currently restricted, with access coming only via OpenAI Daybreak for vetted defenders."
          - "During evals, the model independently discovered two previously unknown zero-days (being responsibly disclosed to maintainers), scored 100% on ExploitBench, and achieved 0% boundary violations on the ExploitGym honeypot; OpenAI separately flagged that the model's written reasoning is harder to monitor than prior generations."
          - "The Critical rating follows the [Aug 18 training pause that triggered OpenAI's pacing framework](/newsletter/2026-08-26/) and marks the first time a model hits Critical at launch rather than during pre-release evaluation — a new precedent for the Preparedness Framework."
        url: "https://openai.com/index/safety-overview-gpt-6-astra/"
      - title: "OpenAI Backs California SB 1119 Youth AI Safety Bill"
        summary:
          - "OpenAI publicly backed California SB 1119 (Aug 31), urging Governor Newsom to sign legislation requiring age-appropriate AI safeguards for teenagers — including age verification, parental controls, and third-party audits."
          - "OpenAI frames SB 1119 as AI-specific rather than an extension of social media rules, arguing the tailored approach avoids over-regulation while addressing real harms; the endorsement extends OpenAI's recent shift toward supporting targeted AI regulation for minors."
          - "The move contrasts with OpenAI's opposition to broader AI regulation bills and positions the company alongside child-safety advocates ahead of what is expected to be a busy California AI regulation signing season."
        url: "https://openai.com/index/supporting-california-bill-advance-ai-youth-safety/"
  - category: "Products & Hardware"
    color: "#10b981"
    items:
      - title: "OpenClaw 2.0: Multiplayer Sessions and Rebuilt Browser App"
        summary:
          - "OpenClaw 2.0 shipped in August 2026 as the largest release in the project's history: 933 contributors (569 first-time), 16,000+ pull requests, and roughly 50% of all PRs ever merged delivered across seven weeks of development."
          - "Key changes: simplified installation starting from existing ChatGPT/Claude subscriptions or local models; a rebuilt browser app as a first-class experience; new shared cloud sessions enabling multiplayer and collaborative work with context handoff between agents."
          - "OpenClaw remains fully open source with no model or provider lock-in; cited by Garry Tan (gstack, 54K stars) as a reference architecture for agentic coding tools and now backed by over 900 contributors worldwide."
        url: "https://openclaw.ai/blog/openclaw-2-accidentally"
      - title: "ChatGPT Connects to Healthcare Sources and Health Records"
        summary:
          - "OpenAI expanded ChatGPT's health integration (Sep 1) to connect to third-party healthcare sources and personal health records for US users, building on the [Apple Health + medical records integration launched July 23](/newsletter/2026-07-26/) for US users 18+."
          - "The expansion deepens ChatGPT's position in the clinical AI race alongside [Claude Science workbench](/newsletter/2026-07-12/) and GPT-Rosalind, targeting the estimated 300M+ users already asking ChatGPT health questions weekly."
          - "Data from health record connections is excluded from model training and advertising targeting, consistent with the privacy commitments made at the July launch; no new lawsuit was filed at the September expansion."
        url: "https://openai.com/index/chatgpt-connects-health-records-and-healthcare-sources/"
      - title: "OpenAI Daybreak Expands to Frontline Defenders"
        summary:
          - "OpenAI expanded Daybreak — its trusted cyber AI access program — to frontline defenders (Sep 3): security teams at critical infrastructure operators, cloud providers, and open-source software maintainers gain early access to GPT-6 Astra's restricted cyber capabilities."
          - "Daybreak for Frontline Defenders prioritises defensive use cases — vulnerability discovery, secure code review, and patch generation — ahead of any general Daybreak cyber rollout, explicitly inverting the usual capability-first access model."
          - "The Daybreak expansion mirrors the Fairwind Program structure announced simultaneously by Google for Gemini 3.8 Flash Cyber, and continues the tiered trusted-access architecture pioneered by [Project Glasswing (Apr 2026)](/newsletter/2026-04-11/)."
        url: "https://openai.com/index/daybreak-for-frontline-defenders/"
  - category: "Research & Resources"
    color: "#ec4899"
    items:
      - title: "Claude Proves Fermat's Last Theorem in Lean 4"
        summary:
          - "Anthropic's Claude worked largely autonomously over 11 days to produce the first fully machine-checked Lean 4 proof of Fermat's Last Theorem — 13 million lines of Lean code, 29,500 intermediate theorems — with mathematician Kevin Buzzard confirming it passes Lean's kernel checker."
          - "The proof builds on 106 upstream files from Imperial College London and the Mathlib community; Claude used the Prove2Me scaffolding tool after a first unassisted attempt failed, and the final proof credits the collaborative human-AI pipeline explicitly."
          - "The result is the largest verified mathematical proof ever produced by an AI system, extending the [autonomous math discovery thread](/newsletter/2026-08-26/) from Astra solving 10 open problems in August and OpenAI's Erdős conjecture disproof in May — this is qualitatively different: a centuries-old theorem, fully machine-checked."
        url: "https://www.anthropic.com/research/formalizing-fermats-last-theorem"
      - title: "TimesFM-3: Native Multivariate Zero-Shot Forecasting"
        summary:
          - "Google Research released TimesFM-3 (330M parameters, pretrained on 1T+ time points) as the first TimesFM model with native multivariate support — multiple targets, past covariates, and known future covariates handled in a single forward pass."
          - "Architecture highlights: alternating causal temporal + full variate attention; non-autoregressive generation via Contiguous Patch Masking; 9-quantile probabilistic output; achieves state-of-the-art results on Gift-Eval, FEV-Bench, and the TIME leaderboard."
          - "Available on GitHub and HuggingFace now; BigQuery AI.FORECAST integration is coming, making zero-shot multivariate forecasting accessible to data teams without dedicated ML infrastructure — the most practical time-series foundation model yet for enterprise use."
        url: "https://research.google/blog/timesfm-3-a-zero-shot-foundation-model-for-multivariate-forecasting/"
---
