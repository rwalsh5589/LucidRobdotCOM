// Vercel serverless function: POST /api/subscribe
// Forwards newsletter signups to Beehiiv with a "newsletter" tag and source URL
// for segmentation. Requires BEEHIIV_API_KEY and BEEHIIV_PUBLICATION_ID env vars.

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'method_not_allowed' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  body = body || {};

  const email = String(body.email || '').trim().toLowerCase();
  const source = String(body.source || '').slice(0, 500);

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'invalid_email' });
  }

  const apiKey = process.env.BEEHIIV_API_KEY;
  const publicationId = process.env.BEEHIIV_PUBLICATION_ID;

  if (!apiKey || !publicationId) {
    console.error('Missing BEEHIIV_API_KEY or BEEHIIV_PUBLICATION_ID');
    return res.status(500).json({ error: 'server_misconfigured' });
  }

  try {
    const beehiivRes = await fetch(
      `https://api.beehiiv.com/v2/publications/${publicationId}/subscriptions`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          reactivate_existing: true,
          send_welcome_email: true,
          utm_source: 'lucidrob_website',
          utm_medium: 'newsletter_form',
          utm_campaign: 'newsletter',
          referring_site: source || 'https://lucidrob.com',
          custom_fields: [
            { name: 'Tag', value: 'newsletter' },
            { name: 'Signup Source', value: source || 'unknown' },
          ],
        }),
      }
    );

    const data = await beehiivRes.json().catch(() => ({}));

    if (!beehiivRes.ok) {
      console.error('Beehiiv error', beehiivRes.status, data);
      return res.status(502).json({ error: 'subscription_provider_error' });
    }

    // Best-effort tag attach: Beehiiv exposes a separate tags endpoint.
    // We've already set custom_fields above (which is enough for segmentation),
    // but we'll also try the tags endpoint so subscribers show up tagged in
    // the Beehiiv UI. Failure here doesn't fail the request.
    const subId = data && data.data && data.data.id;
    if (subId) {
      try {
        await fetch(
          `https://api.beehiiv.com/v2/publications/${publicationId}/subscriptions/${subId}/tags`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${apiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ tags: ['newsletter'] }),
          }
        );
      } catch (e) {
        console.warn('tag attach failed (non-fatal):', e && e.message);
      }
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Subscribe handler error:', err && err.message);
    return res.status(500).json({ error: 'internal_error' });
  }
};
