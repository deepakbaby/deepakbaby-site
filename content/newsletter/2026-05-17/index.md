---
title: "AI Weekly: Full-Duplex AI Arrives, Alexa Swallows Rufus"
date: 2026-05-17
week_start: "2026-05-11"
week_end: "2026-05-17"
draft: false
highlights:
  - "Thinking Machines Lab's TML-Interaction-Small beats GPT Realtime-2.0 on full-duplex benchmarks using a 200ms micro-turn architecture that eliminates conversation turn boundaries entirely."
  - "Amazon unified Rufus and Alexa+ into a single persistent shopping agent, while Anthropic's Claude Platform launched natively on AWS as a fully GA service with IAM auth and CloudTrail audit logs."
  - "Microsoft's DELEGATE-52 benchmark found frontier AI agents still corrupt documents and lose content across long-running workflows, with only Python programming meeting a readiness threshold."
news:
  - category: "Models & Releases"
    color: "#3b82f6"
    items:
      - title: "TML-Interaction-Small: 200ms Full-Duplex AI Beats GPT Realtime"
        summary:
          - "Thinking Machines Lab (ex-OpenAI) released TML-Interaction-Small, a 276B MoE (12B active) model natively built for real-time full-duplex interaction with a 200ms micro-turn architecture that continuously interleaves audio, video, and text without turn boundaries."
          - "It outperforms [GPT Realtime-2.0](https://openai.com/index/gpt-realtime-2/) and Gemini Flash Live on FD-bench while remaining competitive on intelligence benchmarks, and introduces new capabilities like time-awareness (speak at user-specified times) and visual proactivity (count pushups, respond to visual cues mid-stream)."
          - "First model to meaningfully score on TimeSpeak, CueSpeak, and RepCount benchmarks where all existing models score near-zero; research preview is coming."
        url: "https://thinkingmachines.ai/blog/interaction-models/"
      - title: "Google Gemini Omni: AI Video Generation Leaked Before I/O"
        summary:
          - "A leak ahead of Google I/O 2026 (May 19) revealed Gemini Omni, a conversational AI video generation system capable of generate, remix, and edit operations via chat interface."
          - "Built on Veo 3 technology with deep Gemini integration, the tool signals Google's push to unify its video and conversational AI stacks before the annual developer keynote."
          - "The timing puts Gemini Omni in direct competition with OpenAI's Sora 2 and similar tools from Runway and Kling, with Google under pressure to demonstrate multimodal parity at I/O."
        url: "https://www.digit.in/news/general/gemini-omni-leak-reveals-googles-next-ai-video-tool-ahead-of-io-2026.html"
      - title: "Sakana's 7B RL Conductor Beats GPT-5 by Orchestrating It"
        summary:
          - "Sakana AI's RL Conductor is a 7B model trained via reinforcement learning on just 960 examples (2× H100s) to dynamically route and orchestrate GPT-5, Claude Sonnet 4, Gemini 2.5 Pro, and open-source models."
          - "It outperforms each individual frontier model on reasoning and coding benchmarks while consuming far fewer tokens than competing orchestration frameworks."
          - "Commercialized via the Fugu platform, RL Conductor suggests a new paradigm where small orchestrator models trained cheaply can outperform expensive direct inference from the models they manage."
        url: "https://venturebeat.com/orchestration/how-sakana-trained-a-7b-model-to-orchestrate-gpt-5-claude-sonnet-4-and-gemini-2-5-pro"
  - category: "People & Business"
    color: "#8b5cf6"
    items:
      - title: "Coursera + Udemy Merge: 290M Learners, 18K Enterprise Clients"
        summary:
          - "Coursera and Udemy completed their merger on May 11, creating one of the world's largest skills platforms with 290M learners, 18,000 enterprise customers, 95,000 content creators, and 315,000+ courses."
          - "The deal is framed explicitly around AI-era workforce transformation — the combined entity aims to move from a content catalog to a 'skills delivery platform' connecting learning to real-world job outcomes."
          - "The merger follows the [Coinbase 14% AI-driven layoffs covered in our May 10 edition](/newsletter/2026-05-10/) and reflects accelerating demand for reskilling as AI displaces entry-level roles across industries."
        url: "https://blog.coursera.org/coursera-and-udemy-are-now-one-company-creating-the-worlds-most-comprehensive-skills-platform/"
  - category: "Policy & Ethics"
    color: "#f59e0b"
    items:
      - title: "OpenAI Discloses Response to TanStack npm Supply Chain Attack"
        summary:
          - "OpenAI disclosed on May 13 that a supply chain attack targeted TanStack — a widely-used JavaScript library family — via a malicious npm package, and detailed how it detected and responded to the threat."
          - "The incident is notable for involving AI coding tool infrastructure; TanStack is commonly used in projects built with and scaffolded by Codex, Cursor, and similar agents."
          - "It joins the [LiteLLM PyPI supply chain attack from March 2026](/newsletter/2026-03-28/) as a recurring pattern of attackers targeting the npm/PyPI packages most likely to appear in AI-assisted codebases."
        url: "https://openai.com/index/our-response-to-the-tanstack-npm-supply-chain-attack/"
      - title: "Anthropic Maps Two Scenarios for Global AI Leadership by 2028"
        summary:
          - "Anthropic's policy team published a research paper on May 14 exploring two possible global AI trajectories by 2028: one where the US leads responsibly with coordinated governance, and one where a fragmented race leads to geopolitical instability."
          - "The paper lands as the [Connecticut SB5 frontier model regulation bill (covered May 3)](/newsletter/2026-05-03/) advances through state legislature and amid ongoing debate over federal AI policy frameworks."
          - "Anthropic positions the paper as a call for proactive policy investment rather than reactive regulation, emphasizing that the 2025–2026 window is critical for shaping governance norms."
        url: "https://www.anthropic.com/research/2028-ai-leadership"
      - title: "ChatGPT Now Reads Sensitive Context to Reduce Over-Refusals"
        summary:
          - "OpenAI on May 14 improved ChatGPT's ability to recognize nuanced context in sensitive conversations, reducing over-refusals where the model previously declined legitimate requests."
          - "The update follows months of community criticism that safety guardrails were too aggressive in medical, legal, and personal-advice contexts where detailed information is genuinely helpful."
          - "OpenAI framed the change as a calibration rather than a safety rollback, saying the model now better distinguishes harmful intent from genuine need — part of the broader alignment work [covered in our May 10 edition's 'Teaching Claude Why' story](/newsletter/2026-05-10/)."
        url: "https://openai.com/index/chatgpt-recognize-context-in-sensitive-conversations/"
  - category: "Products & Hardware"
    color: "#10b981"
    items:
      - title: "Claude Platform on AWS Now Generally Available"
        summary:
          - "Anthropic launched Claude Platform on AWS as GA on May 11, bringing full native Claude API features — Managed Agents, Skills, MCP connector, Files API, Code Execution, web search, prompt caching, batch processing — accessible via AWS IAM auth and CloudTrail audit logging."
          - "The key distinction from Amazon Bedrock: Anthropic operates the service with data processed outside the AWS boundary (full feature parity, day-one new model access), whereas Bedrock positions AWS as data processor for stricter residency requirements; see also [the related OpenAI-on-Bedrock announcement from our May 3 edition](/newsletter/2026-05-03/)."
          - "Available in most AWS commercial regions with billing via a single AWS invoice that retires against existing AWS commitments — a significant procurement simplification for enterprise customers already standardized on AWS."
        url: "https://claude.com/blog/claude-platform-on-aws"
      - title: "ChatGPT Personal Finance: Connect 12,000+ Bank Accounts"
        summary:
          - "OpenAI launched personal finance tools in preview on May 15 for ChatGPT Pro subscribers in the US, allowing users to connect accounts from 12,000+ financial institutions for AI-powered spending analysis and financial planning."
          - "The feature requires the $100/month Pro tier for now, with a phased rollout planned before expanding to Plus ($20/month) and lower tiers."
          - "The move puts OpenAI directly in competition with Mint successors, YNAB, and fintech AI startups, and raises data-handling questions given OpenAI's [advanced account security rollout covered in our May 3 edition](/newsletter/2026-05-03/)."
        url: "https://openai.com/index/personal-finance-chatgpt/"
      - title: "Codex Goes Mobile and Gets a Windows Sandbox"
        summary:
          - "OpenAI expanded Codex to mobile and additional desktop environments on May 14, making the coding agent accessible beyond the web interface and continuing its push into the [Coding Agent Wars thread](/newsletter/2026-04-25/)."
          - "Separately, OpenAI published an engineering deep-dive on May 13 explaining [how it built a safe isolated sandbox to enable Codex on Windows](https://openai.com/index/building-codex-windows-sandbox/), addressing code execution security for Windows users."
          - "Together these releases significantly broaden Codex's reach just as competitors Cursor and Claude Code accelerate their own mobile and cross-platform roadmaps."
        url: "https://openai.com/index/work-with-codex-from-anywhere/"
      - title: "Amazon Merges Rufus and Alexa+ Into One Shopping Agent"
        summary:
          - "Amazon on May 13 unified the Rufus e-commerce chatbot and Alexa+ into a single persistent shopping agent called 'Alexa for Shopping,' capable of tracking prices, remembering preferences, and acting on behalf of users across Echo devices, Amazon.com, and the app."
          - "The consolidation signals Amazon's recognition that maintaining two parallel AI assistants in the shopping vertical created user confusion and split engineering investment."
          - "The move mirrors the broader platform consolidation trend visible in [Claude Managed Agents (Apr 11)](/newsletter/2026-04-11/) and [ChatGPT Workspace Agents (Apr 25)](/newsletter/2026-04-25/), where conversational and task-execution AI are merging into unified agent surfaces."
        url: "https://www.cnbc.com/2026/05/13/amazon-ditches-rufus-ai-chatbot-in-favor-of-alexa-shopping-agent.html"
      - title: "Open Design: Open-Source Self-Hostable Alternative to Claude Design"
        summary:
          - "nexu-io released Open Design (Apache 2.0) as a local-first, self-hostable alternative to [Anthropic's Claude Design (launched Apr 17)](/newsletter/2026-04-18/), supporting 16 coding agent CLIs auto-detected on PATH including Claude Code, Codex, Cursor, Gemini CLI, Devin, Qwen, and Kimi."
          - "It ships with 31 skills covering web prototypes, mobile apps, decks, and dashboards, plus 72 brand-grade design systems (Linear, Stripe, Vercel, Airbnb, Notion, Apple, Anthropic, Cursor) and a BYOK proxy for any OpenAI-compatible endpoint including Ollama and LM Studio."
          - "Open Design can import Claude Design export ZIPs and includes an MCP server for Claude Code/Codex/Cursor integration — Docker and Vercel deployable — making it a viable self-hosted escape hatch for teams unwilling to lock into Anthropic's hosted offering."
        url: "https://github.com/nexu-io/open-design"
  - category: "Research & Resources"
    color: "#ec4899"
    items:
      - title: "DELEGATE-52: Frontier Agents Still Corrupt Long-Running Work"
        summary:
          - "Microsoft researchers released the DELEGATE-52 benchmark spanning 52 professional domains and found that frontier AI models consistently corrupt documents and lose content across extended multi-step tasks — only Python programming met a readiness threshold after 20 delegated interactions."
          - "Agentic systems with tool access actually performed worse than base models in many domains, suggesting that tool-calling scaffolding introduces new failure modes at scale."
          - "The findings challenge vendor claims about agentic readiness and connect to [the Symphony/Codex orchestration work from our May 3 edition](/newsletter/2026-05-03/) — implying that orchestration frameworks need better state preservation mechanisms before real delegation is viable."
        url: "https://www.theregister.com/ai-ml/2026/05/11/microsoft-researchers-find-ai-models-and-agents-cant-handle-long-running-tasks/5238263"
      - title: "Game Boy Color Runs a Real Transformer LLM Without a PC"
        summary:
          - "A developer ran Karpathy's TinyStories-260K (INT8, fixed-point) on a stock 1998 Game Boy Color with EZ Flash Jr and a microSD card, storing the KV cache in cartridge SRAM and using the D-pad as a keyboard for prompts."
          - "Output is extremely slow and mostly gibberish, but transformer prefill and autoregressive generation run entirely on original GBC hardware — built using Codex as a coding assistant."
          - "The project sits in a growing tradition of extreme-hardware LLM demos alongside the [LLM on a 1998 iMac G3 covered in our Apr 11 edition](/newsletter/2026-04-11/) — see also this week's Intel Optane Kimi K2.5 build below."
        url: "https://github.com/maddiedreese/gbc-transformer"
      - title: "Intel Optane Build Runs 1-Trillion-Param Kimi K2.5 at 4 tok/s"
        summary:
          - "An enthusiast built a Xeon + 768GB Intel Optane Persistent Memory (DCPMM) system that runs Kimi K2.5 (1T parameters, Q2_K_XL quantization) at approximately 4 tokens per second via hybrid GPU/CPU llama.cpp inference — with Optane PMem sourced cheaply on the secondary market acting as a DRAM tier."
          - "Intel discontinued Optane in 2022, making this a community treasure-hunt engineering story: surplus enterprise DCPMM modules offer bandwidth characteristics that consumer DRAM can't match at comparable cost for massive-model inference."
          - "Paired with the [Game Boy Color transformer above](https://github.com/maddiedreese/gbc-transformer), this week's r/LocalLLaMA highlights the full spectrum of local inference ambition — from 1998 8-bit hardware to trillion-parameter quantized giants."
        url: "https://www.reddit.com/r/LocalLLaMA/comments/1taeg8h/computer_build_using_intel_optane_persistent/"
---
