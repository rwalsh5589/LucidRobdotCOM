#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const SRC_DIR = path.join(ROOT, 'og-src');
const OUT_DIR = path.join(ROOT, 'og');

const postsSrc = fs.readFileSync(path.join(ROOT, 'posts.js'), 'utf-8');
const POSTS = new Function(`${postsSrc}; return POSTS;`)();

// Embed logos as base64 so SVG → PNG conversion is self-contained
const LOGO_NAV_DATA  = 'data:image/png;base64,' + fs.readFileSync(path.join(ROOT, 'logo-nav.png')).toString('base64');
const LOGO_HERO_DATA = 'data:image/png;base64,' + fs.readFileSync(path.join(ROOT, 'logo-hero.png')).toString('base64');

// Palette ... matches the live site theme
const PALETTE = {
  ink:     '#0a0410',
  paper:   '#fff4d0',
  paperDim:'#d4c5a6',
  gold:    '#ffd24a',
  goldSoft:'#ffe88a',
  magenta: '#ff3eb8',
  teal:    '#3bf0e0',
  violet:  '#b347ff',
  orange:  '#ff8a3c'
};

// Per-post theming (accent + label) ... colors aligned to new palette
const THEMES = {
  'missing-scientists-conspiracy':   { accent: PALETTE.magenta, label: 'MISSING_SCIENTISTS'      },
  'boston-molasses-flood-1919':      { accent: PALETTE.orange,  label: 'BOSTON_1919'             },
  'anunnaki-ancient-aliens':         { accent: PALETTE.gold,    label: 'ANUNNAKI_THEORY'         },
  'hollow-moon-theory':              { accent: PALETTE.teal,    label: 'HOLLOW_MOON_THEORY'      },
  'artemis-ii-fake-moon-landing':    { accent: PALETTE.violet,  label: 'ARTEMIS_II_HOAX'         },
  'baba-vanga-2026-alien-prediction':{ accent: PALETTE.gold,    label: 'VANGA_PROPHECY'          },
  'celebrity-clone-conspiracy':      { accent: PALETTE.magenta, label: 'CELEBRITY_CLONES'        },
  'dead-internet-theory':            { accent: PALETTE.teal,    label: 'DEAD_INTERNET'           },
  'epstein-files-conspiracy':        { accent: PALETTE.magenta, label: 'EPSTEIN_FILES'           },
  'ai-deepfakes-spotting-guide':     { accent: PALETTE.violet,  label: 'AI_DEEPFAKES'            },
  'elvis-bob-joyce-theory':          { accent: PALETTE.gold,    label: 'ELVIS_LIVES'             },
  'nasa-project-anchor-debunked':    { accent: PALETTE.teal,    label: 'PROJECT_ANCHOR_DEBUNKED' }
};

