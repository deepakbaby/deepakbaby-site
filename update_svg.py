import re

with open('content/posts/openclaw-newsletter/index.md', 'r') as f:
    content = f.read()

# WhatsApp logo
wa_logo = """<g transform="translate(46, 68) scale(0.8)">
      <path fill="#25D366" d="M12 0C5.373 0 0 5.373 0 12c0 2.123.553 4.122 1.54 5.894L.15 23.85l6.11-1.602A11.94 11.94 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.785 0-3.48-.466-5-1.343l-.358-.212-3.714.974.992-3.62-.233-.37A9.94 9.94 0 0 1 2 12C2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10zm5.49-7.375c-.302-.15-1.786-.882-2.063-.983-.277-.101-.48-.15-.682.15-.202.302-.78 1.004-.956 1.205-.177.201-.354.226-.656.075-1.32-.66-2.54-1.503-3.56-2.46-.72-.68-1.29-1.48-1.68-2.36-.101-.225-.015-.352.136-.502.135-.135.302-.351.453-.527.15-.176.202-.301.302-.502.1-.201.05-.377-.025-.527-.075-.15-.682-1.643-.933-2.25-.245-.59-.495-.51-.682-.52-.176-.01-.378-.01-.58-.01-.202 0-.529.075-.806.376-.277.301-1.058 1.03-1.058 2.51 0 1.48 1.083 2.91 1.234 3.11.151.201 2.115 3.228 5.123 4.524 1.95.84 2.64.9 3.59.76.78-.11 2.39-.98 2.72-1.92.33-.94.33-1.74.23-1.92-.1-.18-.35-.28-.65-.43z"/>
    </g>"""

# Replace the circle and robot emoji with WhatsApp logo
content = re.sub(
    r'<circle cx="56" cy="76" r="10" fill="#1e3a5f"/>\n\s*<text x="56" y="80" text-anchor="middle" fill="#3b82f6" font-size="10">&#x1F916;</text>',
    wa_logo,
    content
)

# AWS logo
aws_logo = """<g transform="translate(680, 42) scale(0.6)">
    <path fill="#FF9900" d="M10.99 15.63c-1.31 1.04-3.41 1.76-5.46 1.76-3.1 0-5.53-1.42-5.53-4.59 0-3.32 2.75-4.8 6.64-4.8 1.48 0 2.87.32 3.96.88v-1.1c0-1.68-.84-2.8-2.9-2.8-1.35 0-2.67.48-3.6 1.16l-1.07-2.12c1.35-.88 3.16-1.4 5.06-1.4 4.02 0 5.43 2.36 5.43 5.48v5.52c0 .8.16 1.48.44 1.96v.16h-2.71c-.16-.4-.24-.92-.28-1.48v-.04c-.04 0-.04.04-.04.04zm-2.95-6.16c-.8-.4-1.84-.6-2.83-.6-2.15 0-3.47.88-3.47 2.4 0 1.28.96 2.08 2.47 2.08 1.48 0 2.75-.6 3.83-1.6v-2.28zM24.78 2.91l-3.35 10.4h-2.87l-2.23-7.04-2.27 7.04h-2.83l-3.35-10.4h2.83l1.91 6.84 2.23-6.84h2.95l2.23 6.84 1.91-6.84h2.83zM30.73 6.83c1.35 0 2.51.36 3.23.8l-1.04 2.16c-.6-.36-1.48-.64-2.27-.64-1.12 0-1.68.48-1.68 1.08 0 .6.48.92 1.84 1.32 1.95.56 3.11 1.44 3.11 3.24 0 2.2-1.68 3.56-4.15 3.56-1.64 0-3.11-.48-4.07-1.04l1.16-2.2c.8.48 1.91.88 2.91.88 1.24 0 1.84-.52 1.84-1.16 0-.64-.48-1.04-1.95-1.44-1.87-.56-3.03-1.48-3.03-3.12 0-2.04 1.56-3.44 4.08-3.44z"/>
    <path fill="#FF9900" d="M19.63 20.31c-4.11 1.52-8.57 2.24-12.8 2.12-2.31-.08-4.59-.44-6.82-1.04-.32-.08-.44-.44-.2-.68.88-.88 1.91-1.6 2.99-2.16.24-.12.52-.04.68.16 2.23 2.8 5.62 4.4 9.17 4.4 2.63 0 5.18-.8 7.38-2.28.24-.16.56-.12.72.12l.52.8c.12.2.04.44-.16.56z"/>
    <path fill="#FF9900" d="M20.59 16.91c.2-.28.6-.28.84-.04.88.8 1.87 1.48 2.95 2.04.28.16.28.56 0 .72-1.32.8-2.75 1.4-4.23 1.8-.28.08-.56-.12-.6-.44-.08-.8-.04-1.6.12-2.36.04-.28.32-.44.56-.32.52.28 1.04.6 1.52.96l-1.16-2.36z"/>
  </g>"""

