import re

with open('content/posts/openclaw-newsletter/index.md', 'r') as f:
    content = f.read()

# Let's replace the OpenClaw logo with a very explicit and simple claw SVG
new_claw = r'''<g transform="translate(510, 95) scale(1.2)">
    <path fill="#3b82f6" d="M10,2 Q8,8 10,18 Q12,8 14,2 Z M4,6 Q3,10 5,16 Q7,10 8,6 Z M16,6 Q15,10 17,16 Q19,10 20,6 Z"/>
  </g>'''

content = re.sub(r'<g transform="translate\(515, 95\) scale\(0.05\)">.*?</g>', new_claw, content, flags=re.DOTALL)

new_claw2 = new_claw.replace('translate(510, 95)', 'translate(510, 217)')
content = re.sub(r'<g transform="translate\(515, 217\) scale\(0.05\)">.*?</g>', new_claw2, content, flags=re.DOTALL)

new_claw3 = new_claw.replace('translate(510, 95)', 'translate(510, 337)')
content = re.sub(r'<g transform="translate\(515, 337\) scale\(0.05\)">.*?</g>', new_claw3, content, flags=re.DOTALL)

with open('content/posts/openclaw-newsletter/index.md', 'w') as f:
    f.write(content)