const MOTIFS = {
  'missing-scientists-conspiracy': (c) => {
    const figures = [];
    const cols = 4, rows = 3;
    const cellW = 92, cellH = 118;
    const startX = -((cols - 1) * cellW) / 2;
    const startY = -((rows - 1) * cellH) / 2;
    const xed = new Set([0, 1, 2, 3, 4, 6, 7, 8, 9, 10, 11]); // 11 of 12 marked X
    for (let r = 0; r < rows; r++) {
      for (let col = 0; col < cols; col++) {
        const idx = r * cols + col;
        const x = startX + col * cellW;
        const y = startY + r * cellH;
        const isX = xed.has(idx);
        const op = isX ? 0.32 : 0.95;
        figures.push(`
          <g transform="translate(${x} ${y})">
            <circle cx="0" cy="-12" r="11" fill="${c}" opacity="${op}" stroke="${c}" stroke-width="2"/>
            <path d="M -22 2 Q 0 -4 22 2 L 22 30 L -22 30 Z" fill="${c}" opacity="${op}" stroke="${c}" stroke-width="2"/>
            ${isX ? `
              <line x1="-30" y1="-30" x2="30" y2="34" stroke="${PALETTE.gold}" stroke-width="4" opacity="0.95" stroke-linecap="round"/>
              <line x1="30" y1="-30" x2="-30" y2="34" stroke="${PALETTE.gold}" stroke-width="4" opacity="0.95" stroke-linecap="round"/>
            ` : ''}
          </g>`);
      }
    }
    return `<g transform="translate(940 320)">${figures.join('')}</g>`;
  },
  'boston-molasses-flood-1919': (c) => `
    <g transform="translate(940 320)">
      <ellipse cx="0" cy="-110" rx="78" ry="18" fill="none" stroke="${c}" stroke-width="3" opacity="0.55"/>
      <line x1="-78" y1="-110" x2="-78" y2="-15" stroke="${c}" stroke-width="3" opacity="0.55"/>
      <line x1="78"  y1="-110" x2="78"  y2="-15" stroke="${c}" stroke-width="3" opacity="0.55"/>
      <ellipse cx="0" cy="-15"  rx="78" ry="14" fill="none" stroke="${c}" stroke-width="3" opacity="0.55"/>
      <path d="M -42 -78 L -52 -50 L -38 -32 L -58 -8" stroke="${c}" stroke-width="3" fill="none" opacity="0.95" stroke-linejoin="round"/>
      <path d="M 26 -90 L 36 -64 L 22 -42 L 44 -22" stroke="${c}" stroke-width="2.5" fill="none" opacity="0.85" stroke-linejoin="round"/>
      <path d="M -200 50
               Q -160 12 -120 50
               Q -80 8  -40 50
               Q 0   6  40  50
               Q 80  10 120 50
               Q 160 4  200 50
               L 200 200 L -200 200 Z"
        fill="${c}" opacity="0.32" stroke="${c}" stroke-width="2"/>
      <path d="M -200 110
               Q -160 78  -120 110
               Q -80 70   -40 110
               Q 0   72   40  110
               Q 80  68   120 110
               Q 160 76   200 110
               L 200 220 L -200 220 Z"
        fill="${c}" opacity="0.5"/>
      <circle cx="-150" cy="60" r="6" fill="${PALETTE.ink}" opacity="0.45"/>
      <circle cx="-110" cy="78" r="4" fill="${PALETTE.ink}" opacity="0.45"/>
      <circle cx="120" cy="64" r="5" fill="${PALETTE.ink}" opacity="0.45"/>
      <circle cx="60" cy="92" r="3" fill="${PALETTE.ink}" opacity="0.45"/>
    </g>`,
  'anunnaki-ancient-aliens': (c) => `
    <g transform="translate(940 320)">
      <circle cx="0" cy="0" r="55" fill="${c}" opacity="0.18"/>
      <circle cx="0" cy="0" r="55" fill="none" stroke="${c}" stroke-width="3" opacity="0.95"/>
      <circle cx="0" cy="0" r="32" fill="none" stroke="${c}" stroke-width="2" opacity="0.65"/>
      <circle cx="0" cy="0" r="10" fill="${c}" opacity="0.95"/>
      <path d="M -50 -5 Q -110 -35 -195 -25 L -200 8 Q -180 28 -150 30 L -90 32 Q -60 28 -50 15 Z" fill="${c}" opacity="0.18" stroke="${c}" stroke-width="2"/>
      <line x1="-60" y1="-3" x2="-180" y2="-28" stroke="${c}" stroke-width="1.5" opacity="0.55"/>
      <line x1="-60" y1="6"  x2="-180" y2="-12" stroke="${c}" stroke-width="1.5" opacity="0.45"/>
      <line x1="-60" y1="15" x2="-180" y2="3"   stroke="${c}" stroke-width="1.5" opacity="0.4"/>
      <line x1="-60" y1="24" x2="-160" y2="22"  stroke="${c}" stroke-width="1.5" opacity="0.35"/>
      <path d="M 50 -5 Q 110 -35 195 -25 L 200 8 Q 180 28 150 30 L 90 32 Q 60 28 50 15 Z" fill="${c}" opacity="0.18" stroke="${c}" stroke-width="2"/>
      <line x1="60" y1="-3" x2="180" y2="-28" stroke="${c}" stroke-width="1.5" opacity="0.55"/>
      <line x1="60" y1="6"  x2="180" y2="-12" stroke="${c}" stroke-width="1.5" opacity="0.45"/>
      <line x1="60" y1="15" x2="180" y2="3"   stroke="${c}" stroke-width="1.5" opacity="0.4"/>
      <line x1="60" y1="24" x2="160" y2="22"  stroke="${c}" stroke-width="1.5" opacity="0.35"/>
      <line x1="-30" y1="55" x2="-50" y2="120" stroke="${c}" stroke-width="2.5" opacity="0.7"/>
      <line x1="-12" y1="55" x2="-18" y2="135" stroke="${c}" stroke-width="3" opacity="0.85"/>
      <line x1="0"   y1="55" x2="0"   y2="145" stroke="${c}" stroke-width="3.5" opacity="0.95"/>
      <line x1="12"  y1="55" x2="18"  y2="135" stroke="${c}" stroke-width="3" opacity="0.85"/>
      <line x1="30"  y1="55" x2="50"  y2="120" stroke="${c}" stroke-width="2.5" opacity="0.7"/>
    </g>`,
  'hollow-moon-theory': (c) => `
    <g transform="translate(940 320)">
      <circle cx="0" cy="0" r="200" fill="none" stroke="${c}" stroke-width="2" opacity="0.35"/>
      <circle cx="0" cy="0" r="155" fill="none" stroke="${c}" stroke-width="2" opacity="0.55"/>
      <circle cx="0" cy="0" r="105" fill="none" stroke="${c}" stroke-width="2" opacity="0.8"/>
      <circle cx="0" cy="0" r="58" fill="${c}" opacity="0.18"/>
      <circle cx="-32" cy="-26" r="13" fill="${c}" opacity="0.35"/>
      <circle cx="36" cy="38" r="8" fill="${c}" opacity="0.5"/>
      <circle cx="-8" cy="50" r="6" fill="${c}" opacity="0.4"/>
      <path d="M -170 -56 A 180 180 0 0 1 -56 -170" fill="none" stroke="${c}" stroke-width="3" opacity="0.9"/>
    </g>`,
  'artemis-ii-fake-moon-landing': (c) => `
    <g transform="translate(940 320)">
      <circle cx="0" cy="0" r="160" fill="none" stroke="${c}" stroke-width="2" opacity="0.5"/>
      <circle cx="0" cy="0" r="160" fill="${c}" opacity="0.08"/>
      <circle cx="-28" cy="-18" r="15" fill="${c}" opacity="0.22"/>
      <circle cx="38" cy="28" r="9" fill="${c}" opacity="0.28"/>
      <path d="M -230 190 Q -56 -114 190 -230" fill="none" stroke="${c}" stroke-width="3" opacity="0.8" stroke-dasharray="6 10"/>
      <polygon points="190,-230 170,-210 210,-210" fill="${c}" opacity="0.9"/>
    </g>`,
  'baba-vanga-2026-alien-prediction': (c) => `
    <g transform="translate(940 320)">
      <ellipse cx="0" cy="20" rx="190" ry="42" fill="none" stroke="${c}" stroke-width="3" opacity="0.8"/>
      <ellipse cx="0" cy="20" rx="190" ry="42" fill="${c}" opacity="0.12"/>
      <path d="M -105 10 Q 0 -86 105 10" fill="${c}" opacity="0.22" stroke="${c}" stroke-width="2.5"/>
      <circle cx="-52" cy="-10" r="5" fill="${c}"/>
      <circle cx="0" cy="-19" r="5" fill="${c}"/>
      <circle cx="52" cy="-10" r="5" fill="${c}"/>
      <line x1="-133" y1="58" x2="-190" y2="170" stroke="${c}" stroke-width="2" opacity="0.6" stroke-dasharray="4 6"/>
      <line x1="0" y1="68" x2="0" y2="190" stroke="${c}" stroke-width="2" opacity="0.6" stroke-dasharray="4 6"/>
      <line x1="133" y1="58" x2="190" y2="170" stroke="${c}" stroke-width="2" opacity="0.6" stroke-dasharray="4 6"/>
    </g>`,
  'celebrity-clone-conspiracy': (c) => `
    <g transform="translate(940 320)">
      <circle cx="-58" cy="0" r="135" fill="none" stroke="${c}" stroke-width="3" opacity="0.9"/>
      <circle cx="58" cy="0" r="135" fill="none" stroke="${c}" stroke-width="3" opacity="0.55"/>
      <circle cx="-58" cy="0" r="135" fill="${c}" opacity="0.1"/>
      <circle cx="58" cy="0" r="135" fill="${c}" opacity="0.1"/>
      <ellipse cx="-58" cy="-28" rx="40" ry="50" fill="${c}" opacity="0.25"/>
      <ellipse cx="58" cy="-28" rx="40" ry="50" fill="${c}" opacity="0.2"/>
      <path d="M -106 76 Q -58 38 -10 76" fill="none" stroke="${c}" stroke-width="3" opacity="0.6"/>
      <path d="M 10 76 Q 58 38 106 76" fill="none" stroke="${c}" stroke-width="3" opacity="0.45"/>
    </g>`,
  'dead-internet-theory': (c) => {
    const cells = [];
    const gx = 800, gy = 165, size = 38, gap = 7;
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
    <g transform="translate(940 320)">
      <rect x="-160" y="-180" width="320" height="360" fill="none" stroke="${c}" stroke-width="3" opacity="0.9"/>
      <rect x="-160" y="-180" width="320" height="360" fill="${c}" opacity="0.06"/>
      <rect x="-160" y="-180" width="320" height="46" fill="${c}" opacity="0.25"/>
      <rect x="-130" y="-110" width="260" height="16" fill="${c}"/>
      <rect x="-130" y="-80"  width="200" height="16" fill="${c}" opacity="0.6"/>
      <rect x="-130" y="-50"  width="240" height="16" fill="${c}"/>
      <rect x="-130" y="-20"  width="170" height="16" fill="${c}" opacity="0.6"/>
      <rect x="-130" y="10"   width="220" height="16" fill="${c}"/>
      <rect x="-130" y="40"   width="190" height="16" fill="${c}" opacity="0.6"/>
      <rect x="-130" y="70"   width="250" height="16" fill="${c}"/>
      <text x="0" y="148" text-anchor="middle" font-family="'Lilita One','Impact','Arial Black',sans-serif" font-size="24" fill="${c}" letter-spacing="0.18em">CLASSIFIED</text>
    </g>`,
  'ai-deepfakes-spotting-guide': (c) => {
    const blocks = [];
    const gx = 790, gy = 155, size = 34, cols = 8, rows = 8;
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
    <g transform="translate(940 320)">
      <circle cx="0" cy="0" r="160" fill="${c}" opacity="0.12"/>
      <circle cx="0" cy="0" r="160" fill="none" stroke="${c}" stroke-width="2" opacity="0.5"/>
      <rect x="-22" y="-130" width="44" height="86" rx="22" fill="${c}" opacity="0.85"/>
      <line x1="0" y1="-44" x2="0" y2="32" stroke="${c}" stroke-width="6"/>
      <line x1="-38" y1="32" x2="38" y2="32" stroke="${c}" stroke-width="6"/>
      <text x="0" y="118" text-anchor="middle" font-family="'Lilita One','Impact','Arial Black',sans-serif" font-size="105" fill="${c}">?</text>
    </g>`,
  'nasa-project-anchor-debunked': (c) => `
    <g transform="translate(940 320)">
      <circle cx="0" cy="0" r="170" fill="none" stroke="${c}" stroke-width="2" opacity="0.4"/>
      <circle cx="0" cy="0" r="170" fill="${c}" opacity="0.06"/>
      <ellipse cx="0" cy="0" rx="170" ry="56" fill="none" stroke="${c}" stroke-width="1.5" opacity="0.3"/>
      <ellipse cx="0" cy="0" rx="56" ry="170" fill="none" stroke="${c}" stroke-width="1.5" opacity="0.3"/>
      <path d="M 0 -114 L 0 96 M -48 76 Q 0 130 48 76 M -28 -114 L 28 -114 M 0 -132 A 18 18 0 1 1 0.01 -132" fill="none" stroke="${c}" stroke-width="8" stroke-linecap="round" opacity="0.9"/>
      <line x1="-140" y1="-140" x2="140" y2="140" stroke="${PALETTE.magenta}" stroke-width="8" stroke-linecap="round"/>
    </g>`
};

function wrapTitle(title, maxChars) {
  const words = title.split(/\s+/);
  const lines = [];
  let cur = '';
  for (const w of words) {
    if ((cur + ' ' + w).trim().length > maxChars && cur) {
      lines.push(cur);
      cur = w;
    } else {
      cur = (cur + ' ' + w).trim();
    }
  }
  if (cur) lines.push(cur);
  return lines;
}

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// Pseudo-random scattered stars (deterministic via seed)
function starField(seed = 1) {
  let s = seed;
  const rand = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
  const stars = [];
  for (let i = 0; i < 28; i++) {
    const x = (rand() * 1180 + 10).toFixed(0);
    const y = (rand() * 610 + 10).toFixed(0);
    const r = (0.8 + rand() * 1.6).toFixed(1);
    const op = (0.35 + rand() * 0.5).toFixed(2);
    const colors = ['#fff4d0', '#fff4d0', '#ffd24a', '#b347ff', '#3bf0e0', '#ff3eb8', '#ff8a3c'];
    const fill = colors[Math.floor(rand() * colors.length)];
    stars.push(`<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" opacity="${op}"/>`);
  }
  return `<g>${stars.join('')}</g>`;
}

// Sacred-geometry accents in the background corners ... very faint
function bgGeometry(seed = 1) {
  return `
    <g opacity="0.10" fill="none" stroke="${PALETTE.gold}" stroke-width="1.4">
      <g transform="translate(60 470) rotate(-12)">
        <polygon points="50,10 90,90 10,90"/>
        <circle cx="50" cy="62" r="14"/>
        <circle cx="50" cy="62" r="4" fill="${PALETTE.gold}"/>
      </g>
    </g>
    <g opacity="0.08" fill="none" stroke="${PALETTE.violet}" stroke-width="1.2" transform="translate(1060 70)">
      <circle cx="50" cy="50" r="14"/>
      <circle cx="50" cy="36" r="14"/>
      <circle cx="50" cy="64" r="14"/>
      <circle cx="38" cy="43" r="14"/>
      <circle cx="62" cy="43" r="14"/>
      <circle cx="38" cy="57" r="14"/>
      <circle cx="62" cy="57" r="14"/>
    </g>
    <g opacity="0.08" fill="none" stroke="${PALETTE.teal}" stroke-width="1.4" transform="translate(540 30) scale(0.7)">
      <polygon points="50,8 90,75 10,75"/>
      <polygon points="50,92 90,25 10,25"/>
    </g>`;
}

// Common cosmic background
function cosmicBg() {
  return `
    <defs>
      <radialGradient id="bg-glow-1" cx="18%" cy="22%" r="55%">
        <stop offset="0" stop-color="${PALETTE.gold}" stop-opacity="0.34"/>
        <stop offset="0.6" stop-color="${PALETTE.gold}" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="bg-glow-2" cx="82%" cy="18%" r="50%">
        <stop offset="0" stop-color="${PALETTE.magenta}" stop-opacity="0.30"/>
        <stop offset="0.6" stop-color="${PALETTE.magenta}" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="bg-glow-3" cx="72%" cy="80%" r="55%">
        <stop offset="0" stop-color="${PALETTE.violet}" stop-opacity="0.34"/>
        <stop offset="0.6" stop-color="${PALETTE.violet}" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="bg-glow-4" cx="22%" cy="82%" r="50%">
        <stop offset="0" stop-color="${PALETTE.teal}" stop-opacity="0.24"/>
        <stop offset="0.6" stop-color="${PALETTE.teal}" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="stripe-top" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="${PALETTE.gold}" stop-opacity="0"/>
        <stop offset="0.5" stop-color="${PALETTE.gold}" stop-opacity="0.85"/>
        <stop offset="1" stop-color="${PALETTE.gold}" stop-opacity="0"/>
      </linearGradient>
    </defs>
    <rect width="1200" height="630" fill="${PALETTE.ink}"/>
    <rect width="1200" height="630" fill="url(#bg-glow-1)"/>
    <rect width="1200" height="630" fill="url(#bg-glow-2)"/>
    <rect width="1200" height="630" fill="url(#bg-glow-3)"/>
    <rect width="1200" height="630" fill="url(#bg-glow-4)"/>
    <rect x="0" y="0"   width="1200" height="3" fill="url(#stripe-top)"/>
    <rect x="0" y="627" width="1200" height="3" fill="url(#stripe-top)"/>`;
}

// Chunky title rendering ... gold fill, ink stroke, hard offset shadow.
// Implemented as two layered text elements (shadow first, then main) per line.
function chunkyTitle(lines, startY, fontSize, lineHeight, x = 64) {
  const FONT = "'Lilita One','Impact','Arial Black','Helvetica Black',sans-serif";
  return lines.map((ln, i) => {
    const y = startY + i * lineHeight;
    const safe = esc(ln);
    return `
      <text x="${x + 4}" y="${y + 4}" font-family="${FONT}" font-size="${fontSize}" font-weight="400" fill="${PALETTE.ink}" letter-spacing="0.005em">${safe}</text>
      <text x="${x}" y="${y}" font-family="${FONT}" font-size="${fontSize}" font-weight="400" fill="${PALETTE.gold}" stroke="${PALETTE.ink}" stroke-width="2" stroke-linejoin="round" letter-spacing="0.005em" paint-order="stroke fill">${safe}</text>`;
  }).join('\n');
}

function buildPostSvg(post) {
  const theme = THEMES[post.slug] || { accent: PALETTE.gold, label: 'BLOG' };
  const accent = theme.accent;
  const motif = MOTIFS[post.slug] ? MOTIFS[post.slug](accent) : '';

  // Strip parenthetical from title for sizing
  const sizingTitle = post.title.replace(/\([^)]*\)/g, '').trim();
  let fontSize, maxChars, lineHeight;
  if (sizingTitle.length <= 50) {
    fontSize = 64; maxChars = 16; lineHeight = 76;
  } else if (sizingTitle.length <= 90) {
    fontSize = 52; maxChars = 20; lineHeight = 64;
  } else {
    fontSize = 42; maxChars = 25; lineHeight = 54;
  }
  const lines = wrapTitle(sizingTitle, maxChars).slice(0, 5);
  const titleStartY = 248;
  const bylineY = Math.min(titleStartY + lines.length * lineHeight + 30, 588);
  const dateStr = new Date(post.date).toISOString().slice(0, 10).replace(/-/g, '.');

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1200" height="630" viewBox="0 0 1200 630">
  ${cosmicBg()}
  ${bgGeometry()}
  ${starField(post.slug.length * 7)}

  ${motif}

  <image x="60" y="48" width="92" height="92" xlink:href="${LOGO_NAV_DATA}"/>
  <text x="172" y="92" font-family="'Permanent Marker','Marker Felt','Bradley Hand',cursive" font-size="20" fill="${PALETTE.paper}" letter-spacing="0.16em">// BLOG</text>
  <text x="172" y="120" font-family="'Permanent Marker','Marker Felt','Bradley Hand',cursive" font-size="14" fill="${accent}" letter-spacing="0.18em" opacity="0.9">${esc(theme.label)}</text>
  <rect x="64" y="160" width="80" height="3" fill="${accent}" opacity="0.85"/>

  ${chunkyTitle(lines, titleStartY, fontSize, lineHeight)}

  <text x="64" y="${bylineY}" font-family="'Permanent Marker','Marker Felt','Bradley Hand',cursive" font-size="17" fill="${PALETTE.paperDim}" letter-spacing="0.08em">${dateStr}  /  LUCID ROB</text>

  <text x="1140" y="588" text-anchor="end" font-family="'Lilita One','Impact','Arial Black',sans-serif" font-size="26" font-weight="400" fill="${PALETTE.gold}" stroke="${PALETTE.ink}" stroke-width="1.6" stroke-linejoin="round" paint-order="stroke fill" letter-spacing="0.04em">LUCIDROB.COM</text>
  <rect x="940" y="600" width="200" height="2" fill="${PALETTE.gold}" opacity="0.7"/>
</svg>
`;
}

function buildHomeSvg() {
  const tagline = ['Conspiracies. Hidden history.', 'Signal from the static.'];
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1200" height="630" viewBox="0 0 1200 630">
  ${cosmicBg()}
  ${bgGeometry()}
  ${starField(42)}

  <image x="365" y="60" width="320" height="320" xlink:href="${LOGO_HERO_DATA}"/>

  <text x="600" y="450" text-anchor="middle" font-family="'Lilita One','Impact','Arial Black',sans-serif" font-size="38" font-weight="400" fill="${PALETTE.ink}" letter-spacing="0.005em" transform="translate(4 4)">${esc(tagline[0])}</text>
  <text x="600" y="450" text-anchor="middle" font-family="'Lilita One','Impact','Arial Black',sans-serif" font-size="38" font-weight="400" fill="${PALETTE.gold}" stroke="${PALETTE.ink}" stroke-width="2" stroke-linejoin="round" paint-order="stroke fill" letter-spacing="0.005em">${esc(tagline[0])}</text>

  <text x="600" y="498" text-anchor="middle" font-family="'Lilita One','Impact','Arial Black',sans-serif" font-size="38" font-weight="400" fill="${PALETTE.ink}" letter-spacing="0.005em" transform="translate(4 4)">${esc(tagline[1])}</text>
  <text x="600" y="498" text-anchor="middle" font-family="'Lilita One','Impact','Arial Black',sans-serif" font-size="38" font-weight="400" fill="${PALETTE.gold}" stroke="${PALETTE.ink}" stroke-width="2" stroke-linejoin="round" paint-order="stroke fill" letter-spacing="0.005em">${esc(tagline[1])}</text>

  <text x="600" y="568" text-anchor="middle" font-family="'Permanent Marker','Marker Felt','Bradley Hand',cursive" font-size="22" fill="${PALETTE.magenta}" letter-spacing="0.22em">LUCIDROB.COM</text>
  <rect x="450" y="582" width="300" height="3" fill="${PALETTE.magenta}" opacity="0.7"/>
</svg>
`;
}

if (!fs.existsSync(SRC_DIR)) fs.mkdirSync(SRC_DIR, { recursive: true });
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

let wrote = 0;
for (const post of POSTS) {
  const svgPath = path.join(SRC_DIR, `${post.slug}.svg`);
  const pngPath = path.join(OUT_DIR, `${post.slug}.png`);
  fs.writeFileSync(svgPath, buildPostSvg(post), 'utf-8');
  execFileSync('rsvg-convert', ['-w', '1200', '-h', '630', '-o', pngPath, svgPath]);
  console.log(`  og/${post.slug}.png`);
  wrote += 1;
}

// Homepage / sitewide OG
const homeSvgPath = path.join(SRC_DIR, '_home.svg');
const homePngPath = path.join(ROOT, 'og-image.png');
fs.writeFileSync(homeSvgPath, buildHomeSvg(), 'utf-8');
execFileSync('rsvg-convert', ['-w', '1200', '-h', '630', '-o', homePngPath, homeSvgPath]);
console.log(`  og-image.png (sitewide / homepage)`);

console.log(`\nDone. ${wrote} post OGs + 1 homepage OG generated.`);