# Add AWS logo next to "WHAT HAPPENS ON THE SERVER"
content = content.replace(
    '<text x="560" y="56" text-anchor="middle" fill="#94a3b8" font-size="11" letter-spacing="2">WHAT HAPPENS ON THE SERVER</text>',
    '<text x="540" y="56" text-anchor="middle" fill="#94a3b8" font-size="11" letter-spacing="2">WHAT HAPPENS ON AWS</text>\n  ' + aws_logo
)

# Claude logo
claude_logo = """<g transform="translate(510, 100) scale(1.2)">
    <path fill="#D97757" d="M12.4,2.2l-9.8,17l2.6,0l2.3-4.1l9.8,0l2.3,4.1l2.6,0l-9.8-17L12.4,2.2z M9.1,13l3.3-5.8l3.3,5.8H9.1z"/>
  </g>"""

# Add Claude logo to the Collect panel
content = content.replace(
    '<text x="336" y="112" fill="#3b82f6" font-size="12" font-weight="700">Collect</text>',
    '<text x="336" y="112" fill="#3b82f6" font-size="12" font-weight="700">Collect</text>\n  ' + claude_logo
)

claude_logo2 = """<g transform="translate(510, 222) scale(1.2)">
    <path fill="#D97757" d="M12.4,2.2l-9.8,17l2.6,0l2.3-4.1l9.8,0l2.3,4.1l2.6,0l-9.8-17L12.4,2.2z M9.1,13l3.3-5.8l3.3,5.8H9.1z"/>
  </g>"""

# Add Claude logo to the Preview panel
content = content.replace(
    '<text x="336" y="234" fill="#3b82f6" font-size="12" font-weight="700">Preview</text>',
    '<text x="336" y="234" fill="#3b82f6" font-size="12" font-weight="700">Preview</text>\n  ' + claude_logo2
)

claude_logo3 = """<g transform="translate(510, 342) scale(1.2)">
    <path fill="#D97757" d="M12.4,2.2l-9.8,17l2.6,0l2.3-4.1l9.8,0l2.3,4.1l2.6,0l-9.8-17L12.4,2.2z M9.1,13l3.3-5.8l3.3,5.8H9.1z"/>
  </g>"""

# Add Claude logo to the Publish panel
content = content.replace(
    '<text x="336" y="354" fill="#3b82f6" font-size="12" font-weight="700">Publish</text>',
    '<text x="336" y="354" fill="#3b82f6" font-size="12" font-weight="700">Publish</text>\n  ' + claude_logo3
)

# Add explicit flow arrows
flow_arrows = """
  <!-- Explicit Flow Arrows -->
  <path d="M248,139 L310,139" fill="none" stroke="#25D366" stroke-width="2" marker-end="url(#arrowhead)"/>
  <path d="M248,290 L310,265" fill="none" stroke="#25D366" stroke-width="2" marker-end="url(#arrowhead)"/>
  <path d="M248,400 L310,390" fill="none" stroke="#25D366" stroke-width="2" marker-end="url(#arrowhead)"/>
  <path d="M550,395 L590,395" fill="none" stroke="#3b82f6" stroke-width="2" marker-end="url(#arrowhead)"/>
"""

# Add marker def
marker_def = """
    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="#3b82f6"/>
    </marker>
"""

content = content.replace('</defs>', marker_def + '  </defs>')
content = content.replace('<!-- ========== RIGHT SIDE: Server panels ========== -->', flow_arrows + '\n  <!-- ========== RIGHT SIDE: Server panels ========== -->')

with open('content/posts/openclaw-newsletter/index.md', 'w') as f:
    f.write(content)

