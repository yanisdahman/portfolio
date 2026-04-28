
  /* â”€â”€ Modale Anthropic â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
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

  /* â”€â”€ PDF viewer Anthropic (global) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  function openAmPdf(src, title) {
    const overlay = document.getElementById('am-pdf-overlay');
    const iframe  = document.getElementById('am-pdf-iframe');
    const titleEl = document.getElementById('am-pdf-title');
    titleEl.textContent = title;
    if (!iframe.src.includes(src)) iframe.src = src + '#toolbar=0&navpanes=0&view=Fit';
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    if (window.hideDock) window.hideDock();
  }
  function closeAmPdf() {
    document.getElementById('am-pdf-overlay').classList.remove('open');
    document.body.style.overflow = '';
    if (window.showDock) window.showDock();
  }
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeAmPdf(); });

  /* â”€â”€ Documentation gallery: filter + pagination â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
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

    function openDocModal(url, filename) {
      if (window.innerWidth < 768) { window.open(url, '_blank'); return; }
      document.getElementById('docModalIframe').src = url + '#toolbar=0&navpanes=0&scrollbar=1&view=FitH';
      document.getElementById('docModalFilename').textContent = filename;
      document.getElementById('docModalDl').href = url;
      document.getElementById('docModalOverlay').classList.add('open');
      document.body.style.overflow = 'hidden';
      if (window.hideDock) window.hideDock();
      setTimeout(() => document.querySelector('#docModal .cv-modal-close')?.focus(), 80);
    }
    function closeDocModal() {
      document.getElementById('docModalOverlay').classList.remove('open');
      document.body.style.overflow = '';
      setTimeout(() => { document.getElementById('docModalIframe').src = ''; }, 350);
      if (window.showDock) window.showDock();
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
      if (window.innerWidth < 768) { window.open('docs/YD-CV%20%282%29.pdf', '_blank'); return; }
      const iframe = document.getElementById('cvModalIframe');
      if (!iframe.src.includes('.pdf')) {
        iframe.src = 'docs/YD-CV%20%282%29.pdf#toolbar=0&navpanes=0&view=Fit';
      }
      document.getElementById('cvModalOverlay').classList.add('open');
      document.body.style.overflow = 'hidden';
      if (window.hideDock) window.hideDock();
      setTimeout(() => document.querySelector('#cvModal .cv-modal-close')?.focus(), 80);
    }
    function closeCvModal() {
      document.getElementById('cvModalOverlay').classList.remove('open');
      document.body.style.overflow = '';
      if (window.showDock) window.showDock();
    }
    function closeCvModalOutside(e) {
      if (e.target === document.getElementById('cvModalOverlay')) closeCvModal();
    }
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeCvModal(); });

    function openAttestModal(src, dl) {
      if (window.innerWidth < 768) { window.open(src, '_blank'); return; }
      const iframe = document.getElementById('attestModalIframe');
      iframe.src = src + '#toolbar=0&navpanes=0&view=Fit';
      document.getElementById('attestModalDl').href = dl;
      document.getElementById('attestModalOverlay').classList.add('open');
      document.body.style.overflow = 'hidden';
      if (window.hideDock) window.hideDock();
      setTimeout(() => document.querySelector('#attestModalOverlay .cv-modal-close')?.focus(), 80);
    }
    function closeAttestModal() {
      document.getElementById('attestModalOverlay').classList.remove('open');
      document.body.style.overflow = '';
      if (window.showDock) window.showDock();
    }
    function closeAttestModalOutside(e) {
      if (e.target === document.getElementById('attestModalOverlay')) closeAttestModal();
    }
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeAttestModal(); });

  /* â”€â”€ Morph Card Overlay — FLIP Transition Engine â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
     Technique : FLIP (First → Last → Invert → Play) sur transform+opacity
     uniquement → composite layer → 60 fps garanti.
     Aucune dépendance externe.
  â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
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

    /* â”€â”€ helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
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

    /* â”€â”€ open â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
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

      // â‘  FIRST — record card's current position
      storedRect = card.getBoundingClientRect();
      const { sx, sy, tx, ty } = flipTransform(storedRect);

      // â‘¡ INVERT — position overlay exactly over the card, no transition
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
      if (window.hideDock) window.hideDock();

      // Force reflow so browser registers the start state
      overlay.getBoundingClientRect();

      // â‘¢ PLAY — animate to fullscreen
      overlay.style.transition = [
        `transform ${DUR_OPEN}ms ${EASE}`,
        `border-radius ${DUR_OPEN}ms ${EASE}`,
      ].join(',');
      setTransform(1, 1, 0, 0, '0px');

      scrim.style.transition = `opacity 380ms ease`;
      scrim.style.opacity    = '1';

      // â‘£ After morph — reveal content
      setTimeout(() => {
        // Start loading PDF only after animation
        if (linkEl) moIframe.src = linkEl.href;
        revealStagger();
      }, DUR_OPEN + 40);
    }

    /* â”€â”€ close â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
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
        if (window.showDock) window.showDock();
      }, DUR_CLOSE + 200);
    }

    /* â”€â”€ event wiring — overlay only via explicit button, not card click â”€â”€ */
    // Cards are no longer clickable to open morph — only .dg-open opens the PDF directly

    moClose.addEventListener('click', closeCard);
    scrim.addEventListener('click', closeCard);
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && isOpen) closeCard();
    });

  })();