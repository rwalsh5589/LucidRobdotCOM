// Vercel cron-triggered serverless function.
// Polls the YouTube channel feed + blog RSS, compares against last-seen state
// in Vercel KV, and fires a Beehiiv post (which emails subscribers) when
// something new lands.
//
// Required env vars:
//   BEEHIIV_API_KEY, BEEHIIV_PUBLICATION_ID  (already set for /api/subscribe)
//   KV_REST_API_URL, KV_REST_API_TOKEN        (auto-set when Vercel KV is enabled)
//   CRON_SECRET                               (Vercel auto-injects this on cron-triggered calls)
//
// Manual trigger (for testing):
//   curl -H "Authorization: Bearer <CRON_SECRET>" https://lucidrob.com/api/cron-notify
//   Add ?dry=1 to skip the actual Beehiiv call (preview only)
//   Add ?force=video or ?force=post to bypass the dedup check

const SITE_URL = 'https://lucidrob.com';
const YOUTUBE_CHANNEL_ID = 'UCO9GsAnlLJquoX2gnK_9pzw';

// ---------- Vercel KV (REST API) ----------
async function kvGet(key) {
  if (!process.env.KV_REST_API_URL) return null;
  const r = await fetch(`${process.env.KV_REST_API_URL}/get/${encodeURIComponent(key)}`, {
    headers: { Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}` },
  });
  if (!r.ok) return null;
  const data = await r.json().catch(() => null);
  return data ? data.result : null;
}

async function kvSet(key, value) {
  if (!process.env.KV_REST_API_URL) return false;
  const r = await fetch(`${process.env.KV_REST_API_URL}/set/${encodeURIComponent(key)}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(String(value || '')),
  });
  return r.ok;
}

// ---------- Latest YouTube video ----------
async function fetchLatestYouTubeVideo() {
  const r = await fetch(
    `https://www.youtube.com/feeds/videos.xml?channel_id=${YOUTUBE_CHANNEL_ID}`,
    { headers: { 'User-Agent': 'lucidrob-cron/1.0' } }
  );
  if (!r.ok) return null;
  const xml = await r.text();
  // First <entry> in the Atom feed is the most recent.
  const entryMatch = xml.match(/<entry>[\s\S]*?<\/entry>/);
  if (!entryMatch) return null;
  const e = entryMatch[0];
  const id = (e.match(/<yt:videoId>([^<]+)<\/yt:videoId>/) || [])[1];
  const title = (e.match(/<title>([^<]+)<\/title>/) || [])[1];
  const published = (e.match(/<published>([^<]+)<\/published>/) || [])[1];
  const description = (e.match(/<media:description>([\s\S]*?)<\/media:description>/) || [])[1] || '';
  if (!id) return null;
  return {
    id,
    title: title || 'New video',
    url: `https://www.youtube.com/watch?v=${id}`,
    thumbnail: `https://img.youtube.com/vi/${id}/maxresdefault.jpg`,
    description: description.trim(),
    published,
  };
}

// ---------- Blog post lookup ----------
function parseRssItem(item) {
  const title = (item.match(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/) || [])[1];
  const link = (item.match(/<link>([^<]+)<\/link>/) || [])[1];
  const description = (item.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/) || [])[1] || '';
  const enclosure = (item.match(/<enclosure[^>]*url="([^"]+)"/) || [])[1];
  if (!link) return null;
  const slug = link.replace(/^.*\/blog\//, '').replace(/\/$/, '');
  return {
    slug,
    title: (title || 'New post').trim(),
    url: link.trim(),
    excerpt: description.trim(),
    image: enclosure || `${SITE_URL}/og-image.png`,
  };
}

async function fetchAllBlogItems() {
  const r = await fetch(`${SITE_URL}/rss.xml`, {
    headers: { 'User-Agent': 'lucidrob-cron/1.0' },
  });
  if (!r.ok) return [];
  const xml = await r.text();
  const items = [...xml.matchAll(/<item>[\s\S]*?<\/item>/g)].map((m) => m[0]);
  return items.map(parseRssItem).filter(Boolean);
}

