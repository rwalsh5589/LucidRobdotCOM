#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SITE_URL = 'https://lucidrob.com';
const OG_IMAGE = `${SITE_URL}/og-image.png`;

const postsSrc = fs.readFileSync(path.join(ROOT, 'posts.js'), 'utf-8');
const POSTS = new Function(`${postsSrc}; return POSTS;`)();

const esc = (s) => String(s)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;');
const escAttr = (s) => esc(s).replace(/"/g, '&quot;');
const escJson = (s) => String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"');

const slugify = (s) => s.toLowerCase()
  .replace(/[^\w\s-]/g, '')
  .replace(/\s+/g, '-')
  .replace(/-+/g, '-')
  .replace(/^-|-$/g, '')
  .slice(0, 80);

const LINK_STYLE = 'color:var(--neon-cyan);text-decoration:underline;text-underline-offset:3px;';

const renderBody = (body) => body.split('\n\n').map((chunk) => {
  const trimmed = chunk.trim();
  if (!trimmed) return '';
  const isSubhead = trimmed.length < 90
    && !trimmed.endsWith('.')
    && !trimmed.endsWith('!')
    && !trimmed.endsWith('"');
  if (isSubhead) return `<h2>${esc(trimmed)}</h2>`;

  // Extract [text](url) markdown links to placeholders so escaping doesn't
  // mangle the URL or angle brackets inside the rendered <a> tag later.
  const mdLinks = [];
  let text = trimmed.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, url) => {
    const i = mdLinks.length;
    mdLinks.push({ label, url });
    return `\x00MDLINK${i}\x00`;
  });

  text = esc(text);

  // Auto-link bare URLs (only ones not inside a markdown link, since those
  // are already extracted into placeholders above).
  text = text.replace(
    /(https?:\/\/[^\s<]+|(?:www\.)?youtube\.com\/[^\s<]+)/gi,
    (url) => {
      const href = url.startsWith('http') ? url : 'https://' + url;
      return `<a href="${escAttr(href)}" target="_blank" rel="noopener" style="${LINK_STYLE}">${url}</a>`;
    }
  );

  // Restore markdown links. Internal links (start with /) stay in-tab.
  text = text.replace(/\x00MDLINK(\d+)\x00/g, (_, i) => {
    const { label, url } = mdLinks[+i];
    const isInternal = url.startsWith('/');
    const ext = isInternal ? '' : ' target="_blank" rel="noopener"';
    return `<a href="${escAttr(url)}"${ext} style="${LINK_STYLE}">${esc(label)}</a>`;
  });

  return `<p>${text}</p>`;
}).join('\n');

const formatDate = (iso) => new Date(iso).toISOString().slice(0, 10).replace(/-/g, '.');

const SOCIAL_SVG_YT = '<svg viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>';
const SOCIAL_SVG_IG = '<svg viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>';
const SOCIAL_SVG_TW = '<svg viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>';
const SOCIAL_SVG_TK = '<svg viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.84-.1z"/></svg>';
const SOCIAL_SVG_EM = '<svg viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z"/></svg>';

const buildPage = (post) => {
  const slug = post.slug || slugify(post.title);
  const url = `${SITE_URL}/blog/${slug}`;
  const encUrl = encodeURIComponent(url);
  const encTitle = encodeURIComponent(post.title);
  const isoDate = new Date(post.date).toISOString();
  const dateStr = formatDate(post.date);
  const bodyHtml = renderBody(post.body);
  const pageTitle = `${post.title} | Lucid Rob`;
  const ogImagePath = post.image || `/og/${slug}.png`;
  const ogImage = ogImagePath.startsWith('http') ? ogImagePath : `${SITE_URL}${ogImagePath}`;
  const tags = Array.isArray(post.tags) ? post.tags : [];
  const tagsHtml = tags.length
    ? `<div class="post-article-tags">${tags.map((t) =>
        `<a class="tag-chip" href="/blog?tag=${encodeURIComponent(t)}">${esc(t)}</a>`
      ).join('')}</div>`
    : '';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    author: { '@type': 'Person', name: 'Lucid Rob', url: SITE_URL },
    publisher: {
      '@type': 'Organization',
      name: 'LucidRob.com',
      logo: { '@type': 'ImageObject', url: OG_IMAGE }
    },
    datePublished: isoDate,
    dateModified: isoDate,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    image: ogImage
  };

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${esc(pageTitle)}</title>
<link rel="icon" type="image/svg+xml" href="/favicon.svg"/>
<meta name="description" content="${escAttr(post.excerpt)}" />
<meta name="author" content="Lucid Rob" />
<link rel="canonical" href="${escAttr(url)}" />
<meta property="og:title" content="${escAttr(post.title)}"/>
<meta property="og:description" content="${escAttr(post.excerpt)}"/>
<meta property="og:image" content="${escAttr(ogImage)}"/>
<meta property="og:url" content="${escAttr(url)}"/>
<meta property="og:type" content="article"/>
<meta property="og:site_name" content="LUCIDROB.COM"/>
<meta property="article:published_time" content="${escAttr(isoDate)}"/>
<meta property="article:author" content="Lucid Rob"/>
<meta name="twitter:card" content="summary_large_image"/>
<meta name="twitter:title" content="${escAttr(post.title)}"/>
<meta name="twitter:description" content="${escAttr(post.excerpt)}"/>
<meta name="twitter:image" content="${escAttr(ogImage)}"/>
<meta name="twitter:creator" content="@LucidRob"/>
<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>

