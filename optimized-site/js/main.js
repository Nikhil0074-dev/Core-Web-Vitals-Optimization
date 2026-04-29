/**
 * main.js — Core Web Vitals Optimized Site
 *
 * [OK] Loaded with `defer` — never blocks rendering
 * [OK] No jQuery — pure vanilla JS (saves 87 KB)
 * [OK] Zero dead code
 * [OK] Uses passive event listeners
 * [OK] Uses requestAnimationFrame for smooth animations
 */

'use strict';

/*  1. Scroll progress bar  */
(function initProgress() {
  const bar = document.getElementById('read-progress');
  if (!bar) return;
  const update = () => {
    const scrolled = window.scrollY;
    const total    = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = `scaleX(${total > 0 ? scrolled / total : 0})`;
  };
  window.addEventListener('scroll', update, { passive: true });
})();


/*  2. Intersection Observer -> fade-up animations  */
(function initFadeUp() {
  const els = document.querySelectorAll('.fade-up');
  if (!els.length) return;

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  els.forEach(el => io.observe(el));
})();


/*  3. Animated counters  */
function animateCounter(el) {
  const raw      = el.dataset.target || '0';
  const target   = parseFloat(raw);
  const decimals = raw.includes('.') ? raw.split('.')[1].length : 0;
  const duration = 1400; // ms
  let   startTs  = null;

  function tick(ts) {
    if (!startTs) startTs = ts;
    const elapsed  = ts - startTs;
    const progress = Math.min(elapsed / duration, 1);
    // Ease-out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = (target * eased).toFixed(decimals);
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

(function initCounters() {
  const strip = document.querySelector('.score-strip');
  if (!strip) return;

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          strip.querySelectorAll('[data-target]').forEach(animateCounter);
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );
  io.observe(strip);
})();


/*  4. Register Service Worker  */
(function registerSW() {
  if (!('serviceWorker' in navigator)) return;
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('sw.js')
      .then(reg  => console.log('[SW] Registered:', reg.scope))
      .catch(err => console.warn('[SW] Registration failed:', err));
  });
})();

