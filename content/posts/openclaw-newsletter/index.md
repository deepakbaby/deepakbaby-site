---
title: "My openclaw setup for generating weekly newsletters"
date: 2026-03-13
draft: false
hero: hero.png
tags: ["AI", "OpenClaw", "automation", "newsletter", "AWS", "Hugo"]
categories: ["Projects"]
description: "A practical guide to building an automated weekly AI newsletter using OpenClaw on AWS Lightsail, with WhatsApp integration, RSS staging, and Hugo."
---

I wanted a way to share a curated weekly AI newsletter with colleagues. The idea: throughout the week, I come across interesting AI news (model releases, funding rounds, policy changes, papers) and I wanted to collect them casually and publish a polished newsletter every Monday.

I didn't want to spend Sunday evenings formatting HTML. I wanted something I could feed news to from my phone, and have it generate a ready-to-publish newsletter on demand.

<div style="max-width: 900px; margin: 2rem auto; padding: 1rem 0;">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 520" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">
  <defs>
    <linearGradient id="glowGrad" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#3b82f6" stop-opacity="0" /><stop offset="50%" stop-color="#3b82f6" stop-opacity="0.5" /><stop offset="100%" stop-color="#3b82f6" stop-opacity="0" /></linearGradient>
    <linearGradient id="phoneGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#1e293b"/><stop offset="100%" stop-color="#0f172a"/></linearGradient>
    <clipPath id="screenClip"><rect x="38" y="68" width="194" height="400" rx="4"/></clipPath>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="4" result="blur" /><feComposite in="SourceGraphic" in2="blur" operator="over" /></filter>
    <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#3b82f6" /></marker>
  </defs>
  <path d="M 245 150 C 270 150 280 120 300 120" stroke="#1e293b" stroke-width="2" fill="none" />
  <path d="M 245 270 C 270 270 280 240 300 240" stroke="#1e293b" stroke-width="2" fill="none" />
  <path d="M 245 385 C 270 385 280 360 300 360" stroke="#1e293b" stroke-width="2" fill="none" />
  <path d="M 530 360 L 650 240" stroke="#1e293b" stroke-width="2" fill="none" />
  <path d="M 650 240 L 780 240" stroke="#1e293b" stroke-width="2" fill="none" />
  <circle r="3" fill="#3b82f6" filter="url(#glow)"><animateMotion dur="3s" repeatCount="indefinite" path="M 245 150 C 270 150 280 120 300 120" /></circle>
  <circle r="3" fill="#3b82f6" filter="url(#glow)"><animateMotion dur="2.5s" repeatCount="indefinite" path="M 245 270 C 270 270 280 240 300 240" /></circle>
  <circle r="3" fill="#3b82f6" filter="url(#glow)"><animateMotion dur="3.5s" repeatCount="indefinite" path="M 245 385 C 270 385 280 360 300 360" /></circle>
  <circle r="4" fill="#60a5fa" filter="url(#glow)"><animateMotion dur="4s" repeatCount="indefinite" path="M 530 360 L 650 240 L 780 240" /></circle>
  <g transform="translate(10, 20) scale(0.95)">
    <rect x="25" y="30" width="220" height="468" rx="28" fill="url(#phoneGrad)" stroke="#334155" stroke-width="1.5"/>
    <rect x="95" y="34" width="80" height="18" rx="9" fill="#0f172a"/><circle cx="135" cy="43" r="4" fill="#1e293b"/>
    <rect x="38" y="58" width="194" height="420" rx="4" fill="#0b1120"/>
    <g clip-path="url(#screenClip)">
      <rect x="38" y="58" width="194" height="36" fill="#1a2332"/><text x="72" y="81" fill="#3b82f6" font-size="11" font-weight="700">OpenClaw</text>
      <g transform="translate(46, 68) scale(0.8)"><path fill="#25D366" d="M12 0C5.373 0 0 5.373 0 12c0 2.123.553 4.122 1.54 5.894L.15 23.85l6.11-1.602A11.94 11.94 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.785 0-3.48-.466-5-1.343l-.358-.212-3.714.974.992-3.62-.233-.37A9.94 9.94 0 0 1 2 12C2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10zm5.49-7.375c-.302-.15-1.786-.882-2.063-.983-.277-.101-.48-.15-.682.15-.202.302-.78 1.004-.956 1.205-.177.201-.354.226-.656.075-1.32-.66-2.54-1.503-3.56-2.46-.72-.68-1.29-1.48-1.68-2.36-.101-.225-.015-.352.136-.502.135-.135.302-.351.453-.527.15-.176.202-.301.302-.502.1-.201.05-.377-.025-.527-.075-.15-.682-1.643-.933-2.25-.245-.59-.495-.51-.682-.52-.176-.01-.378-.01-.58-.01-.202 0-.529.075-.806.376-.277.301-1.058 1.03-1.058 2.51 0 1.48 1.083 2.91 1.234 3.11.151.201 2.115 3.228 5.123 4.524 1.95.84 2.64.9 3.59.76.78-.11 2.39-.98 2.72-1.92.33-.94.33-1.74.23-1.92-.1-.18-.35-.28-.65-.43z"/></g>
      <circle cx="63" cy="82" r="3" fill="#22c55e"/><rect x="38" y="94" width="194" height="324" fill="#0b1120"/>
      <rect x="68" y="108" width="156" height="42" rx="10" fill="#1e3a5f"/><text x="78" y="125" fill="#93c5fd" font-size="9" font-weight="600">news:</text><text x="78" y="139" fill="#cbd5e1" font-size="8">openai.com/index/openai...</text>
      <rect x="48" y="158" width="140" height="30" rx="10" fill="#1e293b"/><text x="58" y="175" fill="#94a3b8" font-size="8">Saved. 4 items collected.</text>
      <rect x="82" y="254" width="142" height="30" rx="10" fill="#1e3a5f"/><text x="92" y="271" fill="#93c5fd" font-size="9" font-weight="600">publish newsletter</text>
      <rect x="48" y="292" width="158" height="30" rx="10" fill="#1e293b"/><text x="58" y="309" fill="#94a3b8" font-size="8">Newsletter generated.</text>
    </g>
    <rect x="85" y="480" width="100" height="4" rx="2" fill="#334155"/>
  </g>
  <g transform="translate(300, 40)">
    <rect width="250" height="400" rx="20" fill="#111827" stroke="#334155" stroke-width="1" stroke-dasharray="8,4" />
    <text x="125" y="-15" fill="#3b82f6" font-size="14" font-weight="800" text-anchor="middle" letter-spacing="2">AWS LIGHTSAIL</text>
    <image href="openclaw-logo.png" x="190" y="5" width="40" height="40" opacity="0.8" />
    <g transform="translate(20, 40)">
      <rect width="210" height="80" rx="12" fill="#1e293b" stroke="#3b82f6" stroke-width="1" filter="url(#glow)" />
      <text x="105" y="35" fill="#f8fafc" font-size="18" font-weight="600" text-anchor="middle">COLLECT</text>
      <text x="105" y="60" fill="#94a3b8" font-size="11" text-anchor="middle">Extract metadata from shared links</text>
    </g>
    <g transform="translate(20, 160)">
      <rect width="210" height="80" rx="12" fill="#1e293b" stroke="#3b82f6" stroke-width="1" filter="url(#glow)" />
      <text x="105" y="35" fill="#f8fafc" font-size="18" font-weight="600" text-anchor="middle">PREVIEW</text>
      <text x="105" y="60" fill="#94a3b8" font-size="11" text-anchor="middle">Interactive WhatsApp summaries</text>
    </g>
    <g transform="translate(20, 280)">
      <rect width="210" height="80" rx="12" fill="#1e293b" stroke="#3b82f6" stroke-width="1" filter="url(#glow)" />
      <text x="105" y="35" fill="#60a5fa" font-size="18" font-weight="600" text-anchor="middle">PUBLISH</text>
      <text x="105" y="60" fill="#94a3b8" font-size="11" text-anchor="middle">Web search + Hugo markdown</text>
    </g>
  </g>
  <g transform="translate(620, 180)">
    <rect width="120" height="120" rx="15" fill="#1e293b" stroke="#60a5fa" stroke-width="2" opacity="0.8" />
    <text x="60" y="55" fill="#f8fafc" font-size="20" font-weight="700" text-anchor="middle">GitHub</text>
    <text x="60" y="80" fill="#94a3b8" font-size="12" text-anchor="middle">PR & Review</text>
  </g>
  <g transform="translate(780, 180)">
    <circle r="60" cx="60" cy="60" fill="#000" stroke="#22c55e" stroke-width="3" stroke-dasharray="200" stroke-dashoffset="200"><animate attributeName="stroke-dashoffset" from="240" to="0" dur="2s" fill="freeze" /></circle>
    <text x="60" y="65" fill="#22c55e" font-size="18" font-weight="800" text-anchor="middle">Netlify</text>
    <text x="60" y="85" fill="#94a3b8" font-size="10" text-anchor="middle">LIVE DEPLOY</text>
  </g>
