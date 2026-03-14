import re

with open('content/posts/openclaw-newsletter/index.md', 'r') as f:
    content = f.read()

# Let's replace the OpenClaw logo with a very simple and clean claw SVG
new_claw = r'''<g transform="translate(515, 100) scale(0.8)">
    <path fill="#3b82f6" d="M12,0 C8,0 6,5 6,10 C6,16 9,24 12,30 C15,24 18,16 18,10 C18,5 16,0 12,0 Z M4,4 C2,4 0,8 0,12 C0,17 2,23 4,28 C6,23 8,17 8,12 C8,8 6,4 4,4 Z M20,4 C18,4 16,8 16,12 C16,17 18,23 20,28 C22,23 24,17 24,12 C24,8 22,4 20,4 Z"/>
  </g>'''

content = re.sub(r'<g transform="translate\(510, 95\) scale\(1.2\)">.*?</g>', new_claw, content, flags=re.DOTALL)

new_claw2 = new_claw.replace('translate(515, 100)', 'translate(515, 222)')
content = re.sub(r'<g transform="translate\(510, 217\) scale\(1.2\)">.*?</g>', new_claw2, content, flags=re.DOTALL)

new_claw3 = new_claw.replace('translate(515, 100)', 'translate(515, 342)')
content = re.sub(r'<g transform="translate\(510, 337\) scale\(1.2\)">.*?</g>', new_claw3, content, flags=re.DOTALL)

with open('content/posts/openclaw-newsletter/index.md', 'w') as f:
    f.write(content)

