---
title: "AI Weekly: Musk Takes the Stand, OpenAI Comes to AWS, $650B AI Capex Declared"
date: 2026-05-02
week_start: "2026-04-27"
week_end: "2026-05-03"
draft: false
highlights:
  - "Elon Musk testified against Sam Altman in the landmark OpenAI for-profit conversion trial, revealing private founding emails and clashing on stage before a federal judge."
  - "OpenAI ended its exclusive Microsoft partnership and simultaneously launched models, Codex, and Managed Agents on AWS Bedrock — making Amazon a full-stack OpenAI cloud provider."
  - "Big Tech Q1 earnings revealed a combined $650–700B AI capex commitment from Microsoft, Meta, Alphabet, and Amazon, with Google Cloud crossing $20B quarterly revenue for the first time."
news:
  - category: "Models & Releases"
    color: "#3b82f6"
    items:
      - title: "NVIDIA Nemotron 3 Nano Omni: 9x More Efficient Agents"
        summary:
          - "NVIDIA unveiled Nemotron 3 Nano Omni, an open multimodal model unifying vision, audio, image, and text in a single model rather than chaining separate specialists."
          - "The model tops 6 leaderboards for document intelligence, video, and audio understanding, and is up to 9x more efficient than multi-model pipelines on agent tasks."
          - "Early adopters include Foxconn, Palantir, H Company, Docusign, Oracle, Dell, and Infosys; H Company notes agents can now interpret full HD screen recordings in real time."
        url: "https://blogs.nvidia.com/blog/nemotron-3-nano-omni-multimodal-ai-agents/"
      - title: "Symphony: OpenAI's Open-Source Codex Orchestration Spec"
        summary:
          - "OpenAI open-sourced Symphony, a spec that turns an issue tracker (Linear) into an always-on control plane for Codex coding agents."
          - "Teams using Symphony saw a 500% increase in landed PRs by keeping agents continuously aligned to the live backlog without manual task-passing."
          - "Symphony is designed to be tool-agnostic and extends the Coding Agent Wars thread — now with an official open orchestration layer any platform can adopt."
        url: "https://openai.com/index/open-source-codex-orchestration-symphony/"
  - category: "People & Business"
    color: "#8b5cf6"
    items:
      - title: "Musk vs Altman Trial: Three Days on the Stand"
        summary:
          - "Elon Musk testified April 28–30 in Oakland federal court, accusing Sam Altman of betraying OpenAI's nonprofit mission by converting it to for-profit."
          - "Cross-examination revealed Musk did not read 'fine print' about the conversion and waited until 2024 to sue, undermining his own timeline of grievances."
          - "The trial exposes founding emails and texts between Musk, Altman, and Brockman, and will define whether AI nonprofits can restructure without donor consent."
        url: "https://www.reuters.com/sustainability/boards-policy-regulation/key-takeaways-musks-testimony-openai-trial-2026-05-01/"
      - title: "OpenAI Ends Microsoft Exclusivity, Goes to AWS"
        summary:
          - "OpenAI removed the AGI clause and capped Microsoft's revenue share through 2030, freeing it to serve AWS, Google Cloud, and other hyperscalers."
          - "OpenAI models, Codex coding agent, and Managed Agents all launched on Amazon Bedrock in limited preview the same week."
          - "AWS now hosts Claude, Gemini, Llama, and GPT — becoming the neutral frontier-AI marketplace while Microsoft retains preferred cloud status."
        url: "https://openai.com/index/next-phase-of-microsoft-partnership/"
      - title: "Big Tech Q1 2026: $650B AI Capex Declared"
        summary:
          - "Alphabet (+21.8%), Microsoft (+18%), Meta (+33%), and Amazon (+28% AWS) all beat revenue estimates when reporting simultaneously on April 29."
          - "Google Cloud hit $20B quarterly revenue; Microsoft's AI run rate surpassed $37B (+123% YoY); Meta raised its 2026 capex guide to $145B for superintelligence."
          - "Combined hyperscaler AI infrastructure spending now tracks $650–700B for 2026, with Alphabet guiding 2027 capex to increase further."
        url: "https://fortune.com/2026/04/29/microsoft-meta-google-ai-capex-spending-billions/"
  - category: "Policy & Ethics"
    color: "#f59e0b"
    items:
      - title: "China Blocks Meta's $2B Manus Acquisition"
        summary:
          - "China's NDRC ordered Meta to unwind its $2B-plus acquisition of agentic AI startup Manus, citing technology leakage risks to the US."
          - "Manus, a Chinese-founded AI agent startup, had been acquired by Meta in December 2025; the NDRC ruling is legally binding on both parties."
          - "The decision signals Beijing's tightening grip on US acquisitions of domestic AI companies and could chill future cross-border AI deals."
        url: "https://www.cnbc.com/2026/04/27/meta-manus-china-blocks-acquisition-ai-startup.html"
      - title: "Connecticut Senate Passes Sweeping AI Bill SB5"
        summary:
          - "Connecticut's Senate passed SB5 32-4, a 71-page bill regulating frontier model developers, companion chatbots, AI in employment decisions, and online platform provenance."
          - "The bill establishes whistleblower protections for frontier model employees and consumer disclosure requirements for AI subscriptions."
          - "Now heading to the state House, SB5 is one of the broadest US state AI regulation attempts since California's SB 1047 and faces federal preemption pressure."
        url: "https://ctmirror.org/2026/04/21/artificial-intelligence-regulation-senate-ct/"
      - title: "Popular Uncensored HuggingFace Models Plagiarize Heretic"
        summary:
          - "A forensic analysis revealed that HauhauCS uncensored models (5M+ monthly downloads) are plagiarized forks of Heretic's models with AGPL copyright stripped and relicensed to noncommercial."
          - "The Heretic author confirmed the theft; the models remain live on HuggingFace pending removal requests."
          - "The case exposes a systematic gray market of license-laundering in the open-weight community and spotlights AGPL enforcement gaps on model hosting platforms."
        url: "https://dreamfast.github.io/reaper-analysis"
  - category: "Products & Hardware"
    color: "#10b981"
    items:
      - title: "Google Gemini Enterprise Agent Platform Debuts"
        summary:
          - "Launched at Google Cloud Next '26, the Gemini Enterprise Agent Platform consolidates Vertex AI model selection, agent building, DevOps, and governance into one interface."
          - "CEO Sundar Pichai announced 75% of all new Google code is now AI-generated, with the company shifting from assisted coding to fully agentic workflows."
          - "The platform integrates third-party data connectors, identity controls, and agentic SecOps features that reduced a typical 30-minute alert triage to 60 seconds."
        url: "https://cloud.google.com/blog/products/ai-machine-learning/introducing-gemini-enterprise-agent-platform"
      - title: "Claude Security Launches in Public Beta"
        summary:
          - "Anthropic opened Claude Security (formerly Claude Code Security) to all Enterprise customers, using Opus 4.7 to scan codebases, find vulnerabilities, and generate patches in one session."
          - "Features include scheduled scans, confidence ratings, Slack/Jira webhooks, and CSV/Markdown export — no API integration required."
          - "Security partners embedding Opus 4.7 include CrowdStrike, Microsoft Security, Palo Alto Networks, SentinelOne, TrendAI, and Wiz."
        url: "https://claude.com/blog/claude-security-public-beta"
      - title: "Amazon Quick: Persistent Cross-App AI Assistant"
        summary:
          - "Amazon launched the Quick desktop app — a personal AI that stays connected to local files, calendar, email, Slack, Jira, Google Workspace, and Microsoft 365 across sessions."
          - "Quick can create live dashboards, intelligent apps, presentations, and images; users sign up with just an email address."
          - "Positioned as a direct competitor to Microsoft Copilot and Anthropic's Claude Cowork, Quick is Amazon's entry into the persistent workplace AI assistant market."
        url: "https://www.aboutamazon.com/news/aws/amazon-quick-desktop-ai-assistant"
      - title: "AMD First-Party Ryzen AI Max+ 395 Box Ships June"
        summary:
          - "AMD announced its own first-party Ryzen AI Max+ 395 desktop box (128GB unified memory) at AMD AI Dev Day, built by Lenovo and launching in June."
          - "The device is a direct NVIDIA DGX Spark competitor in the prosumer local-inference market at a lower price point."
          - "128GB unified memory allows running frontier-class open-weight models like Llama 4 and DeepSeek-V4 entirely on-device without quantization."
        url: "https://www.reddit.com/r/LocalLLaMA/comments/1t038g7/amd_inhouse_ryzen_395_box_coming_in_june/"
      - title: "OpenAI Hardened Security for High-Risk ChatGPT Users"
        summary:
          - "OpenAI launched opt-in Advanced Account Security for high-risk users including journalists, activists, government officials, and dissidents."
          - "The opt-in mode enables passkey-only login, disables email and SMS recovery, enforces short sessions, and automatically excludes accounts from model training."
          - "The feature also covers Codex and comes as OpenAI faces continued scrutiny after the April macOS security incident."
        url: "https://openai.com/index/advanced-account-security/"
  - category: "Research & Papers"
    color: "#ec4899"
    items:
      - title: "Anthropic BioMysteryBench: Evaluating AI Bioinformatics"
        summary:
          - "Anthropic released BioMysteryBench, a new evaluation suite specifically designed to test LLM capabilities on real-world bioinformatics research tasks."
          - "The benchmark is part of Anthropic's broader Claude Science Evaluation push and the first domain-specific eval they have published for life sciences."
          - "Results show Claude performing well on gene annotation and protein structure tasks, extending the AI science tools thread from the GPT-Rosalind launch in April."
        url: "https://www.anthropic.com/research/Evaluating-Claude-For-Bioinformatics-With-BioMysteryBench"
      - title: "How 81,000 People Ask Claude for Personal Guidance"
        summary:
          - "Anthropic's Societal Impacts team published the largest qualitative study of AI personal guidance use, covering emotional support, life decisions, and sensitive conversations."
          - "The study surfaces patterns in how users frame personal requests, the contexts where they prefer AI over humans, and the risks of dependency formation."
          - "Results directly inform Anthropic's ongoing work on Claude's character and will shape forthcoming policy updates to how Claude handles mental health topics."
        url: "https://www.anthropic.com/research/claude-personal-guidance"
---
