// Vercel serverless function: GET /api/merch?hats=1&shirts=2
// Proxies Shopify's public products.json feed for lucidrobmerch.com so the
// homepage can render the latest products client-side. Shopify doesn't send
// CORS headers on /products.json, so a direct browser fetch is blocked —
// this proxy is just here to bridge that gap, classify each product as
// hat / shirt / other, and return the requested mix newest-first.

const STORE_URL = 'https://lucidrobmerch.com';

// Heuristic: tags first (lowercased exact match on tokens), then fall back
// to keywords in product_type and title so a future product without proper
// tagging still gets categorized correctly.
const HAT_TAGS  = ['hat', 'hats', 'cap', 'caps', 'beanie', 'beanies', 'hatwear'];
const HAT_WORDS = ['hat', 'cap', 'beanie', 'snapback', 'trucker'];

const SHIRT_TAGS = ['teeshirt', 'tee', 'tees', 't-shirt', 'tshirt', 'shirt', 'shirts', 'hoodie', 'hoodies', 'sweatshirt', 'long-sleeve', 'longsleeve'];
const SHIRT_WORDS = ['tee', 'shirt', 'hoodie', 'sweatshirt', 'crewneck', 'long sleeve', 'longsleeve'];

function classify(product) {
  const tags = (product.tags || []).map((t) => String(t).toLowerCase().trim());
  const haystack = `${product.product_type || ''} ${product.title || ''}`.toLowerCase();

  const hasAny = (set, list) => list.some((needle) => set.includes(needle));
  const hasWord = (text, list) => list.some((needle) => text.includes(needle));

  if (hasAny(tags, HAT_TAGS) || hasWord(haystack, HAT_WORDS)) return 'hat';
  if (hasAny(tags, SHIRT_TAGS) || hasWord(haystack, SHIRT_WORDS)) return 'shirt';
  return 'other';
}

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'method_not_allowed' });
  }

  const clamp = (n, lo, hi) => Math.min(Math.max(n, lo), hi);
  const parseCount = (raw, def) => {
    const n = parseInt(raw, 10);
    return Number.isFinite(n) ? clamp(n, 0, 12) : def;
  };
  const wantHats = parseCount(req.query.hats, 1);
  const wantShirts = parseCount(req.query.shirts, 2);

  try {
    // Pull a generous slice so we have enough of each category to choose from.
    const upstream = await fetch(`${STORE_URL}/products.json?limit=50`, {
      headers: { 'User-Agent': 'lucidrob.com merch proxy' },
    });

    if (!upstream.ok) {
      console.error('shopify upstream error', upstream.status);
      return res.status(502).json({ error: 'upstream_unavailable' });
    }

    const data = await upstream.json();
    const all = (data.products || []).map((p) => ({
      title: p.title,
      handle: p.handle,
      url: `${STORE_URL}/products/${p.handle}`,
      image: (p.images && p.images[0] && p.images[0].src) || null,
      published_at: p.published_at || p.created_at || null,
      kind: classify(p),
    }));

    // Newest first within each category.
    const byDateDesc = (a, b) => String(b.published_at || '').localeCompare(String(a.published_at || ''));
    const hats = all.filter((p) => p.kind === 'hat').sort(byDateDesc).slice(0, wantHats);
    const shirts = all.filter((p) => p.kind === 'shirt').sort(byDateDesc).slice(0, wantShirts);

    // Combined feed, sorted newest-first across the mix.
    const products = [...hats, ...shirts].sort(byDateDesc);

    // Cache 5 min at the edge, allow stale-while-revalidate for an hour so
    // a slow Shopify response never blocks a homepage render.
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=3600');
    return res.status(200).json({ products });
  } catch (err) {
    console.error('merch proxy error', err);
    return res.status(502).json({ error: 'fetch_failed' });
  }
};
