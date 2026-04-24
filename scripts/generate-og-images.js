#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const SRC_DIR = path.join(ROOT, 'og-src');
const OUT_DIR = path.join(ROOT, 'og');

const postsSrc = fs.readFileSync(path.join(ROOT, 'posts.js'), 'utf-8');
const POSTS = new Function(`${postsSrc}; return POSTS;`)();

const THEMES = {
  'hollow-moon-theory':              { accent: '#00f0ff', label: 'HOLLOW_MOON_THEORY'      },
  'artemis-ii-fake-moon-landing':    { accent: '#b400ff', label: 'ARTEMIS_II_HOAX'         },
  'baba-vanga-2026-alien-prediction':{ accent: '#ffb400', label: 'VANGA_PROPHECY'          },
  'celebrity-clone-conspiracy':      { accent: '#ff006e', label: 'CELEBRITY_CLONES'        },
  'dead-internet-theory':            { accent: '#00f0ff', label: 'DEAD_INTERNET'           },
  'epstein-files-conspiracy':        { accent: '#ff006e', label: 'EPSTEIN_FILES'           },
  'ai-deepfakes-spotting-guide':     { accent: '#b400ff', label: 'AI_DEEPFAKES'            },
  'elvis-bob-joyce-theory':          { accent: '#ffb400', label: 'ELVIS_LIVES'             },
  'nasa-project-anchor-debunked':    { accent: '#00f0ff', label: 'PROJECT_ANCHOR_DEBUNKED' }
};

