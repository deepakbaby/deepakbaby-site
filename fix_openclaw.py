import re

with open('content/posts/openclaw-newsletter/index.md', 'r') as f:
    content = f.read()

# Let's fix the transform and path
old_g = r'<g transform="translate\(510, 100\) scale\(1.2\)">(.*?)</g>'
new_g = r'<g transform="translate(510, 95) scale(1.2)">\n    <path fill="#3b82f6" d="M12 2C10.5 2 9 4 9 7C9 10 11 15 12 22C13 15 15 10 15 7C15 4 13.5 2 12 2Z M5 5C4 5 3 7 3 10C3 13 4.5 17 5 20C5.5 17 7 13 7 10C7 7 6 5 5 5Z M19 5C18 5 17 7 17 10C17 13 18.5 17 19 20C19.5 17 21 13 21 10C21 7 20 5 19 5Z"/>\n  </g>'

content = re.sub(r'<g transform="translate\(510, 100\) scale\(1.2\)">.*?</g>', new_g, content, flags=re.DOTALL)

new_g2 = r'<g transform="translate(510, 217) scale(1.2)">\n    <path fill="#3b82f6" d="M12 2C10.5 2 9 4 9 7C9 10 11 15 12 22C13 15 15 10 15 7C15 4 13.5 2 12 2Z M5 5C4 5 3 7 3 10C3 13 4.5 17 5 20C5.5 17 7 13 7 10C7 7 6 5 5 5Z M19 5C18 5 17 7 17 10C17 13 18.5 17 19 20C19.5 17 21 13 21 10C21 7 20 5 19 5Z"/>\n  </g>'
content = re.sub(r'<g transform="translate\(510, 222\) scale\(1.2\)">.*?</g>', new_g2, content, flags=re.DOTALL)

new_g3 = r'<g transform="translate(510, 337) scale(1.2)">\n    <path fill="#3b82f6" d="M12 2C10.5 2 9 4 9 7C9 10 11 15 12 22C13 15 15 10 15 7C15 4 13.5 2 12 2Z M5 5C4 5 3 7 3 10C3 13 4.5 17 5 20C5.5 17 7 13 7 10C7 7 6 5 5 5Z M19 5C18 5 17 7 17 10C17 13 18.5 17 19 20C19.5 17 21 13 21 10C21 7 20 5 19 5Z"/>\n  </g>'
content = re.sub(r'<g transform="translate\(510, 342\) scale\(1.2\)">.*?</g>', new_g3, content, flags=re.DOTALL)

with open('content/posts/openclaw-newsletter/index.md', 'w') as f:
    f.write(content)

