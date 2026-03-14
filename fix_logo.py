import re

with open('content/posts/openclaw-newsletter/index.md', 'r') as f:
    content = f.read()

old_path = '<path fill="#3b82f6" d="M4.5,3 C3.5,3 2.5,4 3,6 L5,20 C5.2,21 6.8,21 7,20 L9,6 C9.5,4 8.5,3 7.5,3 L4.5,3 Z M11.5,1 C10.5,1 9.5,2 10,4 L12,21 C12.2,22 13.8,22 14,21 L16,4 C16.5,2 15.5,1 14.5,1 L11.5,1 Z M18.5,4 C17.5,4 16.5,5 17,7 L18.5,19 C18.7,20 20.3,20 20.5,19 L22,7 C22.5,5 21.5,4 20.5,4 L18.5,4 Z"/>'
new_path = '<path fill="#3b82f6" d="M10.5 0C10.5 0 8 4.5 8 10C8 15.5 10.5 24 10.5 24C10.5 24 13 15.5 13 10C13 4.5 10.5 0 10.5 0Z M4 3C4 3 2 6.5 2 11C2 15.5 4 22 4 22C4 22 6 15.5 6 11C6 6.5 4 3 4 3Z M17 3C17 3 15 6.5 15 11C15 15.5 17 22 17 22C17 22 19 15.5 19 11C19 6.5 17 3 17 3Z"/>'

content = content.replace(old_path, new_path)

with open('content/posts/openclaw-newsletter/index.md', 'w') as f:
    f.write(content)

