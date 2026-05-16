(function () {
  const now = Date.now();
  const m = 60000;

  const ARTICLES = [
    {
      source: 'Korben',
      title: 'Chrome installe en douce un modèle IA de 4 Go sur votre disque sans rien demander',
      link: 'https://korben.info/chrome-installe-en-douce-un-modele-ia-de-4-go-sur-votre-disque-sans-rien-demander.html',
      published: new Date(now - 22 * m).toISOString()
    },
    {
      source: 'IT-Connect',
      title: 'DAEMON Tools : des milliers de PC infectés via les versions officielles',
      link: 'https://www.it-connect.fr/daemon-tools-des-milliers-de-pc-infectes-via-les-versions-officielles/',
      published: new Date(now - 78 * m).toISOString()
    },
    {
      source: 'IT-Connect',
      title: 'Faille Apache : deux simples trames suffisent à faire un déni de service (CVE-2026-23918)',
      link: 'https://www.it-connect.fr/faille-apache-deux-simples-trames-suffisent-a-faire-un-deni-de-service-cve-2026-23918/',
      published: new Date(now - 195 * m).toISOString()
    },
    {
      source: 'Korben',
      title: 'VS Code signe vos commits avec Copilot, même sans Copilot',
      link: 'https://korben.info/vscode-copilot-coauthor-polemique.html',
      published: new Date(now - 312 * m).toISOString()
    }
  ];

  function relTime(iso) {
    const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
    if (mins < 60) return Math.max(1, mins) + 'min';
    const h = Math.floor(mins / 60);
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

  function init() {
    const grid    = document.getElementById('vliveArticles');
    const countEl = document.getElementById('vliveCount');
    if (!grid) return;

    if (countEl) {
      const n = countEl.querySelector('.vlive-stat-n');
      if (n) n.textContent = ARTICLES.length;
    }

    renderArticles(ARTICLES, grid);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
