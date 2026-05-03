<?php
header('Content-Type: text/plain; charset=utf-8');

$FEEDS = [
    ['url' => 'https://www.cert.ssi.gouv.fr/feed/',            'source' => 'CERT-FR',           'category' => 'cybersecurite'],
    ['url' => 'https://feeds.feedburner.com/TheHackersNews',    'source' => 'The Hacker News',   'category' => 'cybersecurite'],
    ['url' => 'https://www.bleepingcomputer.com/feed/',         'source' => 'Bleeping Computer', 'category' => 'cybersecurite'],
    ['url' => 'https://korben.info/feed',                       'source' => 'Korben',            'category' => 'outils'],
    ['url' => 'https://www.it-connect.fr/feed/',                'source' => 'IT-Connect',        'category' => 'reseau'],
    ['url' => 'https://www.lemagit.fr/rss/actualites',          'source' => 'LeMagIT',           'category' => 'actu'],
];

$MAX_PER_FEED = 10;

function fetchUrl(string $url, int $timeout = 12): ?string {
    $ctx = stream_context_create([
        'http' => [
            'timeout'         => $timeout,
            'user_agent'      => 'Mozilla/5.0 (compatible; VeilleTechBot/1.0)',
            'follow_location' => true,
        ],
        'ssl' => ['verify_peer' => false, 'verify_peer_name' => false],
    ]);
    $data = @file_get_contents($url, false, $ctx);
    return $data ?: null;
}

function clean(string $s): string {
    $s = strip_tags($s);
    $s = html_entity_decode($s, ENT_QUOTES | ENT_HTML5, 'UTF-8');
    return trim(preg_replace('/\s+/', ' ', $s));
}

function parseDate(string $d): string {
    if (!$d) return date('c');
    $ts = strtotime($d);
    return $ts ? date('c', $ts) : date('c');
}

function extractRssImage(SimpleXMLElement $item): string {
    $media = $item->children('media', true);
    if ($media && isset($media->content)) {
        $a = $media->content->attributes();
        if (!empty($a['url'])) return (string)$a['url'];
    }
    if ($media && isset($media->thumbnail)) {
        $a = $media->thumbnail->attributes();
        if (!empty($a['url'])) return (string)$a['url'];
    }
    if (isset($item->enclosure)) {
        $a = $item->enclosure->attributes();
        if (!empty($a['url']) && strpos((string)($a['type'] ?? ''), 'image') !== false) {
            return (string)$a['url'];
        }
    }
    $html = '';
    $content = $item->children('content', true);
    if ($content && isset($content->encoded)) {
        $html = (string)$content->encoded;
    } elseif (isset($item->description)) {
        $html = (string)$item->description;
    }
    if ($html && preg_match('/<img[^>]+src=["\']([^"\']+)["\']/', $html, $m)) {
        return $m[1];
    }
    return '';
}

function fetchOGImage(string $url): string {
    $html = fetchUrl($url, 5);
    if (!$html) return '';
    if (preg_match('/<meta[^>]+property=["\']og:image["\'][^>]+content=["\']([^"\']+)["\']/', $html, $m)) return $m[1];
    if (preg_match('/<meta[^>]+content=["\']([^"\']+)["\'][^>]+property=["\']og:image["\']/', $html, $m)) return $m[1];
    if (preg_match('/<meta[^>]+name=["\']twitter:image["\'][^>]+content=["\']([^"\']+)["\']/', $html, $m)) return $m[1];
    if (preg_match('/<meta[^>]+content=["\']([^"\']+)["\'][^>]+name=["\']twitter:image["\']/', $html, $m)) return $m[1];
    return '';
}

$articles = [];
$seen     = [];

foreach ($FEEDS as $feed) {
    $raw = fetchUrl($feed['url']);
    if (!$raw) { echo "SKIP {$feed['source']}\n"; continue; }

    libxml_use_internal_errors(true);
    $xml = simplexml_load_string($raw, 'SimpleXMLElement', LIBXML_NOCDATA);
    if (!$xml) { echo "PARSE ERROR {$feed['source']}\n"; continue; }

    $isAtom = $xml->getName() === 'feed';
    $items  = $isAtom ? ($xml->entry ?? []) : ($xml->channel->item ?? []);

    $count = 0;
    foreach ($items as $item) {
        if ($count >= $MAX_PER_FEED) break;

        if ($isAtom) {
            $link = '';
            foreach ($item->link as $l) {
                $a = $l->attributes();
                if (!$a['rel'] || (string)$a['rel'] === 'alternate') { $link = (string)$a['href']; break; }
            }
            $title   = clean((string)($item->title   ?? ''));
            $summary = clean((string)($item->summary  ?? $item->content ?? ''));
            $date    = (string)($item->published ?? $item->updated ?? '');
        } else {
            $link    = (string)($item->link    ?? '');
            $title   = clean((string)($item->title       ?? ''));
            $summary = clean((string)($item->description ?? ''));
            $date    = (string)($item->pubDate ?? '');
        }

        if (!$link) continue;
        $id = md5($link);
        if (isset($seen[$id])) continue;
        $seen[$id] = true;

        if (strlen($summary) > 220) $summary = substr($summary, 0, 217) . '...';

        $image = extractRssImage($item);

        if (!$image && $link) {
            $image = fetchOGImage($link);
            if ($image) echo "  OG: " . substr($title, 0, 60) . "\n";
        }

        $articles[] = [
            'id'        => $id,
            'title'     => $title,
            'link'      => $link,
            'summary'   => $summary,
            'published' => parseDate($date),
            'source'    => $feed['source'],
            'category'  => $feed['category'],
            'image'     => $image,
        ];
        $count++;
    }
    echo "OK {$feed['source']}: {$count} articles\n";
}

usort($articles, fn($a, $b) => strcmp($b['published'], $a['published']));

$output = json_encode([
    'last_updated' => date('c'),
    'count'        => count($articles),
    'articles'     => $articles,
], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

$dataDir = __DIR__ . '/../data';
if (!is_dir($dataDir)) mkdir($dataDir, 0755, true);
file_put_contents($dataDir . '/feeds.json', $output);

echo "\nTermine — " . count($articles) . " articles sauvegardes.\n";
