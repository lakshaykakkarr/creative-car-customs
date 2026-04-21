/* ============================================
   main.js — Global init: navbar, theme, GSAP
   ============================================ */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {

  // ---- Theme Toggle ----
  const htmlEl = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const savedTheme = localStorage.getItem('ccc-theme') || 'dark';
  htmlEl.setAttribute('data-theme', savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const next = htmlEl.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      htmlEl.setAttribute('data-theme', next);
      localStorage.setItem('ccc-theme', next);
    });
  }

  // ---- Navbar scroll effect ----
  const navbar = document.getElementById('navbar');
  function handleScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // ---- Mobile menu ----
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  const overlay   = document.getElementById('mobileOverlay');

  function closeNav() {
    hamburger?.classList.remove('active');
    navLinks?.classList.remove('open');
    overlay?.classList.remove('active');
    document.body.classList.remove('nav-open');
  }

  hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks?.classList.toggle('open');
    overlay?.classList.toggle('active');
    document.body.classList.toggle('nav-open');
  });

  overlay?.addEventListener('click', closeNav);
  navLinks?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeNav));

  // ---- FAQ Accordion ----
  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-question');
    const a = item.querySelector('.faq-answer');
    if (!q || !a) return;
    q.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(other => {
        other.classList.remove('open');
        other.querySelector('.faq-answer').style.maxHeight = null;
      });
      if (!isOpen) {
        item.classList.add('open');
        a.style.maxHeight = a.scrollHeight + 'px';
      }
    });
  });

  // ---- GSAP Animations ----
  initAnimations();

  // ---- Animated Counters ----
  initCounters();
});

function initAnimations() {
  // --- Hero entrance (DOMContentLoaded, not scroll) ---
  const heroContent = document.querySelector('.hero-content');
  if (heroContent) {
    const heroEls = heroContent.querySelectorAll('.hero-badge, .hero-title, .hero-subtitle, .hero-buttons, .scroll-indicator');
    gsap.fromTo(heroEls,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.55,
        ease: 'power2.out',
        stagger: 0.09,
      }
    );
  }

  // --- Page hero (inner pages) ---
  const pageHero = document.querySelector('.page-hero');
  if (pageHero) {
    gsap.fromTo(pageHero.children,
      { opacity: 0, y: 18 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', stagger: 0.1 }
    );
  }

  // --- Hero parallax (native CSS transform, no GSAP scrub overhead) ---
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          heroBg.style.transform = `translateY(${window.scrollY * 0.25}px)`;
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  // --- Batch reveal: card grids (staggered cascade) ---
  // These are groups of sibling .gsap-reveal elements inside a grid
  const grids = document.querySelectorAll(
    '.auto-grid, .services-grid, .packages-grid, .team-grid, .mission-grid, .gallery-grid'
  );
  grids.forEach(grid => {
    const items = grid.querySelectorAll('.gsap-reveal, .gallery-item, .service-card, .card, .package-card');
    if (items.length === 0) return;
    gsap.fromTo(items,
      { opacity: 0, y: 12 },
      {
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: 'power2.out',
        stagger: 0.045,
        scrollTrigger: {
          trigger: grid,
          start: 'top 94%',
          toggleActions: 'play none none none',
          once: true,
        },
      }
    );
  });

  // --- Default reveal: standalone .gsap-reveal elements ---
  const standalone = document.querySelectorAll('.gsap-reveal:not(.auto-grid *):not(.services-grid *):not(.packages-grid *):not(.team-grid *):not(.mission-grid *):not(.gallery-grid *)');
  standalone.forEach(el => {
    gsap.fromTo(el,
      { opacity: 0, y: 12 },
      {
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 95%',
          toggleActions: 'play none none none',
          once: true,
        },
      }
    );
  });
}

function initCounters() {
  const counters = document.querySelectorAll('.stat-number[data-target]');
  if (counters.length === 0 || typeof IntersectionObserver === 'undefined') return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.getAttribute('data-target'), 10);
      animateCounter(el, target);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}

function animateCounter(el, target) {
  const duration = 2000;
  const startTime = performance.now();
  function update(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(ease * target);
    el.textContent = target >= 1000
      ? current.toLocaleString('en-IN') + '+'
      : current + '+';
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}
