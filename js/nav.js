(() => {
  'use strict';
    /* â”€â”€â”€ 6. SCROLL PROGRESS + NAV SPY + NAVBAR â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
    const spb   = document.getElementById('spb');
    const navEl = document.querySelector('nav');
    const btt   = document.getElementById('back-to-top');
    const secs  = [...document.querySelectorAll('section[id]')];
    const navAs = [...document.querySelectorAll('.nav-links a')];
    const NAV_H = navEl.offsetHeight;
    let spbRaf  = null;

    // Sliding nav indicator
    const indicator = document.getElementById('navIndicator');
    function updateIndicator(activeA) {
      if (!indicator || !activeA) return;
      const linksList = document.querySelector('.nav-links');
      if (!linksList) return;
      const lRect = linksList.getBoundingClientRect();
      const aRect = activeA.getBoundingClientRect();
      indicator.style.left  = (aRect.left - lRect.left) + 'px';
      indicator.style.width = aRect.width + 'px';
    }

    const DARK_SECS = new Set(['apropos','certifications','documentation','tableau']);

    function onScroll() {
      const max = document.documentElement.scrollHeight - innerHeight;
      if (max > 0) spb.style.width = (scrollY / max * 100).toFixed(2) + '%';
      navEl.classList.toggle('nav-scrolled', scrollY > 60);
      navEl.classList.toggle('compact', scrollY > 60);
      let cur = secs[0].id;
      for (const s of secs) { if (scrollY >= s.offsetTop - NAV_H - 130) cur = s.id; }
      document.body.classList.toggle('section-dark', DARK_SECS.has(cur));
      // dark-nav: activate when a dark section actually overlaps the navbar
      let isDarkNav = false;
      for (const id of DARK_SECS) {
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= NAV_H + 10 && rect.bottom > NAV_H + 10) { isDarkNav = true; break; }
      }
      navEl.classList.toggle('dark-nav', isDarkNav);
      if (btt) btt.classList.toggle('visible', scrollY > 300);
      let activeA = null;
      for (const a of navAs) {
        const isActive = a.getAttribute('href') === '#'+cur;
        a.classList.toggle('active', isActive);
        if (isActive) activeA = a;
      }
      updateIndicator(activeA);
      spbRaf = null;
    }
    window.addEventListener('scroll', () => { if (!spbRaf) spbRaf = requestAnimationFrame(onScroll); }, { passive:true });
    if (btt) btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    window.addEventListener('resize', () => {
      const active = document.querySelector('.nav-links a.active');
      updateIndicator(active);
    });
    onScroll();

    // Nav smooth scroll — cible le premier contenu de la section, pas le bord
    const NAV_SECTIONS = ['accueil','apropos','certifications','parcours','documentation','veille','tableau','contact'];
    function scrollToId(id) {
      if (id === 'accueil') { window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
      const el = document.getElementById(id);
      if (!el) return;
      const navH = document.querySelector('nav').offsetHeight;
      const anchor = el.querySelector('.section-eyebrow, .section-title, .certif-standalone-head, .about-new, .parcours-new, .doc-grid, .veille-grid, .skills-wrap, .contact-grid') || el;
      const top = anchor.getBoundingClientRect().top + window.scrollY - navH - 28;
      window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
    }
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', function(e) {
        const id = this.getAttribute('href').slice(1);
        if (!NAV_SECTIONS.includes(id)) return;
        e.preventDefault();
        scrollToId(id);
        history.pushState(null, '', '#' + id);
      });
    });

    /* â”€â”€â”€ 7. REVEAL (IntersectionObserver) with stagger â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
    /* Titles: late trigger — only reveal when you've scrolled to them */
    const titleObs = new IntersectionObserver(entries => {
      for (const e of entries) {
        if (e.isIntersecting) { e.target.classList.add('in'); titleObs.unobserve(e.target); }
      }
    }, { threshold:.12, rootMargin:'0px 0px -50px 0px' });
    /* Blocks/cards: Paco-style threshold — earlier trigger with stagger */
    const revObs = new IntersectionObserver(entries => {
      const visible = entries.filter(e => e.isIntersecting);
      visible.forEach((e, i) => {
        const el = e.target;
        if (!el.style.getPropertyValue('--d')) {
          el.style.setProperty('--d', (i * 0.1) + 's');
        }
        el.classList.add('in');
        revObs.unobserve(el);
      });
    }, { threshold:.1, rootMargin:'0px 0px -90px 0px' });
    const TITLE_CLS = new Set(['section-title','section-eyebrow','section-divider','section-desc']);
    document.querySelectorAll('.reveal,.reveal-l,.reveal-r,.reveal-scale').forEach(el => {
      const isTitle = [...el.classList].some(c => TITLE_CLS.has(c));
      (isTitle ? titleObs : revObs).observe(el);
    });

    /* Révélation immédiate des éléments hero visibles au chargement (comme Paco) */
    setTimeout(() => {
      document.querySelectorAll('#accueil .reveal, #accueil .reveal-l, #accueil .reveal-r').forEach(el => {
        el.classList.add('in');
        titleObs.unobserve(el);
        revObs.unobserve(el);
      });
    }, 100);

    /* â”€â”€â”€ 8. SKILL BARS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
    const barObs = new IntersectionObserver(entries => {
      for (const e of entries) { if (e.isIntersecting) { e.target.classList.add('go'); barObs.unobserve(e.target); } }
    }, { threshold:.5 });
    document.querySelectorAll('.sk-fill').forEach(b => barObs.observe(b));

    /* â”€â”€â”€ 9. TIMELINE LINE + DOTS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
    const tlP = document.getElementById('tlProgress');
    if (tlP) {
      new IntersectionObserver(([e]) => { if (e.isIntersecting) tlP.classList.add('draw'); }, { threshold:.05 })
        .observe(document.getElementById('parcours'));
    }
    document.querySelectorAll('.tl-dot').forEach(dot => {
      new IntersectionObserver(([e]) => { if (e.isIntersecting) dot.classList.add('lit'); },
        { threshold:1, rootMargin:'0px 0px -60px 0px' }).observe(dot);
    });

    /* â”€â”€â”€ 10. ANIMATED COUNTERS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
    const ctrObs = new IntersectionObserver(entries => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        const el = e.target, target = +el.dataset.target, dur = 1200, step = 16;
        let cur = 0;
        const t = setInterval(() => {
          cur = Math.min(cur + target / (dur / step), target);
          el.textContent = Math.floor(cur);
          if (cur >= target) clearInterval(t);
        }, step);
        ctrObs.unobserve(el);
      }
    }, { threshold:.5 });
    document.querySelectorAll('[data-target]').forEach(el => ctrObs.observe(el));

    /* â”€â”€â”€ 11. EXP-CARD + DG-CARD REVEAL â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
    document.querySelectorAll('.exp-card').forEach((el, i) => {
      el.classList.add('reveal');
      el.style.setProperty('--d', (0.1 + i * 0.18) + 's');
      revObs.observe(el);
    });
    document.querySelectorAll('.dg-card').forEach((el, i) => {
      el.classList.add('reveal-scale');
      el.style.setProperty('--d', (i % 4 * 0.08) + 's');
      revObs.observe(el);
    });

    /* â”€â”€â”€ 12. TECH CHIPS STAGGER â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
    document.querySelectorAll('.hero-tech-chip').forEach((chip, i) => {
      chip.style.opacity = '0';
      chip.style.transform = 'translateY(12px)';
      chip.style.transition = 'opacity .5s, transform .5s var(--ease)';
      setTimeout(() => { chip.style.opacity = '1'; chip.style.transform = 'translateY(0)'; }, 700 + i * 100);
    });

    /* â”€â”€â”€ 12. HERO TITLE WORD SPLIT ANIMATION â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
      // Replace text nodes (not the #typed span) with word-wrapped spans
      const nodes = [...heroTitle.childNodes];
      nodes.forEach(node => {
        if (node.nodeType === Node.TEXT_NODE) {
          const text = node.textContent;
          const words = text.split(/(\s+)/);
          const frag = document.createDocumentFragment();
          words.forEach((w, i) => {
            if (w.match(/^\s+$/)) { frag.appendChild(document.createTextNode(w)); return; }
            if (!w.trim()) return;
            const span = document.createElement('span');
            span.className = 'word';
            span.textContent = w;
            span.style.animationDelay = (0.1 + i * 0.08) + 's';
            frag.appendChild(span);
          });
          node.parentNode.replaceChild(frag, node);
        } else if (node.classList && node.classList.contains('line-accent')) {
          // Don't wrap: just animate the span itself to preserve gradient text
          node.classList.add('word');
          node.style.animationDelay = '0.3s';
        }
      });
    }

    /* â”€â”€â”€ 13. TERMINAL — handled by separate engine below â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */




    /* â”€â”€â”€ 18. BURGER MENU â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
    const burger  = document.getElementById('burger');
    const mobMenu = document.getElementById('mobileMenu');
    burger.addEventListener('click', () => {
      const open = mobMenu.classList.toggle('open');
      burger.classList.toggle('open', open);
      navEl.classList.toggle('mobile-open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    window.closeMob = () => {
      mobMenu.classList.remove('open');
      burger.classList.remove('open');
      navEl.classList.remove('mobile-open');
      document.body.style.overflow = '';
    };

})();