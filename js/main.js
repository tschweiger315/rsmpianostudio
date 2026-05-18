/* ============================================
   RSM Piano Studio — Global JS
   Piano key cursor · Wave engine · Nav · Reveals
   ============================================ */

(function() {
  'use strict';

  /* ── CURSOR ──────────────────────────────────── */
  const cursorKey    = document.getElementById('cursor-key');
  const cursorRipple = document.getElementById('cursor-ripple');
  let   cx = window.innerWidth / 2;
  let   cy = window.innerHeight / 2;

  document.addEventListener('mousemove', e => {
    cx = e.clientX; cy = e.clientY;
    if (cursorKey) {
      cursorKey.style.left = cx + 'px';
      cursorKey.style.top  = cy + 'px';
    }
  });

  // Ripple on click
  document.addEventListener('click', e => {
    if (!cursorRipple) return;
    cursorRipple.style.left   = e.clientX + 'px';
    cursorRipple.style.top    = e.clientY + 'px';
    cursorRipple.style.animation = 'none';
    cursorRipple.offsetHeight; // reflow
    cursorRipple.style.animation = 'rippleOut 0.5s ease-out forwards';
  });

  // Hovering state
  document.addEventListener('mouseover', e => {
    if (!cursorKey) return;
    const t = e.target;
    if (t.matches('a, button, [data-hover]')) {
      cursorKey.classList.add('hovering');
    }
  });

  document.addEventListener('mouseout', e => {
    if (!cursorKey) return;
    const t = e.target;
    if (t.matches('a, button, [data-hover]')) {
      cursorKey.classList.remove('hovering');
    }
  });

  /* ── SCROLLING WAVE ──────────────────────────── */
  const canvas = document.getElementById('wave-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let W, H, t = 0;

    function resize() {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const waves = [
      { amp: 14, freq: 0.008, speed: 0.012, alpha: 0.18, color: '142,175,212' },
      { amp: 9,  freq: 0.013, speed: 0.018, alpha: 0.10, color: '200,205,216' },
      { amp: 18, freq: 0.005, speed: 0.007, alpha: 0.07, color: '142,175,212' },
    ];

    function drawWaves() {
      ctx.clearRect(0, 0, W, H);
      waves.forEach(w => {
        ctx.beginPath();
        ctx.moveTo(0, H / 2);
        for (let x = 0; x <= W; x += 3) {
          const y = H / 2 + Math.sin(x * w.freq + t * w.speed) * w.amp
                          + Math.sin(x * w.freq * 1.7 + t * w.speed * 0.6) * (w.amp * 0.4);
          ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(${w.color}, ${w.alpha})`;
        ctx.lineWidth   = 1.2;
        ctx.stroke();
      });
      t++;
      requestAnimationFrame(drawWaves);
    }
    drawWaves();
  }

  /* ── NAVBAR SCROLL ───────────────────────────── */
  const navbar = document.getElementById('navbar');
  if (navbar) {
    let lastY = 0;
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      if (y > 60) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
      lastY = y;
    });
  }

  /* ── HAMBURGER / MOBILE ──────────────────────── */
  const ham     = document.getElementById('hamburger');
  const mobMenu = document.getElementById('mobile-menu');

  if (ham && mobMenu) {
    ham.addEventListener('click', () => {
      const open = ham.classList.toggle('open');
      mobMenu.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });

    mobMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        ham.classList.remove('open');
        mobMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ── SCROLL REVEAL ───────────────────────────── */
  function initReveals() {
    const els = document.querySelectorAll('.reveal, .reveal-left');
    if (!els.length) return;

    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

    els.forEach(el => io.observe(el));
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initReveals);
  } else {
    initReveals();
  }

  /* ── ACTIVE NAV LINK ─────────────────────────── */
  function setActiveNav() {
    const path = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(a => {
      const href = a.getAttribute('href') || '';
      if (href === path || (path === 'index.html' && href === 'index.html')) {
        a.classList.add('active');
      } else {
        a.classList.remove('active');
      }
    });
  }
  setActiveNav();

  /* ── PIANO KEYS INTERACTIVE HOVER ───────────── */
  document.querySelectorAll('.key-w, .key-b, .hero-key-w').forEach(key => {
    key.addEventListener('mouseenter', () => {
      key.style.background = 'rgba(142,175,212,0.15)';
    });
    key.addEventListener('mouseleave', () => {
      key.style.background = '';
    });
  });

  /* ── FORM ENHANCEMENTS ───────────────────────── */
  document.querySelectorAll('.form-input, .form-select, .form-textarea').forEach(el => {
    const field = el.closest('.form-field');
    if (!field) return;
    // Line already animates via CSS :focus-within
  });

  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      const btn = contactForm.querySelector('[type="submit"]');
      const msg = document.getElementById('form-success');
      if (btn) {
        btn.textContent = 'Message Sent';
        btn.style.color = 'var(--accent)';
        btn.style.borderColor = 'rgba(142,175,212,0.3)';
        btn.disabled = true;
      }
      if (msg) {
        msg.style.opacity = '1';
        msg.style.transform = 'translateY(0)';
      }
    });
  }

  /* ── PAGE TRANSITION LINKS ───────────────────── */
  // Add a subtle fade-in on page load
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease';
  window.addEventListener('load', () => {
    document.body.style.opacity = '1';
  });

  // Subtle transition on internal links
  document.querySelectorAll('a[href]').forEach(a => {
    const href = a.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto') || href.startsWith('http')) return;
    a.addEventListener('click', e => {
      e.preventDefault();
      document.body.style.opacity = '0';
      setTimeout(() => { window.location.href = href; }, 350);
    });
  });

})();
