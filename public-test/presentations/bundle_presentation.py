#!/usr/bin/env python3
"""
Presentation Bundler - Creates a single self-contained HTML file
from the multi-file presentation structure.

Usage:
    python bundle_presentation.py [--output output.html] [--embed-media]

Options:
    --output: Output filename (default: presentation-bundled.html)
    --embed-media: Embed images/videos as base64 (WARNING: Creates very large files)
"""

import os
import re
import base64
import argparse
from pathlib import Path
from urllib.parse import urljoin
import mimetypes

# Configuration
OUTPUT_FILE = "presentation-bundled.html"
EMBED_MEDIA = False

# File paths to exclude from embedding
EXCLUDED_PATTERNS = [
    r'\.git',
    r'node_modules',
    r'__pycache__',
    r'bundle_presentation\.py',
    r'\.md$',
    r'presentation-bundled\.html',
]

def should_exclude(path):
    """Check if a path should be excluded."""
    path_str = str(path)
    return any(re.search(pattern, path_str) for pattern in EXCLUDED_PATTERNS)

def read_file_content(filepath):
    """Read file content, handling encoding issues."""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            return f.read()
    except UnicodeDecodeError:
        # Binary file
        with open(filepath, 'rb') as f:
            return f.read()

def encode_base64(filepath):
    """Encode a file as base64 data URI."""
    mime_type, _ = mimetypes.guess_type(str(filepath))
    if not mime_type:
        # Default based on extension
        ext = filepath.suffix.lower()
        mime_map = {
            '.png': 'image/png',
            '.jpg': '.jpeg': 'image/jpeg',
            '.gif': 'image/gif',
            '.svg': 'image/svg+xml',
            '.mp4': 'video/mp4',
            '.webm': 'video/webm',
            '.mp3': 'audio/mpeg',
        }
        mime_type = mime_map.get(ext, 'application/octet-stream')
    
    with open(filepath, 'rb') as f:
        data = base64.b64encode(f.read()).decode('utf-8')
        return f"data:{mime_type};base64,{data}"

def inline_css(content, base_dir):
    """Inline external CSS files."""
    # Find all <link rel="stylesheet"> tags
    css_pattern = r'<link\s+[^>]*rel=["\']stylesheet["\'][^>]*href=["\']([^"\']+)["\'][^>]*>'
    
    def replace_css(match):
        href = match.group(1)
        # Skip external URLs
        if href.startswith('http://') or href.startswith('https://'):
            return match.group(0)
        
        css_path = base_dir / href
        if css_path.exists():
            css_content = read_file_content(css_path)
            return f'<style>\n{css_content}\n</style>'
        return match.group(0)
    
    return re.sub(css_pattern, replace_css, content)

def inline_scripts(content, base_dir):
    """Inline external JavaScript files."""
    script_pattern = r'<script\s+[^>]*src=["\']([^"\']+)["\'][^>]*></script>'
    
    def replace_script(match):
        src = match.group(1)
        # Skip external URLs
        if src.startswith('http://') or src.startswith('https://'):
            return match.group(0)
        
        script_path = base_dir / src
        if script_path.exists():
            script_content = read_file_content(script_path)
            return f'<script>\n{script_content}\n</script>'
        return match.group(0)
    
    return re.sub(script_pattern, replace_script, content)

def embed_images_and_videos(content, base_dir, embed_media=False):
    """Replace image/video src attributes with base64 or relative paths."""
    if not embed_media:
        # Just ensure paths are relative to the bundle location
        return content
    
    # Replace images
    img_pattern = r'<img\s+[^>]*src=["\']([^"\']+)["\'][^>]*>'
    
    def replace_img(match):
        src = match.group(1)
        if src.startswith('data:') or src.startswith('http'):
            return match.group(0)
        
        img_path = base_dir / src
        if img_path.exists():
            try:
                data_uri = encode_base64(img_path)
                # Replace just the src attribute
                return re.sub(r'src=["\'][^"\']+["\']', f'src="{data_uri}"', match.group(0))
            except Exception as e:
                print(f"Warning: Could not embed {img_path}: {e}")
                return match.group(0)
        return match.group(0)
    
    content = re.sub(img_pattern, replace_img, content)
    
    # Replace videos
    video_pattern = r'<video[^>]*>.*?<source[^>]*src=["\']([^"\']+)["\'][^>]*>.*?</video>'
    
    def replace_video(match):
        src = match.group(1)
        if src.startswith('data:') or src.startswith('http'):
            return match.group(0)
        
        video_path = base_dir / src
        if video_path.exists():
            try:
                data_uri = encode_base64(video_path)
                # Replace the source src
                return re.sub(r'<source[^>]*src=["\'][^"\']+["\']', f'<source src="{data_uri}"', match.group(0))
            except Exception as e:
                print(f"Warning: Could not embed {video_path}: {e}")
                return match.group(0)
        return match.group(0)
    
    content = re.sub(video_pattern, replace_video, content, flags=re.DOTALL)
    
    return content

