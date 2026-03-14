import re

with open('content/posts/openclaw-newsletter/index.md', 'r') as f:
    content = f.read()

# Find the SVG block
svg_match = re.search(r'<svg.*?</svg>', content, re.DOTALL)
if svg_match:
    svg_content = svg_match.group(0)
    # Remove empty lines
    new_svg_content = re.sub(r'\n\s*\n', '\n', svg_content)
    content = content.replace(svg_content, new_svg_content)

with open('content/posts/openclaw-newsletter/index.md', 'w') as f:
    f.write(content)

