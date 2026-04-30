(() => {
  'use strict';
    (() => {
      const loader  = document.getElementById('loader');
      const ldBar   = document.getElementById('ld-bar');
      const ldPct   = document.getElementById('ld-pct');
      const ldStatus= document.getElementById('ld-status');
      const ldCnv   = document.getElementById('ld-canvas');
      const lctx    = ldCnv.getContext('2d');

      /* — Canvas resize — */
      function resizeLdCnv() {
        ldCnv.width  = window.innerWidth;
        ldCnv.height = window.innerHeight;
      }
      resizeLdCnv();

      /* — Hex particles — */
      const HEX = '0123456789ABCDEF';
      const particles = Array.from({length: 200}, () => ({
        x: Math.random() * ldCnv.width,
        y: Math.random() * ldCnv.height,
        ch: HEX[Math.floor(Math.random()*16)],
        spd: 0.25 + Math.random() * 0.55,
        op: 0.08 + Math.random() * 0.35,
        sz: 9 + Math.random() * 9,
        drift: (Math.random() - 0.5) * 0.15,
      }));

      let ldRaf;
      function drawLd() {
        lctx.clearRect(0, 0, ldCnv.width, ldCnv.height);
        particles.forEach(p => {
          lctx.fillStyle = `rgba(26,26,28,${p.op})`;
          lctx.font = `${p.sz}px 'JetBrains Mono',monospace`;
          lctx.fillText(p.ch, p.x, p.y);
          p.y -= p.spd;
          p.x += p.drift;
          if (p.y < -20) {
            p.y = ldCnv.height + 20;
            p.x = Math.random() * ldCnv.width;
            p.ch = HEX[Math.floor(Math.random()*16)];
          }
        });
        ldRaf = requestAnimationFrame(drawLd);
      }
      drawLd();

      /* — Message fixe — */
      let typeTm, nextTm;
      ldStatus.textContent = 'Initialisation du portfolio...';

      /* — Progress bar — barre lente visible 0→100% */
      const TOTAL = 1000;
      const TICK  = 20;
      let prog = 0;
      let pageLoaded = false;
      const steps = TOTAL / TICK;
      const base  = 100 / steps;

      function hideLoader() {
        clearTimeout(typeTm); clearTimeout(nextTm);
        clearInterval(progIv); cancelAnimationFrame(ldRaf);
        loader.classList.add('hidden');
      }

      const progIv = setInterval(() => {
        // Si la page n'est pas encore chargée, ralentir à 85% max
        const cap = pageLoaded ? 100 : 85;
        prog = Math.min(cap, prog + base + (Math.random() - 0.3) * 0.4);
        ldBar.style.width = prog + '%';
        ldPct.textContent = Math.floor(prog) + '%';
        if (prog >= 100) {
          clearInterval(progIv);
          ldPct.textContent = '100%';
          setTimeout(hideLoader, 180);
        }
      }, TICK);

      window.addEventListener('load', () => { pageLoaded = true; });
      /* Safety fallback */
      setTimeout(hideLoader, 6000);
    })();
})();