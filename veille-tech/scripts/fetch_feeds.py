import feedparser
import json
import os
import hashlib
import html
import re
import time
import socket
from datetime import datetime, timezone
from urllib.request import urlopen, Request
from urllib.parse import urlparse, urljoin

# Timeout réseau global (secondes)
socket.setdefaulttimeout(15)

FEEDS = [
    {"url": "https://www.cert.ssi.gouv.fr/feed/",          "source": "CERT-FR",          "category": "cybersecurite"},
    {"url": "https://feeds.feedburner.com/TheHackersNews",  "source": "The Hacker News",  "category": "cybersecurite"},
    {"url": "https://www.bleepingcomputer.com/feed/",       "source": "Bleeping Computer","category": "cybersecurite"},
    {"url": "https://korben.info/feed",                     "source": "Korben",           "category": "outils"},
    {"url": "https://www.it-connect.fr/feed/",              "source": "IT-Connect",       "category": "reseau"},
    {"url": "https://www.lemagit.fr/rss/actualites",        "source": "LeMagIT",          "category": "actu"},
]

MAX_PER_FEED  = 10
RETRY_DELAYS  = [0, 15, 45, 90, 180]
USER_AGENT    = "Mozilla/5.0 (compatible; RSSBot/2.0; +https://yanisdahman.fr)"


# ── Helpers ──────────────────────────────────────────────────────────────────

def clean_html(text):
    if not text:
        return ""
    text = re.sub(r"<[^>]+>", "", text)
    text = html.unescape(text)
    return " ".join(text.split())


def parse_date(entry):
    if hasattr(entry, "published_parsed") and entry.published_parsed:
        try:
            return datetime(*entry.published_parsed[:6], tzinfo=timezone.utc).isoformat()
        except Exception:
            pass
    return datetime.now(timezone.utc).isoformat()


def get_image(entry):
    if hasattr(entry, "media_content") and entry.media_content:
        for m in entry.media_content:
            if m.get("type", "").startswith("image"):
                return m.get("url", "")
    if hasattr(entry, "enclosures") and entry.enclosures:
        for e in entry.enclosures:
            if "image" in e.get("type", ""):
                return e.get("href", "")
    raw = ""
    if hasattr(entry, "content") and entry.content:
        raw = entry.content[0].value
    elif hasattr(entry, "summary"):
        raw = entry.summary or ""
    match = re.search(r'<img[^>]+src=["\']([^"\']+)["\']', raw)
    if match:
        return match.group(1)
    return ""


def base_url(url):
    p = urlparse(url)
    return f"{p.scheme}://{p.netloc}"


# ── Auto-discovery ────────────────────────────────────────────────────────────

def autodiscover(feed_url):
    """
    Cherche l'URL du flux RSS/Atom sur la homepage du site.
    Retourne la nouvelle URL ou None si introuvable.
    """
    home = base_url(feed_url)
    print(f"    Auto-discovery sur {home} ...")
    try:
        req = Request(home, headers={"User-Agent": USER_AGENT})
        with urlopen(req, timeout=10) as resp:
            content = resp.read().decode("utf-8", errors="ignore")
    except Exception as e:
        print(f"    Auto-discovery : impossible de charger {home} ({e})")
        return None

    # Patterns RSS et Atom, attributs dans les deux ordres possibles
    patterns = [
        r'<link[^>]+type=["\']application/rss\+xml["\'][^>]*href=["\']([^"\']+)["\']',
        r'<link[^>]+href=["\']([^"\']+)["\'][^>]*type=["\']application/rss\+xml["\']',
        r'<link[^>]+type=["\']application/atom\+xml["\'][^>]*href=["\']([^"\']+)["\']',
        r'<link[^>]+href=["\']([^"\']+)["\'][^>]*type=["\']application/atom\+xml["\']',
    ]
    for pattern in patterns:
        m = re.search(pattern, content, re.IGNORECASE)
        if m:
            discovered = urljoin(home, m.group(1))
            print(f"    Auto-discovery : nouvelle URL trouvée → {discovered}")
            return discovered

    print(f"    Auto-discovery : aucun flux trouvé sur {home}")
    return None