const MOTIFS = {
  'hollow-moon-theory': (c) => `
    <g transform="translate(870 315)">
      <circle cx="0" cy="0" r="210" fill="none" stroke="${c}" stroke-width="2" opacity="0.35"/>
      <circle cx="0" cy="0" r="160" fill="none" stroke="${c}" stroke-width="2" opacity="0.55"/>
      <circle cx="0" cy="0" r="110" fill="none" stroke="${c}" stroke-width="2" opacity="0.8"/>
      <circle cx="0" cy="0" r="60" fill="${c}" opacity="0.18"/>
      <circle cx="-35" cy="-28" r="14" fill="${c}" opacity="0.35"/>
      <circle cx="38" cy="40" r="8" fill="${c}" opacity="0.5"/>
      <circle cx="-8" cy="52" r="6" fill="${c}" opacity="0.4"/>
      <path d="M -180 -60 A 190 190 0 0 1 -60 -180" fill="none" stroke="${c}" stroke-width="3" opacity="0.9"/>
    </g>`,
  'artemis-ii-fake-moon-landing': (c) => `
    <g transform="translate(870 315)">
      <circle cx="0" cy="0" r="170" fill="none" stroke="${c}" stroke-width="2" opacity="0.5"/>
      <circle cx="0" cy="0" r="170" fill="${c}" opacity="0.08"/>
      <circle cx="-30" cy="-20" r="16" fill="${c}" opacity="0.22"/>
      <circle cx="40" cy="30" r="10" fill="${c}" opacity="0.28"/>
      <path d="M -240 200 Q -60 -120 200 -240" fill="none" stroke="${c}" stroke-width="3" opacity="0.8" stroke-dasharray="6 10"/>
      <polygon points="200,-240 180,-220 220,-220" fill="${c}" opacity="0.9"/>
    </g>`,
  'baba-vanga-2026-alien-prediction': (c) => `
    <g transform="translate(870 315)">
      <ellipse cx="0" cy="20" rx="200" ry="44" fill="none" stroke="${c}" stroke-width="3" opacity="0.8"/>
      <ellipse cx="0" cy="20" rx="200" ry="44" fill="${c}" opacity="0.12"/>
      <path d="M -110 10 Q 0 -90 110 10" fill="${c}" opacity="0.22" stroke="${c}" stroke-width="2.5"/>
      <circle cx="-55" cy="-10" r="5" fill="${c}"/>
      <circle cx="0" cy="-20" r="5" fill="${c}"/>
      <circle cx="55" cy="-10" r="5" fill="${c}"/>
      <line x1="-140" y1="60" x2="-200" y2="180" stroke="${c}" stroke-width="2" opacity="0.6" stroke-dasharray="4 6"/>
      <line x1="0" y1="70" x2="0" y2="200" stroke="${c}" stroke-width="2" opacity="0.6" stroke-dasharray="4 6"/>
      <line x1="140" y1="60" x2="200" y2="180" stroke="${c}" stroke-width="2" opacity="0.6" stroke-dasharray="4 6"/>
    </g>`,
  'celebrity-clone-conspiracy': (c) => `
    <g transform="translate(870 315)">
      <circle cx="-60" cy="0" r="140" fill="none" stroke="${c}" stroke-width="3" opacity="0.9"/>
      <circle cx="60" cy="0" r="140" fill="none" stroke="${c}" stroke-width="3" opacity="0.55"/>
      <circle cx="-60" cy="0" r="140" fill="${c}" opacity="0.1"/>
      <circle cx="60" cy="0" r="140" fill="${c}" opacity="0.1"/>
      <ellipse cx="-60" cy="-30" rx="42" ry="52" fill="${c}" opacity="0.25"/>
      <ellipse cx="60" cy="-30" rx="42" ry="52" fill="${c}" opacity="0.2"/>
      <path d="M -110 80 Q -60 40 -10 80" fill="none" stroke="${c}" stroke-width="3" opacity="0.6"/>
      <path d="M 10 80 Q 60 40 110 80" fill="none" stroke="${c}" stroke-width="3" opacity="0.45"/>
    </g>`,
  'dead-internet-theory': (c) => {
    const cells = [];
    const gx = 740, gy = 150, size = 40, gap = 8;
    const hidden = new Set(['1-2','2-1','2-4','3-0','3-3','4-2','0-4']);
    for (let r = 0; r < 5; r++) {
      for (let col = 0; col < 5; col++) {
        const key = `${r}-${col}`;
        const x = gx + col * (size + gap);
        const y = gy + r * (size + gap);
        if (hidden.has(key)) {
          cells.push(`<rect x="${x}" y="${y}" width="${size}" height="${size}" fill="none" stroke="${c}" stroke-width="1.5" stroke-dasharray="3 3" opacity="0.25"/>`);
        } else {
          const opacity = 0.35 + Math.random() * 0.55;
          cells.push(`<rect x="${x}" y="${y}" width="${size}" height="${size}" fill="${c}" opacity="${opacity.toFixed(2)}"/>`);
        }
      }
    }
    return `<g>${cells.join('')}</g>`;
  },
  'epstein-files-conspiracy': (c) => `
    <g transform="translate(870 315)">
      <rect x="-170" y="-190" width="340" height="380" fill="none" stroke="${c}" stroke-width="3" opacity="0.9"/>
      <rect x="-170" y="-190" width="340" height="380" fill="${c}" opacity="0.06"/>
      <rect x="-170" y="-190" width="340" height="48" fill="${c}" opacity="0.25"/>
      <rect x="-140" y="-116" width="280" height="18" fill="${c}"/>
      <rect x="-140" y="-84" width="220" height="18" fill="${c}" opacity="0.6"/>
      <rect x="-140" y="-52" width="260" height="18" fill="${c}"/>
      <rect x="-140" y="-20" width="180" height="18" fill="${c}" opacity="0.6"/>
      <rect x="-140" y="12"  width="240" height="18" fill="${c}"/>
      <rect x="-140" y="44"  width="200" height="18" fill="${c}" opacity="0.6"/>
      <rect x="-140" y="76"  width="270" height="18" fill="${c}"/>
      <text x="0" y="160" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="26" font-weight="700" fill="${c}" letter-spacing="0.2em">CLASSIFIED</text>
    </g>`,
  'ai-deepfakes-spotting-guide': (c) => {
    const blocks = [];
    const gx = 740, gy = 130, size = 36, cols = 8, rows = 8;
    for (let r = 0; r < rows; r++) {
      for (let col = 0; col < cols; col++) {
        const x = gx + col * size;
        const y = gy + r * size;
        const glitch = (r === 3 && col > 2 && col < 6) || (r === 4 && (col === 1 || col === 6));
        const inFace = (r > 0 && r < 7 && col > 0 && col < 7) && !glitch;
        if (glitch) {
          blocks.push(`<rect x="${x}" y="${y}" width="${size}" height="${size}" fill="${c}" opacity="0.9"/>`);
        } else if (inFace) {
          const op = 0.15 + Math.random() * 0.35;
          blocks.push(`<rect x="${x}" y="${y}" width="${size}" height="${size}" fill="${c}" opacity="${op.toFixed(2)}"/>`);
        } else {
          blocks.push(`<rect x="${x}" y="${y}" width="${size}" height="${size}" fill="none" stroke="${c}" stroke-width="1" opacity="0.15"/>`);
        }
      }
    }
    return `<g>${blocks.join('')}</g>`;
  },
  'elvis-bob-joyce-theory': (c) => `
    <g transform="translate(870 315)">
      <circle cx="0" cy="0" r="170" fill="${c}" opacity="0.12"/>
      <circle cx="0" cy="0" r="170" fill="none" stroke="${c}" stroke-width="2" opacity="0.5"/>
      <rect x="-22" y="-140" width="44" height="90" rx="22" fill="${c}" opacity="0.85"/>
      <line x1="0" y1="-50" x2="0" y2="30" stroke="${c}" stroke-width="6"/>
      <line x1="-40" y1="30" x2="40" y2="30" stroke="${c}" stroke-width="6"/>
      <text x="0" y="120" text-anchor="middle" font-family="'Space Grotesk', sans-serif" font-size="110" font-weight="700" fill="${c}">?</text>
    </g>`,
  'nasa-project-anchor-debunked': (c) => `
    <g transform="translate(870 315)">
      <circle cx="0" cy="0" r="180" fill="none" stroke="${c}" stroke-width="2" opacity="0.4"/>
      <circle cx="0" cy="0" r="180" fill="${c}" opacity="0.06"/>
      <ellipse cx="0" cy="0" rx="180" ry="60" fill="none" stroke="${c}" stroke-width="1.5" opacity="0.3"/>
      <ellipse cx="0" cy="0" rx="60" ry="180" fill="none" stroke="${c}" stroke-width="1.5" opacity="0.3"/>
      <path d="M 0 -120 L 0 100 M -50 80 Q 0 140 50 80 M -30 -120 L 30 -120 M 0 -140 A 20 20 0 1 1 0.01 -140" fill="none" stroke="${c}" stroke-width="8" stroke-linecap="round" opacity="0.9"/>
      <line x1="-150" y1="-150" x2="150" y2="150" stroke="#ff006e" stroke-width="8" stroke-linecap="round"/>
    </g>`
};

