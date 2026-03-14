import re

with open('content/posts/openclaw-newsletter/index.md', 'r') as f:
    content = f.read()

claude_path = '<path fill="#D97757" d="M12.4,2.2l-9.8,17l2.6,0l2.3-4.1l9.8,0l2.3,4.1l2.6,0l-9.8-17L12.4,2.2z M9.1,13l3.3-5.8l3.3,5.8H9.1z"/>'
openclaw_path = '<path fill="#3b82f6" d="M4.5,3 C3.5,3 2.5,4 3,6 L5,20 C5.2,21 6.8,21 7,20 L9,6 C9.5,4 8.5,3 7.5,3 L4.5,3 Z M11.5,1 C10.5,1 9.5,2 10,4 L12,21 C12.2,22 13.8,22 14,21 L16,4 C16.5,2 15.5,1 14.5,1 L11.5,1 Z M18.5,4 C17.5,4 16.5,5 17,7 L18.5,19 C18.7,20 20.3,20 20.5,19 L22,7 C22.5,5 21.5,4 20.5,4 L18.5,4 Z"/>'

content = content.replace(claude_path, openclaw_path)

with open('content/posts/openclaw-newsletter/index.md', 'w') as f:
    f.write(content)

