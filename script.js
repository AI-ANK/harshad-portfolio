/* Portfolio — script.js
   Features:
   1. Nav glassmorphism on scroll
   2. Typewriter hero effect
   3. Scroll-reveal via IntersectionObserver
   4. Stagger delay for project cards
   5. Smooth scroll with nav-height offset
*/

(function () {
  'use strict';

  // ── 1. Nav scroll state ──────────────────────────────────────
  const nav = document.getElementById('nav');
  if (nav) {
    window.addEventListener('scroll', function () {
      nav.classList.toggle('is-scrolled', window.scrollY > 20);
    }, { passive: true });
  }

  // ── 2. Typewriter effect ─────────────────────────────────────
  const STRINGS = [
    'RAG pipelines',
    'vector search systems',
    'LLM applications',
    'AI research tools',
    'multimodal AI apps',
  ];

  const CONFIG = {
    typeSpeed:       60,   // ms per character typed
    deleteSpeed:     35,   // ms per character deleted
    pauseAfterType:  1800, // ms hold completed string
    pauseAfterDelete:400,  // ms gap before next string
  };

  function startTypewriter(element) {
    let stringIndex = 0;
    let charIndex   = 0;
    let isDeleting  = false;

    function tick() {
      var current = STRINGS[stringIndex];

      if (isDeleting) {
        charIndex--;
        element.textContent = current.slice(0, charIndex);
      } else {
        charIndex++;
        element.textContent = current.slice(0, charIndex);
      }

      var delay = isDeleting ? CONFIG.deleteSpeed : CONFIG.typeSpeed;

      if (!isDeleting && charIndex === current.length) {
        delay      = CONFIG.pauseAfterType;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting  = false;
        stringIndex = (stringIndex + 1) % STRINGS.length;
        delay       = CONFIG.pauseAfterDelete;
      }

      setTimeout(tick, delay);
    }

    tick();
  }

  var typewriterEl = document.getElementById('typewriter');
  if (typewriterEl) {
    // Wait for fonts to load so there's no layout shift during first typed chars
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () {
        startTypewriter(typewriterEl);
      });
    } else {
      // Fallback for browsers without Font Loading API
      window.addEventListener('load', function () {
        startTypewriter(typewriterEl);
      });
    }
  }

  // ── 3. Scroll reveal ─────────────────────────────────────────
  var revealItems = document.querySelectorAll('.reveal-item');

  if ('IntersectionObserver' in window && revealItems.length) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold:   0.1,
      rootMargin:  '0px 0px -40px 0px',
    });

    revealItems.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // Fallback: show all items immediately
    revealItems.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  // ── 4. Stagger delay for project cards ───────────────────────
  // Within each 2-column grid row, left card reveals first, right card 80ms later
  document.querySelectorAll('.project-card').forEach(function (card, i) {
    card.style.transitionDelay = ((i % 2) * 80) + 'ms';
  });

  // ── 5. Smooth scroll with nav offset ─────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var href = anchor.getAttribute('href');
      if (!href || href === '#') return;

      var target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      var navH   = nav ? nav.offsetHeight : 64;
      var offset = target.getBoundingClientRect().top + window.scrollY - navH - 16;

      window.scrollTo({ top: offset, behavior: 'smooth' });
    });
  });

}());
