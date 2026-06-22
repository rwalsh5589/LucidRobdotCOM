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
  'david-wilcock-suicide-conspiracy':{ accent: PALETTE.violet,  label: 'WILCOCK_DEATH'           },
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
  'nasa-project-anchor-debunked':    { accent: PALETTE.teal,    label: 'PROJECT_ANCHOR_DEBUNKED' },
  'tartaria-mud-flood':              { accent: PALETTE.orange,  label: 'TARTARIA_MUD_FLOOD'      },
  'project-blue-beam':               { accent: PALETTE.teal,    label: 'PROJECT_BLUE_BEAM'       },
  'cern-timeline-shift':             { accent: PALETTE.violet,  label: 'CERN_TIMELINE_SHIFT'     },
  'antarctica-hidden-continent':     { accent: PALETTE.teal,    label: 'ANTARCTICA_UNDER_ICE'    },
  'black-knight-satellite':          { accent: PALETTE.violet,  label: 'BLACK_KNIGHT_SAT'        },
  'phantom-time-hypothesis':         { accent: PALETTE.gold,    label: 'PHANTOM_TIME'            },
  'bohemian-grove-cremation-of-care':{ accent: PALETTE.magenta, label: 'BOHEMIAN_GROVE'          },
  'haarp-weather-manipulation':      { accent: PALETTE.orange,  label: 'HAARP_ARRAY'             },
  'dark-ages-conspiracy':            { accent: PALETTE.violet,  label: 'DARK_AGES_LIE'           },
  'pastors-alien-disclosure-warning':{ accent: PALETTE.magenta, label: 'PASTOR_DISCLOSURE_OP'    },
  'bigfoot-missing-link':            { accent: PALETTE.orange,  label: 'BIGFOOT_LEGEND'          },
  'scientology-l-ron-hubbard-cult-empire': { accent: PALETTE.violet, label: 'SCIENTOLOGY_FILE'  },
  'hantavirus-covid-plandemic-conspiracy': { accent: PALETTE.teal,   label: 'HANTAVIRUS_2026'   },
  'agi-cover-up-conspiracy':               { accent: PALETTE.magenta, label: 'AGI_COVER_UP'      },
  'chavin-de-huantar-psychedelic-religion':{ accent: PALETTE.teal,    label: 'CHAVIN_DRUG_CULT'  },
  'uap-disclosure-pursue-files':           { accent: PALETTE.orange,  label: 'UAP_DISCLOSURE_2026' },
  'uap-disclosure-mother-orb-pursue-3':    { accent: PALETTE.orange,  label: 'MOTHER_ORB_FILE'     }
};

