  /* Migré vers js/ — ce fichier n'est plus chargé par index.html */

  (() => {
    'use strict';

    /* ─── 1. PAGE LOADER ───────────────────────────────────────────── */
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
      const particles = Array.from({length: 55}, () => ({
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

      /* — Terminal typing — */
      const msgs = [
        'Initialisation du portfolio...',
        'Chargement des projets...',
        'Mise en place de l\'interface...',
        'Portfolio prêt.',
      ];
      let mi = 0, ci = 0;
      let typeTm, nextTm;
      function typeNext() {
        const m = msgs[mi];
        if (ci <= m.length) {
          ldStatus.textContent = m.slice(0, ci++);
          typeTm = setTimeout(typeNext, 30 + Math.random()*20);
        } else if (mi < msgs.length - 1) {
          nextTm = setTimeout(() => { mi++; ci = 0; typeNext(); }, 550);
        }
      }
      typeNext();

      /* — Progress bar — */
      const TOTAL = 1200;
      const TICK  = 28;
      let prog = 0;
      const steps = TOTAL / TICK;
      const base  = 100 / steps;
      const progIv = setInterval(() => {
        prog = Math.min(100, prog + base + (Math.random() - 0.25) * 0.6);
        ldBar.style.width = prog + '%';
        ldPct.textContent = Math.floor(prog) + '%';
        if (prog >= 100) { clearInterval(progIv); ldPct.textContent = '100%'; }
      }, TICK);

      /* — Hide — */
      function hideLoader() {
        clearTimeout(typeTm); clearTimeout(nextTm);
        clearInterval(progIv); cancelAnimationFrame(ldRaf);
        loader.classList.add('hidden');
      }
      window.addEventListener('load', () => setTimeout(hideLoader, 1200));
      /* Safety fallback */
      setTimeout(hideLoader, 6000);
    })();


    /* ─── 6. SCROLL PROGRESS + NAV SPY + NAVBAR ───────────────────── */
    const spb   = document.getElementById('spb');
    const navEl = document.querySelector('nav');
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

    const DARK_SECS = new Set(['apropos','documentation','tableau']);

    function onScroll() {
      const max = document.documentElement.scrollHeight - innerHeight;
      if (max > 0) spb.style.width = (scrollY / max * 100).toFixed(2) + '%';
      navEl.classList.toggle('nav-scrolled', scrollY > 60);
      let cur = secs[0].id;
      for (const s of secs) { if (scrollY >= s.offsetTop - NAV_H - 130) cur = s.id; }
      document.body.classList.toggle('section-dark', DARK_SECS.has(cur));
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
    window.addEventListener('resize', () => {
      const active = document.querySelector('.nav-links a.active');
      updateIndicator(active);
    });
    onScroll();

    // Nav smooth scroll — cible le premier contenu de la section, pas le bord
    const NAV_SECTIONS = ['accueil','apropos','parcours','certifications','documentation','veille','tableau','contact'];
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

    /* ─── 7. REVEAL (IntersectionObserver) with stagger ──────────────── */
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
          el.style.setProperty('--d', (i * 0.06) + 's');
        }
        el.classList.add('in');
        revObs.unobserve(el);
      });
    }, { threshold:.12, rootMargin:'0px 0px -50px 0px' });
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

    /* ─── 8. SKILL BARS ─────────────────────────────────────────────── */
    const barObs = new IntersectionObserver(entries => {
      for (const e of entries) { if (e.isIntersecting) { e.target.classList.add('go'); barObs.unobserve(e.target); } }
    }, { threshold:.5 });
    document.querySelectorAll('.sk-fill').forEach(b => barObs.observe(b));

    /* ─── 9. TIMELINE LINE + DOTS ───────────────────────────────────── */
    const tlP = document.getElementById('tlProgress');
    if (tlP) {
      new IntersectionObserver(([e]) => { if (e.isIntersecting) tlP.classList.add('draw'); }, { threshold:.05 })
        .observe(document.getElementById('parcours'));
    }
    document.querySelectorAll('.tl-dot').forEach(dot => {
      new IntersectionObserver(([e]) => { if (e.isIntersecting) dot.classList.add('lit'); },
        { threshold:1, rootMargin:'0px 0px -60px 0px' }).observe(dot);
    });

    /* ─── 10. ANIMATED COUNTERS ─────────────────────────────────────── */
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

    /* ─── 11. EXP-CARD + DG-CARD REVEAL ────────────────────────────── */
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

    /* ─── 12. TECH CHIPS STAGGER ────────────────────────────────────── */
    document.querySelectorAll('.hero-tech-chip').forEach((chip, i) => {
      chip.style.opacity = '0';
      chip.style.transform = 'translateY(12px)';
      chip.style.transition = 'opacity .5s, transform .5s var(--ease)';
      setTimeout(() => { chip.style.opacity = '1'; chip.style.transform = 'translateY(0)'; }, 700 + i * 100);
    });

    /* ─── 12. HERO TITLE WORD SPLIT ANIMATION ───────────────────────── */
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

    /* ─── 13. TERMINAL — handled by separate engine below ──────────── */

    /* ─── 15. MAGNETIC BUTTONS ──────────────────────────────────────── */
    document.querySelectorAll('.btn,.nav-cta').forEach(btn => {
      let bx = 0, by = 0, tx = 0, ty = 0, active = false, raf = null;
      function loop() {
        bx += (tx - bx) * .18; by += (ty - by) * .18;
        btn.style.transform = `translate(${bx.toFixed(2)}px,${by.toFixed(2)}px)`;
        if (active || Math.abs(bx) > .05 || Math.abs(by) > .05) raf = requestAnimationFrame(loop);
        else { btn.style.transform = ''; raf = null; }
      }
      btn.addEventListener('mousemove', e => {
        const r = btn.getBoundingClientRect();
        tx = ((e.clientX-(r.left+r.width/2))/(r.width/2)) * 9;
        ty = ((e.clientY-(r.top+r.height/2))/(r.height/2)) * 6;
        active = true; if (!raf) raf = requestAnimationFrame(loop);
      });
      btn.addEventListener('mouseleave', () => { tx=0; ty=0; active=false; if (!raf) raf=requestAnimationFrame(loop); });
    });

    /* ─── 16. 3D TILT — Apple-style (cartes + terminal) ────────────── */
    function applyTilt(selector, maxDeg, lift) {
      document.querySelectorAll(selector).forEach(card => {
        let rx=0, ry=0, trx=0, try_=0, hover=false, raf=null;
        card.style.willChange = 'transform';
        card.style.transition = 'box-shadow .4s';
        function loop() {
          rx += (trx - rx) * .1; ry += (try_ - ry) * .1;
          card.style.transform = `perspective(1000px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) translateY(${hover?-lift:0}px)`;
          if (hover || Math.abs(rx)>.04 || Math.abs(ry)>.04) raf = requestAnimationFrame(loop);
          else { card.style.transform = ''; raf = null; }
        }
        card.addEventListener('mousemove', e => {
          const r = card.getBoundingClientRect();
          trx  = -((e.clientY-(r.top+r.height/2))/(r.height/2))*maxDeg;
          try_ =  ((e.clientX-(r.left+r.width/2))/(r.width/2))*maxDeg;
          if (!raf) raf = requestAnimationFrame(loop);
        });
        card.addEventListener('mouseenter', () => { hover=true; if (!raf) raf=requestAnimationFrame(loop); });
        card.addEventListener('mouseleave', () => { hover=false; trx=0; try_=0; if (!raf) raf=requestAnimationFrame(loop); });
      });
    }
    applyTilt('.dg-card', 5, 6);
    applyTilt('.veille-card', 5, 8);
    applyTilt('.exp-card', 3, 4);
    applyTilt('.terminal-card', 4, 0);
    applyTilt('.ap-who', 2, 3);

    /* ─── 17. HERO PARALLAX + SECTION DECO PARALLAX ────────────────── */
    const heroLeft  = document.querySelector('.hero-left');
    const heroRight = document.querySelector('.hero-right');
    const decos = [...document.querySelectorAll('.section-deco')];
    function onScrollParallax() {
      const sy = window.scrollY;
      // Hero content subtle parallax (Apple-style depth)
      if (heroLeft)  heroLeft.style.transform  = `translateY(${sy * 0.09}px)`;
      if (heroRight) heroRight.style.transform = `translateY(${sy * 0.06}px)`;
      // Section deco numbers parallax
      decos.forEach(deco => {
        const rect = deco.closest('.section').getBoundingClientRect();
        const progress = -rect.top / window.innerHeight;
        deco.style.transform = `translateY(calc(-50% + ${progress * 40}px))`;
      });
    }
    let parallaxRaf = null;
    window.addEventListener('scroll', () => {
      if (!parallaxRaf) parallaxRaf = requestAnimationFrame(() => { onScrollParallax(); parallaxRaf = null; });
    }, { passive:true });

    /* ─── 18. BURGER MENU ───────────────────────────────────────────── */
    const burger  = document.getElementById('burger');
    const mobMenu = document.getElementById('mobileMenu');
    burger.addEventListener('click', () => {
      const open = mobMenu.classList.toggle('open');
      burger.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    window.closeMob = () => {
      mobMenu.classList.remove('open');
      burger.classList.remove('open');
      document.body.style.overflow = '';
    };

  })();

  /* ── Wave Background Canvas — translated from React AnimatedBackground ── */
  (function(){
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H;

    function resize() {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    let timeRef    = 0;
    let scrollRef  = 0;
    let mouseRef   = { x: -1000, y: -1000 };
    let smoothMouse = { x: -1000, y: -1000 };

    window.addEventListener('scroll',    () => { scrollRef = window.scrollY; }, { passive: true });
    window.addEventListener('mousemove', e  => { mouseRef.x = e.clientX; mouseRef.y = e.clientY; }, { passive: true });

    const waves = [
      { amplitude:80,  frequency:0.003, speed:0.008, phase:0,   yOffset:0.25, color:'rgba(200,198,190,0.12)', lineWidth:1.5 },
      { amplitude:60,  frequency:0.004, speed:0.006, phase:1.2, yOffset:0.30, color:'rgba(190,188,180,0.10)', lineWidth:1.2 },
      { amplitude:100, frequency:0.002, speed:0.005, phase:2.5, yOffset:0.35, color:'rgba(195,193,185,0.08)', lineWidth:1.0 },
      { amplitude:50,  frequency:0.005, speed:0.012, phase:0.8, yOffset:0.50, color:'rgba(180,178,170,0.14)', lineWidth:1.8 },
      { amplitude:70,  frequency:0.003, speed:0.010, phase:3.1, yOffset:0.55, color:'rgba(185,183,175,0.11)', lineWidth:1.4 },
      { amplitude:40,  frequency:0.006, speed:0.014, phase:1.7, yOffset:0.48, color:'rgba(175,173,165,0.09)', lineWidth:1.0 },
      { amplitude:35,  frequency:0.007, speed:0.018, phase:0.3, yOffset:0.72, color:'rgba(170,168,160,0.16)', lineWidth:2.0 },
      { amplitude:55,  frequency:0.004, speed:0.015, phase:2.0, yOffset:0.78, color:'rgba(175,173,165,0.13)', lineWidth:1.6 },
      { amplitude:25,  frequency:0.008, speed:0.020, phase:4.2, yOffset:0.68, color:'rgba(165,163,155,0.10)', lineWidth:1.2 },
      { amplitude:20,  frequency:0.010, speed:0.025, phase:1.5, yOffset:0.40, color:'rgba(160,158,150,0.18)', lineWidth:0.8 },
      { amplitude:15,  frequency:0.012, speed:0.022, phase:3.8, yOffset:0.60, color:'rgba(165,163,155,0.15)', lineWidth:0.6 },
    ];
    const sortedWaves = [...waves].sort((a, b) => a.yOffset - b.yOffset);

    function drawWave(wave, t, scrollOffset, mx, my) {
      const parallaxFactor = wave.yOffset * 0.15;
      const baseY          = H * wave.yOffset - scrollOffset * parallaxFactor;
      const mouseInfluence = 60 + wave.yOffset * 80;
      const mouseRadius    = 250;

      ctx.beginPath();
      ctx.strokeStyle = wave.color;
      ctx.lineWidth   = wave.lineWidth;
      ctx.lineCap     = 'round';

      for (let x = -10; x <= W + 10; x += 3) {
        let y = baseY
          + Math.sin(x * wave.frequency + t * wave.speed + wave.phase) * wave.amplitude
          + Math.sin(x * wave.frequency * 0.5 + t * wave.speed * 1.3 + wave.phase * 0.7) * (wave.amplitude * 0.4)
          + Math.cos(x * wave.frequency * 0.3 + t * wave.speed * 0.7) * (wave.amplitude * 0.2);

        const dx = x - mx, dy = y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouseRadius) {
          const force = 1 - dist / mouseRadius;
          y += (dy >= 0 ? 1 : -1) * force * force * mouseInfluence;
          y += Math.sin(dist * 0.05 - t * 0.06) * force * 20;
        }
        if (x === -10) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();

      ctx.lineTo(W + 10, H + 50);
      ctx.lineTo(-10, H + 50);
      ctx.closePath();
      const m = wave.color.match(/[\d.]+\)$/);
      const fillAlpha = m ? (parseFloat(m[0]) * 0.3).toFixed(3) : '0.03';
      ctx.fillStyle = wave.color.replace(/[\d.]+\)$/, fillAlpha + ')');
      ctx.fill();
    }

    function animate() {
      timeRef += 1;
      W = canvas.width; H = canvas.height;
      smoothMouse.x += (mouseRef.x - smoothMouse.x) * 0.08;
      smoothMouse.y += (mouseRef.y - smoothMouse.y) * 0.08;

      ctx.clearRect(0, 0, W, H);
      for (const wave of sortedWaves) {
        drawWave(wave, timeRef, scrollRef, smoothMouse.x, smoothMouse.y);
      }

      if (smoothMouse.x > -500) {
        const gr = ctx.createRadialGradient(smoothMouse.x, smoothMouse.y, 0, smoothMouse.x, smoothMouse.y, 200);
        gr.addColorStop(0, 'rgba(190,188,180,0.10)');
        gr.addColorStop(0.4, 'rgba(195,193,185,0.05)');
        gr.addColorStop(1, 'rgba(200,198,190,0)');
        ctx.fillStyle = gr;
        ctx.beginPath();
        ctx.arc(smoothMouse.x, smoothMouse.y, 200, 0, Math.PI * 2);
        ctx.fill();
      }

      for (let i = 0; i < 5; i++) {
        const sy = (H / 5) * i + Math.sin(timeRef * 0.01 + i * 1.5) * 30;
        const op = 0.02 + Math.sin(timeRef * 0.008 + i) * 0.015;
        const grd = ctx.createLinearGradient(0, sy - 40, 0, sy + 40);
        grd.addColorStop(0, 'rgba(200,198,190,0)');
        grd.addColorStop(0.5, `rgba(200,198,190,${Math.abs(op).toFixed(3)})`);
        grd.addColorStop(1, 'rgba(200,198,190,0)');
        ctx.fillStyle = grd;
        ctx.fillRect(0, sy - 40, W, 80);
      }

      requestAnimationFrame(animate);
    }
    animate();
  })();

  /* ── Terminal typing engine ────────────────────────────────── */
  (function(){
    const body = document.getElementById('termBody');
    if (!body) return;

    const SPEED   = 22;   // ms/char typing speed
    const JITTER  = 8;    // random ms added per char
    const LINE_DL = 65;   // ms between output lines
    const CMD_DL  = 200;  // pause after enter before output
    const SEQ_DL  = 1100; // pause between commands

    const INTRO = [
      { cmd:'whoami', out:[
        { c:'ok',  t:'Yanis DAHMAN — BTS SIO SISR' }
      ]},
      { cmd:'cat welcome.txt', out:[
        { c:'out', t:'Bienvenue sur mon portfolio interactif.' },
        { c:'out', t:'Étudiant en BTS SIO SISR — systèmes & réseaux.' },
        { c:'out', t:'Tape "help" pour voir les commandes disponibles.' },
      ]},
    ];

    const CMDS = {
      'help':[
        {c:'out',t:'Commandes disponibles :'},
        {c:'out',t:'  whoami       → identité'},
        {c:'out',t:'  ls projets/  → liste des projets'},
        {c:'out',t:'  contact      → me joindre'},
        {c:'out',t:'  date         → date & heure'},
        {c:'out',t:'  ping yanis   → test de connectivité'},
        {c:'out',t:'  clear        → effacer le terminal'},
        {c:'out',t:'  exit         → réinitialiser & quitter'},
      ],
      'whoami':[{c:'ok',t:'Yanis DAHMAN — BTS SIO SISR'}],
      'skills':[
        {c:'out',t:'→ Administration Linux · Windows Server'},
        {c:'out',t:'→ Réseaux Cisco · VLANs · pfSense'},
        {c:'out',t:'→ Virtualisation VMware · Proxmox'},
        {c:'out',t:'→ Sécurité SI · SSH · VPN · GLPI'},
      ],
      'ls':[{c:'out',t:'skills.txt   projets/   contact.cfg   cv.pdf'}],
      'ls projets/':[{c:'out',t:'BorneWiFi/   NAS/   ProjetBMS/   ProjetMDL/'}],
      'contact':[
        {c:'out',t:'→ yanisdahman0@gmail.com'},
        {c:'out',t:'→ +33 7 69 54 18 30'},
        {c:'out',t:'→ linkedin.com/in/yanisdahman'},
      ],
      'date':[{c:'ok',t:()=>new Date().toLocaleString('fr-FR')}],
      'pwd':[{c:'ok',t:'/home/yanis/portfolio'}],
      'uname':[{c:'out',t:'Linux sisr 5.15.0-BTS-SIO x86_64 GNU/Linux'}],
      'uname -a':[{c:'out',t:'Linux sisr 5.15.0-BTS-SIO #SISR x86_64 GNU/Linux'}],
      'ping yanis':[
        {c:'out',t:'PING yanis.local (127.0.0.1) 56 bytes of data.'},
        {c:'ok', t:'64 bytes icmp_seq=1 ttl=64 time=0.08 ms'},
        {c:'ok', t:'64 bytes icmp_seq=2 ttl=64 time=0.07 ms'},
        {c:'out',t:'--- yanis.local ping statistics: 2 packets, 0% loss'},
      ],
      'echo $objectif':[{c:'ok',t:'→ Expert infra réseaux & systèmes'}],
      'cat cv.pdf':[{c:'out',t:'→ Voir la section CV ci-dessous ↓'}],
      'cat skills.txt':[
        {c:'out',t:'→ Administration Linux · Windows Server'},
        {c:'out',t:'→ Réseaux Cisco · VLANs · pfSense'},
        {c:'out',t:'→ Virtualisation VMware · Proxmox'},
        {c:'out',t:'→ Sécurité SI · SSH · VPN · GLPI'},
      ],
    };

    // Build the interactive input row (hidden until intro done)
    const inputRow = document.createElement('div');
    inputRow.className = 'term-input-row';
    inputRow.style.display = 'none';
    const promptSpan = document.createElement('span');
    promptSpan.className = 'term-prompt'; promptSpan.textContent = '$ ';
    // ① Fake block caret — visible at idle, hidden on focus/typing
    const fakeCaret = document.createElement('span');
    fakeCaret.className = 'term-fake-caret';
    const input = document.createElement('input');
    input.type = 'text'; input.className = 'term-input';
    input.placeholder = 'tape une commande...';
    input.autocomplete = 'off'; input.spellcheck = false;
    inputRow.appendChild(promptSpan);
    inputRow.appendChild(fakeCaret);
    inputRow.appendChild(input);
    body.appendChild(inputRow);

    // ② Hint text — disappears on first keystroke
    const hintEl = document.createElement('div');
    hintEl.className = 'term-hint';
    hintEl.textContent = "(Astuce : tape 'help' pour voir les commandes disponibles)";
    let hintDismissed = false;
    body.appendChild(hintEl);

    // Caret: hide on focus (native caret takes over), restore on blur if empty
    input.addEventListener('focus', () => { fakeCaret.style.display = 'none'; });
    input.addEventListener('blur',  () => {
      if (!input.value) fakeCaret.style.display = 'inline-block';
    });
    // Hint: fade out on first character typed
    input.addEventListener('input', () => {
      if (!hintDismissed && input.value.length > 0) {
        hintEl.classList.add('faded');
        hintDismissed = true;
      }
    });

    function esc(s){ return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

    function mkEl(tag, cls, txt) {
      const el = document.createElement(tag);
      el.className = cls;
      if (txt != null) el.textContent = typeof txt === 'function' ? txt() : txt;
      return el;
    }

    function append(el) {
      body.insertBefore(el, inputRow);
      body.scrollTop = body.scrollHeight;
    }

    function animAppend(el) {
      el.style.cssText = 'opacity:0;transform:translateX(-10px);transition:opacity .3s,transform .3s';
      append(el);
      requestAnimationFrame(() => requestAnimationFrame(() => {
        el.style.opacity = '1'; el.style.transform = 'translateX(0)';
      }));
    }

    function outputLines(lines, done) {
      let i = 0;
      function next() {
        if (i >= lines.length) { done && done(); return; }
        const { c, t } = lines[i++];
        animAppend(mkEl('span', 'term-' + c, t));
        setTimeout(next, LINE_DL);
      }
      next();
    }

    function blank(done) {
      append(mkEl('span','term-blank',''));
      setTimeout(done, 60);
    }

    function showInput() {
      inputRow.style.display = 'flex';
      input.focus();
    }

    // Render intro instantly — no typing animation
    function renderIntroInstant() {
      INTRO.forEach(step => {
        const line = document.createElement('span'); line.className = 'term-line';
        line.innerHTML = `<span class="term-prompt">$ </span><span class="term-cmd">${esc(step.cmd)}</span>`;
        append(line);
        step.out.forEach(({ c, t }) => append(mkEl('span', 'term-' + c, typeof t === 'function' ? t() : t)));
        append(mkEl('span','term-blank',''));
      });
      showInput();
    }

    // Float tags around the terminal card
    const floatTags = document.querySelectorAll('.hft-1, .hft-2');
    function hideFloats() {}
    function showFloats() {}

    // Interactive commands
    body.addEventListener('click', () => { if (inputRow.style.display !== 'none') input.focus(); });

    input.addEventListener('keydown', e => {
      if (e.key !== 'Enter') return;
      const raw = input.value.trim();
      if (!raw) return;
      input.value = '';

      const echo = document.createElement('span'); echo.className = 'term-line';
      echo.innerHTML = `<span class="term-prompt">$ </span><span class="term-cmd">${esc(raw)}</span>`;
      append(echo);

      hideFloats();

      const val = raw.toLowerCase();
      const spaceIdx = raw.indexOf(' ');
      const cmd = spaceIdx === -1 ? val : raw.slice(0, spaceIdx).toLowerCase();

      // clear
      if (cmd === 'clear') {
        [...body.children].forEach(c => { if (c !== inputRow && c !== hintEl) c.remove(); });
        showFloats();
        return;
      }

      // exit — reset terminal
      if (val === 'exit') {
        animAppend(mkEl('span','term-ok','Déconnexion... à bientôt !'));
        setTimeout(() => {
          [...body.children].forEach(c => { if (c !== inputRow && c !== hintEl) c.remove(); });
          input.value = '';
          fakeCaret.style.display = 'inline-block';
          hintEl.classList.remove('faded');
          hintDismissed = false;
          input.blur();
          showFloats();
        }, 900);
        return;
      }

      // commandes classiques
      const res = CMDS[val];
      if (res) {
        outputLines(res, () => blank(() => showFloats()));
      } else {
        animAppend(mkEl('span','term-err', esc(val) + ': command not found — tape "help"'));
        blank(() => showFloats());
      }
    });

    renderIntroInstant();
  })();

  /* ── Certifications marquee — clone for seamless CSS loop ─── */
  (function(){
    const track = document.getElementById('certifTrack');
    if (!track) return;
    Array.from(track.children).forEach(card => {
      const clone = card.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      track.appendChild(clone);
    });
  })();

  /* ── Modale Anthropic ─────────────────────────────────────── */
  (function(){
    const modal   = document.getElementById('anthropic-modal');
    const openBtn = document.getElementById('openAnthropicModal');
    const closeBtn= document.getElementById('closeAnthropicModal');
    const backdrop= document.getElementById('amBackdrop');
    if (!modal || !openBtn) return;

    function openModal()  { modal.classList.add('open'); document.body.style.overflow='hidden'; }
    function closeModal() { modal.classList.remove('open'); document.body.style.overflow=''; }

    openBtn.addEventListener('click', openModal);
    closeBtn.addEventListener('click', closeModal);
    backdrop.addEventListener('click', closeModal);
    document.addEventListener('keydown', e => { if (e.key==='Escape') closeModal(); });

    // Les clones du carrousel ont aussi le bouton — on délègue via le body
    document.body.addEventListener('click', e => {
      if (e.target.closest('#openAnthropicModal') && !modal.classList.contains('open')) openModal();
    });
  })();

  /* ── PDF viewer Anthropic (global) ───────────────────────── */
  function openAmPdf(src, title) {
    const overlay = document.getElementById('am-pdf-overlay');
    const iframe  = document.getElementById('am-pdf-iframe');
    const titleEl = document.getElementById('am-pdf-title');
    titleEl.textContent = title;
    if (!iframe.src.includes(src)) iframe.src = src + '#toolbar=0&navpanes=0&view=Fit';
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeAmPdf() {
    document.getElementById('am-pdf-overlay').classList.remove('open');
    document.body.style.overflow = '';
  }
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeAmPdf(); });

  /* ── Documentation gallery: filter + pagination ───────────── */
  (function(){
    const CARDS_PER_PAGE = 6;
    let currentFilter = 'tous';
    let currentPage = 1;
    let firstRender = true;

    const gallery = document.getElementById('docGallery');
    const prevBtn = document.getElementById('docPrev');
    const nextBtn = document.getElementById('docNext');
    const pageInfo = document.getElementById('docPageInfo');
    if (!gallery) return;

    function getAllCards() {
      return Array.from(gallery.querySelectorAll('.dg-card'));
    }
    function getFilteredCards() {
      return getAllCards().filter(card => {
        if (currentFilter === 'tous') return true;
        return (card.dataset.tags || '').split(',').includes(currentFilter);
      });
    }
    function render() {
      const filtered = getFilteredCards();
      const totalPages = Math.max(1, Math.ceil(filtered.length / CARDS_PER_PAGE));
      if (currentPage > totalPages) currentPage = totalPages;
      getAllCards().forEach(c => c.classList.add('hidden'));
      const start = (currentPage - 1) * CARDS_PER_PAGE;
      filtered.slice(start, start + CARDS_PER_PAGE).forEach(c => {
        c.classList.remove('hidden');
        if (!firstRender) requestAnimationFrame(() => c.classList.add('in'));
      });
      firstRender = false;
      pageInfo.textContent = 'Page ' + currentPage + ' / ' + totalPages;
      prevBtn.disabled = currentPage <= 1;
      nextBtn.disabled = currentPage >= totalPages;
    }

    document.querySelectorAll('.doc-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.doc-filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        currentPage = 1;
        render();
      });
    });

    prevBtn.addEventListener('click', () => { if (currentPage > 1) { currentPage--; render(); } });
    nextBtn.addEventListener('click', () => {
      const totalPages = Math.ceil(getFilteredCards().length / CARDS_PER_PAGE);
      if (currentPage < totalPages) { currentPage++; render(); }
    });

    render();
  })();

  // ══ TERMINAL WINDOW CONTROLS ══════════════════════════════════════════════
  (function() {
    const card    = document.getElementById('termCard');
    const bar     = document.getElementById('termBar');
    const dotRed  = document.getElementById('dot-red');
    const dotOrg  = document.getElementById('dot-orange');
    const tbody   = document.getElementById('termBody');
    const resizeH = document.getElementById('termResize');
    const floats  = document.querySelectorAll('.hft-1, .hft-2');
    if (!card) return;

    // Masquer le dot orange
    dotOrg.style.display = 'none';

    // Bouton rouvrir
    const reopenBtn = document.createElement('button');
    reopenBtn.className = 'term-reopen-btn';
    reopenBtn.innerHTML = '⌨&nbsp;Terminal';
    document.body.appendChild(reopenBtn);

    let resizing = false;
    let rStartX = 0, rStartY = 0, rStartW = 0, rStartH = 0;

    function hideFloatTags() {
      floats.forEach(f => { f.style.transition = 'opacity .2s'; f.style.opacity = '0'; f.style.pointerEvents = 'none'; });
    }
    function showFloatTags() {
      floats.forEach(f => { f.style.transition = 'opacity .2s'; f.style.opacity = ''; f.style.pointerEvents = ''; });
    }

    function makeFixed() {
      if (card.classList.contains('is-fixed')) return;
      const r = card.getBoundingClientRect();
      card.style.left  = r.left + 'px';
      card.style.top   = r.top  + 'px';
      card.style.width = r.width + 'px';
      card.classList.add('is-fixed');
    }

    document.addEventListener('mousemove', e => {
      if (resizing) {
        const w = Math.max(280, rStartW + (e.clientX - rStartX));
        const h = Math.max(160, rStartH + (e.clientY - rStartY));
        card.style.width = w + 'px';
        tbody.style.maxHeight = Math.max(80, h - 52) + 'px';
      }
    });

    document.addEventListener('mouseup', () => {
      resizing = false;
      document.body.style.userSelect = '';
    });

    // ── Resize (coin bas-droite) ──────────────────────────────────
    resizeH.addEventListener('mousedown', e => {
      e.stopPropagation();
      makeFixed();
      resizing  = true;
      rStartX   = e.clientX; rStartY = e.clientY;
      rStartW   = card.offsetWidth;
      rStartH   = card.offsetHeight;
      document.body.style.userSelect = 'none';
    });

    // ── Rouge : fermer ───────────────────────────────────────────
    dotRed.addEventListener('click', () => {
      hideFloatTags();
      card.style.display = 'none';
      reopenBtn.style.display = 'flex';
    });
    reopenBtn.addEventListener('click', () => {
      card.style.display = '';
      reopenBtn.style.display = 'none';
      showFloatTags();
    });
  })();

    function openDocModal(url, filename) {
      document.getElementById('docModalIframe').src = url + '#toolbar=0&navpanes=0&scrollbar=1&view=FitH';
      document.getElementById('docModalFilename').textContent = filename;
      document.getElementById('docModalDl').href = url;
      document.getElementById('docModalOverlay').classList.add('open');
      document.body.style.overflow = 'hidden';
    }
    function closeDocModal() {
      document.getElementById('docModalOverlay').classList.remove('open');
      document.body.style.overflow = '';
      setTimeout(() => { document.getElementById('docModalIframe').src = ''; }, 350);
    }
    function closeDocModalOutside(e) {
      if (e.target === document.getElementById('docModalOverlay')) closeDocModal();
    }
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDocModal(); });

    // Event delegation — tous les boutons "Voir le document" de la galerie
    document.getElementById('docGallery').addEventListener('click', e => {
      const link = e.target.closest('.dg-open');
      if (!link) return;
      e.preventDefault();
      e.stopPropagation();
      const url = link.getAttribute('href');
      const filename = decodeURIComponent(url.split('/').pop());
      openDocModal(url, filename);
    });

    function openCvModal() {
      const iframe = document.getElementById('cvModalIframe');
      if (!iframe.src.includes('.pdf')) {
        iframe.src = 'docs/YD-CV%20%282%29.pdf#toolbar=0&navpanes=0&view=Fit';
      }
      document.getElementById('cvModalOverlay').classList.add('open');
      document.body.style.overflow = 'hidden';
    }
    function closeCvModal() {
      document.getElementById('cvModalOverlay').classList.remove('open');
      document.body.style.overflow = '';
    }
    function closeCvModalOutside(e) {
      if (e.target === document.getElementById('cvModalOverlay')) closeCvModal();
    }
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeCvModal(); });

    function openAttestModal(src, dl) {
      const iframe = document.getElementById('attestModalIframe');
      iframe.src = src + '#toolbar=0&navpanes=0&view=Fit';
      document.getElementById('attestModalDl').href = dl;
      document.getElementById('attestModalOverlay').classList.add('open');
      document.body.style.overflow = 'hidden';
    }
    function closeAttestModal() {
      document.getElementById('attestModalOverlay').classList.remove('open');
      document.body.style.overflow = '';
    }
    function closeAttestModalOutside(e) {
      if (e.target === document.getElementById('attestModalOverlay')) closeAttestModal();
    }
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeAttestModal(); });

  /* ── Morph Card Overlay — FLIP Transition Engine ────────────────────────
     Technique : FLIP (First → Last → Invert → Play) sur transform+opacity
     uniquement → composite layer → 60 fps garanti.
     Aucune dépendance externe.
  ──────────────────────────────────────────────────────────────────────── */
  (function () {
    const overlay   = document.getElementById('morphOverlay');
    const scrim     = document.getElementById('morphScrim');
    const moImg     = document.getElementById('moImg');
    const moTitle   = document.getElementById('moTitle');
    const moTags    = document.getElementById('moTags');
    const moDesc    = document.getElementById('moDesc');
    const moLink    = document.getElementById('moOpenLink');
    const moIframe  = document.getElementById('moIframe');
    const moClose   = document.getElementById('moClose');
    if (!overlay) return;

    const EASE       = 'cubic-bezier(0.4,0,0.2,1)';
    const DUR_OPEN   = 500;   // ms
    const DUR_CLOSE  = 440;   // ms

    let isOpen      = false;
    let originCard  = null;   // DOM reference for re-querying on close
    let storedRect  = null;   // rect at open time (viewport-relative)

    /* ── helpers ──────────────────────────────────────────────── */
    function flipTransform(rect) {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const sx = rect.width  / vw;
      const sy = rect.height / vh;
      const tx = rect.left + rect.width  / 2 - vw / 2;
      const ty = rect.top  + rect.height / 2 - vh / 2;
      return { sx, sy, tx, ty };
    }

    function setTransform(sx, sy, tx, ty, br) {
      overlay.style.transform     = `translate(${tx}px,${ty}px) scale(${sx},${sy})`;
      overlay.style.borderRadius  = br;
    }

    function resetStagger(dir) {
      // dir: 'in' → invisible+offset, 'out' → instant fade
      overlay.querySelectorAll('.mo-stagger').forEach(el => {
        el.style.transition = dir === 'out' ? 'opacity 130ms ease,transform 130ms ease' : 'none';
        el.style.opacity    = '0';
        el.style.transform  = `translateY(${dir === 'out' ? '8px' : '16px'})`;
      });
    }

    function revealStagger() {
      overlay.querySelectorAll('.mo-stagger').forEach((el, i) => {
        el.style.transition = `opacity 360ms ease ${i * 95}ms,
                               transform 360ms ${EASE} ${i * 95}ms`;
        el.style.opacity    = '1';
        el.style.transform  = 'translateY(0)';
      });
      moClose.style.transition = `opacity 280ms ease 80ms,
                                   background .2s,border-color .2s,transform .25s`;
      moClose.style.opacity    = '1';
    }

    /* ── open ─────────────────────────────────────────────────── */
    function openCard(card) {
      if (isOpen) return;
      isOpen     = true;
      originCard = card;

      // Populate content
      const imgEl  = card.querySelector('.dg-visual-img');
      const titleEl = card.querySelector('.dg-title');
      const descEl  = card.querySelector('.dg-desc');
      const linkEl  = card.querySelector('.dg-open');
      const tagsEl  = card.querySelector('.dg-tags-overlay');

      moImg.src     = imgEl   ? imgEl.src              : '';
      moImg.alt     = imgEl   ? (imgEl.alt || '')       : '';
      moTitle.textContent = titleEl ? titleEl.textContent : '';
      moDesc.textContent  = descEl  ? descEl.textContent  : '';
      moTags.innerHTML    = tagsEl  ? tagsEl.innerHTML    : '';
      moLink.href         = linkEl  ? linkEl.href         : '#';
      moIframe.src        = '';    // load after animation

      // Reset close button + stagger
      moClose.style.transition = 'none';
      moClose.style.opacity    = '0';
      resetStagger('in');

      // ① FIRST — record card's current position
      storedRect = card.getBoundingClientRect();
      const { sx, sy, tx, ty } = flipTransform(storedRect);

      // ② INVERT — position overlay exactly over the card, no transition
      overlay.style.transition = 'none';
      overlay.style.opacity    = '1';
      overlay.style.visibility = 'visible';
      setTransform(sx, sy, tx, ty, '12px');

      // Scrim: start transparent
      scrim.style.transition = 'none';
      scrim.style.opacity    = '0';
      scrim.classList.add('active');

      // Lock background scroll
      document.body.style.overflow = 'hidden';

      // Force reflow so browser registers the start state
      overlay.getBoundingClientRect();

      // ③ PLAY — animate to fullscreen
      overlay.style.transition = [
        `transform ${DUR_OPEN}ms ${EASE}`,
        `border-radius ${DUR_OPEN}ms ${EASE}`,
      ].join(',');
      setTransform(1, 1, 0, 0, '0px');

      scrim.style.transition = `opacity 380ms ease`;
      scrim.style.opacity    = '1';

      // ④ After morph — reveal content
      setTimeout(() => {
        // Start loading PDF only after animation
        if (linkEl) moIframe.src = linkEl.href;
        revealStagger();
      }, DUR_OPEN + 40);
    }

    /* ── close ────────────────────────────────────────────────── */
    function closeCard() {
      if (!isOpen) return;

      // Re-query card position (handles edge case of resize/reflow)
      const rect = originCard
        ? originCard.getBoundingClientRect()
        : storedRect;
      const { sx, sy, tx, ty } = flipTransform(rect);

      // Fade out stagger content first
      resetStagger('out');
      moClose.style.transition = 'opacity 120ms ease';
      moClose.style.opacity    = '0';

      // Reverse FLIP after content fades
      setTimeout(() => {
        overlay.style.transition = [
          `transform ${DUR_CLOSE}ms ${EASE}`,
          `border-radius ${DUR_CLOSE}ms ${EASE}`,
          `opacity 240ms ease ${DUR_CLOSE - 160}ms`,
        ].join(',');
        setTransform(sx, sy, tx, ty, '12px');
        overlay.style.opacity = '0';

        scrim.style.transition = 'opacity 360ms ease';
        scrim.style.opacity    = '0';
      }, 130);

      // Cleanup
      setTimeout(() => {
        overlay.style.visibility = 'hidden';
        overlay.style.transition = 'none';
        setTransform(1, 1, 0, 0, '0px');
        overlay.style.opacity    = '1';
        scrim.classList.remove('active');
        moIframe.src  = '';   // unload PDF → free memory
        isOpen        = false;
        originCard    = null;
        document.body.style.overflow = '';
      }, DUR_CLOSE + 200);
    }

    /* ── event wiring — overlay only via explicit button, not card click ── */
    // Cards are no longer clickable to open morph — only .dg-open opens the PDF directly

    moClose.addEventListener('click', closeCard);
    scrim.addEventListener('click', closeCard);
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && isOpen) closeCard();
    });

  })();

  (() => {
    if (!document.body.classList.contains('premium-version')) return;

    /* ── 1. TILT 3D sur les cards ───────────────────────────────────── */
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

    /* ── 2. RIPPLE sur les boutons ──────────────────────────────────── */
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

    /* ── 3. COMPTEUR animé des skills ───────────────────────────────── */
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

    /* ── 4. NAV — active link tracking (no blue glow) ───────────────── */

  })();

  /* ── macOS Dock — fisheye magnification ──────────────────────── */
  (function(){
    const dock  = document.getElementById('macDock');
    if (!dock) return;
    const items = [...dock.querySelectorAll('.dock-item')];
    const BASE  = 44;
    const MAX   = 68;
    const RANGE = 110;

    function update(mouseX) {
      items.forEach(item => {
        const icon   = item.querySelector('.dock-icon');
        if (!icon) return;
        const rect   = item.getBoundingClientRect();
        const center = rect.left + rect.width / 2;
        const dist   = Math.abs(mouseX - center);
        const scale  = dist < RANGE ? 1 + (1 - dist / RANGE) * (MAX / BASE - 1) : 1;
        const size   = (BASE * scale).toFixed(1) + 'px';
        icon.style.width  = size;
        icon.style.height = size;
      });
    }

    dock.addEventListener('mousemove', e => update(e.clientX));
    dock.addEventListener('mouseleave', () => {
      items.forEach(item => {
        const icon = item.querySelector('.dock-icon');
        if (icon) { icon.style.width = BASE + 'px'; icon.style.height = BASE + 'px'; }
      });
    });

    items.forEach(item => {
      item.addEventListener('click', () => {
        const href = item.dataset.href;
        if (!href) return;
        const id = href.slice(1);
        if (id === 'accueil') { window.scrollTo({ top:0, behavior:'smooth' }); return; }
        const section = document.getElementById(id);
        if (!section) return;
        const navH   = document.querySelector('nav').offsetHeight;
        const anchor = section.querySelector('.section-eyebrow,.section-title') || section;
        const top    = anchor.getBoundingClientRect().top + window.scrollY - navH - 28;
        window.scrollTo({ top: Math.max(0, top), behavior:'smooth' });
      });
    });

    // Sync active dot with scroll
    window.addEventListener('scroll', () => {
      const secs  = [...document.querySelectorAll('section[id]')];
      const navH  = document.querySelector('nav').offsetHeight;
      let cur = secs[0] ? secs[0].id : '';
      for (const s of secs) { if (window.scrollY >= s.offsetTop - navH - 130) cur = s.id; }
      items.forEach(item => {
        item.classList.toggle('dock-active', item.dataset.href === '#' + cur);
      });
    }, { passive:true });
  })();
