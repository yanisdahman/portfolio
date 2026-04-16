# Yanis DAHMAN — Portfolio SISR

Portfolio professionnel d'un étudiant en **BTS SIO option SISR** (Solutions d'Infrastructure, Systèmes et Réseaux).

## 📁 Structure du dossier

```
yanis portfolio/
├── index.html          # Fichier principal (tout-en-un HTML/CSS/JS)
└── README.md          # Ce fichier
```

## 🚀 Comment utiliser

### Option 1 : Ouvrir localement
1. Double-cliquez sur `index.html` pour l'ouvrir dans votre navigateur

### Option 2 : Via un serveur web local
```bash
# Si vous avez Python 3
python -m http.server 8000

# Si vous avez Node.js + http-server
npx http-server
```
Puis accédez à `http://localhost:8000` dans votre navigateur.

### Option 3 : Déployer en ligne
Uploadez le fichier `index.html` sur un hébergeur (GitHub Pages, Netlify, Vercel, etc.)

## ✨ Fonctionnalités

- **Dark/Light Mode** — Bascule de thème avec préférence sauvegardée
- **Mouse Glow** — Fond réactif qui suit le curseur
- **Glassmorphisme** — Navbar avec backdrop-filter blur
- **Animations avancées** — Reveal mask, tilt 3D, boutons magnétiques
- **Performance 60 FPS** — RequestAnimationFrame throttlé, will-change, IntersectionObserver
- **Responsive design** — Mobile, tablette, desktop
- **Typographie fluide** — Utilise `clamp()` pour une échelle optimale

## 🎨 Couleurs

### Mode Sombre (défaut)
- Fond : `#090909`
- Surface : `#101010`
- Texte : `#f0f0f0`

### Mode Clair
- Fond : `#f2f2f0`
- Surface : `#ffffff`
- Texte : `#080808`

## 📱 Sections

1. **Accueil** — Hero avec typing effect et parallax grid
2. **À propos** — Présentation et statistiques
3. **Compétences** — 4 domaines (Systèmes, Réseaux, Virtualisation, Sécurité)
4. **Projets** — 6 cartes avec effet tilt 3D
5. **Parcours** — Timeline de formation et expériences

## ⚙️ Compatibilité

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile Safari (iOS 13+)

## 🔧 Personnalisation

Le fichier est entièrement autonomous (HTML + CSS + JS inline). Pour modifier :

1. **Contenu** — Éditez directement dans `index.html`
2. **Couleurs** — Variables CSS dans `:root` (lignes ~20-50)
3. **Textes** — Cherchez les `[à compléter]` et remplacez par vos infos
4. **Images** — Le logo avatar (YD) est en CSS, pas d'image externe

## 📄 Licence

© 2026 Yanis DAHMAN — Tous droits réservés

---

**Version** : 2.0 Premium WebPerf Edition
**Dernière mise à jour** : 2 avril 2026
