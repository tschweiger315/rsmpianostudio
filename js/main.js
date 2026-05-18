/* =============================================
   RSM Piano Studio — Global JS
   Cursor trail · 3D tilt · Nav · Reveals
   ============================================= */

(function () {
  'use strict';

  /* ── CURSOR TRAIL ────────────────────────────── */
  const canvas = document.getElementById('trail-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let W = 0, H = 0;
    const points = [];
    let mouse = { x: -200, y: -200 };

    function resize() {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    document.addEventListener('mousemove', e => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      for (let i = 0; i < 2; i++) {
        points.push({
          x: e.clientX + (Math.random() - 0.5) * 6,
          y: e.clientY + (Math.random() - 0.5) * 6,
          life: 1,
          r: Math.random() * 5 + 3,
        });
      }
      if (points.length > 120) points.splice(0, points.length - 120);
    });

    function drawTrail() {
      ctx.clearRect(0, 0, W, H);
      for (let i = points.length - 1; i >= 0; i--) {
        const p = points[i];
        p.life -= 0.045;
        if (p.life <= 0) { points.splice(i, 1); continue; }
        const alpha = p.life * 0.06;
        const r = p.r * p.life;
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 3);
        grad.addColorStop(0, `rgba(184,144,42,${alpha})`);
        grad.addColorStop(1, `rgba(212,170,74,0)`);
        ctx.beginPath();
        ctx.arc(p.x, p.y, r * 3, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      }
      requestAnimationFrame(drawTrail);
    }
    drawTrail();
  }

  /* ── NAVBAR SCROLL ───────────────────────────── */
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('shadow', window.scrollY > 40);
    }, { passive: true });
  }

  /* ── MOBILE MENU ─────────────────────────────── */
  const ham      = document.getElementById('hamburger');
  const mobMenu  = document.getElementById('mobile-menu');
  const backdrop = document.getElementById('menu-backdrop');

  function closeMob() {
    ham && ham.classList.remove('open');
    mobMenu && mobMenu.classList.remove('open');
    backdrop && backdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (ham) {
    ham.addEventListener('click', () => {
      const open = ham.classList.toggle('open');
      mobMenu && mobMenu.classList.toggle('open', open);
      backdrop && backdrop.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
  }
  if (backdrop) backdrop.addEventListener('click', closeMob);
  const closeBtn = document.getElementById('mobile-close');
  if (closeBtn) closeBtn.addEventListener('click', closeMob);
  if (mobMenu) {
    mobMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMob));
  }

  /* ── 3D CARD TILT ────────────────────────────── */
  function initTilt() {
    document.querySelectorAll('.card-3d').forEach(card => {
      const inner = card.querySelector('.card-3d-inner') || card;

      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top  + rect.height / 2;
        const dx = (e.clientX - cx) / (rect.width  / 2);
        const dy = (e.clientY - cy) / (rect.height / 2);
        const rx = -dy * 9;
        const ry =  dx * 9;
        inner.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.025,1.025,1.025)`;
        inner.style.transition = 'transform 0.1s ease';
      });

      card.addEventListener('mouseleave', () => {
        inner.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)';
        inner.style.transition = 'transform 0.6s cubic-bezier(0.16,1,0.3,1)';
      });
    });
  }
  initTilt();

  /* ── HERO PARALLAX MOUSE ─────────────────────── */
  const heroParallax = document.querySelector('.hero-parallax');
  if (heroParallax) {
    const layers = heroParallax.querySelectorAll('[data-depth]');
    document.addEventListener('mousemove', e => {
      const cx = window.innerWidth  / 2;
      const cy = window.innerHeight / 2;
      const dx = (e.clientX - cx) / cx;
      const dy = (e.clientY - cy) / cy;
      layers.forEach(layer => {
        const depth = parseFloat(layer.dataset.depth) || 0;
        const tx = dx * depth * 28;
        const ty = dy * depth * 18;
        layer.style.transform = `translate(${tx}px, ${ty}px)`;
        layer.style.transition = 'transform 0.4s ease';
      });
    });
  }

  /* ── SCROLL REVEAL ───────────────────────────── */
  function initReveals() {
    const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    if (!els.length) return;
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.1, rootMargin: '0px 0px -20px 0px' });
    els.forEach(el => io.observe(el));
  }

  /* ── ACTIVE LINK ─────────────────────────────── */
  function markActive() {
    const file = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === file);
    });
  }

  /* ── FLOATING NOTES PARALLAX ─────────────────── */
  function initNoteParallax() {
    const notes = document.querySelectorAll('.note-float');
    if (!notes.length) return;
    document.addEventListener('mousemove', e => {
      notes.forEach((n, i) => {
        const depth = (i % 3 + 1) * 0.12;
        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 2;
        const tx = (e.clientX - cx) * depth;
        const ty = (e.clientY - cy) * depth;
        n.style.marginLeft = tx + 'px';
        n.style.marginTop  = ty + 'px';
      });
    });
  }
  initNoteParallax();

  /* ── PAGE FADE IN ────────────────────────────── */
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease';

  /* ── INTERNAL LINK TRANSITION ────────────────── */
  function handleLinks() {
    document.querySelectorAll('a[href]').forEach(a => {
      const href = a.getAttribute('href') || '';
      if (href.startsWith('#') || href.startsWith('mailto') || href.startsWith('http') || href.startsWith('tel')) return;
      if (a.hasAttribute('data-linked')) return;
      a.setAttribute('data-linked', '1');
      a.addEventListener('click', e => {
        e.preventDefault();
        document.body.style.opacity = '0';
        setTimeout(() => window.location.href = href, 350);
      });
    });
  }

  /* ── FORM SUCCESS ────────────────────────────── */
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const msg = document.getElementById('form-success');
      const btn = form.querySelector('button[type=submit]');
      if (btn) { btn.textContent = 'Message Sent ✦'; btn.style.background = '#5a8a5a'; btn.disabled = true; }
      if (msg) { msg.style.display = 'block'; }
    });
  }

  /* ── INIT ────────────────────────────────────── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { markActive(); initReveals(); handleLinks(); });
  } else {
    markActive(); initReveals(); handleLinks();
  }

  window.addEventListener('load', () => {
    document.body.style.opacity = '1';
  });

})();