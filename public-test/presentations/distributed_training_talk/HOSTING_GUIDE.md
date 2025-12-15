# Hosting Guide for Distributed Training Presentation

This guide provides multiple options for hosting your presentation, from simple single-file bundles to professional hosting solutions.

## 📋 Table of Contents

1. [Option 1: Single HTML File Bundle](#option-1-single-html-file-bundle)
2. [Option 2: Static Site Hosting (Recommended)](#option-2-static-site-hosting-recommended)
3. [Option 3: GitHub Pages](#option-3-github-pages)
4. [Option 4: Netlify/Vercel](#option-4-netlifyvercel)
5. [Option 5: Simple HTTP Server](#option-5-simple-http-server)

---

## Option 1: Single HTML File Bundle

### Pros
- ✅ Single file to manage
- ✅ Easy to share via email or cloud storage
- ✅ Works offline after first load
- ✅ No server configuration needed

### Cons
- ❌ Very large file size (potentially 50-100+ MB with media)
- ❌ Slower initial load time
- ❌ Browser memory constraints
- ❌ Difficult to update individual pages

### Implementation

**Basic Bundle (Without Media):**
```bash
python bundle_presentation.py --output presentation.html
```

**Full Bundle (With Embedded Media):**
```bash
python bundle_presentation.py --output presentation.html --embed-media
```

⚠️ **Warning:** The `--embed-media` option will create a very large file (potentially 100+ MB). Consider hosting media separately.

---

## Option 2: Static Site Hosting (Recommended) ⭐

This is the **best option** for most use cases. Keep your current structure and host it as-is.

### Pros
- ✅ Maintains current structure
- ✅ Fast loading (files load on-demand)
- ✅ Easy to update individual pages
- ✅ Works with CDN for faster global access
- ✅ Can embed in iframe or share direct links

### Implementation

1. **Keep your current file structure:**
   ```
   your-presentation/
   ├── main.html
   ├── shared-styles.css
   ├── title.html
   ├── animation-utils.js
   └── sections/
       ├── 01-back-to-basics/
       ├── 02-why-distributed-training/
       └── ...
   ```

2. **Upload entire folder to hosting service**

3. **Access via:** `https://your-domain.com/main.html`

### Hosting Options:
- **GitHub Pages** (Free, see Option 3)
- **Netlify Drop** (Drag & drop, free)
- **Vercel** (Free tier)
- **Cloudflare Pages** (Free)
- **Your own web server**

---

## Option 3: GitHub Pages

Perfect for open-source or public presentations. Free and easy.

### Setup Steps

1. **Create a GitHub repository:**
   ```bash
   git init
   git add .
   git commit -m "Initial presentation"
   git remote add origin https://github.com/yourusername/distributed-training-talk.git
   git push -u origin main
   ```

2. **Enable GitHub Pages:**
   - Go to repository Settings → Pages
   - Select source branch (usually `main`)
   - Select folder (usually `/ (root)`)
   - Save

3. **Access your presentation:**
   - URL: `https://yourusername.github.io/distributed-training-talk/main.html`
   - Custom domain: Configure in Pages settings

### Custom Domain (Optional)
1. Add `CNAME` file to repo root:
   ```
   presentation.yourdomain.com
   ```
2. Configure DNS CNAME record

---

## Option 4: Netlify/Vercel

Perfect for professional hosting with automatic deployments.

### Netlify Drop (Simplest)

1. Go to [app.netlify.com/drop](https://app.netlify.com/drop)
2. Drag and drop your entire presentation folder
3. Get instant URL: `https://random-name.netlify.app`
4. Optionally configure custom domain

### Netlify with Git

1. Connect your GitHub repository
2. Build command: (leave empty - static files)
3. Publish directory: `/`
4. Deploy automatically on every git push

### Vercel

```bash
npm i -g vercel
cd /path/to/presentation
vercel
```

Follow prompts. That's it!

---

## Option 5: Simple HTTP Server

For local testing or internal hosting.

### Python HTTP Server

```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

Access at: `http://localhost:8000/main.html`

### Node.js HTTP Server

```bash
npx http-server -p 8000
```

### Docker (for production)

```dockerfile
FROM nginx:alpine
COPY . /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

```bash
docker build -t presentation .
docker run -p 80:80 presentation
```

---

## 🎯 Recommendation

**For Public Hosting:** Use **GitHub Pages** or **Netlify Drop**
- Free
- Easy setup
- Automatic HTTPS
- Custom domain support
- No server maintenance

**For Single File Sharing:** Use the bundler script without `--embed-media`
- Share the HTML file
- Host media files separately (e.g., on GitHub Releases, CDN, or cloud storage)
- Update paths in the bundle to point to external media URLs

**For Internal/Corporate:** Use static file hosting on your web server
- Better control
- Can integrate with authentication
- No external dependencies

---

## 🔧 Optimization Tips

1. **Optimize Images:**
   - Use WebP format where possible
   - Compress images (TinyPNG, ImageOptim)
   - Use responsive images

2. **Optimize Videos:**
   - Compress videos (HandBrake, FFmpeg)
   - Consider hosting on YouTube/Vimeo and embedding
   - Use poster images for faster loading

3. **Enable Caching:**
   Add to your server config (nginx/apache):
   ```nginx
   location ~* \.(css|js|jpg|jpeg|png|gif|ico|svg)$ {
       expires 1y;
       add_header Cache-Control "public, immutable";
   }
   ```

4. **Use CDN:**
   - Cloudflare (free tier)
   - jsDelivr (for GitHub repos)

---

## 📝 Quick Comparison

| Option | Cost | Setup Time | Best For |
|--------|------|------------|----------|
| Single HTML File | Free | 5 min | Email sharing |
| GitHub Pages | Free | 10 min | Open source, public |
| Netlify Drop | Free | 2 min | Quick deployment |
| Vercel | Free tier | 5 min | Modern workflow |
| Own Server | Varies | 30 min | Enterprise, control |

---

## 🆘 Troubleshooting

### Issue: Pages not loading in iframe
**Solution:** Ensure all paths are relative, not absolute

### Issue: Fonts not loading
**Solution:** Check Google Fonts URL is correct and internet connection

### Issue: Media files 404
**Solution:** Verify paths match actual file locations (case-sensitive)

### Issue: Animation controls not working
**Solution:** Ensure `animation-utils.js` is loaded before page scripts

---

## 📚 Additional Resources

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Netlify Documentation](https://docs.netlify.com/)
- [Vercel Documentation](https://vercel.com/docs)
- [MDN: Static Site Hosting](https://developer.mozilla.org/en-US/docs/Learn/Common_questions/What_is_a_web_server)

