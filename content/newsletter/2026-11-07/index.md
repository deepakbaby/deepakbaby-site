---
title: "AI Weekly: Models Learn to Edit Weights, Inkling 2 Small Debuts"
date: 2026-11-07
week_start: "2026-11-02"
week_end: "2026-11-08"
draft: false
highlights:
  - "Weight-Space Programming shows GPT-6 Astra reading, repairing and writing neural network weights directly with no gradient descent, including a 0.016% weight edit that lifted Qwen3.5-0.8B on MATH-500 from 7.9% to 48.1%."
  - "Thinking Machines launched Inkling 2 Small, a 594B-parameter MoE available now with closed weights, with Apache 2.0 weights promised next week after external safety testing and red-teaming."
  - "OpenAI put offensive security in the spotlight: GPT-6 Cyber went to approved Daybreak Red customers, and a prototype pipeline produced 948 Linux kernel local privilege escalation exploits."
news:
  - category: "Models & Releases"
    color: "#3b82f6"
    items:
      - title: "Thinking Machines Launches Inkling 2 Small, Open Weights Next Week"
        summary:
          - "Inkling 2 Small is a 594B-total, 17B-active Mixture-of-Experts model with image inputs, scoring 31 on the Artificial Analysis Intelligence Index and available now on Tinker with closed weights."
          - "Full Apache 2.0 weights are promised next week after external safety testing and red-teaming, a closed-first staged release that stands out against the [Qwen3.8 exfiltration trust debate](/newsletter/2026-11-01/)."
          - "It reports 72.1% on DeepSWE v1.1 and tops the listed field on MMMU Pro (81.6%) and Vals Finance (61.5%), joining the open-weights race alongside [Muse Spark Open](/newsletter/2026-10-18/) and Kimi K3."
        url: "https://thinkingmachines.ai/news/inkling-2-small/"
      - title: "Moonshot Releases Kimi K3.1 Pro as Open Weights"
        summary:
          - "Kimi K3.1 Pro is a natively multimodal agentic MoE with 2.8T total and 104B active parameters, a 1M-token context window and MXFP4 weights."
          - "It accepts text and image input and ships on Hugging Face as open weights."
          - "The model card carries vendor-reported benchmark tables against Claude Fable 5.1, GPT-6 Astra and Claude Opus 5.5."
        url: "https://huggingface.co/moonshotai/Kimi-K3.1-Pro"
  - category: "People & Business"
    color: "#8b5cf6"
    items:
      - title: "OpenAI to Acquire Pierre Computer Company"
        summary:
          - "OpenAI announced it will acquire Pierre Computer Company, maker of Code Storage and the open-source Trees and Diffs libraries used in Codex."
          - "Closing is subject to regulatory approvals."
          - "Pierre's open-source projects will remain open source."
        url: "https://openai.com/index/openai-to-acquire-pierre/"
      - title: "Revolut Self-Hosts GLM; Qwen Pledges to Stay Open"
        summary:
          - "Revolut's ops lead said at AI Engineer NYC that self-hosted GLM models became the default for coding, cutting inference costs by about 90%, with GLM-5.3 running on 56 Nvidia B200 GPUs for roughly 2,000 engineers."
          - "Vision tasks at Revolut are routed to Gemini or GPT models, and the switch came at the expense of Claude."
          - "Separately, a [r/LocalLLaMA post](https://www.reddit.com/r/LocalLLaMA/comments/1xm28e6/official_statement_qwen_models_will_stick_to_open/) relays a Qwen statement that Qwen 4.0 and 5.0 will remain open source after rumours Qwen4 would be the last open-weight series, a pledge that tests the open-weights trust-versus-adoption tension from the [Qwen3.8 exfiltration story](/newsletter/2026-11-01/)."
        url: "https://www.theregister.com/ai-and-ml/2026/11/03/british-fintech-revolut-slashes-ai-coding-costs-10x-by-cutting-out-claude-and-going-self-hosted/5307345"
      - title: "Australian Universities Partner With OpenAI on AI-Native Graduates"
        summary:
          - "UNSW, University of Sydney, La Trobe and Adelaide University are expanding their OpenAI collaborations, including ChatGPT Edu and Codex."
          - "An OpenAI-commissioned survey of 1,018 Australian students from August 2026 found 81% use AI several times a week."
          - "The partnerships are framed around producing AI-native graduates."
        url: "https://openai.com/index/australian-universities-ai-native-graduates/"
  - category: "Policy & Ethics"
    color: "#f59e0b"
    items:
      - title: "OpenAI Pushes Offensive Security: GPT-6 Cyber and 948 Kernel Exploits"
        summary:
          - "GPT-6 Cyber scores 48.5% on ExploitGym versus 32.1% for GPT-5.6 Cyber, stayed in scope in 99.93% of alignment tests without a deployment prompt, and is classed Critical under OpenAI's Preparedness Framework."
          - "Access is limited at first to a select group of approved Daybreak Red customers via API and Codex, while GPT-5.6 Cyber reached approved government customers through [Daybreak Red in AWS GovCloud](https://openai.com/index/daybreak-red-aws-govcloud/) and Hacktron's frontier-model access expanded through the [Hacktron partnership](https://openai.com/index/partnering-with-hacktron/)."
          - "A separate [prototype pipeline](https://openai.com/index/a-thousand-fewer-paths-to-root/) analysed 2,308 candidate Linux kernel findings, reproduced 1,724 and produced 948 local privilege escalation exploits, with 304 critical findings disclosed with candidate patches at roughly $1.2M in API cost."
        url: "https://openai.com/index/introducing-gpt-6-cyber/"
  - category: "Products & Hardware"
    color: "#10b981"
    items:
      - title: "Anthropic Launches Personal Finance in Claude via Plaid"
        summary:
          - "Personal Finance is in beta this week for Claude Pro, Max and Ultra users in the US, who connect bank and card accounts through Plaid so Claude never sees the bank password."
          - "Access is read-only, so Claude cannot move, manage or invest money, and Anthropic warns it can make mistakes and says users should verify important figures with their bank."
          - "Personal Finance hub chats are not used to train models, and Anthropic is inviting banks, wealth managers and financial services firms to help shape work with licensed professionals, a consumer step beyond the [finance push in the Oct 25 edition](/newsletter/2026-10-25/)."
        url: "https://claude.com/resources/articles/introducing-personal-finance-in-claude"
      - title: "OpenAI Launches Images 2.6 With GIFs and API Tools"
        summary:
          - "Images 2.6 adds GIF generation in ChatGPT, Codex and the API and is 50% faster than before."
          - "The API gains Flare and Sunburst image models, SVG export and image markup."
          - "OpenAI says users create about 4 billion images per week."
        url: "https://openai.com/index/introducing-images-2-6/"
  - category: "Research & Resources"
    color: "#ec4899"
    items:
      - title: "Weight-Space Programming: LLMs Read, Fix and Write Network Weights"
        summary:
          - "Using GPT-6 Astra with no gradient descent, the experiments fixed a failing PPO car-control network by editing 3.5% of weights (0% to 100% success), wrote MinAtar networks that beat PPO trained for 100M steps across 3 games, and wrote a 1.5M-parameter Go network that beats an equal-sized PPO trained on 20M games."
          - "Editing 0.016% of Qwen3.5-0.8B's weights fixed a reasoning-loop bug and lifted MATH-500 from 7.9% to 48.1%, GSM8K from 13.8% to 67.1% and IFEval from 21% to 62.3%, though weight edits can remove an obstacle but not add a capability the model lacked (Gemma 270M math barely moved)."
          - "Implications include auditing models for backdoors without running inference, a fresh angle on the [open-weights trust debate](/newsletter/2026-11-01/), and a companion result in which [Simon Willison](https://simonwillison.net/2026/Nov/3/qwen-can-interpret-model-weights/) found a local Qwen 3.8 27B identified Pac-Man, Pong and Breakout from game weights but failed Freeway, at 46 to 65 minutes per run."
        url: "https://rikiyat.github.io/blog/weight-space-programming/"
      - title: "Hamel Husain: Tune Decision-Model Thresholds for Evals"
        summary:
          - "On 100 traces from an apartment-leasing agent, the post compares decision models including TypeSafe Jev 1.13, Perplexity Decider 1.1 27B, Liquid d1 and d1-ultra, Cloudflare Clef Flash and the OpenAI Decisions API (GPT-6 Luna)."
          - "OpenAI Decisions had the best separation at F1 0.87 for 3.72 cents per 100 eval runs, while Perplexity was about 4.5x cheaper at 0.82 cents with F1 0.79, and tuning the default 0.50 threshold helped Liquid d1 and Clef Flash most."
          - "It adds independent evaluation to the [OpenAI Decisions API GA](/newsletter/2026-10-25/) and advises one narrow judge per failure mode, tested on your own data."
        url: "https://hamel.dev/blog/posts/decision-model-evals/"
      - title: "Anthropic Biology Team Maps Vault Particle Structure With Claude"
        summary:
          - "Anthropic's biology research lab says Claude helped at each step of mapping the first 3D structure of a vault particle found in prokaryotic cells."
          - "Vault particles are described as barrel-shaped and among the largest protein structures in cells."
          - "It follows the [Anthropic life sciences lab and enzyme work](/newsletter/2026-10-25/) from the Oct 25 edition."
        url: "https://www.anthropic.com/research/investigating-vault-particles-with-claude"
      - title: "OpenAI BioBasicsBench Tests Agents on Wet-Lab Science"
        summary:
          - "BioBasicsBench has 100 wet-lab analysis tasks built with biotech company Ligo."
          - "At xhigh effort GPT-6 Astra averaged 66.7% versus 43.8% for GPT-5.6 Sol."
          - "OpenAI notes remaining gaps in control checking and image interpretation."
        url: "https://openai.com/index/measuring-how-ai-agents-handle-wet-lab-science/"
---