<script>
  const CONFIG = {
    SOCIALS: {
      youtube:   "https://www.youtube.com/@LucidRobYT",
      instagram: "https://www.instagram.com/lucid.rob/",
      twitter:   "https://x.com/LucidRob",
      tiktok:    "https://www.tiktok.com/@lucidrob",
      email:     "mailto:lucidrobbiz@gmail.com"
    }
  };
</script>

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Monoton&family=Monsieur+La+Doulaise&family=Megrim&family=Audiowide&family=Alfa+Slab+One&family=Playfair+Display:ital,wght@1,700;1,900&family=Kaushan+Script&family=Bungee+Shade&family=Space+Grotesk:wght@300;400;500;700&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/styles.css">
</head>

<body>

<nav>
  <div class="brand"><a href="/" style="color:inherit;text-decoration:none;">LUCIDROB.COM</a></div>
  <button class="nav-toggle" aria-label="menu">MENU</button>
  <ul id="navMenu">
    <li><a href="/#videos">01_VIDEOS</a></li>
    <li><a href="/#books">02_BOOKS</a></li>
    <li><a href="/#music">03_MUSIC</a></li>
    <li><a href="/#merch">04_MERCH</a></li>
    <li><a href="/blog">05_BLOG</a></li>
    <li><a href="/#join">06_JOIN</a></li>
    <li><a href="/#about">07_ABOUT</a></li>
  </ul>
</nav>

<article id="post" class="post-article">
  <div class="section-wrap">
    <div class="post-article-inner">
      <div class="post-article-meta">
        <a class="post-article-back" href="/blog"><span class="arrow">←</span> All posts</a>
        <span class="post-article-date mono">${esc(dateStr)}</span>
      </div>
      <h1 class="post-article-title">${esc(post.title)}</h1>
      <p class="post-article-excerpt">${esc(post.excerpt)}</p>
      ${tagsHtml}
      <div class="post-article-body">
${bodyHtml}
      </div>
      <div class="post-article-share">
        <span class="mono">// SHARE</span>
        <a href="https://twitter.com/intent/tweet?url=${encUrl}&text=${encTitle}" target="_blank" rel="noopener">Twitter / X</a>
        <a href="https://www.facebook.com/sharer/sharer.php?u=${encUrl}" target="_blank" rel="noopener">Facebook</a>
        <a href="https://www.linkedin.com/sharing/share-offsite/?url=${encUrl}" target="_blank" rel="noopener">LinkedIn</a>
        <a href="https://api.whatsapp.com/send?text=${encTitle}%20${encUrl}" target="_blank" rel="noopener">WhatsApp</a>
        <a href="mailto:?subject=${encTitle}&body=${encUrl}">Email</a>
      </div>
    </div>
  </div>
</article>

