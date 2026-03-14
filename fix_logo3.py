import re

with open('content/posts/openclaw-newsletter/index.md', 'r') as f:
    content = f.read()

# Let's replace the OpenClaw logo with a nice robot/claw logo or just a text if SVG is hard
# But a clean claw SVG is best
new_claw = r'''<g transform="translate(515, 95) scale(0.05)">
    <path fill="#3b82f6" d="M256,0 C114.6,0 0,114.6 0,256 C0,397.4 114.6,512 256,512 C397.4,512 512,397.4 512,256 C512,114.6 397.4,0 256,0 Z M384,352 C384,369.7 369.7,384 352,384 C334.3,384 320,369.7 320,352 L320,256 C320,220.7 291.3,192 256,192 C220.7,192 192,220.7 192,256 L192,352 C192,369.7 177.7,384 160,384 C142.3,384 128,369.7 128,352 L128,256 C128,185.3 185.3,128 256,128 C326.7,128 384,185.3 384,256 L384,352 Z"/>
  </g>'''

content = re.sub(r'<g transform="translate\(515, 100\) scale\(0.8\)">.*?</g>', new_claw, content, flags=re.DOTALL)

new_claw2 = new_claw.replace('translate(515, 95)', 'translate(515, 217)')
content = re.sub(r'<g transform="translate\(515, 222\) scale\(0.8\)">.*?</g>', new_claw2, content, flags=re.DOTALL)

new_claw3 = new_claw.replace('translate(515, 95)', 'translate(515, 337)')
content = re.sub(r'<g transform="translate\(515, 342\) scale\(0.8\)">.*?</g>', new_claw3, content, flags=re.DOTALL)

with open('content/posts/openclaw-newsletter/index.md', 'w') as f:
    f.write(content)

