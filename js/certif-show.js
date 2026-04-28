(function () {
  const CERTIFS = [
    {
      img: 'img/IntroductionToCybersecurity.png', alt: 'Introduction to Cybersecurity',
      title: 'Introduction to Cybersecurity',
      issuer: 'Cisco Networking Academy · févr. 2025',
      issuer_en: 'Cisco Networking Academy · Feb. 2025',
      desc: 'Panorama des menaces numériques, bases de la cybersécurité et introduction aux carrières du secteur.',
      desc_en: 'Overview of digital threats, cybersecurity fundamentals and introduction to sector careers.',
      link: 'https://www.credly.com/badges/2ba22d9d-a709-4638-89c1-12fa5edb4ac4/linked_in_profile',
      imgBg: 'none'
    },
    {
      img: 'img/CyberthreatManagement.png', alt: 'Cyber Threat Management',
      title: 'Cyber Threat Management',
      issuer: 'Cisco Networking Academy · mars 2025',
      issuer_en: 'Cisco Networking Academy · Mar. 2025',
      desc: 'Gestion avancée des cybermenaces, analyse de risques, politiques de sécurité et stratégies de mitigation.',
      desc_en: 'Advanced cyber threat management, risk analysis, security policies and mitigation strategies.',
      link: 'https://www.credly.com/badges/2b8b3c5c-4d95-4943-8743-7aca9e0a9106/linked_in_profile',
      imgBg: 'none'
    },
    {
      img: 'img/EnglishForIT.png', alt: 'English for IT',
      title: 'English for IT',
      issuer: 'Cisco Networking Academy · avr. 2026',
      issuer_en: 'Cisco Networking Academy · Apr. 2026',
      desc: 'Certification en anglais technique pour l\'IT — vocabulaire professionnel, communication et terminologie des réseaux et de la cybersécurité.',
      desc_en: 'Technical English certification for IT — professional vocabulary, communication and networking & cybersecurity terminology.',
      link: 'https://www.credly.com/badges/333d8c11-5c17-4a01-869e-fb0e7d823fd2',
      imgBg: 'none'
    },
    {
      img: 'img/IntroductionToModernAI.png', alt: 'Introduction to Modern AI',
      title: 'Introduction to Modern AI',
      issuer: 'Cisco Networking Academy · nov. 2025',
      issuer_en: 'Cisco Networking Academy · Nov. 2025',
      desc: 'Fondamentaux de l\'intelligence artificielle moderne, machine learning et réseaux de neurones.',
      desc_en: 'Fundamentals of modern artificial intelligence, machine learning and neural networks.',
      link: 'https://www.credly.com/badges/35585322-858c-4cc6-bdf0-1aadeb6cd88f/linked_in_profile',
      imgBg: 'none'
    },
    {
      img: 'img/EthicalHacker.png', alt: 'Ethical Hacker',
      title: 'Ethical Hacker',
      issuer: 'Cisco Networking Academy · avr. 2026',
      issuer_en: 'Cisco Networking Academy · Apr. 2026',
      desc: 'Certification en cybersécurité offensive — techniques de hacking éthique, tests d\'intrusion et identification des vulnérabilités.',
      desc_en: 'Offensive cybersecurity certification — ethical hacking techniques, penetration testing and vulnerability identification.',
      link: 'https://www.credly.com/badges/178f1ff6-6b57-4510-ba2a-317fc1a7f2a7',
      imgBg: 'none'
    },
    {
      img: 'img/NetworkDefense.png', alt: 'Network Defense',
      title: 'Network Defense',
      issuer: 'Cisco Networking Academy · janv. 2026',
      issuer_en: 'Cisco Networking Academy · Jan. 2026',
      desc: 'Défense des infrastructures réseau, détection d\'intrusions, surveillance et réponse aux incidents.',
      desc_en: 'Network infrastructure defense, intrusion detection, monitoring and incident response.',
      link: 'https://www.credly.com/badges/de0a265f-71af-40af-b650-5cc5e428ec51/linked_in_profile',
      imgBg: 'none'
    },
    {
      img: 'img/CertifMOOC.webp', alt: 'MOOC Cybersécurité ANSSI',
      title: 'MOOC Cybersécurité',
      title_en: 'Cybersecurity MOOC',
      issuer: 'ANSSI — Agence nationale · janv. 2026',
      issuer_en: 'ANSSI — National Agency · Jan. 2026',
      desc: 'Formation cybersécurité de référence en France — fondamentaux, menaces et bonnes pratiques de sécurité des systèmes.',
      desc_en: 'France\'s reference cybersecurity training — fundamentals, threats and system security best practices.',
      link: 'img/MOOC.jpg',
      imgBg: 'none'
    },
    {
      img: 'img/CertifPIX.jpg', alt: 'Certification Pix',
      title: 'Certification Pix',
      title_en: 'Pix Certification',
      issuer: 'Lycée Gabriel Fauré, Annecy · mars 2026',
      issuer_en: 'Lycée Gabriel Fauré, Annecy · Mar. 2026',
      desc: 'Certification nationale des compétences numériques — validation des usages numériques professionnels et collaboratifs.',
      desc_en: 'National digital skills certification — validation of professional and collaborative digital practices.',
      link: 'img/PIX.jpg',
      imgBg: 'rgba(255,255,255,0.92)'
    },
    {
      img: 'img/AnthropicLogo.webp', alt: 'Anthropic',
      title: 'Anthropic · 8 Certifications',
      issuer: 'Anthropic — Formation officielle · 2025',
      issuer_en: 'Anthropic — Official Training · 2025',
      desc: 'Série de 8 certifications officielles Anthropic — prompt engineering, sécurité IA et utilisation avancée de Claude.',
      desc_en: 'Series of 8 official Anthropic certifications — prompt engineering, AI safety and advanced Claude usage.',
      link: null, action: 'modal',
      imgBg: 'rgba(255,255,255,0.92)'
    }
  ];

  let current = 0;
  let animating = false;

  const stage  = document.getElementById('cs-stage');
  if (!stage) return;

  const circle    = document.getElementById('cs-circle');
  const img       = document.getElementById('cs-img');
  const name      = document.getElementById('cs-name');
  const issuer    = document.getElementById('cs-issuer');
  const desc      = document.getElementById('cs-desc');
  const linkEl    = document.getElementById('cs-link');
  const dotsEl    = document.getElementById('cs-dots');
  const prevBtn   = document.getElementById('cs-prev');
  const nextBtn   = document.getElementById('cs-next');
  const counter   = document.getElementById('cs-counter');
  const gridEl    = document.getElementById('cs-grid');
  const toggleBtn = document.getElementById('cs-toggle');

  const ICON_GRID = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>`;
  const ICON_SLIDE = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2" fill="currentColor" stroke="none"/><circle cx="7" cy="12" r="1.2" fill="currentColor" stroke="none" opacity=".5"/><circle cx="17" cy="12" r="1.2" fill="currentColor" stroke="none" opacity=".5"/></svg>`;

  function buildGrid() {
    gridEl.innerHTML = CERTIFS.map(c => {
      const imgStyle = c.imgBg !== 'none'
        ? `style="background:${c.imgBg};padding:5px;border-radius:6px;"`
        : '';
      let btn = '';
      if (c.link) {
        btn = `<a class="certif-li-btn" href="${c.link}" target="_blank" rel="noopener">Voir <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg></a>`;
      } else if (c.action === 'modal') {
        btn = `<button class="certif-li-btn" onclick="document.getElementById('openAnthropicModal')?.click()">Voir</button>`;
      }
      return `<div class="certif-li-card">
        <div class="certif-li-logo"><img src="${c.img}" alt="${c.alt}" style="width:100%;height:100%;object-fit:contain;" ${imgStyle}></div>
        <div class="certif-li-body">
          <div class="certif-li-title">${c.title}</div>
          <div class="certif-li-issuer">${c.issuer}</div>
          <div class="certif-li-actions">${btn}</div>
        </div>
      </div>`;
    }).join('');
  }

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const toGrid = !stage.classList.contains('is-grid');
      if (toGrid) {
        buildGrid();
        gridEl.classList.add('active');
        stage.classList.add('is-grid');
        toggleBtn.innerHTML = ICON_SLIDE;
        toggleBtn.title = 'Vue carrousel';
        toggleBtn.setAttribute('aria-label', 'Vue carrousel');
      } else {
        gridEl.classList.remove('active');
        stage.classList.remove('is-grid');
        toggleBtn.innerHTML = ICON_GRID;
        toggleBtn.title = 'Vue liste';
        toggleBtn.setAttribute('aria-label', 'Vue liste');
      }
    });
  }

  /* build dots */
  CERTIFS.forEach((_, i) => {
    const d = document.createElement('button');
    d.className = 'cs-dot' + (i === 0 ? ' is-active' : '');
    d.setAttribute('aria-label', `Certification ${i + 1}`);
    d.addEventListener('click', () => { if (!animating) goTo(i, i > current ? 'next' : 'prev'); });
    dotsEl.appendChild(d);
  });

  function updateDots() {
    dotsEl.querySelectorAll('.cs-dot').forEach((d, i) => d.classList.toggle('is-active', i === current));
    if (counter) counter.textContent = `${current + 1} / ${CERTIFS.length}`;
  }

  function applyContent(idx) {
    const c  = CERTIFS[idx];
    const en = window.i18nLang === 'en';
    img.src = c.img;
    img.alt = c.alt;
    img.style.background  = c.imgBg !== 'none' ? c.imgBg : 'transparent';
    img.style.padding     = c.imgBg !== 'none' ? '8px' : '0';
    img.style.borderRadius = c.imgBg !== 'none' ? '10px' : '0';
    name.textContent   = (en && c.title_en)  ? c.title_en  : c.title;
    issuer.textContent = (en && c.issuer_en) ? c.issuer_en : c.issuer;
    desc.textContent   = (en && c.desc_en)   ? c.desc_en   : c.desc;

    if (c.link) {
      linkEl.href = c.link;
      linkEl.target = '_blank';
      linkEl.style.display = 'inline-flex';
      linkEl.onclick = null;
    } else if (c.action === 'modal') {
      linkEl.href = '#';
      linkEl.target = '';
      linkEl.style.display = 'inline-flex';
      linkEl.onclick = e => { e.preventDefault(); document.getElementById('openAnthropicModal')?.click(); };
    }

    updateDots();
  }

  function goTo(idx, dir) {
    if (animating || idx === current) return;
    animating = true;

    const outCls = dir === 'next' ? 'cs-out-left'  : 'cs-out-right';
    const inCls  = dir === 'next' ? 'cs-in-right'  : 'cs-in-left';

    circle.classList.add(outCls);
    name.classList.add('cs-text-out');
    issuer.classList.add('cs-text-out');
    desc.classList.add('cs-text-out');
    linkEl.classList.add('cs-text-out');

    setTimeout(() => {
      current = idx;
      circle.classList.remove(outCls);
      circle.classList.add(inCls);
      applyContent(current);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          circle.classList.remove(inCls);
          name.classList.remove('cs-text-out');   name.classList.add('cs-text-in');
          issuer.classList.remove('cs-text-out'); issuer.classList.add('cs-text-in');
          desc.classList.remove('cs-text-out');   desc.classList.add('cs-text-in');
          linkEl.classList.remove('cs-text-out'); linkEl.classList.add('cs-text-in');

          setTimeout(() => {
            name.classList.remove('cs-text-in');
            issuer.classList.remove('cs-text-in');
            desc.classList.remove('cs-text-in');
            linkEl.classList.remove('cs-text-in');
            animating = false;
          }, 400);
        });
      });
    }, 300);
  }

  prevBtn.addEventListener('click', () => goTo((current - 1 + CERTIFS.length) % CERTIFS.length, 'prev'));
  nextBtn.addEventListener('click', () => goTo((current + 1) % CERTIFS.length, 'next'));

  /* keyboard */
  stage.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft')  goTo((current - 1 + CERTIFS.length) % CERTIFS.length, 'prev');
    if (e.key === 'ArrowRight') goTo((current + 1) % CERTIFS.length, 'next');
  });

  /* swipe */
  let tx = 0;
  stage.addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, { passive: true });
  stage.addEventListener('touchend',   e => {
    const dx = e.changedTouches[0].clientX - tx;
    if (Math.abs(dx) > 48) {
      if (dx < 0) goTo((current + 1) % CERTIFS.length, 'next');
      else        goTo((current - 1 + CERTIFS.length) % CERTIFS.length, 'prev');
    }
  }, { passive: true });

  applyContent(0);
  window.certifRefresh = () => applyContent(current);

  /* ── Autoplay — démarre dès que le carousel est visible ──────── */
  const DELAY = 3500;
  let autoTimer  = null;
  let isHovered  = false;

  function startAutoplay() {
    if (stage.classList.contains('is-grid') || isHovered) return;
    clearInterval(autoTimer);
    autoTimer = setInterval(() => {
      if (!animating) goTo((current + 1) % CERTIFS.length, 'next');
    }, DELAY);
  }

  function stopAutoplay() {
    clearInterval(autoTimer);
    autoTimer = null;
  }

  // Pause au survol
  stage.addEventListener('mouseenter', () => { isHovered = true;  stopAutoplay(); });
  stage.addEventListener('mouseleave', () => { isHovered = false; startAutoplay(); });

  // Reset du timer sur interaction manuelle
  prevBtn.addEventListener('click', () => { stopAutoplay(); startAutoplay(); });
  nextBtn.addEventListener('click', () => { stopAutoplay(); startAutoplay(); });
  dotsEl.addEventListener('click',  () => { stopAutoplay(); startAutoplay(); });
  stage.addEventListener('touchend', () => { stopAutoplay(); startAutoplay(); }, { passive: true });

  // Pause en vue grille, reprise en vue carrousel
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      if (stage.classList.contains('is-grid')) stopAutoplay();
      else startAutoplay();
    });
  }

  // Démarre dès que le carousel entre dans le champ de vision
  const visibilityObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) startAutoplay();
      else stopAutoplay();
    });
  }, { threshold: 0.4 });

  visibilityObserver.observe(stage);
})();