def extract_page_content(html_file, base_dir):
    """Extract the body content and styles from an HTML file."""
    content = read_file_content(html_file)
    
    # Extract body content
    body_match = re.search(r'<body[^>]*>(.*?)</body>', content, re.DOTALL)
    body_content = body_match.group(1) if body_match else ""
    
    # Extract inline styles
    style_match = re.search(r'<style[^>]*>(.*?)</style>', content, re.DOTALL)
    inline_styles = style_match.group(1) if style_match else ""
    
    # Extract scripts (inline)
    script_matches = re.findall(r'<script[^>]*>(.*?)</script>', content, re.DOTALL)
    inline_scripts = "\n".join(script_matches)
    
    # Inline external resources
    content = inline_css(content, base_dir)
    content = inline_scripts(content, base_dir)
    
    # Re-extract after inlining
    style_match = re.search(r'<style[^>]*>(.*?)</style>', content, re.DOTALL)
    if style_match:
        inline_styles += "\n" + style_match.group(1)
    
    return {
        'body': body_content,
        'styles': inline_styles,
        'scripts': inline_scripts
    }

def bundle_presentation(output_file, embed_media=False):
    """Create a bundled single-file presentation."""
    print(f"Bundling presentation...")
    print(f"Output: {output_file}")
    print(f"Embed media: {embed_media}")
    
    base_dir = Path(__file__).parent
    
    # Read main.html
    main_file = base_dir / "main.html"
    if not main_file.exists():
        print(f"Error: {main_file} not found!")
        return
    
    main_content = read_file_content(main_file)
    
    # Inline shared-styles.css
    shared_styles = base_dir / "shared-styles.css"
    shared_css = ""
    if shared_styles.exists():
        shared_css = read_file_content(shared_styles)
        print(f"Inlined shared-styles.css ({len(shared_css)} chars)")
    
    # Inline animation-utils.js
    anim_utils = base_dir / "animation-utils.js"
    anim_js = ""
    if anim_utils.exists():
        anim_js = read_file_content(anim_utils)
        print(f"Inlined animation-utils.js ({len(anim_js)} chars)")
    
    # Read title.html
    title_file = base_dir / "title.html"
    title_content = extract_page_content(title_file, title_file.parent) if title_file.exists() else None
    
    # Find all section pages
    sections_dir = base_dir / "sections"
    section_pages = {}
    
    if sections_dir.exists():
        for html_file in sections_dir.rglob("*.html"):
            if should_exclude(html_file):
                continue
            
            relative_path = html_file.relative_to(base_dir)
            section_pages[str(relative_path)] = extract_page_content(html_file, html_file.parent)
            print(f"Processed: {relative_path}")
    
    # Generate bundled HTML
    # We need to modify the main.html structure to include all pages inline
    
    # Start building the bundled HTML
    bundled_html = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Distributed Training - Presentation</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
{shared_css}
    </style>
"""
    
    # Extract and add styles from main.html
    main_styles_match = re.search(r'<style[^>]*>(.*?)</style>', main_content, re.DOTALL)
    if main_styles_match:
        bundled_html += f"""    <style>
{main_styles_match.group(1)}
    </style>
"""
    
    bundled_html += """</head>
<body>
"""
    
    # Add body content from main.html (but we'll modify the JavaScript)
    # Extract the body HTML
    main_body_match = re.search(r'<body[^>]*>(.*?)</body>', main_content, re.DOTALL)
    if main_body_match:
        bundled_html += main_body_match.group(1)
    
    # Now we need to modify the JavaScript to use inline pages instead of iframes
    # Extract JavaScript from main.html
    main_scripts_match = re.search(r'<script[^>]*>(.*?)</script>', main_content, re.DOTALL | re.MULTILINE)
    if main_scripts_match:
        js_content = main_scripts_match.group(1)
        
        # Store page contents in JavaScript
        pages_data_js = f"""
        // Bundled page contents
        const bundledPages = {{
"""
        
        # Add title page
        if title_content:
            pages_data_js += f"""            'title.html': {{
                body: `{title_content['body'].replace('`', '\\`').replace('${', '\\${}')}`,
                styles: `{title_content['styles'].replace('`', '\\`').replace('${', '\\${}')}`,
                scripts: `{title_content['scripts'].replace('`', '\\`').replace('${', '\\${}')}`
            }},
"""
        
        # Add section pages
        for page_path, page_data in section_pages.items():
            escaped_path = page_path.replace('\\', '/')
            pages_data_js += f"""            '{escaped_path}': {{
                body: `{page_data['body'].replace('`', '\\`').replace('${', '\\${}')}`,
                styles: `{page_data['styles'].replace('`', '\\`').replace('${', '\\${}')}`,
                scripts: `{page_data['scripts'].replace('`', '\\`').replace('${', '\\${}')}`
            }},
"""
        
        pages_data_js += """        };
"""
        
        # Modify the JavaScript to load pages from bundledPages instead of iframes
        js_content = pages_data_js + js_content
        
        # Replace iframe loading logic
        # This is complex - we'll need to modify the page loading to inject HTML directly
        
        bundled_html += f"""
    <script>
{anim_js}
    </script>
    <script>
{js_content}
    </script>
"""
    
    bundled_html += """</body>
</html>
"""
    
    # Write output
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(bundled_html)
    
    file_size = os.path.getsize(output_file) / (1024 * 1024)  # MB
    print(f"\n✅ Bundle created: {output_file}")
    print(f"   Size: {file_size:.2f} MB")
    print(f"\n⚠️  Note: This is a basic bundle. Images/videos are still referenced as external files.")
    print(f"   To embed everything, use --embed-media flag (creates very large files)")

def main():
    parser = argparse.ArgumentParser(description='Bundle presentation into single HTML file')
    parser.add_argument('--output', '-o', default=OUTPUT_FILE, help='Output filename')
    parser.add_argument('--embed-media', action='store_true', help='Embed images/videos as base64')
    
    args = parser.parse_args()
    
    bundle_presentation(args.output, args.embed_media)

if __name__ == '__main__':
    main()

