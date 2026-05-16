const CAT_LABELS = {
  cybersecurite: 'Cybersécurité',
  reseau:        'Réseau & Infra',
  actu:          'Actu IT',
  outils:        'Outils',
};

const SOURCE_LOGOS = {
  'CERT-FR':           '../logo/Cert-fr.png',
  'The Hacker News':   '../logo/thehackernews_logo.jpg',
  'Bleeping Computer': '../logo/BleepingComputer.jpg',
  'Korben':            '../logo/Korben.avif',
  'IT-Connect':        '../logo/Itconnect.jpg',
};

/* ── Articles statiques ─────────────────────────────────────────────── */
(function () {
  const now = Date.now();
  const m = 60000;

  window.STATIC_ARTICLES = [
    {
      id: '1',
      title: 'Les Pays-Bas migrent leur code vers Forgejo et claquent la porte de GitHub',
      link: 'https://korben.info/les-pays-bas-migrent-leur-code-vers-forgejo-et-claquent-la-porte-de-github.html',
      summary: 'Le gouvernement néerlandais a ouvert sa propre instance Forgejo à l\'adresse code.overheid.nl, hébergée sur les serveurs de l\'État. Une décision forte en faveur de la souveraineté numérique et des logiciels libres.',
      source: 'Korben',
      category: 'outils',
      image: 'https://korben.info/les-pays-bas-migrent-leur-code-vers-forgejo-et-claquent-la-porte-de-github/les-pays-bas-migrent-leur-code-vers-forgejo-et-claquent-la-porte-de-github-1.jpg',
      published: new Date(now - 18 * m).toISOString()
    },
    {
      id: '2',
      title: 'VS Code signe vos commits avec Copilot, même sans Copilot',
      link: 'https://korben.info/vscode-copilot-coauthor-polemique.html',
      summary: 'Microsoft a discrètement modifié VS Code pour ajouter Copilot comme co-auteur dans les messages de commit, sans que les développeurs n\'aient donné leur accord. La communauté réagit vivement.',
      source: 'Korben',
      category: 'outils',
      image: 'https://korben.info/vscode-copilot-coauthor-polemique/vscode-copilot-coauthor-polemique-1.png',
      published: new Date(now - 45 * m).toISOString()
    },
    {
      id: '3',
      title: 'Chrome installe en douce un modèle IA de 4 Go sur votre disque sans rien demander',
      link: 'https://korben.info/chrome-installe-en-douce-un-modele-ia-de-4-go-sur-votre-disque-sans-rien-demander.html',
      summary: 'La dernière version de Chrome télécharge en arrière-plan un modèle de langage local Gemini Nano de 4 Go, sans demander votre consentement. Un comportement qui soulève des questions sérieuses sur la vie privée.',
      source: 'Korben',
      category: 'outils',
      image: 'https://korben.info/chrome-installe-en-douce-un-modele-ia-de-4-go-sur-votre-disque-sans-rien-demander/chrome-installe-en-douce-un-modele-ia-de-4-go-sur-votre-disque-sans-rien-demander-1.jpg',
      published: new Date(now - 70 * m).toISOString()
    },
    {
      id: '4',
      title: 'Apple ajoute le chiffrement bout-en-bout entre iPhone et Android pour les RCS dans iOS 26.5',
      link: 'https://korben.info/apple-ajoute-le-chiffrement-bout-en-bout-entre-iphone-et-android-pour-les-rcs-dans-ios-26-5.html',
      summary: 'Avec iOS 26.5, Apple corrige enfin l\'absence de chiffrement dans les échanges RCS entre iPhone et Android. Une avancée importante pour la confidentialité des communications mobiles.',
      source: 'Korben',
      category: 'outils',
      image: 'https://korben.info/apple-ajoute-le-chiffrement-bout-en-bout-entre-iphone-et-android-pour-les-rcs-dans-ios-26-5/apple-ajoute-le-chiffrement-bout-en-bout-entre-iphone-et-android-pour-les-rcs-dans-ios-26-5-1.jpg',
      published: new Date(now - 105 * m).toISOString()
    },
    {
      id: '5',
      title: 'Faille Apache : deux simples trames suffisent à faire un déni de service (CVE-2026-23918)',
      link: 'https://www.it-connect.fr/faille-apache-deux-simples-trames-suffisent-a-faire-un-deni-de-service-cve-2026-23918/',
      summary: 'Une vulnérabilité critique dans le module HTTP/2 d\'Apache permet de déclencher un déni de service avec seulement deux trames réseau. Mettez à jour vos serveurs Apache sans attendre.',
      source: 'IT-Connect',
      category: 'reseau',
      image: '',
      published: new Date(now - 140 * m).toISOString()
    },
    {
      id: '6',
      title: 'DAEMON Tools : des milliers de PC infectés via les versions officielles',
      link: 'https://www.it-connect.fr/daemon-tools-des-milliers-de-pc-infectes-via-les-versions-officielles/',
      summary: 'Depuis début avril 2026, les installeurs de DAEMON Tools disponibles sur le site officiel sont infectés par un logiciel malveillant, résultat d\'une attaque de type supply-chain ciblant la chaîne de distribution.',
      source: 'IT-Connect',
      category: 'reseau',
      image: '',
      published: new Date(now - 180 * m).toISOString()
    },
    {
      id: '7',
      title: 'Proton Mail déploie le chiffrement post-quantique : voici comment l\'activer',
      link: 'https://www.it-connect.fr/proton-mail-deploie-le-chiffrement-post-quantique-voici-comment-lactiver/',
      summary: 'Proton Mail met à disposition de tous ses utilisateurs la protection post-quantique pour sécuriser les e-mails contre les futures menaces des ordinateurs quantiques. Découvrez comment l\'activer.',
      source: 'IT-Connect',
      category: 'reseau',
      image: '',
      published: new Date(now - 220 * m).toISOString()
    },
    {
      id: '8',
      title: 'Un chercheur prouve que Microsoft Edge laisse fuiter vos mots de passe en mémoire',
      link: 'https://www.it-connect.fr/un-chercheur-prouve-que-microsoft-edge-laisse-fuiter-vos-mots-de-passe-en-memoire/',
      summary: 'Une faille de sécurité dans Microsoft Edge expose les mots de passe en clair dans la mémoire vive de Windows, une vulnérabilité que tout processus avec les bons droits peut exploiter.',
      source: 'IT-Connect',
      category: 'reseau',
      image: '',
      published: new Date(now - 255 * m).toISOString()
    },
    {
      id: '9',
      title: 'iOS 26.5 : vos messages RCS entre iPhone et Android seront enfin sécurisés',
      link: 'https://www.it-connect.fr/ios-26-5-vos-messages-rcs-entre-iphone-et-android-seront-enfin-securises/',
      summary: 'La mise à jour iOS 26.5 intègre le chiffrement de bout en bout pour les échanges RCS entre iPhone et Android, une fonctionnalité attendue depuis l\'arrivée du RCS sur Apple.',
      source: 'IT-Connect',
      category: 'reseau',
      image: '',
      published: new Date(now - 300 * m).toISOString()
    },
    {
      id: '10',
      title: 'Mises à jour Windows 11 : Microsoft force votre PC à redémarrer plusieurs fois ce mois-ci',
      link: 'https://www.it-connect.fr/mises-a-jour-windows-11-microsoft-force-votre-pc-a-redemarrer-plusieurs-fois-ce-mois-ci/',
      summary: 'Les mises à jour d\'avril pour Windows 11 provoquent plusieurs redémarrages successifs liés au Secure Boot. Microsoft confirme que ce comportement est intentionnel et prévisible.',
      source: 'IT-Connect',
      category: 'reseau',
      image: '',
      published: new Date(now - 345 * m).toISOString()
    },
    {
      id: '11',
      title: 'Piratage DigiCert : des malwares signés à l\'aide de certificats volés !',
      link: 'https://www.it-connect.fr/piratage-digicert-des-malwares-signes-a-laide-de-certificats-voles/',
      summary: 'Suite au piratage de l\'autorité de certification DigiCert, des cybercriminels ont utilisé des certificats EV dérobés pour signer des logiciels malveillants et contourner les mécanismes de détection.',
      source: 'IT-Connect',
      category: 'reseau',
      image: '',
      published: new Date(now - 390 * m).toISOString()
    },
    {
      id: '12',
      title: 'wg-obfuscator — Faire passer WireGuard pour de la visioconférence',
      link: 'https://korben.info/wg-obfuscator.html',
      summary: 'Un outil open-source permet de dissimuler le trafic WireGuard en le faisant ressembler à du trafic de visioconférence, pour contourner les filtres DPI dans les réseaux restrictifs.',
      source: 'Korben',
      category: 'outils',
      image: 'https://korben.info/wg-obfuscator/wg-obfuscator-1.png',
      published: new Date(now - 435 * m).toISOString()
    },
    {
      id: '13',
      title: '10 sites pour jouer aux jeux DOS dans votre navigateur gratuitement',
      link: 'https://korben.info/emulateurs-dos-navigateur-gratuits.html',
      summary: 'DOOM, Fallout, Theme Hospital, Civilization... des milliers de jeux DOS jouables directement depuis votre navigateur, sans installation, grâce aux émulateurs en ligne.',
      source: 'Korben',
      category: 'outils',
      image: 'https://korben.info/emulateurs-dos-navigateur-gratuits/emulateurs-dos-navigateur-gratuits-1.png',
      published: new Date(now - 490 * m).toISOString()
    },
    {
      id: '14',
      title: 'Palo Alto PAN-OS — Exploitation active d\'une faille RCE critique',
      link: 'https://thehackernews.com/2026/05/palo-alto-pan-os-flaw-under-active.html',
      summary: 'Une vulnérabilité buffer overflow dans PAN-OS de Palo Alto Networks (CVE-2026-0300) est activement exploitée dans la nature, permettant l\'exécution de code arbitraire à distance.',
      source: 'The Hacker News',
      category: 'cybersecurite',
      image: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgF11tAg5Rdf8st9TeSlgPkW_Rn1I3Xi4Xl6wJjNMThFLB0oYYl2kKURYxYxgtnEphAJkeHzRxVrm8LX_7i8RDXgdLQhq4HM5ecZCrv3biRciuLM2JufgdxHqJR3eNTcTsIBWJBAz1Nv8Gac1fhW0vZ8Kgb7RFOC7_9zkL7Uy_SCrFOKps1scenY4c_LPSH/s1600/paloalto.jpg',
      published: new Date(now - 545 * m).toISOString()
    },
    {
      id: '15',
      title: 'DAEMON Tools — Attaque supply-chain via les installeurs officiels',
      link: 'https://thehackernews.com/2026/05/daemon-tools-supply-chain-attack.html',
      summary: 'Des installeurs de DAEMON Tools ont été compromis pour distribuer une charge malveillante. Kaspersky confirme que les fichiers étaient servis directement depuis le site officiel de l\'éditeur.',
      source: 'The Hacker News',
      category: 'cybersecurite',
      image: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEghQDcWhFHnIEeEngbqyPFjkweCMgT7FoZRRZV0WYRuHg1cHiq2O0lw2ahMc7jhJnzOCqqrLhzpM9w-O3eLpVdiCvI4C3-RD6XwqTkDxWdhzkS-W2BsbLy_SFwnjykdvvhuhjGnwPkFpOSJiapeWULhqx9er8hDH0sCCtoK51OrH4nSYqc_oAZwILcOi1A2/s1600/daemon.jpg',
      published: new Date(now - 600 * m).toISOString()
    },
    {
      id: '16',
      title: 'Vulnérabilité dans Python — Contournement de politique de sécurité (CERT-FR)',
      link: 'https://www.cert.ssi.gouv.fr/avis/CERTFR-2026-AVI-0505/',
      summary: 'Le CERT-FR publie un avis concernant une vulnérabilité dans Python permettant à un attaquant de contourner la politique de sécurité. Une mise à jour est disponible et fortement recommandée.',
      source: 'CERT-FR',
      category: 'cybersecurite',
      image: '',
      published: new Date(now - 660 * m).toISOString()
    },
    {
      id: '17',
      title: 'Multiples vulnérabilités dans les produits Microsoft (CERT-FR)',
      link: 'https://www.cert.ssi.gouv.fr/avis/CERTFR-2026-AVI-0503/',
      summary: 'Le CERT-FR alerte sur de multiples vulnérabilités dans les produits Microsoft permettant diverses attaques. Les correctifs du Patch Tuesday sont disponibles et doivent être appliqués rapidement.',
      source: 'CERT-FR',
      category: 'cybersecurite',
      image: '',
      published: new Date(now - 720 * m).toISOString()
    },
    {
      id: '18',
      title: 'Bulletin d\'actualité CERTFR-2026-ACT-019 — Synthèse hebdomadaire',
      link: 'https://www.cert.ssi.gouv.fr/actualite/CERTFR-2026-ACT-019/',
      summary: 'Le CERT-FR publie sa synthèse hebdomadaire des vulnérabilités significatives, soulignant les criticités les plus importantes pour les systèmes d\'information des organisations françaises.',
      source: 'CERT-FR',
      category: 'cybersecurite',
      image: '',
      published: new Date(now - 780 * m).toISOString()
    },
    {
      id: '19',
      title: 'Smartphones : l\'Europe impose les batteries amovibles dès 2027',
      link: 'https://www.it-connect.fr/smartphones-leurope-impose-les-batteries-amovibles-des-2027-mais-il-y-a-des-exceptions/',
      summary: 'Une nouvelle réglementation européenne oblige les fabricants de smartphones à proposer des batteries amovibles dès février 2027, avec quelques exceptions pour les appareils étanches et ultra-fins.',
      source: 'IT-Connect',
      category: 'actu',
      image: '',
      published: new Date(now - 840 * m).toISOString()
    },
    {
      id: '20',
      title: 'Multiples vulnérabilités dans Google Chrome — Mise à jour urgente (CERT-FR)',
      link: 'https://www.cert.ssi.gouv.fr/avis/CERTFR-2026-AVI-0487/',
      summary: 'Le CERT-FR publie un avis sur de multiples vulnérabilités dans Google Chrome permettant à un attaquant de provoquer des problèmes de sécurité non spécifiés. Mise à jour immédiate recommandée.',
      source: 'CERT-FR',
      category: 'cybersecurite',
      image: '',
      published: new Date(now - 900 * m).toISOString()
    }
  ];
})();

