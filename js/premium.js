  (() => {
    if (!document.body.classList.contains('premium-version')) return;

    /* â”€â”€ 1. TILT 3D sur les cards â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
    const TILT_MAX = 7; // degrés max
    const tiltEls  = document.querySelectorAll(
      '.dg-card, .proj-card, .skill-block, .cert-card'
    );

    tiltEls.forEach(el => {
      el.addEventListener('mousemove', e => {
        const r  = el.getBoundingClientRect();
        const cx = r.left + r.width  / 2;
        const cy = r.top  + r.height / 2;
        const dx = (e.clientX - cx) / (r.width  / 2); // -1 → +1
        const dy = (e.clientY - cy) / (r.height / 2); // -1 → +1
        const rx = -dy * TILT_MAX;
        const ry =  dx * TILT_MAX;
        el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(6px)`;
      });

      el.addEventListener('mouseleave', () => {
        el.style.transform = '';
      });
    });

    /* â”€â”€ 2. RIPPLE sur les boutons â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
    document.querySelectorAll('.btn').forEach(btn => {
      btn.addEventListener('click', e => {
        const r    = btn.getBoundingClientRect();
        const size = Math.max(r.width, r.height);
        const x    = e.clientX - r.left - size / 2;
        const y    = e.clientY - r.top  - size / 2;
        const span = document.createElement('span');
        span.className = 'pv-ripple';
        span.style.cssText = `width:${size}px;height:${size}px;left:${x}px;top:${y}px`;
        btn.appendChild(span);
        span.addEventListener('animationend', () => span.remove());
      });
    });

    /* â”€â”€ 3. COMPTEUR animé des skills â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
    const counters = document.querySelectorAll('.sk-pct');
    if (counters.length) {
      const obs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          const el     = entry.target;
          const target = parseInt(el.textContent, 10);
          if (isNaN(target)) return;
          obs.unobserve(el);
          let start   = 0;
          const dur   = 1200; // ms
          const step  = ts => {
            if (!start) start = ts;
            const prog = Math.min((ts - start) / dur, 1);
            // easeOutQuart
            const ease = 1 - Math.pow(1 - prog, 4);
            el.textContent = Math.round(ease * target) + '%';
            if (prog < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        });
      }, { threshold: 0.6 });

      counters.forEach(c => obs.observe(c));
    }

    /* â”€â”€ 4. NAV — active link tracking (no blue glow) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

  })();