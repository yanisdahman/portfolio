(() => {
  'use strict';
  const nameEl = document.getElementById('swHoverName');
  if (!nameEl) return;

  document.querySelectorAll('.sw-item').forEach(item => {
    const label = item.querySelector('img')?.alt || '';

    item.addEventListener('mouseenter', () => {
      nameEl.textContent = label + (item.dataset.doc ? ' ↗' : '');
      nameEl.classList.add('visible');
    });
    item.addEventListener('mouseleave', () => nameEl.classList.remove('visible'));

    if (item.dataset.doc) {
      item.addEventListener('click', () => {
        if (typeof openDocModal === 'function') {
          openDocModal(item.dataset.doc, item.dataset.docTitle || label);
        }
      });
    }
  });
})();
