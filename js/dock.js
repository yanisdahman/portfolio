  /* ── macOS Dock — spring magnification (mass=0.1, stiffness=150, damping=12) ── */
  (function () {
    const dock = document.getElementById('macDock');
    if (!dock) return;

    const items     = [...dock.querySelectorAll('.dock-item')];
    const iconWraps = items.map(item => item.querySelector('.dock-icon-wrap'));

    const BASE  = 38;
    const PEAK  = 58;
    const RANGE = 140;

    const K = 700;
    const D = 60;

    const springs = items.map(() => ({ cur: BASE, vel: 0 }));

    let mouseX     = Infinity;
    let isHovering = false;
    let lastTs     = 0;
    let rafId      = null;

    // Centres stockés en coordonnées RELATIVES au dock (pas viewport).
    // Le dock est centré via translateX(-50%) : quand les icônes grossissent
    // le conteneur se décale → les positions absolutes deviennent fausses → tremblement.
    // En relatif, le décalage du dock s'annule automatiquement.
    let iconCenters = new Array(items.length).fill(0);

    function cacheIconCenters() {
      const dockRect = dock.getBoundingClientRect();
      iconWraps.forEach((wrap, i) => {
        if (!wrap) return;
        const rect = wrap.getBoundingClientRect();
        iconCenters[i] = rect.left + rect.width / 2 - dockRect.left;
      });
    }

    // Cache initial
    cacheIconCenters();

    function targetFor(i) {
      if (!isHovering || mouseX === Infinity) return BASE;
      const dist = Math.abs(mouseX - iconCenters[i]);
      if (dist >= RANGE) return BASE;
      return BASE + (PEAK - BASE) * (1 - dist / RANGE);
    }

    function isSettled() {
      return springs.every(s => Math.abs(s.cur - BASE) < 0.15 && Math.abs(s.vel) < 0.15);
    }

    function tick(ts) {
      if (!lastTs) lastTs = ts;
      const dt = Math.min((ts - lastTs) * 0.001, 0.016);
      lastTs = ts;

      let needsUpdate = false;
      springs.forEach((s, i) => {
        const target = targetFor(i);
        const force  = (target - s.cur) * K - s.vel * D;
        s.vel += force * dt;
        s.cur += s.vel * dt;
        if (s.cur < BASE - 1) { s.cur = BASE - 1; if (s.vel < 0) s.vel = 0; }
        if (s.cur > PEAK + 1) { s.cur = PEAK + 1; if (s.vel > 0) s.vel = 0; }
        if (iconWraps[i]) {
          const sz = s.cur.toFixed(1) + 'px';
          iconWraps[i].style.width  = sz;
          iconWraps[i].style.height = sz;
        }
        if (Math.abs(s.cur - BASE) > 0.15 || Math.abs(s.vel) > 0.15) needsUpdate = true;
      });

      if (isHovering || needsUpdate) {
        rafId = requestAnimationFrame(tick);
      } else {
        rafId = null;
        lastTs = 0;
      }
    }

    function startTick() {
      if (!rafId) rafId = requestAnimationFrame(tick);
    }

    function resetSprings() {
      isHovering = false;
      mouseX = Infinity;
      springs.forEach(s => { s.cur = BASE; s.vel = 0; });
      // NE PAS appeler cacheIconCenters() ici : le DOM montre encore les icônes
      // grossies (tick n'a pas encore écrit les tailles BASE). Le cache serait stale.
    }

    dock.addEventListener('mouseenter', () => { cacheIconCenters(); startTick(); });
    dock.addEventListener('mousemove',  e => {
      const dockRect = dock.getBoundingClientRect();
      mouseX = e.clientX - dockRect.left;
      if (!isHovering) cacheIconCenters();
      isHovering = true;
      startTick();
    });
    dock.addEventListener('mouseleave', resetSprings);
    window.addEventListener('scroll',  resetSprings, { passive: true });
    window.addEventListener('resize',  cacheIconCenters, { passive: true });

    items.forEach(item => {
      item.addEventListener('click', () => {
        const href = item.dataset.href;
        if (!href) return;
        const id = href.slice(1);
        if (id === 'accueil') { window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
        const section = document.getElementById(id);
        if (!section) return;
        const navH   = document.querySelector('nav')?.offsetHeight ?? 70;
        const anchor = section.querySelector('.section-eyebrow, .section-title') || section;
        const top    = anchor.getBoundingClientRect().top + window.scrollY - navH - 28;
        window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
      });
    });

    window.addEventListener('scroll', () => {
      const secs = [...document.querySelectorAll('section[id]')];
      const navH = document.querySelector('nav')?.offsetHeight ?? 70;
      let cur = secs[0]?.id ?? '';
      for (const s of secs) { if (window.scrollY >= s.offsetTop - navH - 130) cur = s.id; }
      items.forEach(item => {
        item.classList.toggle('dock-active', item.dataset.href === '#' + cur);
      });
    }, { passive: true });

    window.hideDock = () => {
      dock.style.opacity       = '0';
      dock.style.transform     = 'translate3d(-50%, 14px, 0)';
      dock.style.pointerEvents = 'none';
    };
    window.showDock = () => {
      dock.style.opacity       = '1';
      dock.style.transform     = 'translate3d(-50%, 0, 0)';
      dock.style.pointerEvents = '';
    };

    /* ── Close / Trigger logic ── */
    const closeBtn = document.getElementById('dockClose');
    const trigger  = document.getElementById('dockTrigger');
    let dockHidden = false;

    function hideDockUser() {
      dockHidden = true;
      dock.style.opacity       = '0';
      dock.style.transform     = 'translate3d(-50%, 20px, 0)';
      dock.style.pointerEvents = 'none';
      if (trigger) trigger.classList.add('is-shown');
    }
    function showDockUser() {
      dockHidden = false;
      dock.style.opacity       = '1';
      dock.style.transform     = 'translate3d(-50%, 0, 0)';
      dock.style.pointerEvents = '';
      if (trigger) trigger.classList.remove('is-shown');
    }

    if (closeBtn) closeBtn.addEventListener('click', hideDockUser);
    if (trigger)  {
      trigger.addEventListener('click', showDockUser);
      trigger.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') showDockUser(); });
    }

    /* Override global hideDock to respect user preference */
    const _origHide = window.hideDock;
    const _origShow = window.showDock;
    window.hideDock = () => { if (!dockHidden) _origHide(); };
    window.showDock = () => { if (!dockHidden) _origShow(); };

    rafId = requestAnimationFrame(tick);
  })();
