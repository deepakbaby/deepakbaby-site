# Quick Deployment Guide

## 🎯 Recommended: Host As-Is (Easiest & Best Performance)

Your presentation is already structured perfectly for web hosting. No bundling needed!

### Option 1: GitHub Pages (Free, ~5 minutes)

1. **Initialize git repository:**
   ```bash
   git init
   git add .
   git commit -m "Initial presentation"
   ```

2. **Create repository on GitHub:**
   - Go to https://github.com/new
   - Create repository (public or private)
   - Don't initialize with README

3. **Push your code:**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/distributed-training-talk.git
   git branch -M main
   git push -u origin main
   ```

4. **Enable GitHub Pages:**
   - Go to repo Settings → Pages
   - Source: Deploy from a branch
   - Branch: `main` / `/ (root)`
   - Save

5. **Access your presentation:**
   ```
   https://YOUR_USERNAME.github.io/distributed-training-talk/main.html
   ```

### Option 2: Netlify Drop (Free, ~2 minutes)

1. Go to https://app.netlify.com/drop
2. Drag your entire presentation folder
3. Get instant URL: `https://random-name-123.netlify.app/main.html`
4. Optional: Configure custom domain in site settings

### Option 3: Vercel (Free, ~3 minutes)

```bash
npm i -g vercel
cd /path/to/your/presentation
vercel
```

Follow prompts. Done!

---

## 📦 Creating a Single HTML File

**Note:** Due to the iframe-based structure, a true single-file bundle is complex. Here are your options:

### Option A: Use Current Structure + CDN for Media

1. Keep your HTML files as-is
2. Upload media (images/videos) to a CDN or cloud storage
3. Update paths in HTML files to point to CDN URLs
4. Share the main.html file + instructions

**Pros:** Smaller file size, faster loading  
**Cons:** Still requires external resources

### Option B: Modified Version Without Iframes

I can help you create a version that:
- Loads pages via fetch/innerHTML instead of iframes
- Embeds all HTML inline
- Can be bundled into a single file more easily

Would require refactoring the page loading logic.

---

## 🔧 Quick Commands

### Test Locally

```bash
# Python
python -m http.server 8000

# Node.js
npx http-server -p 8000

# PHP
php -S localhost:8000
```

Then visit: `http://localhost:8000/main.html`

### Prepare for Deployment

```bash
# Check file sizes
du -sh sections/*/images sections/*/videos

# Optimize images (optional)
# Use tools like ImageOptim, TinyPNG, or squoosh.app
```

---

## ❓ FAQ

**Q: Can I create a true single HTML file?**  
A: Yes, but it will be very large (50-100+ MB) if you embed media. The iframe structure makes it complex. Consider hosting as-is instead.

**Q: Will it work offline?**  
A: Yes! After first load, everything is cached. Or use a service worker for true offline support.

**Q: Can I embed it in an iframe on my website?**  
A: Yes! Just link to your hosted `main.html`:
```html
<iframe src="https://your-domain.com/main.html" width="100%" height="800px"></iframe>
```

**Q: How do I update it?**  
A: Just update files and push to git (if using GitHub Pages/Netlify), or re-upload to your hosting service.

---

## 📝 Summary

**Best Approach:** Host your presentation as-is using GitHub Pages or Netlify Drop. No bundling needed, works perfectly, and is easier to maintain.

**Single File:** Possible but complex due to iframe structure. Consider converting to direct HTML injection if you really need it.