# ── Fetch avec retry ──────────────────────────────────────────────────────────

def try_url(url, source, label=""):
    """Tente de récupérer un flux avec retry. Retourne le feed ou None."""
    tag = f"[{source}]{' ' + label if label else ''}"
    for attempt, delay in enumerate(RETRY_DELAYS, start=1):
        if delay > 0:
            print(f"  {tag} Tentative {attempt}/{len(RETRY_DELAYS)} dans {delay}s...")
            time.sleep(delay)
        else:
            print(f"  {tag} Tentative {attempt}/{len(RETRY_DELAYS)}...")

        try:
            feed = feedparser.parse(url, agent=USER_AGENT)
        except Exception as e:
            print(f"  {tag} Erreur parse : {e}")
            continue

        if feed.entries:
            status = getattr(feed, "status", "?")
            print(f"  {tag} OK (HTTP {status}, {len(feed.entries)} entrées)")
            return feed

        status  = getattr(feed, "status", None)
        bozo_ex = getattr(feed, "bozo_exception", None)
        reason  = f"HTTP {status}" if status else str(bozo_ex) if bozo_ex else "flux vide"
        print(f"  {tag} Échec : {reason}")

    return None


def fetch_feed(feed_cfg):
    """
    1. Essaie l'URL principale avec retry.
    2. Si échec → auto-discovery sur la homepage.
    3. Si une nouvelle URL est trouvée → réessaie avec retry.
    """
    source = feed_cfg["source"]
    url    = feed_cfg["url"]

    # Étape 1 — URL principale
    feed = try_url(url, source)
    if feed:
        return feed

    print(f"  [{source}] URL principale épuisée — tentative auto-discovery...")

    # Étape 2 — Auto-discovery
    discovered = autodiscover(url)
    if not discovered or discovered == url:
        print(f"  [{source}] ABANDON — aucune alternative trouvée.")
        return None

    # Étape 3 — Nouvelle URL découverte
    feed = try_url(discovered, source, label="(découverte)")
    if feed:
        print(f"  [{source}] Succès via auto-discovery !")
        return feed

    print(f"  [{source}] ABANDON — URL découverte aussi en échec.")
    return None


# ── Collecte ──────────────────────────────────────────────────────────────────

articles = []
seen     = set()
failed   = []

for feed_cfg in FEEDS:
    feed = fetch_feed(feed_cfg)

    if feed is None:
        failed.append(feed_cfg["source"])
        continue

    count = 0
    for entry in feed.entries[:MAX_PER_FEED]:
        link       = getattr(entry, "link", "")
        article_id = hashlib.md5(link.encode()).hexdigest()

        if article_id in seen:
            continue
        seen.add(article_id)

        title   = clean_html(getattr(entry, "title", "Sans titre"))
        summary = clean_html(getattr(entry, "summary", ""))
        if len(summary) > 220:
            summary = summary[:217] + "..."

        articles.append({
            "id":        article_id,
            "title":     title,
            "link":      link,
            "summary":   summary,
            "published": parse_date(entry),
            "source":    feed_cfg["source"],
            "category":  feed_cfg["category"],
            "image":     get_image(entry),
        })
        count += 1

    print(f"  [{feed_cfg['source']}] {count} articles retenus")

# ── Résumé ────────────────────────────────────────────────────────────────────

print(f"\n{'='*50}")
print(f"Résultat : {len(articles)} articles — {len(FEEDS) - len(failed)}/{len(FEEDS)} flux OK")
if failed:
    print(f"Flux en échec : {', '.join(failed)}")

# Échec total : on ne touche pas au feeds.json existant
if not articles:
    print("ERREUR CRITIQUE : aucun article récupéré. feeds.json non modifié.")
    raise SystemExit(1)

articles.sort(key=lambda x: x["published"], reverse=True)

output = {
    "last_updated": datetime.now(timezone.utc).isoformat(),
    "count":        len(articles),
    "articles":     articles,
}

os.makedirs("data", exist_ok=True)
with open("data/feeds.json", "w", encoding="utf-8") as f:
    json.dump(output, f, ensure_ascii=False, indent=2)

print(f"{len(articles)} articles sauvegardés dans data/feeds.json")