async function fetchLatestBlogPost() {
  const all = await fetchAllBlogItems();
  return all[0] || null;
}

async function fetchBlogPostBySlug(slug) {
  const all = await fetchAllBlogItems();
  return all.find((p) => p.slug === slug) || null;
}

// ---------- Email body templates ----------
const FONT = "'Helvetica Neue', Arial, sans-serif";
const GOLD = '#ffd24a';
const INK = '#0a0410';

function videoEmailHtml({ title, url, thumbnail }) {
  return `
<a href="${url}" style="text-decoration:none;color:inherit;display:block;">
  <img src="${thumbnail}" alt="${escapeHtml(title)}" style="width:100%;max-width:640px;height:auto;display:block;border:0;border-radius:14px;"/>
</a>
<h2 style="margin:24px 0 12px;font-family:${FONT};font-size:26px;line-height:1.2;font-weight:800;color:${INK};">${escapeHtml(title)}</h2>
<p style="font-family:${FONT};font-size:17px;line-height:1.55;color:${INK};margin:0 0 28px;">New drop on the channel. Pour something. Click play. Tell me where I'm wrong in the comments.</p>
<p style="margin:0 0 36px;">
  <a href="${url}" style="display:inline-block;background:${GOLD};color:${INK};padding:14px 26px;border-radius:12px;text-decoration:none;font-family:${FONT};font-weight:800;letter-spacing:0.06em;text-transform:uppercase;border:3px solid ${INK};">Watch on YouTube →</a>
</p>
<p style="font-family:${FONT};font-style:italic;color:#5a4d3a;margin:0;">... Lucid Rob</p>`;
}

function postEmailHtml({ title, url, image, excerpt }) {
  return `
<a href="${url}" style="text-decoration:none;color:inherit;display:block;">
  <img src="${image}" alt="${escapeHtml(title)}" style="width:100%;max-width:640px;height:auto;display:block;border:0;border-radius:14px;"/>
</a>
<h2 style="margin:24px 0 12px;font-family:${FONT};font-size:26px;line-height:1.2;font-weight:800;color:${INK};">${escapeHtml(title)}</h2>
<p style="font-family:${FONT};font-size:17px;line-height:1.55;color:${INK};margin:0 0 28px;">${escapeHtml(excerpt)}</p>
<p style="margin:0 0 36px;">
  <a href="${url}" style="display:inline-block;background:${GOLD};color:${INK};padding:14px 26px;border-radius:12px;text-decoration:none;font-family:${FONT};font-weight:800;letter-spacing:0.06em;text-transform:uppercase;border:3px solid ${INK};">Read it →</a>
</p>
<p style="font-family:${FONT};font-style:italic;color:#5a4d3a;margin:0;">... Lucid Rob</p>`;
}

function escapeHtml(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ---------- Beehiiv broadcast ----------
// Beehiiv's "publish + send" via API is gated to their Enterprise plan, so by
// default we create a DRAFT here. The full email (subject, body, image, CTA) is
// written into Beehiiv ready to fire ... user clicks Send in the dashboard.
// Pass ?auto=1 to attempt status="confirmed" (will only succeed on Enterprise).
async function sendBeehiivBroadcast({ title, subjectLine, contentHtml, autoSend = false }) {
  const apiKey = process.env.BEEHIIV_API_KEY;
  const pubId = process.env.BEEHIIV_PUBLICATION_ID;
  if (!apiKey || !pubId) {
    return { ok: false, status: 0, data: { error: 'missing_beehiiv_env' } };
  }
  const status = autoSend ? 'confirmed' : 'draft';
  const r = await fetch(
    `https://api.beehiiv.com/v2/publications/${pubId}/posts`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        subtitle: subjectLine,
        body_content: contentHtml,
        status,
        audience: 'free',
        platform: 'email',
        email_settings: {
          subject_line: subjectLine,
          preview_text: '',
        },
      }),
    }
  );
  const data = await r.json().catch(() => null);
  return { ok: r.ok, status: r.status, data, mode: status };
}

