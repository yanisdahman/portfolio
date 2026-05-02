(function () {
  const FEEDS_URL = 'https://yanisdahman.fr/veille-tech/data/feeds.json';

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

  async function load() {
    const grid    = document.getElementById('vliveArticles');
    const countEl = document.getElementById('vliveCount');
    const visual  = document.querySelector('.veille-visual--live');
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

      /* Image de fond sur le visuel supérieur */
      const featImg = top4.find(a => a.image);
      if (featImg && visual) {
        visual.style.backgroundImage  = `url('${esc(featImg.image)}')`;
        visual.style.backgroundSize   = 'cover';
        visual.style.backgroundPosition = 'center';
        visual.classList.add('vlive-has-img');
      }

      /* 4 articles avec miniature */
      grid.innerHTML = top4.map(a => `
        <a class="vlive-article" href="${esc(a.link)}" target="_blank" rel="noopener"
           onclick="event.stopPropagation()">
          ${a.image
            ? `<img class="vlive-art-img" src="${esc(a.image)}" alt="" loading="lazy" onerror="this.style.display='none'">`
            : `<span class="vlive-art-noimg"></span>`}
          <div class="vlive-art-text">
            <span class="vlive-art-source">${esc(a.source)}</span>
            <span class="vlive-art-title">${esc(a.title)}</span>
            <span class="vlive-art-time">Il y a ${relTime(a.published)}</span>
          </div>
        </a>
      `).join('');

    } catch (_) {
      /* garder les squelettes si erreur réseau */
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', load);
  } else {
    load();
  }
})();
