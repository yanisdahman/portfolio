(function () {
  const FEEDS_URL = './veille-tech/data/feeds.json';

  const DEMO = [
    { source: 'The Hacker News', title: 'Vulnérabilité critique découverte dans OpenSSL 3.x', published: new Date(Date.now() - 3600000).toISOString(), link: '#' },
    { source: 'CERT-FR',         title: 'Alerte : campagne de phishing ciblant les PME françaises', published: new Date(Date.now() - 7200000).toISOString(), link: '#' },
    { source: 'Bleeping Computer', title: 'Ransomware LockBit : nouvelles variantes détectées en Europe', published: new Date(Date.now() - 10800000).toISOString(), link: '#' },
    { source: 'Korben',           title: 'Docker 26 : amélioration majeure de la sécurité des conteneurs', published: new Date(Date.now() - 14400000).toISOString(), link: '#' },
  ];

  function relTime(iso) {
    const m = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
    if (m < 60) return Math.max(1, m) + 'min';
    const h = Math.floor(m / 60);
    if (h < 24) return h + 'h';
    return Math.floor(h / 24) + 'j';
  }

  function esc(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function renderArticles(articles, grid) {
    grid.innerHTML = articles.map(a => `
      <a class="vlive-article" href="${esc(a.link)}" target="_blank" rel="noopener"
         onclick="event.stopPropagation()">
        <span class="vlive-art-source">${esc(a.source)}</span>
        <span class="vlive-art-title">${esc(a.title)}</span>
        <span class="vlive-art-time">Il y a ${relTime(a.published)}</span>
      </a>
    `).join('');
  }

  async function load() {
    const grid    = document.getElementById('vliveArticles');
    const countEl = document.getElementById('vliveCount');
    if (!grid) return;

    try {
      const res = await fetch(FEEDS_URL + '?t=' + Date.now());
      if (!res.ok) throw new Error();
      const data = await res.json();

      if (countEl) {
        const n = countEl.querySelector('.vlive-stat-n');
        if (n) n.textContent = data.count ?? data.articles.length;
      }

      const top4 = (data.articles || []).slice(0, 4);
      if (!top4.length) throw new Error();
      renderArticles(top4, grid);

    } catch (_) {
      renderArticles(DEMO, grid);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', load);
  } else {
    load();
  }
})();
