/* =====================================================
   script.js — Coding With Mamta Interactive JS
   ===================================================== */

'use strict';

// ── Utility ──────────────────────────────────────────
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

// ── DOM Ready ────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initHeader();
  initHamburger();
  initFilterTabs();
  initVideoCards();
  initRevealOnScroll();
  initCounters();
  initModal();
  initLoadMore();
});

// =====================================================
// 1. PARTICLE SYSTEM
// =====================================================
function initParticles() {
  const container = $('#particles');
  if (!container) return;

  const colors = [
    'rgba(184, 71, 255, 0.7)',
    'rgba(0, 229, 255, 0.6)',
    'rgba(255, 45, 120, 0.5)',
    'rgba(184, 71, 255, 0.4)',
    'rgba(0, 229, 255, 0.4)',
  ];

  for (let i = 0; i < 45; i++) {
    const p = document.createElement('div');
    p.className = 'particle';

    const size = Math.random() * 4 + 1;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const left = Math.random() * 100;
    const duration = Math.random() * 18 + 10;
    const delay = Math.random() * 15;

    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      left: ${left}%;
      animation-duration: ${duration}s;
      animation-delay: -${delay}s;
      box-shadow: 0 0 ${size * 3}px ${color};
    `;
    container.appendChild(p);
  }
}

// =====================================================
// 2. SCROLLED HEADER
// =====================================================
function initHeader() {
  const header = $('#header');
  if (!header) return;

  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
}

// =====================================================
// 3. HAMBURGER / MOBILE NAV
// =====================================================
function initHamburger() {
  const hamburger = $('#hamburger');
  const mobileNav = $('#mobile-nav');
  if (!hamburger || !mobileNav) return;

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    mobileNav.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen.toString());
  });

  // Close on mobile nav link click
  $$('.mobile-nav-link, .mobile-yt-btn', mobileNav).forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileNav.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });
}

// =====================================================
// 4. FILTER TABS
// =====================================================
function initFilterTabs() {
  const tabs = $$('.tab');
  const cards = $$('.video-card');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Update active tab
      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      const filter = tab.dataset.filter;

      // Filter cards with a stagger
      cards.forEach((card, i) => {
        const category = card.dataset.category;
        const show = filter === 'all' || category === filter;

        if (show) {
          card.classList.remove('hidden');
          card.style.animationDelay = `${i * 0.08}s`;
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
}

// =====================================================
// 5. VIDEO CARD INTERACTIONS
// =====================================================
function initVideoCards() {
  $$('.video-card').forEach(card => {
    // Tilt effect on mouse move
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      // Pause float animation while hovering
      card.style.animationPlayState = 'paused';
      card.style.transform = `
        perspective(800px)
        rotateY(${x * 8}deg)
        rotateX(${-y * 8}deg)
        translateY(-8px)
        scale(1.02)
      `;
    });

    card.addEventListener('mouseleave', () => {
      card.style.animationPlayState = 'running';
      card.style.transform = '';
    });
  });
}

// =====================================================
// 6. SCROLL REVEAL ANIMATION
// =====================================================
function initRevealOnScroll() {
  // Mark elements for reveal
  const targets = [
    ...$$('.section-header'),
    ...$$('.video-card'),
    ...$$('.about-text'),
    ...$$('.about-visual'),
    ...$$('.social-btn'),
    ...$$('.stat-pill'),
  ];

  targets.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  targets.forEach(el => observer.observe(el));
}

// =====================================================
// 7. COUNTER ANIMATION
// =====================================================
function initCounters() {
  const counters = $$('.about-stat-num');

  const formatNum = (num, target) => {
    if (target >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M+';
    } else if (target >= 1000) {
      return (num / 1000).toFixed(0) + 'K+';
    }
    return num.toString() + (target > 1 ? '+' : '');
  };

  const animateCounter = (el) => {
    const target = parseInt(el.dataset.target, 10);
    const duration = 1800;
    const start = performance.now();

    const step = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
      const current = Math.round(ease * target);

      el.textContent = formatNum(current, target);

      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}

// =====================================================
// 8. DOWNLOAD MODAL
// =====================================================
function initModal() {
  const overlay = $('#modal-overlay');
  const closeBtn = $('#modal-close');
  const closeBtnSecondary = $('#modal-close-btn');
  if (!overlay) return;

  const openModal = () => overlay.classList.add('active');
  const closeModal = () => overlay.classList.remove('active');

  $$('.btn-download').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });
  });

  closeBtn?.addEventListener('click', closeModal);
  closeBtnSecondary?.addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  // Keyboard: close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
}

// =====================================================
// 9. LOAD MORE BUTTON
// =====================================================
function initLoadMore() {
  const btn = $('#load-more-btn');
  if (!btn) return;

  btn.addEventListener('click', () => {
    btn.textContent = 'Loading... ⚡';
    btn.style.opacity = '0.6';
    btn.disabled = true;

    setTimeout(() => {
      // Simulate loading more cards
      btn.textContent = "You've reached the end! Subscribe for more 🔥";
      btn.style.opacity = '1';
      btn.style.color = 'var(--neon-cyan)';
      btn.style.borderColor = 'var(--neon-cyan)';
    }, 1200);
  });
}

// =====================================================
// 10. ACTIVE NAV LINK ON SCROLL
// =====================================================
(function () {
  const sections = $$('section[id]');
  const navLinks = $$('.nav-link');

  if (!sections.length || !navLinks.length) return;

  const onScroll = () => {
    const scrollY = window.scrollY + 120;
    sections.forEach(section => {
      const top = section.offsetTop;
      const bottom = top + section.offsetHeight;
      if (scrollY >= top && scrollY < bottom) {
        navLinks.forEach(link => {
          link.style.color = '';
          link.style.textShadow = '';
          const href = link.getAttribute('href');
          if (href === '#' + section.id) {
            link.style.color = 'var(--neon-purple)';
            link.style.textShadow = '0 0 8px var(--neon-purple)';
          }
        });
      }
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
})();

// =====================================================
// 11. GLITCH TEXT EFFECT (occasional hero title flicker)
// =====================================================
(function () {
  const title = $('#hero-title');
  if (!title) return;

  const triggerGlitch = () => {
    title.style.filter = `
      drop-shadow(2px 0 0 rgba(0,229,255,0.8))
      drop-shadow(-2px 0 0 rgba(184,71,255,0.8))
    `;
    title.style.transform = 'skewX(-0.5deg)';
    setTimeout(() => {
      title.style.filter = '';
      title.style.transform = '';
    }, 80);
  };

  // Random glitch every 5-12 seconds
  const scheduleGlitch = () => {
    const delay = 5000 + Math.random() * 7000;
    setTimeout(() => {
      triggerGlitch();
      scheduleGlitch();
    }, delay);
  };
  scheduleGlitch();
})();

// =====================================================
// 12. SMOOTH CURSOR GLOW (desktop only)
// =====================================================
(function () {
  if (window.matchMedia('(max-width: 768px)').matches) return;

  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed;
    width: 300px;
    height: 300px;
    pointer-events: none;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(184,71,255,0.06) 0%, transparent 70%);
    transform: translate(-50%, -50%);
    transition: left 0.12s ease, top 0.12s ease;
    z-index: 0;
    mix-blend-mode: screen;
  `;
  document.body.appendChild(glow);

  document.addEventListener('mousemove', (e) => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
  });
})();