</svg>
</div>

The flow is conversational:

1. <span style="color: #3b82f6; font-weight: 600;">During the week</span>: I spot interesting AI news and drop links into a WhatsApp self-chat
2. <span style="color: #3b82f6; font-weight: 600;">Friday</span>: A cron job scans RSS feeds and Reddit, stages candidate stories, and sends me a summary
3. <span style="color: #3b82f6; font-weight: 600;">Saturday</span>: I say "publish" and the agent merges my picks with RSS candidates and fresh web search results, generates the newsletter, and pushes it to GitHub
4. <span style="color: #3b82f6; font-weight: 600;">Monday morning</span>: I review the PR, merge, and Netlify auto-deploys

No YAML files to edit. No scripts to run. Just WhatsApp messages.

## Why OpenClaw?

I initially sketched out a custom Python pipeline: web search collectors, a Claude-powered curation layer, Jinja2 templates. Maybe 500 lines across a dozen files.

Then I looked at [OpenClaw](https://openclaw.ai). It's an open-source, self-hosted AI agent that connects to messaging apps and can run tools, remember context, and execute tasks. The key realization: OpenClaw could replace that entire pipeline with a single "skill", a markdown file that teaches the agent what to do.

The tradeoff is maturity. OpenClaw is very new, and I hit plenty of rough edges. But for a personal project where I control the environment, the WhatsApp-native interaction model was worth it.

## Setting Up AWS Lightsail

### Why Not My Laptop?

OpenClaw runs with broad system permissions: file access, command execution, app interaction. Security researchers found over 30,000 exposed instances in a two-week scan, and there was a "ClawJacked" vulnerability where a malicious website could hijack a locally running agent. A cloud VM isolates all of that from my personal data.

Plus, the agent needs to be always-on to accept news items whenever I find them.

### The Setup

AWS launched an OpenClaw blueprint for Lightsail in early March 2026, making this nearly one-click:

1. **Create instance**: Lightsail console → Create instance → Linux/Unix → OpenClaw blueprint → 4 GB RAM plan (~$16/month)
2. **Pick a region**: I chose `eu-west-1` (Ireland), closest to Belgium
3. **Enable Bedrock**: Run the setup script from the Getting Started tab in AWS CloudShell. This creates the IAM role for Bedrock access
4. **Anthropic form**: Bedrock requires a one-time use case submission for Anthropic models. Submit and wait ~15 minutes

One thing to watch: if you just created your AWS account, Lightsail might not be available immediately.

### Security Choices

During SSH setup, OpenClaw asks about security. What I chose:

- <span style="color: #3b82f6; font-weight: 600;">File & folder protection</span>: Enabled (default). Config and tokens only readable by my user
- <span style="color: #3b82f6; font-weight: 600;">Browser remote control</span>: Disabled. No need for browser automation
- <span style="color: #3b82f6; font-weight: 600;">Exec host policy</span>: Host (not sandbox). The agent runs commands directly on the VM, which gives it access to git credentials and the push script. This is a deliberate tradeoff — the VM itself is the isolation boundary
- <span style="color: #3b82f6; font-weight: 600;">Shell command approval</span>: Allow, since the VM isolates everything from my personal machine

I initially ran with Docker sandbox mode, but switched to host execution after hitting too much friction with git credentials and file access. Since the Lightsail VM is a throwaway instance with nothing personal on it, running directly on the host is the pragmatic choice. The skill itself has strict rules — it never touches git except through the push script, never creates files outside its own folder, and never installs packages without asking.

## Connecting WhatsApp

The setup itself is simple:

```bash
openclaw plugins enable whatsapp
openclaw gateway restart
openclaw channels login
```

Scan the QR code with WhatsApp → Settings → Linked Devices → Link a Device. Done.

### The Self-Chat Safety

Here's something I learned the hard way: by default, OpenClaw responds to messages in **all** your WhatsApp chats. It started replying on my behalf in conversations with friends and colleagues. Not great.

To fix this:

```bash
openclaw config set channels.whatsapp.selfChatMode true
openclaw config set channels.whatsapp.dmPolicy allowlist
openclaw config set channels.whatsapp.allowFrom '[]'
openclaw gateway restart
```

Now it only responds in the "Message yourself" chat. The docs actually recommend a separate phone number (WhatsApp Business on the same device works), which is probably the right long-term move.

**Enable `selfChatMode` before anything else.**

## The Newsletter Skill

An OpenClaw skill is a folder with a `SKILL.md` file: YAML frontmatter plus markdown instructions. No SDK, no compilation. You're writing a detailed playbook that teaches the agent how to do a job.

```
~/.openclaw/workspace/skills/ai-newsletter/
├── SKILL.md
├── collected_items.jsonl
├── candidates.jsonl
├── output/
│   └── 2026-03-14.md
└── templates/
    └── newsletter_template.html
```

### Four Modes
<div class="blog-card-grid blog-card-grid--2col">
  <div class="blog-card">
    <div class="blog-card__label">01. Collect</div>
    <div class="blog-card__title">Casual Sharing</div>
    <p class="blog-card__text">Drop links into WhatsApp anytime. The agent parses metadata, determines the publish date (from URL meta tags or web search), and appends to <code>collected_items.jsonl</code>. These manual items always get priority in the final newsletter.</p>
  </div>
  <div class="blog-card">
    <div class="blog-card__label">02. Preview</div>
    <div class="blog-card__title">Instant Summary</div>
    <p class="blog-card__text">Text "generate newsletter" for an immediate text-based grouping of collected items. No web search, no git, no file generation — just a quick pulse check of what's been saved so far.</p>
  </div>
  <div class="blog-card">
    <div class="blog-card__label">03. Friday Staging Scan</div>
    <div class="blog-card__title">Automated RSS Scan</div>
    <p class="blog-card__text">A cron job triggers on Friday. The agent pulls RSS feeds from TechCrunch, Wired, VentureBeat, arXiv, and top Reddit AI subs. It deduplicates against manual items, saves candidates to <code>candidates.jsonl</code>, and sends a WhatsApp summary of what it found.</p>
  </div>
  <div class="blog-card">
    <div class="blog-card__label">04. Publish</div>
    <div class="blog-card__title">The Full Pipeline</div>
    <p class="blog-card__text">Merges manual items, RSS candidates, a fresh RSS pass, and targeted web searches. Deduplicates, caps at 15 items, generates Hugo markdown with exactly 3 bullet points per story, runs the push script, and sends a PR link via WhatsApp.</p>
  </div>
</div>

## Hugo Integration

My site runs on Hugo with Netlify deploys. I added a `/newsletter/` section with a list page showing all weeks (latest first) and individual pages with categorized news cards in a dark theme matching the rest of the site.

Each newsletter is a markdown file with structured frontmatter:

```yaml
---
title: "AI Weekly: OpenAI Acquires Promptfoo & Yann LeCun Raises $1B"
date: 2026-03-14
week_start: "2026-03-08"
week_end: "2026-03-14"
draft: false
highlights:
  - "OpenAI snaps up AI security testing firm Promptfoo"
  - "Yann LeCun's startup raises $1B for world-model AI"
news:
  - category: "Models & Releases"
    color: "#3b82f6"
    items:
      - title: "BitNet: 100B-Param Model Runs on Laptop CPUs"
        summary:
          - "Microsoft's 1-bit quantization enables 100B-param inference on consumer CPUs"
          - "Open-sourced on GitHub with 330+ upvotes on Hacker News"
        url: "https://github.com/microsoft/BitNet"
---
```

I have a custom Hugo template that renders this into styled newsletter pages automatically.

### The Push Script

Since the agent runs directly on the host (no sandbox), it can execute a shell script that handles the git workflow. The skill calls `~/push-newsletter.sh` at the end of the publish pipeline:

```bash
~/push-newsletter.sh 2026-03-14 ~/.openclaw/workspace/skills/ai-newsletter/output/2026-03-14.md
```

The script copies the markdown into the Hugo content directory, creates a branch, commits, and pushes. The agent then sends me the PR link via WhatsApp. This was originally a manual step when I was running in sandbox mode, but switching to host execution made it fully automatic.

### The RSS Staging Pipeline

The Friday staging scan was the biggest quality improvement. Before adding it, I was relying entirely on manual sharing plus a single web search pass at publish time. Running it on Friday gives the agent most of the week's stories while still leaving Saturday for the final publish pass to catch anything last-minute. The problem: web search results for "AI news this week" are noisy and often miss niche stories from Reddit or arXiv.

Now the agent pulls from 8 RSS feeds on Friday:

- <span style="color: #3b82f6; font-weight: 600;">News</span>: TechCrunch AI, Wired AI, VentureBeat
- <span style="color: #3b82f6; font-weight: 600;">Research</span>: arXiv cs.LG
- <span style="color: #3b82f6; font-weight: 600;">Community</span>: r/LocalLLaMA, r/MachineLearning, r/artificial, r/singularity (top posts, extracting the linked article URL, not the Reddit discussion URL)

These candidates get saved to `candidates.jsonl` and merged with manual items at publish time. Manual items always take priority — if I shared something, it's in the newsletter regardless of what RSS found.
## Things I Learned
<div class="blog-card-grid">
  <div class="blog-card">
    <div class="blog-card__header">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1 0-4.88 2.5 2.5 0 0 1 0-4.88 2.5 2.5 0 0 1 0-4.88A2.5 2.5 0 0 1 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 0-4.88 2.5 2.5 0 0 0 0-4.88 2.5 2.5 0 0 0 0-4.88A2.5 2.5 0 0 0 14.5 2Z"/></svg>
      <span class="blog-card__title">Instructions, Not Code</span>
    </div>
    <p class="blog-card__text">Writing a playbook for an agent is different from programming. You need to be explicit, add constraints, and include "Rules" for what not to do.</p>
  </div>
  <div class="blog-card">
    <div class="blog-card__header">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/></svg>
      <span class="blog-card__title">Host vs Sandbox</span>
    </div>
    <p class="blog-card__text">I started with Docker sandbox mode but switched to host execution. The sandbox blocked git credentials, file watchers, and push scripts. For a dedicated cloud VM with nothing personal on it, host mode is the pragmatic choice — just add strict rules to the skill itself.</p>
  </div>
  <div class="blog-card">
    <div class="blog-card__header">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
      <span class="blog-card__title">Agent Timeouts</span>
    </div>
    <p class="blog-card__text">Complex pipelines hit the 5-minute limit. Keep steps focused—dropping extra sources (Reddit/ArXiv) in favor of deep web search fixed it.</p>
  </div>
  <div class="blog-card">
    <div class="blog-card__header">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#a855f7" stroke-width="2"><path d="m7 11 2-2-2-2"/><path d="M11 19h10"/><rect x="3" y="5" width="18" height="14" rx="2"/></svg>
      <span class="blog-card__title">Context Limits</span>
    </div>
    <p class="blog-card__text">WhatsApp chats fill context windows quickly. Compaction helps, but using disk storage (JSONL) for raw data is more reliable than chat memory.</p>
  </div>
  <div class="blog-card">
    <div class="blog-card__header">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#eab308" stroke-width="2"><path d="M6 3 2 7l4 4"/><path d="m18 21 4-4-4-4"/><path d="M2 7h18a2 2 0 0 1 2 2v10"/></svg>
      <span class="blog-card__title">Start Simple</span>
    </div>
    <p class="blog-card__text">The most effective version is the simplest: share in, web search gap-fill, and markdown out. Complexity can wait for future iterations.</p>
  </div>
</div>

## What's Next

- ~~<span style="color: #22c55e; font-weight: 600;">RSS feed integration</span>~~: Done. Friday staging scan pulls from 8 feeds automatically
- ~~<span style="color: #22c55e; font-weight: 600;">Full automation</span>~~: Done. Switching from sandbox to host execution resolved the git push friction
- <span style="color: #3b82f6; font-weight: 600;">Automated publish scheduling</span>: use OpenClaw's cron to trigger the full publish pipeline every Saturday evening, so I just review the PR on Monday
- <span style="color: #3b82f6; font-weight: 600;">Separate WhatsApp number</span>: cleaner separation from personal chats
- <span style="color: #3b82f6; font-weight: 600;">Newsletter-specific RSS</span>: subscribe to curated newsletters (The Batch, Import AI, etc.) and auto-extract stories

The flow is now mostly automated. About 2 minutes during the week dropping items into WhatsApp, a Friday staging summary I glance at, and 5 minutes on Saturday reviewing and saying "publish." Good trade for a polished weekly newsletter.

You can see the result at [deepakbaby.in/newsletter](https://deepakbaby.in/newsletter).
