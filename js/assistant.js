/* ═══════════════════════════════════════════════════════════════
   AI ASSISTANT — vanilla keyword engine, no external API
═══════════════════════════════════════════════════════════════ */

(function () {
  const card       = document.getElementById('aiCard');
  const closeBtn   = document.getElementById('aiClose');
  const reopenBtn  = document.getElementById('aiReopen');
  const msgBox     = document.getElementById('aiMessages');
  const pillBox    = document.getElementById('aiPills');
  const form       = document.getElementById('aiForm');
  const input      = document.getElementById('aiInput');
  const statusText = document.getElementById('aiStatusText');

  if (!card || !msgBox || !input || !form) return;

  /* ── Welcome + default ──────────────────────────── */
  const WELCOME = `Bienvenue — je suis l'assistant du portfolio de <strong>Yanis Dahman</strong>. Pose-moi une question ou utilise les suggestions ci-dessous.`;
  const DEFAULT_REPLY = `Hmm, je ne connais pas ce mot-clé. Tape <strong>aide</strong> pour voir ce que je sais faire.`;

  /* ── Quick-reply pills ──────────────────────────── */
  const PILLS = [
    { label: 'Contact',        kw: 'contact' },
    { label: 'Projets',        kw: 'projets' },
    { label: 'CV',             kw: 'cv' },
    { label: 'Parcours',       kw: 'parcours' },
    { label: 'Compétences',    kw: 'competences' },
    { label: 'Stages',         kw: 'stages' },
    { label: 'Aide',           kw: 'aide' },
  ];

  /* ── Intent dictionary ──────────────────────────── */
  const INTENTS = [
    {
      keys: ['bonjour', 'salut', 'hello', 'hi', 'hey', 'cc', 'yo', 'coucou', 'bonsoir'],
      reply: () => `Salut ! Ravi de te voir. Tu veux découvrir quoi — <strong>parcours</strong>, <strong>projets</strong> ou <strong>contact</strong> ?`
    },
    {
      keys: ['merci', 'thanks', 'thx', 'ty', 'cool', 'super', 'parfait'],
      reply: () => `Avec plaisir. Besoin d'autre chose ?`
    },
    {
      keys: ['qui', 'toi', 'presente', 'présente', 'presentation', 'présentation', 'yanis', 'dahman'],
      reply: () => `Je suis l'assistant du portfolio de <strong>Yanis Dahman</strong>, étudiant en <strong>BTS SIO SISR</strong> à Annecy, passionné d'infrastructures réseau et de cybersécurité. Actuellement en recherche d'alternance pour la rentrée 2026.`
    },
    {
      keys: ['age', 'âge'],
      reply: () => `Yanis est étudiant en 2e année de BTS SIO SISR. Pour les détails perso, passe par la <strong>section contact</strong>.${button('Section Contact', 'scroll', '#contact')}`
    },
    {
      keys: ['contact', 'mail', 'email', 'joindre', 'ecrire', 'écrire', 'message', 'contacter'],
      reply: () => `Pour me joindre :<br>📧 <a href="https://mail.google.com/mail/?view=cm&to=yanisdahman0@gmail.com" target="_blank" rel="noopener">yanisdahman0@gmail.com</a><br>📞 <a href="tel:+33769541830">+33 7 69 54 18 30</a>${actions([
        { label: 'Aller au contact', action: 'scroll', target: '#contact' },
        { label: 'Copier l\'email',   action: 'copy',   target: 'yanisdahman0@gmail.com' }
      ])}`
    },
    {
      keys: ['cv', 'curriculum', 'resume', 'pdf'],
      reply: () => `Mon CV est intégré directement au portfolio.${actions([
        { label: 'Ouvrir mon CV', action: 'cv' }
      ])}`
    },
    {
      keys: ['projets', 'projet', 'realisations', 'réalisations', 'realisation', 'réalisation', 'portfolio', 'travaux'],
      reply: () => `Mes projets et réalisations (procédures, schémas réseau, labs) sont regroupés dans la section documentation.${actions([
        { label: 'Voir mes projets', action: 'scroll', target: '#documentation' }
      ])}`
    },
    {
      keys: ['documentation', 'docs', 'dossier', 'dossiers', 'procedures', 'procédures', 'doc'],
      reply: () => `Toute ma documentation technique (procédures, architectures, labs) y est centralisée.${actions([
        { label: 'Ouvrir documentation', action: 'scroll', target: '#documentation' }
      ])}`
    },
    {
      keys: ['parcours', 'formation', 'diplome', 'diplôme', 'ecole', 'école', 'etudes', 'études', 'bts', 'sio', 'sisr', 'lycee', 'lycée'],
      reply: () => `Je suis en <strong>BTS SIO option SISR</strong> au <strong>Lycée Gabriel Fauré</strong> (Annecy), et je prépare un <strong>Bachelor ASRC</strong> à la rentrée 2026 au <strong>Lycée Saint-Michel</strong>. Mon parcours complet est détaillé plus bas.${actions([
        { label: 'Voir le parcours', action: 'scroll', target: '#parcours' }
      ])}`
    },
    {
      keys: ['stage', 'stages', 'experience', 'expérience', 'experiences', 'expériences', 'prodhys', 'novarina'],
      reply: () => `J'ai réalisé deux stages :<br>• <strong>Prodhys</strong> — support & assistance informatique<br>• <strong>Novarina</strong> — déploiement Bitwarden Enterprise, SSO/SCIM, GPO${actions([
        { label: 'Voir les stages', action: 'scroll', target: '#parcours' }
      ])}`
    },
    {
      keys: ['veille', 'news', 'actualite', 'actualité', 'informationnelle'],
      reply: () => `Ma veille porte sur la cybersécurité et l'administration système (sources sélectionnées, synthèse régulière).${actions([
        { label: 'Ouvrir la veille', action: 'scroll', target: '#veille' }
      ])}`
    },
    {
      keys: ['certif', 'certifs', 'certifications', 'certificat', 'certificats', 'ethical', 'hacker', 'badge'],
      reply: () => `J'ai plusieurs certifications dont <strong>Ethical Hacker</strong>. Elles sont regroupées dans la section Certifications dédiée.${actions([
        { label: 'Voir les certifications', action: 'scroll', target: '#certifications' }
      ])}`
    },
    {
      keys: ['competences', 'compétences', 'skills', 'techno', 'technos', 'stack', 'tech', 'outils', 'tableau'],
      reply: () => `Mon tableau de compétences détaille chaque savoir-faire (réseau, système, sécurité, support N2).${actions([
        { label: 'Voir mes compétences', action: 'scroll', target: '#tableau' }
      ])}`
    },
    {
      keys: ['reseau', 'réseau', 'network', 'networking'],
      reply: () => `Réseau : configuration Cisco, VLAN, routage, services AD, GPO, VPN IPsec, surveillance. Voir mon tableau de compétences pour le détail.${actions([
        { label: 'Voir compétences', action: 'scroll', target: '#tableau' }
      ])}`
    },
    {
      keys: ['securite', 'sécurité', 'security', 'cybersecurite', 'cybersécurité', 'cyber'],
      reply: () => `Cybersécurité : veille active, labs CTF, pentesting basique, gestion SSO/MFA, hardening système. Certification <strong>Ethical Hacker</strong> obtenue.${actions([
        { label: 'Voir la veille', action: 'scroll', target: '#veille' }
      ])}`
    },
    {
      keys: ['linkedin'],
      reply: () => `LinkedIn : <a href="https://www.linkedin.com/in/yanisdahman" target="_blank" rel="noopener">yanis-dahman</a>${actions([
        { label: 'Ouvrir LinkedIn', action: 'link', target: 'https://www.linkedin.com/in/yanisdahman' }
      ])}`
    },
    {
      keys: ['github', 'git', 'code', 'repo'],
      reply: () => `Mon code et mes labs sont partagés dans la documentation du portfolio. Pour un échange technique, contact par email.`
    },
    {
      keys: ['alternance', 'recherche', 'entreprise', 'embauche', 'recruter', 'recrute', 'job', 'poste'],
      reply: () => `Je recherche une <strong>alternance pour la rentrée 2026</strong> — postes Sysadmin, Support N2, Réseau. Disponibilité rapide, rythme 2 sem. entreprise / 1 sem. école.${actions([
        { label: 'Me contacter', action: 'scroll', target: '#contact' }
      ])}`
    },
    {
      keys: ['ou', 'où', 'annecy', 'localisation', 'adresse', 'ville', 'region', 'région', 'lieu'],
      reply: () => `Je suis basé à <strong>Annecy (74)</strong>, Haute-Savoie — mobile sur la région Auvergne-Rhône-Alpes.`
    },
    {
      keys: ['disponibilite', 'disponibilité', 'dispo', 'quand'],
      reply: () => `Je suis <strong>disponible rapidement</strong> pour une alternance à partir de septembre 2026. Rythme 2 semaines entreprise / 1 semaine formation.`
    },
    {
      keys: ['aide', 'help', 'commande', 'commandes', 'menu', '?', 'sujets'],
      reply: () => `Voici les sujets que je connais : <strong>contact</strong>, <strong>cv</strong>, <strong>projets</strong>, <strong>parcours</strong>, <strong>stages</strong>, <strong>compétences</strong>, <strong>certifications</strong>, <strong>veille</strong>, <strong>linkedin</strong>, <strong>alternance</strong>, <strong>réseau</strong>, <strong>sécurité</strong>, <strong>où</strong>, <strong>disponibilité</strong>.`
    },
    {
      keys: ['bye', 'ciao', 'aurevoir', 'au revoir', 'adieu', 'tchao'],
      reply: () => `À bientôt ! Pense à la <strong>section contact</strong> si tu veux me joindre.`
    },
    {
      keys: ['blague', 'joke', 'humour', 'rire'],
      reply: () => `Pourquoi l'admin réseau est toujours calme ? Parce qu'il <em>ping</em> avant de paniquer.`
    },
  ];

  /* ── Helpers for reply building ─────────────────── */
  function actions(list) {
    if (!list || !list.length) return '';
    const inner = list.map(b => {
      const target = b.target ? ` data-target="${escapeAttr(b.target)}"` : '';
      return `<button class="ai-msg-btn" data-action="${b.action}"${target}>${b.label}</button>`;
    }).join('');
    return `<div class="ai-msg-actions">${inner}</div>`;
  }
  function button(label, action, target) {
    return actions([{ label, action, target }]);
  }
  function escapeAttr(s) {
    return String(s).replace(/"/g, '&quot;');
  }

  /* ── Normalization & intent matching ────────────── */
  function normalize(str) {
    return String(str).toLowerCase()
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[.,!?;:()\[\]{}'"«»]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }
  function findIntent(text) {
    const norm = normalize(text);
    if (!norm) return null;
    const tokens = new Set(norm.split(' '));
    for (const intent of INTENTS) {
      for (const k of intent.keys) {
        const nk = normalize(k);
        if (!nk) continue;
        if (nk.includes(' ')) {
          if (norm.includes(nk)) return intent;
        } else if (tokens.has(nk)) {
          return intent;
        }
      }
    }
    return null;
  }

  /* ── Rendering ──────────────────────────────────── */
  function scrollToBottom() {
    msgBox.scrollTop = msgBox.scrollHeight;
  }
  function addMessage(html, who) {
    const el = document.createElement('div');
    el.className = 'ai-msg ' + (who === 'user' ? 'user' : 'bot');
    el.innerHTML = html;
    msgBox.appendChild(el);
    scrollToBottom();
    return el;
  }
  function addTyping() {
    const el = document.createElement('div');
    el.className = 'ai-msg bot typing';
    el.innerHTML = '<span></span><span></span><span></span>';
    msgBox.appendChild(el);
    scrollToBottom();
    return el;
  }
  function renderPills() {
    pillBox.innerHTML = '';
    PILLS.forEach(p => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'ai-pill';
      b.textContent = p.label;
      b.addEventListener('click', () => submit(p.kw));
      pillBox.appendChild(b);
    });
  }
  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, c => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
  }

  /* ── Conversation flow ──────────────────────────── */
  let busy = false;
  function submit(text) {
    const clean = String(text || '').trim();
    if (!clean || busy) return;
    busy = true;
    addMessage(escapeHtml(clean), 'user');
    input.value = '';
    setStatus('écrit…');

    const typing = addTyping();
    const delay = 420 + Math.min(clean.length * 14, 520) + Math.random() * 160;
    setTimeout(() => {
      typing.remove();
      const intent = findIntent(clean);
      addMessage(intent ? intent.reply() : DEFAULT_REPLY, 'bot');
      setStatus('En ligne — prêt à répondre');
      busy = false;
    }, delay);
  }

  function setStatus(txt) {
    if (statusText) statusText.textContent = txt;
  }

  /* ── Action handlers (buttons inside messages) ── */
  msgBox.addEventListener('click', e => {
    const btn = e.target.closest('.ai-msg-btn');
    if (!btn) return;
    const action = btn.dataset.action;
    const target = btn.dataset.target;

    if (action === 'scroll' && target) {
      const sec = document.querySelector(target);
      if (sec) {
        const navH = document.querySelector('nav')?.offsetHeight ?? 70;
        const top  = sec.getBoundingClientRect().top + window.scrollY - navH - 28;
        window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
      }
    } else if (action === 'cv' && typeof window.openCvModal === 'function') {
      window.openCvModal();
    } else if (action === 'link' && target) {
      window.open(target, '_blank', 'noopener');
    } else if (action === 'copy' && target) {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(target).then(() => {
          const orig = btn.textContent;
          btn.textContent = 'Copié ✓';
          setTimeout(() => { btn.textContent = orig; }, 1400);
        });
      }
    }
  });

  /* ── Open / close logic ─────────────────────────── */
  function closeCard() {
    card.classList.add('is-hidden');
    reopenBtn?.classList.add('is-shown');
  }
  function openCard() {
    card.classList.remove('is-hidden');
    reopenBtn?.classList.remove('is-shown');
    setTimeout(() => input.focus(), 320);
  }
  closeBtn?.addEventListener('click', closeCard);
  reopenBtn?.addEventListener('click', openCard);

  /* ── Global keyboard shortcut (Ctrl/Cmd + K) ────── */
  document.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (card.classList.contains('is-hidden')) openCard();
      else input.focus();
    }
    if (e.key === 'Escape' && document.activeElement === input) {
      input.blur();
    }
  });

  /* ── Form submit ────────────────────────────────── */
  form.addEventListener('submit', e => {
    e.preventDefault();
    submit(input.value);
  });

  /* ── Disable send when empty ────────────────────── */
  const sendBtn = document.getElementById('aiSend');
  function syncSendState() {
    if (!sendBtn) return;
    sendBtn.disabled = !input.value.trim();
  }
  input.addEventListener('input', syncSendState);
  syncSendState();

  /* ── Boot ───────────────────────────────────────── */
  renderPills();
  setTimeout(() => addMessage(WELCOME, 'bot'), 450);
})();
