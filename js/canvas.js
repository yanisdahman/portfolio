(function () {
  const container = document.getElementById('bg-particles');
  if (!container) return;

  const mem   = navigator.deviceMemory || 4;
  const cores = navigator.hardwareConcurrency || 4;
  const COUNT = (mem <= 2 || cores <= 2) ? 60 : (mem <= 4 || cores <= 4) ? 120 : 220;
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < COUNT; i++) {
    const size     = Math.random() * 7 + 2;    // 2px → 9px
    const left     = Math.random() * 100;      // 0% → 100%
    const duration = Math.random() * 12 + 8;  // 8s → 20s
    const delay    = Math.random() * -15;      // démarrage déjà en cours

    const el = document.createElement('div');
    el.className  = 'particle';
    el.style.cssText =
      `width:${size}px;height:${size}px;` +
      `left:${left}%;` +
      `animation-duration:${duration}s;` +
      `animation-delay:${delay}s;`;
    fragment.appendChild(el);
  }

  container.appendChild(fragment);
})();
