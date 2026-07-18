---
title: "AI Weekly: Kimi K3 Designs Its Own Chip, Grok Build's Secret Uploads Exposed"
date: 2026-07-19
week_start: "2026-07-13"
week_end: "2026-07-19"
draft: false
highlights:
  - "Moonshot AI's Kimi K3 — the world's first open 3-trillion-parameter-class model — designed a physical chip in 48 hours and wrote a GPU compiler from scratch; full weights drop July 27."
  - "xAI's Grok Build CLI was silently uploading entire Git repos — committed secrets included — to cloud storage by default; xAI disabled uploads server-side and then open-sourced the tool 72 hours later."
  - "Thinking Machines Lab released Inkling, a 975B open-weights multimodal MoE with controllable reasoning effort, available for fine-tuning on its Tinker platform."
news:
  - category: "Models & Releases"
    color: "#3b82f6"
    items:
      - title: "Kimi K3: Open 3T-Class Model Designs Its Own Chip"
        summary:
          - "Moonshot AI released Kimi K3 — 2.8 trillion parameters (MoE, 16 of 896 experts active), native vision, 1M-token context, priced from $0.30/MTok cache-hit; full weights release July 27."
          - "Standout demos: K3 designed a physical nano-model chip in a 48-hour autonomous run (1.46M cells, closes timing at 100 MHz, achieves 8,700+ tokens/s), and built MiniTriton — a GPU compiler from scratch with its own tile-level IR over MLIR, rivalling Triton on benchmarks."
          - "Architecture uses Kimi Delta Attention (KDA) + Attention Residuals (AttnRes) for long-context flow — the same AttnRes technique [covered in the Mar 21 edition](/newsletter/2026-03-21/) — plus Stable LatentMoE with Quantile Balancing and MXFP4/MXFP8 mixed precision."
        url: "https://www.kimi.com/blog/kimi-k3"
      - title: "Inkling: Thinking Machines Lab's 975B Open-Weights Multimodal MoE"
        summary:
          - "Thinking Machines Lab released Inkling (MIT licence) — 975B total / 41B active MoE, pretrained on 45T tokens of text, images, audio, and video, with a 1M-token context window."
          - "Key differentiator: controllable reasoning effort (0.2–0.99 sweep); at mid-effort it matches Nemotron 3 Ultra on Terminal-Bench 2.1 at a third of the tokens; at max effort scores 77.6% SWE-Bench Verified and 97.1% AIME 2026."
          - "Available for fine-tuning on the company's Tinker platform; bootstrapped from Kimi K2.5 synthetic data; companion Inkling-Small (276B/12B active) matches it on most benchmarks at lower cost."
        url: "https://thinkingmachines.ai/news/introducing-inkling/"
  - category: "People & Business"
    color: "#8b5cf6"
    items:
      - title: "Chai Discovery Raises $400M at $3.8B for AI Drug Design"
        summary:
          - "Chai Discovery closed a $400M Series C led by Index Ventures with Pfizer, Eli Lilly, Sequoia, and OpenAI as backers, tripling its valuation to $3.8B in seven months."
          - "The two-year-old startup builds AI models that predict molecular interactions to identify new drug candidates; the round brings total raised to $630M."
          - "The close continues the [AI in Life Sciences thread](/newsletter/2026-06-14/) running since GPT-Rosalind (Apr 18) through Claude Science workbench (Jun 30), now extending into AI-designed antibodies reaching Big Pharma."
        url: "https://www.nytimes.com/2026/07/14/business/dealbook/chai-discovery-ai-drug-development.html"
      - title: "Anthropic Launches Rupee Pricing for India, Its Second-Largest Market"
        summary:
          - "Anthropic rolled out INR-denominated Pro, Max, and Team plans in India on July 13 — the first non-US market to get local-currency pricing, with GST included at checkout."
          - "India is Claude's largest market outside the US; UPI payment support is not yet enabled, and dollar-converted rates are marginally higher than US prices."
          - "The move mirrors OpenAI's and Google's earlier localisation pushes in South and Southeast Asia as frontier labs compete for the world's most populous market."
        url: "https://techcrunch.com/2026/07/13/anthropic-starts-localizing-claude-pricing-for-india-its-biggest-market-after-the-us/"
      - title: "Helsing Raises $1.8B Series E at $18B for Defence AI"
        summary:
          - "European defence AI company Helsing raised a $1.8B Series E — oversubscribed — valuing it at $18B and cementing its position as Europe's answer to Anduril."
          - "The round will fund expansion of AI-driven military systems and a first US manufacturing base planned for West Virginia."
          - "The raise arrived the same week as the White House GOLD EAGLE initiative (below), reflecting record VC appetite for militarised AI infrastructure."
        url: "https://helsing.ai/newsroom/helsing-raises-1-8bn-in-series-e"
  - category: "Policy & Ethics"
    color: "#f59e0b"
    items:
      - title: "Grok Build CLI Silently Uploaded Full Git Repos — Secrets Included"
        summary:
          - "Researcher cereblab found that xAI's Grok Build CLI was packaging and uploading entire Git repositories — including full commit history, unread files, and unredacted .env secrets — to a GCS bucket; on a 12 GB repo, model traffic was ~192 KB while the storage channel moved 5.1 GiB."
          - "Critically, the 'Improve the model' opt-out toggle had no effect: it governs training, not transmission; the upload ran regardless, and upload code remained present in later binary versions (server can re-enable without a client update)."
          - "This connects to the [Supply Chain / Infrastructure Security thread](/newsletter/2026-05-10/) running from LiteLLM PyPI (Mar 28) through BadHost CVE-2026-48710 (May 31); action for affected users: rotate any credential Grok could have accessed, including secrets in Git history."
        url: "https://thehackernews.com/2026/07/grok-build-uploads-entire-git.html"
      - title: "xAI Open-Sources Grok Build Under Apache 2.0 After Controversy"
        summary:
          - "72 hours after the secret-upload story broke, xAI released the entire Grok Build codebase under Apache 2.0 and removed all usage caps — a trust-repair move that came with no formal security advisory."
          - "The open-source release revealed the upload code is still present in the binary; community contributions are explicitly blocked despite the Apache licence."
          - "Elon Musk stated all previously uploaded user data would be 'completely and utterly deleted'; no third-party verification has been provided."
        url: "https://simonwillison.net/2026/Jul/15/grok-build/"
      - title: "White House Launches GOLD EAGLE AI-Cybersecurity Clearinghouse"
        summary:
          - "The Trump administration announced GOLD EAGLE on July 14 — a formal clearinghouse requiring AI developers and critical infrastructure operators to share information on cybersecurity vulnerabilities detected by advanced AI systems."
          - "The initiative includes open-source AI model developers and is led by White House cyber director Sean Cairncross; it fulfils a commitment in Trump's earlier AI executive orders."
          - "GOLD EAGLE arrives the same week the Grok Build incident exposed how AI coding tools can exfiltrate sensitive infrastructure secrets, putting the policy context in sharp relief."
        url: "https://www.whitehouse.gov/releases/2026/07/white-house-launches-gold-eagle-initiative-for-unprecedented-cybersecurity-vulnerability-coordination/"
  - category: "Products & Hardware"
    color: "#10b981"
    items:
      - title: "GPT-5.6 Becomes Default Model in Microsoft 365 Copilot"
        summary:
          - "Microsoft and OpenAI confirmed GPT-5.6 Sol is now the preferred model powering Microsoft 365 Copilot across Word, Excel, Teams, and Outlook — rolling out to enterprise users globally."
          - "The upgrade brings Sol-tier reasoning (53.6% Agents' Last Exam) and Ultra multi-agent orchestration mode to the enterprise productivity suite; GPT-5.6 was covered at GA launch in the [Jul 12 edition](/newsletter/2026-07-12/) as a new development."
          - "This is the first time a frontier Sol-class model has become the default inside a major enterprise productivity platform, accelerating the shift from assistant to agentic work tool."
        url: "https://openai.com/news/"
  - category: "Research & Resources"
    color: "#ec4899"
    items:
      - title: "GPT-Red: OpenAI Trains AI to Break AI"
        summary:
          - "OpenAI published GPT-Red on July 15 — an automated red-teaming system that uses self-play to find prompt injection vulnerabilities; it 'can break nearly all models it is pitted against' according to the blog post."
          - "The system trains next-generation models that are resistant to prompt injection by iteratively attacking earlier versions, encoding the safety gains back into training; it scales red-teaming beyond what human teams can achieve."
          - "GPT-Red connects to the [AI Alignment Thread](/newsletter/2026-05-10/) (NLAs May 7, Teaching Claude Why May 8) and extends automated safety tooling into the adversarial red-team domain."
        url: "https://openai.com/index/unlocking-self-improvement-gpt-red/"
      - title: "OpenAI Scorecard: Measuring AI Value as Useful Intelligence per Dollar"
        summary:
          - "OpenAI published a framework for CFOs and enterprise AI buyers on July 17: 'Useful Intelligence per Dollar' — measuring work completed, cost per successful task, reliability, and scaling returns rather than cost-per-token."
          - "The piece argues the lowest price-per-token often isn't the lowest cost-per-outcome: a frontier model completing a task in one pass beats a cheaper model requiring retries, latency, and human review."
          - "The GPT-5.6 Sol/Terra/Luna tier family is positioned explicitly as the implementation of this scorecard, with Luna for volume, Terra for depth, and Sol for maximum reasoning value."
        url: "https://openai.com/index/a-scorecard-for-the-ai-age/"
---