// ---------- Handler ----------
module.exports = async function handler(req, res) {
  // Auth: Vercel cron sets Authorization: Bearer <CRON_SECRET>.
  // If CRON_SECRET is set, require it. If unset, function is open (e.g. during initial setup).
  const required = process.env.CRON_SECRET;
  if (required) {
    const got = (req.headers.authorization || '').replace(/^Bearer\s+/, '');
    if (got !== required) {
      return res.status(401).json({ error: 'unauthorized' });
    }
  }

  const url = new URL(req.url, 'http://x');
  const dry = url.searchParams.get('dry') === '1';
  const force = url.searchParams.get('force'); // 'video' | 'post' | null
  const slug = url.searchParams.get('slug');   // optional, picks a specific post
  const autoSend = url.searchParams.get('auto') === '1'; // attempt immediate send (Enterprise plan only)

  const result = { dry, actions: [], errors: [] };

  try {
    const [video, post] = await Promise.all([
      fetchLatestYouTubeVideo().catch((e) => ({ _error: 'youtube', message: e.message })),
      (slug
        ? fetchBlogPostBySlug(slug)
        : fetchLatestBlogPost()
      ).catch((e) => ({ _error: 'blog', message: e.message })),
    ]);

    if (slug && post && !post._error) {
      result.actions.push({ type: 'post_slug_resolved', slug: post.slug, title: post.title });
    }

    // -------- VIDEO --------
    if (video && !video._error) {
      const lastVideo = await kvGet('last_video_id');
      const isFirstRun = !lastVideo;
      const isNew = lastVideo && video.id !== lastVideo;
      const shouldFire = force === 'video' || (!isFirstRun && isNew);

      if (isFirstRun && force !== 'video') {
        // Seed state without sending so we don't blast a backlog.
        await kvSet('last_video_id', video.id);
        result.actions.push({ type: 'video_init', id: video.id, title: video.title });
      } else if (shouldFire) {
        if (dry) {
          result.actions.push({ type: 'video_dry', id: video.id, title: video.title, subject: `new video: ${video.title}` });
        } else {
          const r = await sendBeehiivBroadcast({
            title: video.title,
            subjectLine: `new video: ${video.title}`,
            contentHtml: videoEmailHtml(video),
            autoSend,
          });
          if (r.ok) {
            await kvSet('last_video_id', video.id);
            result.actions.push({ type: r.mode === 'draft' ? 'video_drafted' : 'video_sent', id: video.id, title: video.title });
          } else {
            result.errors.push({ type: 'video_send_failed', status: r.status, data: r.data });
          }
        }
      } else {
        result.actions.push({ type: 'video_unchanged', id: video.id });
      }
    } else if (video && video._error) {
      result.errors.push({ type: 'video_fetch_failed', detail: video });
    }

    // -------- POST --------
    if (post && !post._error) {
      const lastPost = await kvGet('last_post_slug');
      const isFirstRun = !lastPost;
      const isNew = lastPost && post.slug !== lastPost;
      const shouldFire = force === 'post' || (!isFirstRun && isNew);

      if (isFirstRun && force !== 'post') {
        await kvSet('last_post_slug', post.slug);
        result.actions.push({ type: 'post_init', slug: post.slug, title: post.title });
      } else if (shouldFire) {
        if (dry) {
          result.actions.push({ type: 'post_dry', slug: post.slug, title: post.title, subject: `new on the blog: ${post.title}` });
        } else {
          const r = await sendBeehiivBroadcast({
            title: post.title,
            subjectLine: `new on the blog: ${post.title}`,
            contentHtml: postEmailHtml(post),
            autoSend,
          });
          if (r.ok) {
            await kvSet('last_post_slug', post.slug);
            result.actions.push({ type: r.mode === 'draft' ? 'post_drafted' : 'post_sent', slug: post.slug, title: post.title });
          } else {
            result.errors.push({ type: 'post_send_failed', status: r.status, data: r.data });
          }
        }
      } else {
        result.actions.push({ type: 'post_unchanged', slug: post.slug });
      }
    } else if (post && post._error) {
      result.errors.push({ type: 'post_fetch_failed', detail: post });
    }

    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ error: 'internal', message: err.message });
  }
};
