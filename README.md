# >> Core Web Vitals Optimization
### Transforming a Slow Website from [-] Red to [+] Green

---

##  Overview

This project is a complete **web performance optimization case study** demonstrating how to analyze, optimize, and measure Core Web Vitals to achieve a Google PageSpeed Green score.

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| LCP    | 5.2s   | 1.8s  | v 65%       |
| FID/INP| 250ms  | 60ms  | v 76%       |
| CLS    | 0.25   | 0.05  | v 80%       |
| TTFB   | 820ms  | 180ms | v 78%       |
| Score  | [-] 32  | [+] 97 | +65 pts     |

---

##  Project Structure

```
cwv-project/

 original-site/
    index.html              <- Intentionally unoptimized demo site

 optimized-site/
    index.html              <- Fully optimized site
    css/
       styles.css          <- Minified, critical-first CSS
    js/
       main.js             <- Deferred, tree-shaken JS
    sw.js                   <- Service Worker (cache strategies)
    images/                 <- WebP/AVIF optimized images

 reports/
    optimization-analysis.md <- Detailed audit report

 scripts/
    optimization-notes.md   <- Step-by-step optimization guide

 src/
    dashboard.html          <- Interactive performance dashboard

 README.md
```

---

## [SW] How to Run

### Option 1 – Open directly in browser
```bash
# Open optimized site
open optimized-site/index.html

# Open dashboard
open src/dashboard.html
```

### Option 2 – Local server (recommended)
```bash
npx serve .
# Visit http://localhost:3000/optimized-site/
```

---

##  Core Web Vitals Explained

###  LCP – Largest Contentful Paint
- **Measures:** Loading performance (when the largest element appears)
- **Good:** < 2.5s | **Needs Work:** 2.5–4s | **Poor:** > 4s
- **Fixes Applied:** WebP images, preload hints, CDN, eliminate render-blocking resources

###  FID / INP – First Input Delay / Interaction to Next Paint
- **Measures:** Interactivity responsiveness
- **Good:** < 100ms | **Needs Work:** 100–300ms | **Poor:** > 300ms
- **Fixes Applied:** Removed jQuery, code splitting, defer attribute, removed unused JS

###  CLS – Cumulative Layout Shift
- **Measures:** Visual stability (unexpected layout jumps)
- **Good:** < 0.1 | **Needs Work:** 0.1–0.25 | **Poor:** > 0.25
- **Fixes Applied:** Explicit image dimensions, font-display: swap, reserved space for ads

---

##  Optimization Techniques

1. **Image Optimization** – WebP/AVIF conversion, explicit dimensions, lazy loading
2. **Eliminate Render-Blocking JS** – `defer` attribute, remove jQuery, code splitting
3. **CDN Setup** – Cloudflare edge caching, HTTP/3, brotli compression
4. **CSS Optimization** – Critical CSS inlined, unused rules purged, minified
5. **Lazy Loading** – Native `loading="lazy"` + Intersection Observer
6. **Code Splitting** – Dynamic `import()`, route-based chunks
7. **Service Worker** – Pre-cache shell, stale-while-revalidate for images

---

##  Tools Used

| Tool | Purpose |
|------|---------|
| Google PageSpeed Insights | Primary scoring |
| Lighthouse (Chrome DevTools) | Detailed audit |
| WebPageTest | Waterfall analysis |
| ImageOptim / Squoosh | Image compression |
| PurgeCSS | Remove unused CSS |
| Webpack Bundle Analyzer | JS size analysis |

---