<section id="join" class="post-article-join">
  <div class="section-wrap">
    <div class="section-header">
      <span class="num">// NEWSLETTER</span>
      <h2 class="neon-sign sign-join">Get The Signal</h2>
      <p class="section-desc">Stories too weird or too mean for YouTube. Direct to your inbox.</p>
    </div>
    <div class="join-grid">
      <div class="join-col">
        <span class="tag">// NEWSLETTER</span>
        <h3>Direct to your inbox.</h3>
        <p>Occasional dispatches. Stories too weird or too mean for YouTube. Early links. No spam, no funnel nonsense, no selling your email to anyone who wants to sell you a supplement.</p>
        <form class="newsletter-form" id="newsletterForm">
          <input type="email" name="email" id="newsletterEmail" placeholder="your@email.com" required />
          <button type="submit" class="btn primary" id="newsletterBtn">Subscribe <span class="arrow">→</span></button>
        </form>
        <p class="newsletter-confirm" id="newsletterConfirm" style="display:none;color:var(--neon-cyan);font-family:'JetBrains Mono',monospace;font-size:13px;margin-top:12px;text-shadow:0 0 8px rgba(0,240,255,0.5);">// SIGNAL RECEIVED. YOU'RE IN.</p>
      </div>
    </div>
  </div>
</section>

<footer>
  <div class="socials" id="socialsRow"></div>
  <div class="footer-meta">
    <span>&copy; <span id="yr"></span> LUCIDROB.COM</span>
    <span>v1.0.0 // ALL SIGNALS RESERVED</span>
  </div>
</footer>

<script>
document.getElementById('yr').textContent = new Date().getFullYear();

document.querySelector('.nav-toggle').addEventListener('click', () => document.getElementById('navMenu').classList.toggle('open'));
document.querySelectorAll('#navMenu a').forEach(a => a.addEventListener('click', () => document.getElementById('navMenu').classList.remove('open')));

const nlForm = document.getElementById('newsletterForm');
nlForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('newsletterEmail').value;
  const btn = document.getElementById('newsletterBtn');
  btn.textContent = 'Sending...';
  btn.disabled = true;
  try {
    await fetch('https://formsubmit.co/ajax/lucidrobbiz@gmail.com', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ email, _subject: 'New Subscriber - LucidRob.com', _captcha: 'false' })
    });
    nlForm.style.display = 'none';
    document.getElementById('newsletterConfirm').style.display = 'block';
  } catch {
    btn.textContent = 'Subscribe →';
    btn.disabled = false;
  }
});

const socialIcons = {
  youtube:   ${JSON.stringify(SOCIAL_SVG_YT)},
  instagram: ${JSON.stringify(SOCIAL_SVG_IG)},
  twitter:   ${JSON.stringify(SOCIAL_SVG_TW)},
  tiktok:    ${JSON.stringify(SOCIAL_SVG_TK)},
  email:     ${JSON.stringify(SOCIAL_SVG_EM)}
};
document.getElementById('socialsRow').innerHTML = Object.entries(CONFIG.SOCIALS).filter(([k,v]) => v).map(([k,v]) =>
  \`<a class="social-icon" href="\${v}" \${k === 'email' ? '' : 'target="_blank" rel="noopener"'} aria-label="\${k}">\${socialIcons[k]}</a>\`
).join('');
</script>

</body>
</html>
`;
};

const buildSitemap = (posts) => {
  const urls = [
    { loc: `${SITE_URL}/`, priority: '1.0' },
    { loc: `${SITE_URL}/blog`, priority: '0.9' },
    ...posts.map((p) => ({
      loc: `${SITE_URL}/blog/${p.slug}`,
      lastmod: new Date(p.date).toISOString().slice(0, 10),
      priority: '0.8'
    }))
  ];
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url>
    <loc>${u.loc}</loc>${u.lastmod ? `\n    <lastmod>${u.lastmod}</lastmod>` : ''}
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>
`;
};

const blogDir = path.join(ROOT, 'blog');
if (!fs.existsSync(blogDir)) fs.mkdirSync(blogDir, { recursive: true });

let written = 0;
POSTS.forEach((post) => {
  if (!post.slug) post.slug = slugify(post.title);
  const html = buildPage(post);
  const outPath = path.join(blogDir, `${post.slug}.html`);
  fs.writeFileSync(outPath, html, 'utf-8');
  written += 1;
  console.log(`  wrote blog/${post.slug}.html`);
});

fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), buildSitemap(POSTS), 'utf-8');
console.log(`  wrote sitemap.xml`);

const robots = `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`;
fs.writeFileSync(path.join(ROOT, 'robots.txt'), robots, 'utf-8');
console.log(`  wrote robots.txt`);

console.log(`\nDone. ${written} post pages generated.`);
