import re

with open('content/posts/openclaw-newsletter/index.md', 'r') as f:
    content = f.read()

marker_def = """
    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="#3b82f6"/>
    </marker>
"""

new_marker_def = """
    <marker id="arrowhead-blue" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="#3b82f6"/>
    </marker>
    <marker id="arrowhead-green" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="#25D366"/>
    </marker>
"""

content = content.replace(marker_def, new_marker_def)
content = content.replace('marker-end="url(#arrowhead)"', 'marker-end="url(#arrowhead-green)"', 3)
content = content.replace('marker-end="url(#arrowhead)"', 'marker-end="url(#arrowhead-blue)"')

with open('content/posts/openclaw-newsletter/index.md', 'w') as f:
    f.write(content)

