(() => {
  'use strict';
  const ENDPOINT = 'https://formspree.io/f/mojypqkl';

  const form    = document.getElementById('contact-form');
  if (!form) return;

  const btn     = document.getElementById('ct-submit-btn');
  const success = document.getElementById('ct-success');
  const errBox  = document.getElementById('ct-error');
  const errMsg  = document.getElementById('ct-error-msg');

  function setLoading(on) {
    btn.disabled = on;
    btn.classList.toggle('is-loading', on);
  }

  function showError(msg) {
    errMsg.textContent = msg || 'Une erreur est survenue. Réessaie ou envoie un email directement.';
    errBox.hidden = false;
    errBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    errBox.hidden = true;

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    setLoading(true);

    try {
      const res  = await fetch(ENDPOINT, {
        method:  'POST',
        headers: { 'Accept': 'application/json' },
        body:    new FormData(form),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        form.hidden    = true;
        errBox.hidden  = true;
        success.hidden = false;
        success.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } else {
        const msg = data.errors
          ? data.errors.map(e => e.message).join(' — ')
          : (data.error || 'Erreur lors de l\'envoi.');
        showError(msg);
        setLoading(false);
      }
    } catch {
      showError('Impossible de joindre le serveur. Vérifie ta connexion ou envoie un email à yanisdahman0@gmail.com.');
      setLoading(false);
    }
  });
})();