function wrapTitle(title, maxChars) {
  const words = title.split(/\s+/);
  const lines = [];
  let current = '';
  for (const word of words) {
    if ((current + ' ' + word).trim().length > maxChars && current) {
      lines.push(current);
      current = word;
    } else {
      current = (current + ' ' + word).trim();
    }
  }
  if (current) lines.push(current);
  return lines;
}

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function buildSvg(post) {
  const theme = THEMES[post.slug] || { accent: '#00f0ff', label: 'FIELD_NOTES' };
  const accent = theme.accent;
  const motif = MOTIFS[post.slug] ? MOTIFS[post.slug](accent) : '';

  const sizingTitle = post.title.replace(/\([^)]*\)/g, '').trim();
  let fontSize, maxChars, lineHeight;
  if (sizingTitle.length <= 55) {
    fontSize = 68; maxChars = 18; lineHeight = 78;
  } else if (sizingTitle.length <= 90) {
    fontSize = 56; maxChars = 22; lineHeight = 66;
  } else {
    fontSize = 46; maxChars = 27; lineHeight = 56;
  }

  const lines = wrapTitle(sizingTitle, maxChars).slice(0, 5);
  const titleStartY = 250;
  const titleBlock = lines.map((ln, i) =>
    `<text x="64" y="${titleStartY + i * lineHeight}" font-family="'Space Grotesk','Helvetica Neue',Arial,sans-serif" font-size="${fontSize}" font-weight="700" fill="#f5f5f7" letter-spacing="-0.015em">${esc(ln)}</text>`
  ).join('\n      ');

  const dateStr = new Date(post.date).toISOString().slice(0, 10).replace(/-/g, '.');
  const bylineY = titleStartY + lines.length * lineHeight + 22;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <radialGradient id="glow" cx="20%" cy="28%" r="70%">
      <stop offset="0" stop-color="${accent}" stop-opacity="0.28"/>
      <stop offset="0.55" stop-color="${accent}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glowR" cx="80%" cy="70%" r="60%">
      <stop offset="0" stop-color="${accent}" stop-opacity="0.18"/>
      <stop offset="0.6" stop-color="${accent}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="stripe" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="${accent}" stop-opacity="0"/>
      <stop offset="0.5" stop-color="${accent}" stop-opacity="0.9"/>
      <stop offset="1" stop-color="${accent}" stop-opacity="0"/>
    </linearGradient>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="${accent}" stroke-width="0.5" stroke-opacity="0.08"/>
    </pattern>
  </defs>

  <rect width="1200" height="630" fill="#0a0a0f"/>
  <rect width="1200" height="630" fill="url(#grid)"/>
  <rect width="1200" height="630" fill="url(#glow)"/>
  <rect width="1200" height="630" fill="url(#glowR)"/>

  ${motif}

  <rect x="0" y="0" width="1200" height="2" fill="url(#stripe)"/>
  <rect x="0" y="628" width="1200" height="2" fill="url(#stripe)"/>

  <text x="64" y="80" font-family="'JetBrains Mono','Menlo',monospace" font-size="16" font-weight="600" fill="${accent}" letter-spacing="0.22em" opacity="0.95">// FIELD_NOTES</text>
  <text x="64" y="108" font-family="'JetBrains Mono','Menlo',monospace" font-size="14" font-weight="500" fill="#c9c9d1" letter-spacing="0.18em" opacity="0.75">${esc(theme.label)}</text>

  <rect x="64" y="140" width="72" height="3" fill="${accent}" opacity="0.85"/>

  ${titleBlock}

  <text x="64" y="${bylineY}" font-family="'JetBrains Mono','Menlo',monospace" font-size="15" font-weight="500" fill="#9a9aa5" letter-spacing="0.14em">${dateStr}  /  LUCID ROB</text>

  <text x="1136" y="585" text-anchor="end" font-family="'JetBrains Mono','Menlo',monospace" font-size="17" font-weight="700" fill="${accent}" letter-spacing="0.22em" opacity="0.95">LUCIDROB.COM</text>
  <rect x="980" y="600" width="156" height="2" fill="${accent}" opacity="0.7"/>
</svg>
`;
}

if (!fs.existsSync(SRC_DIR)) fs.mkdirSync(SRC_DIR, { recursive: true });
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

let wrote = 0;
for (const post of POSTS) {
  const svgPath = path.join(SRC_DIR, `${post.slug}.svg`);
  const pngPath = path.join(OUT_DIR, `${post.slug}.png`);
  fs.writeFileSync(svgPath, buildSvg(post), 'utf-8');
  execFileSync('rsvg-convert', ['-w', '1200', '-h', '630', '-o', pngPath, svgPath]);
  console.log(`  og/${post.slug}.png`);
  wrote += 1;
}

console.log(`\nDone. ${wrote} OG images generated.`);
