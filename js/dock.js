  (function () {
    const dock = document.getElementById('macDock');
    if (!dock) return;

    const items     = [...dock.querySelectorAll('.dock-item')];
    const iconWraps = items.map(item => item.querySelector('.dock-icon-wrap'));

    const BASE  = 38;
    const PEAK  = 58;
    const RANGE = 140;

    let isHovering = false;

    function getSize(mouseX, centerX) {
      const dist = Math.abs(mouseX - centerX);
      if (dist >= RANGE) return BASE;
      return BASE + (PEAK - BASE) * Math.cos((dist / RANGE) * (Math.PI / 2));
    }

    function applyMagnification(e) {
      const dockRect = dock.getBoundingClientRect();
      const mouseX   = e.clientX - dockRect.left;
      iconWraps.forEach(wrap => {
        if (!wrap) return;
        const r  = wrap.getBoundingClientRect();
        const cx = r.left + r.width / 2 - dockRect.left;
        const sz = getSize(mouseX, cx).toFixed(1) + 'px';
        wrap.style.width  = sz;
        wrap.style.height = sz;
      });
    }

    function resetMagnification() {
      isHovering = false;
      iconWraps.forEach(wrap => {
        if (!wrap) return;
        wrap.style.width  = BASE + 'px';
        wrap.style.height = BASE + 'px';
      });
    }

    dock.addEventListener('mouseenter', e => { isHovering = true; applyMagnification(e); });
    dock.addEventListener('mousemove',  e => { if (isHovering) applyMagnification(e); });
    dock.addEventListener('mouseleave', resetMagnification);
    window.addEventListener('scroll',   resetMagnification, { passive: true });

    /* ── Navigation ── */
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

    /* ── Active item on scroll ── */
    window.addEventListener('scroll', () => {
      const secs = [...document.querySelectorAll('section[id]')];
      const navH = document.querySelector('nav')?.offsetHeight ?? 70;
      let cur = secs[0]?.id ?? '';
      for (const s of secs) { if (window.scrollY >= s.offsetTop - navH - 130) cur = s.id; }
      items.forEach(item => {
        item.classList.toggle('dock-active', item.dataset.href === '#' + cur);
      });
    }, { passive: true });

    /* ── Show / Hide ── */
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

    const closeBtn  = document.getElementById('dockClose');
    const trigger   = document.getElementById('dockTrigger');
    let dockHidden  = false;

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
    if (trigger) {
      trigger.addEventListener('click', showDockUser);
      trigger.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') showDockUser(); });
    }

    const _origHide = window.hideDock;
    const _origShow = window.showDock;
    window.hideDock = () => { if (!dockHidden) _origHide(); };
    window.showDock = () => { if (!dockHidden) _origShow(); };

  })();