const MOTIFS = {
  'david-wilcock-suicide-conspiracy': (c) => `
    <g transform="translate(940 320)">
      <rect x="-140" y="-130" width="280" height="190" rx="10" fill="${c}" opacity="0.08"/>
      <rect x="-140" y="-130" width="280" height="190" rx="10" fill="none" stroke="${c}" stroke-width="3.5" opacity="0.9"/>
      <circle cx="0" cy="-55" r="22" fill="${c}" opacity="0.5"/>
      <path d="M -42 -22 Q 0 -36 42 -22 L 42 38 L -42 38 Z" fill="${c}" opacity="0.5"/>
      <circle cx="-115" cy="-100" r="7" fill="${PALETTE.magenta}" opacity="0.95"/>
      <text x="-100" y="-95" font-family="'Lilita One','Impact','Arial Black',sans-serif" font-size="14" fill="${c}" letter-spacing="0.08em">LIVE</text>
      <line x1="-140" y1="-75" x2="140" y2="-75" stroke="${c}" stroke-width="1" opacity="0.35" stroke-dasharray="3 5"/>
      <line x1="-140" y1="-32" x2="140" y2="-32" stroke="${c}" stroke-width="1" opacity="0.25" stroke-dasharray="2 4"/>
      <line x1="-140" y1="10"  x2="140" y2="10"  stroke="${c}" stroke-width="1" opacity="0.2"  stroke-dasharray="3 5"/>
      <line x1="-160" y1="-150" x2="160" y2="78" stroke="${PALETTE.gold}" stroke-width="5" opacity="0.95" stroke-linecap="round"/>
      <text x="0" y="105" text-anchor="middle" font-family="'Lilita One','Impact','Arial Black',sans-serif" font-size="22" fill="${PALETTE.gold}" stroke="${PALETTE.ink}" stroke-width="1.6" stroke-linejoin="round" paint-order="stroke fill" letter-spacing="0.14em">SIGNAL LOST</text>
    </g>`,
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
    </g>`,
  'dark-ages-conspiracy': (c) => `
    <g transform="translate(940 320)">
      <!-- Closed book / banned tome motif -->
      <rect x="-150" y="-110" width="300" height="220" rx="6" fill="${c}" opacity="0.1"/>
      <rect x="-150" y="-110" width="300" height="220" rx="6" fill="none" stroke="${c}" stroke-width="3.5" opacity="0.85"/>
      <line x1="0" y1="-110" x2="0" y2="110" stroke="${c}" stroke-width="3" opacity="0.8"/>
      <!-- Spine clasps -->
      <rect x="-12" y="-110" width="24" height="14" fill="${c}" opacity="0.85"/>
      <rect x="-12" y="96" width="24" height="14" fill="${c}" opacity="0.85"/>
      <!-- Cross / suppression mark over the open page -->
      <line x1="-110" y1="-60" x2="-110" y2="60" stroke="${c}" stroke-width="1.5" opacity="0.45"/>
      <line x1="-90" y1="-60" x2="-90" y2="60" stroke="${c}" stroke-width="1.5" opacity="0.35"/>
      <line x1="-70" y1="-60" x2="-70" y2="60" stroke="${c}" stroke-width="1.5" opacity="0.45"/>
      <line x1="-50" y1="-60" x2="-50" y2="60" stroke="${c}" stroke-width="1.5" opacity="0.35"/>
      <line x1="-30" y1="-60" x2="-30" y2="60" stroke="${c}" stroke-width="1.5" opacity="0.45"/>
      <!-- Flame on the right page (knowledge being burned) -->
      <path d="M 70 60 Q 50 20 70 -20 Q 90 0 100 -40 Q 120 0 110 40 Q 95 60 70 60 Z" fill="${PALETTE.magenta}" opacity="0.85"/>
      <path d="M 80 50 Q 70 25 82 -5 Q 96 15 95 35 Q 90 55 80 50 Z" fill="${PALETTE.gold}" opacity="0.9"/>
      <!-- Forbidden stamp -->
      <line x1="-150" y1="-110" x2="150" y2="110" stroke="${PALETTE.magenta}" stroke-width="6" stroke-linecap="round" opacity="0.7"/>
    </g>`,
  'pastors-alien-disclosure-warning': (c) => `
    <g transform="translate(940 320)">
      <!-- Broadcast waves emanating downward from the disc -->
      <path d="M -210 -80 A 230 230 0 0 1 210 -80" fill="none" stroke="${c}" stroke-width="2.5" opacity="0.3"/>
      <path d="M -160 -100 A 180 180 0 0 1 160 -100" fill="none" stroke="${c}" stroke-width="2.5" opacity="0.5"/>
      <path d="M -110 -120 A 130 130 0 0 1 110 -120" fill="none" stroke="${c}" stroke-width="2.5" opacity="0.75"/>
      <!-- UFO disc -->
      <ellipse cx="0" cy="-148" rx="74" ry="18" fill="${c}" opacity="0.9"/>
      <ellipse cx="0" cy="-160" rx="40" ry="14" fill="${c}" opacity="0.95"/>
      <circle cx="-32" cy="-148" r="4" fill="${PALETTE.gold}"/>
      <circle cx="0"   cy="-148" r="4" fill="${PALETTE.gold}"/>
      <circle cx="32"  cy="-148" r="4" fill="${PALETTE.gold}"/>
      <!-- Light beam from disc to cross -->
      <path d="M -22 -130 L -70 140 L 70 140 L 22 -130 Z" fill="${c}" opacity="0.12"/>
      <!-- Cross on a small pulpit base -->
      <rect x="-14" y="-80" width="28" height="200" fill="${c}" opacity="0.9"/>
      <rect x="-58" y="-30" width="116" height="22" fill="${c}" opacity="0.9"/>
      <rect x="-72" y="120" width="144" height="20" fill="${c}" opacity="0.85"/>
      <!-- Subtle eye glow at top of cross to suggest something watching back -->
      <circle cx="0" cy="-90" r="6" fill="${PALETTE.gold}" opacity="0.85"/>
    </g>`,
  'bigfoot-missing-link': (c) => `
    <g transform="translate(940 320)">
      <!-- Big footprint: heel pad -->
      <ellipse cx="0" cy="60" rx="62" ry="86" fill="${c}" opacity="0.18"/>
      <ellipse cx="0" cy="60" rx="62" ry="86" fill="none" stroke="${c}" stroke-width="3.5" opacity="0.95"/>
      <!-- Ball / arch transition -->
      <path d="M -56 -10 Q 0 -28 56 -10" fill="none" stroke="${c}" stroke-width="2.5" opacity="0.55"/>
      <!-- Five toes, big to small -->
      <ellipse cx="-36" cy="-58" rx="16" ry="20" fill="${c}" opacity="0.92"/>
      <ellipse cx="-12" cy="-78" rx="14" ry="18" fill="${c}" opacity="0.92"/>
      <ellipse cx="10"  cy="-86" rx="13" ry="17" fill="${c}" opacity="0.92"/>
      <ellipse cx="30"  cy="-80" rx="11" ry="15" fill="${c}" opacity="0.92"/>
      <ellipse cx="46"  cy="-66" rx="9"  ry="12" fill="${c}" opacity="0.92"/>
      <!-- Tree-line silhouette behind, low and dark -->
      <path d="M -200 150 L -180 110 L -160 145 L -140 100 L -120 145 L -100 115 L -80 145 L -60 95 L -40 145 L -20 120 L 0 145 L 20 105 L 40 145 L 60 115 L 80 145 L 100 100 L 120 145 L 140 110 L 160 145 L 180 120 L 200 145 L 200 200 L -200 200 Z" fill="${c}" opacity="0.22"/>
      <!-- Two glinting eyes peeking from the trees -->
      <circle cx="-110" cy="118" r="3.5" fill="${PALETTE.gold}" opacity="0.95"/>
      <circle cx="-96"  cy="118" r="3.5" fill="${PALETTE.gold}" opacity="0.95"/>
    </g>`,
  'agi-cover-up-conspiracy': (c) => `
    <g transform="translate(940 320)">
      <!-- Vault / black box housing -->
      <rect x="-160" y="-160" width="320" height="320" rx="14" fill="${c}" opacity="0.08"/>
      <rect x="-160" y="-160" width="320" height="320" rx="14" fill="none" stroke="${c}" stroke-width="3.5" opacity="0.9"/>
      <!-- Neural network: input layer (left) -->
      <circle cx="-100" cy="-100" r="8" fill="${c}" opacity="0.9"/>
      <circle cx="-100" cy="-40"  r="8" fill="${c}" opacity="0.9"/>
      <circle cx="-100" cy="40"   r="8" fill="${c}" opacity="0.9"/>
      <circle cx="-100" cy="100"  r="8" fill="${c}" opacity="0.9"/>
      <!-- Hidden layer (middle) -->
      <circle cx="0" cy="-80" r="8" fill="${c}" opacity="0.85"/>
      <circle cx="0" cy="-20" r="8" fill="${c}" opacity="0.85"/>
      <circle cx="0" cy="40"  r="8" fill="${c}" opacity="0.85"/>
      <circle cx="0" cy="100" r="8" fill="${c}" opacity="0.85"/>
      <!-- Output layer (right) -->
      <circle cx="100" cy="-60" r="8" fill="${c}" opacity="0.9"/>
      <circle cx="100" cy="0"   r="8" fill="${c}" opacity="0.9"/>
      <circle cx="100" cy="60"  r="8" fill="${c}" opacity="0.9"/>
      <!-- Connections L1 -> L2 -->
      <line x1="-100" y1="-100" x2="0" y2="-80" stroke="${c}" stroke-width="1.4" opacity="0.5"/>
      <line x1="-100" y1="-100" x2="0" y2="-20" stroke="${c}" stroke-width="1.4" opacity="0.35"/>
      <line x1="-100" y1="-40"  x2="0" y2="-80" stroke="${c}" stroke-width="1.4" opacity="0.4"/>
      <line x1="-100" y1="-40"  x2="0" y2="-20" stroke="${c}" stroke-width="1.4" opacity="0.5"/>
      <line x1="-100" y1="-40"  x2="0" y2="40"  stroke="${c}" stroke-width="1.4" opacity="0.3"/>
      <line x1="-100" y1="40"   x2="0" y2="-20" stroke="${c}" stroke-width="1.4" opacity="0.3"/>
      <line x1="-100" y1="40"   x2="0" y2="40"  stroke="${c}" stroke-width="1.4" opacity="0.5"/>
      <line x1="-100" y1="40"   x2="0" y2="100" stroke="${c}" stroke-width="1.4" opacity="0.4"/>
      <line x1="-100" y1="100"  x2="0" y2="40"  stroke="${c}" stroke-width="1.4" opacity="0.35"/>
      <line x1="-100" y1="100"  x2="0" y2="100" stroke="${c}" stroke-width="1.4" opacity="0.5"/>
      <!-- Connections L2 -> L3 -->
      <line x1="0" y1="-80" x2="100" y2="-60" stroke="${c}" stroke-width="1.4" opacity="0.5"/>
      <line x1="0" y1="-80" x2="100" y2="0"   stroke="${c}" stroke-width="1.4" opacity="0.3"/>
      <line x1="0" y1="-20" x2="100" y2="-60" stroke="${c}" stroke-width="1.4" opacity="0.4"/>
      <line x1="0" y1="-20" x2="100" y2="0"   stroke="${c}" stroke-width="1.4" opacity="0.5"/>
      <line x1="0" y1="40"  x2="100" y2="0"   stroke="${c}" stroke-width="1.4" opacity="0.45"/>
      <line x1="0" y1="40"  x2="100" y2="60"  stroke="${c}" stroke-width="1.4" opacity="0.5"/>
      <line x1="0" y1="100" x2="100" y2="60"  stroke="${c}" stroke-width="1.4" opacity="0.4"/>
      <!-- Redaction bar across the middle hiding the output -->
      <rect x="-150" y="-14" width="300" height="28" fill="${PALETTE.ink}"/>
      <rect x="-150" y="-14" width="300" height="28" fill="none" stroke="${PALETTE.gold}" stroke-width="2.5" opacity="0.95"/>
      <text x="0" y="6" text-anchor="middle" font-family="'Lilita One','Impact','Arial Black',sans-serif" font-size="16" fill="${PALETTE.gold}" letter-spacing="0.24em">CLASSIFIED</text>
      <!-- AGI label up top -->
      <text x="0" y="-122" text-anchor="middle" font-family="'Lilita One','Impact','Arial Black',sans-serif" font-size="22" fill="${c}" stroke="${PALETTE.ink}" stroke-width="1.2" stroke-linejoin="round" paint-order="stroke fill" letter-spacing="0.24em">AGI :: ?</text>
      <!-- Lock icon bottom -->
      <rect x="-14" y="125" width="28" height="22" rx="3" fill="${PALETTE.gold}" opacity="0.95"/>
      <path d="M -9 125 L -9 116 Q -9 104 0 104 Q 9 104 9 116 L 9 125" fill="none" stroke="${PALETTE.gold}" stroke-width="3" opacity="0.95"/>
    </g>`,
  'chavin-de-huantar-psychedelic-religion': (c) => `
    <g transform="translate(940 320)">
      <!-- Stone chamber frame: piercing top/bottom -->
      <rect x="-150" y="-160" width="300" height="14" fill="${c}" opacity="0.18"/>
      <rect x="-150" y="-160" width="300" height="14" fill="none" stroke="${c}" stroke-width="2" opacity="0.7"/>
      <rect x="-150" y="146"  width="300" height="14" fill="${c}" opacity="0.18"/>
      <rect x="-150" y="146"  width="300" height="14" fill="none" stroke="${c}" stroke-width="2" opacity="0.7"/>
      <!-- The Lanzón: tall granite stake piercing floor and ceiling -->
      <path d="M -28 -170 L 28 -170 L 22 160 L -22 160 Z" fill="${c}" opacity="0.16"/>
      <path d="M -28 -170 L 28 -170 L 22 160 L -22 160 Z" fill="none" stroke="${c}" stroke-width="3" opacity="0.95"/>
      <!-- Vertical glyph lines suggesting carved relief -->
      <line x1="-14" y1="-150" x2="-14" y2="140" stroke="${c}" stroke-width="1" opacity="0.45" stroke-dasharray="4 6"/>
      <line x1="14"  y1="-150" x2="14"  y2="140" stroke="${c}" stroke-width="1" opacity="0.45" stroke-dasharray="4 6"/>
      <!-- Fanged predator face mid-monolith -->
      <circle cx="-9"  cy="-26" r="4.5" fill="${PALETTE.gold}" opacity="0.95"/>
      <circle cx="9"   cy="-26" r="4.5" fill="${PALETTE.gold}" opacity="0.95"/>
      <path d="M -16 -4 Q 0 6 16 -4" fill="none" stroke="${PALETTE.gold}" stroke-width="2.2" opacity="0.95"/>
      <!-- Fangs -->
      <path d="M -10 -2 L -6 14 L -2 -2 Z" fill="${PALETTE.gold}" opacity="0.95"/>
      <path d="M 2 -2 L 6 14 L 10 -2 Z"   fill="${PALETTE.gold}" opacity="0.95"/>
      <!-- Snuff tube + powder trail to the left -->
      <rect x="-138" y="58" width="68" height="9" rx="2" fill="${c}" opacity="0.85"/>
      <rect x="-138" y="58" width="68" height="9" rx="2" fill="none" stroke="${PALETTE.ink}" stroke-width="1" opacity="0.7"/>
      <circle cx="-62" cy="56" r="2" fill="${PALETTE.gold}" opacity="0.9"/>
      <circle cx="-54" cy="50" r="1.6" fill="${PALETTE.gold}" opacity="0.8"/>
      <circle cx="-48" cy="42" r="1.3" fill="${PALETTE.gold}" opacity="0.7"/>
      <circle cx="-44" cy="34" r="1" fill="${PALETTE.gold}" opacity="0.6"/>
      <!-- Conch shell on the right -->
      <path d="M 110 -22 Q 144 -32 150 -2 Q 154 22 128 28 Q 110 30 104 14 Q 100 0 110 -22 Z" fill="${c}" opacity="0.18"/>
      <path d="M 110 -22 Q 144 -32 150 -2 Q 154 22 128 28 Q 110 30 104 14 Q 100 0 110 -22 Z" fill="none" stroke="${c}" stroke-width="2.2" opacity="0.9"/>
      <path d="M 124 -8 Q 138 -4 138 8" fill="none" stroke="${c}" stroke-width="1.2" opacity="0.6"/>
      <!-- Sound ripples emanating from conch -->
      <path d="M 160 -2 Q 174 -2 180 12" fill="none" stroke="${c}" stroke-width="1.4" opacity="0.55"/>
      <path d="M 168 -10 Q 188 -8 196 12" fill="none" stroke="${c}" stroke-width="1.2" opacity="0.4"/>
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