let allArticles = [];
let activeCategory = 'all';
let searchQuery = '';

function relTime(iso) {
  const m = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (m < 1)  return "À l'instant";
  if (m < 60) return `${m}min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  if (d < 7)  return `${d}j`;
  return new Date(iso).toLocaleDateString('fr-FR', { day:'numeric', month:'short' });
}

function esc(s) {
  return String(s)
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;');
}

function sourceInitial(source) {
  return source.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase();
}

function getFiltered() {
  return allArticles.filter(a => {
    const catOk  = activeCategory === 'all' || a.category === activeCategory;
    const q      = searchQuery.toLowerCase();
    const textOk = !q || a.title.toLowerCase().includes(q) || a.source.toLowerCase().includes(q) || a.summary.toLowerCase().includes(q);
    return catOk && textOk;
  });
}

/* ── Featured card ─────────────────────────────────────────────────── */
function renderFeatured(article, idx) {
  const cat   = article.category;
  const label = CAT_LABELS[cat] || cat;
  const logo  = SOURCE_LOGOS[article.source];

  const imgTag = article.image
    ? `<img src="${esc(article.image)}" alt="" class="fc-img" loading="lazy" onerror="this.remove()">`
    : '';

  return `
    <div class="fc fc-cat-${esc(cat)}${article.image ? ' fc-has-img' : ''}" style="animation-delay:${idx*60}ms"
         onclick="window.open('${esc(article.link)}','_blank','noopener')">
      <div class="fc-thumb">
        ${imgTag}
        <span class="fc-cat-badge">${esc(label)}</span>
      </div>
      <div class="fc-body">
        <h2 class="fc-title">
          <a href="${esc(article.link)}" target="_blank" rel="noopener"
             onclick="event.stopPropagation()">${esc(article.title)}</a>
        </h2>
        ${article.summary ? `<p class="fc-desc">${esc(article.summary)}</p>` : ''}
        <div class="fc-footer">
          <span class="fc-time">Il y a ${relTime(article.published)}</span>
          <span class="fc-read">Lire
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </span>
        </div>
      </div>
    </div>`;
}

/* ── List item ──────────────────────────────────────────────────────── */
function renderListItem(article, idx) {
  const cat   = article.category;
  const label = CAT_LABELS[cat] || cat;
  const init  = sourceInitial(article.source);
  const logo  = SOURCE_LOGOS[article.source];
  const thumbContent = logo
    ? `<img src="${esc(logo)}" alt="${esc(article.source)}" class="li-logo" loading="lazy">`
    : `<span class="li-init">${init}</span>`;
  const thumbClass = logo ? 'li-thumb li-thumb-logo' : `li-thumb li-cat-${esc(cat)}`;
  return `
    <div class="li-item" style="animation-delay:${idx*30}ms"
         onclick="window.open('${esc(article.link)}','_blank','noopener')">
      <div class="${thumbClass}">
        ${thumbContent}
      </div>
      <div class="li-content">
        <div class="li-top">
          <span class="li-badge badge-${esc(cat)}">${esc(label)}</span>
        </div>
        <div class="li-title">
          <a href="${esc(article.link)}" target="_blank" rel="noopener"
             onclick="event.stopPropagation()">${esc(article.title)}</a>
        </div>
        <div class="li-meta">
          <span>${esc(article.source)}</span>
          <span class="li-sep">·</span>
          <span>Il y a ${relTime(article.published)}</span>
        </div>
      </div>
    </div>`;
}

/* ── Top stories widget ─────────────────────────────────────────────── */
function renderTopWidget(articles) {
  const top5 = articles.slice(0, 5);
  if (!top5.length) return '<p style="font-size:.75rem;color:#94a3b8">Aucun article disponible.</p>';
  return top5.map(a => `
    <a class="wi-item" href="${esc(a.link)}" target="_blank" rel="noopener">
      <span class="wi-dot wi-dot-${esc(a.category)}"></span>
      <div class="wi-body">
        <span class="wi-source">${esc(a.source)}</span>
        <span class="wi-title">${esc(a.title)}</span>
      </div>
    </a>`).join('');
}

/* ── Categories widget ──────────────────────────────────────────────── */
function renderCatsWidget(articles) {
  const counts = {};
  articles.forEach(a => { counts[a.category] = (counts[a.category] || 0) + 1; });
  return Object.entries(CAT_LABELS).map(([key, label]) => {
    const n = counts[key] || 0;
    if (!n) return '';
    return `
      <div class="cat-row" data-filter="${esc(key)}">
        <div class="cat-row-left">
          <span class="cat-bar cat-bar-${esc(key)}"></span>
          <span class="cat-row-name">${esc(label)}</span>
        </div>
        <span class="cat-row-count">${n}</span>
      </div>`;
  }).join('');
}

/* ── Sources widget ─────────────────────────────────────────────────── */
function renderSourcesWidget(articles) {
  const counts = {};
  articles.forEach(a => { counts[a.source] = (counts[a.source] || 0) + 1; });
  return Object.entries(counts)
    .sort((a,b) => b[1]-a[1])
    .map(([src, n]) => `
      <div class="source-row">
        <span class="source-name">${esc(src)}</span>
        <span class="source-count">${n} articles</span>
      </div>`).join('');
}

/* ── Main render ────────────────────────────────────────────────────── */
function render() {
  const filtered  = getFiltered();
  const listItems = filtered.slice(2);

  const featuredGrid = document.getElementById('featuredGrid');
  const articleList  = document.getElementById('articleList');
  const listHeader   = document.getElementById('listHeader');
  const listCount    = document.getElementById('listCount');
  const listLabel    = document.getElementById('listLabel');
  const emptyState   = document.getElementById('emptyState');

  if (!filtered.length) {
    featuredGrid.innerHTML = '';
    articleList.innerHTML  = '';
    listHeader.hidden = true;
    emptyState.hidden = false;
    return;
  }

  emptyState.hidden = true;
  const withImg = filtered.filter(a => a.image);
  const featured2 = withImg.slice(0, 2);
  featuredGrid.innerHTML = featured2.map((a,i) => renderFeatured(a, i)).join('');

  if (listItems.length) {
    const label = activeCategory === 'all' ? 'Derniers articles' : CAT_LABELS[activeCategory] || 'Articles';
    listLabel.textContent = label;
    listCount.textContent = `${listItems.length} article${listItems.length > 1 ? 's' : ''}`;
    listHeader.hidden     = false;
    articleList.innerHTML = listItems.map((a,i) => renderListItem(a,i)).join('');
  } else {
    listHeader.hidden     = true;
    articleList.innerHTML = '';
  }

  document.querySelectorAll('.cat-row[data-filter]').forEach(row => {
    row.addEventListener('click', () => setCategory(row.dataset.filter));
  });
}

/* ── Sidebar render ─────────────────────────────────────────────────── */
function renderSidebar(articles) {
  const topWidget     = document.getElementById('topWidget');
  const catsWidget    = document.getElementById('catsWidget');
  const sourcesWidget = document.getElementById('sourcesWidget');

  if (topWidget)     topWidget.innerHTML     = renderTopWidget(articles);
  if (catsWidget)    catsWidget.innerHTML    = renderCatsWidget(articles);
  if (sourcesWidget) sourcesWidget.innerHTML = renderSourcesWidget(articles);

  document.querySelectorAll('.cat-row[data-filter]').forEach(row => {
    row.addEventListener('click', () => setCategory(row.dataset.filter));
  });
}

/* ── Category switching ─────────────────────────────────────────────── */
function setCategory(cat) {
  activeCategory = cat;
  document.querySelectorAll('.catlink').forEach(el => {
    el.classList.toggle('active', el.dataset.cat === cat);
  });
  render();
}

/* ── Init ──────────────────────────────────────────────────────────── */
function initFeeds() {
  const loading = document.getElementById('loadingState');
  if (loading) loading.hidden = true;

  allArticles = window.STATIC_ARTICLES || [];

  const updated   = document.getElementById('statUpdated');
  const navStatus = document.getElementById('navStatus');
  const timeStr   = 'Mise à jour il y a 18min';
  if (updated)   updated.textContent   = timeStr;
  if (navStatus) navStatus.textContent = timeStr;

  renderSidebar(allArticles);
  render();
}

/* ── Events ─────────────────────────────────────────────────────────── */
document.getElementById('catNav').addEventListener('click', e => {
  const link = e.target.closest('.catlink');
  if (link) setCategory(link.dataset.cat);
});

let searchTimer;
document.getElementById('searchInput').addEventListener('input', e => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    searchQuery = e.target.value.trim();
    render();
  }, 200);
});

initFeeds();
