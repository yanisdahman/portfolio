(() => {
  'use strict';
  const originals = new Map();

  function storeFr() {
    document.querySelectorAll('[data-i18n]').forEach(el => originals.set(el.dataset.i18n, el.innerHTML));
    document.querySelectorAll('[data-i18n-ph]').forEach(el => originals.set('ph:' + el.dataset.i18nPh, el.placeholder));
  }

  function applyTranslations(t) {
    document.querySelectorAll('[data-i18n]').forEach(el => { if (t[el.dataset.i18n] !== undefined) el.innerHTML = t[el.dataset.i18n]; });
    document.querySelectorAll('[data-i18n-ph]').forEach(el => { if (t[el.dataset.i18nPh] !== undefined) el.placeholder = t[el.dataset.i18nPh]; });
  }

  function resetFr() {
    document.querySelectorAll('[data-i18n]').forEach(el => { const v = originals.get(el.dataset.i18n); if (v !== undefined) el.innerHTML = v; });
    document.querySelectorAll('[data-i18n-ph]').forEach(el => { const v = originals.get('ph:' + el.dataset.i18nPh); if (v !== undefined) el.placeholder = v; });
  }

  let current = localStorage.getItem('lang') || 'fr';
  window.i18nLang = current;

  window.setLang = async function(lang) {
    if (lang === current) return;
    current = lang;
    window.i18nLang = lang;
    localStorage.setItem('lang', lang);
    if (lang === 'fr') {
      resetFr();
    } else {
      try {
        const mod = await import('./lang/en.js');
        applyTranslations(mod.default);
      } catch {
        current = 'fr';
        window.i18nLang = 'fr';
        localStorage.setItem('lang', 'fr');
        return;
      }
    }
    document.documentElement.lang = lang;
    const label = document.getElementById('langCurrent');
    if (label) label.textContent = lang.toUpperCase();
    document.querySelectorAll('.lang-opt').forEach(b => b.classList.toggle('active', b.dataset.lang === lang));
    // Rafraîchir la carte certif active
    if (window.certifRefresh) window.certifRefresh();
  };

  document.addEventListener('DOMContentLoaded', () => {
    storeFr();
    if (current === 'en') window.setLang('en');

    const trigger = document.getElementById('langTrigger');
    const dropdown = document.getElementById('langDropdown');
    const label = document.getElementById('langCurrent');
    if (label) label.textContent = current.toUpperCase();
    document.querySelectorAll('.lang-opt').forEach(b => b.classList.toggle('active', b.dataset.lang === current));

    if (trigger && dropdown) {
      trigger.addEventListener('click', e => { e.stopPropagation(); dropdown.classList.toggle('open'); });
      document.addEventListener('click', () => dropdown.classList.remove('open'));
      document.querySelectorAll('.lang-opt').forEach(btn => {
        btn.addEventListener('click', () => { window.setLang(btn.dataset.lang); dropdown.classList.remove('open'); });
      });
    }
  });
})();
