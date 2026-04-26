// Faint psychedelic geometric shapes drifting in the background.
// Injected once per page; positioned/animated by CSS in styles.css.
(function () {
  if (document.querySelector('.cosmos-shapes')) return;

  const SHAPES_HTML = `
    <svg class="cosmos-shape s-1" viewBox="0 0 100 100" aria-hidden="true">
      <polygon points="50,10 90,90 10,90" fill="none" stroke="currentColor" stroke-width="1.4"/>
      <circle cx="50" cy="62" r="14" fill="none" stroke="currentColor" stroke-width="1.2"/>
      <circle cx="50" cy="62" r="4" fill="currentColor"/>
    </svg>

    <svg class="cosmos-shape s-2" viewBox="0 0 100 100" aria-hidden="true">
      <g fill="none" stroke="currentColor" stroke-width="1.1">
        <circle cx="50" cy="50" r="14"/>
        <circle cx="50" cy="36" r="14"/>
        <circle cx="50" cy="64" r="14"/>
        <circle cx="38" cy="43" r="14"/>
        <circle cx="62" cy="43" r="14"/>
        <circle cx="38" cy="57" r="14"/>
        <circle cx="62" cy="57" r="14"/>
        <circle cx="50" cy="50" r="28"/>
      </g>
    </svg>

    <svg class="cosmos-shape s-3" viewBox="0 0 100 100" aria-hidden="true">
      <polygon points="50,8 90,75 10,75" fill="none" stroke="currentColor" stroke-width="1.3"/>
      <polygon points="50,92 90,25 10,25" fill="none" stroke="currentColor" stroke-width="1.3"/>
    </svg>

    <svg class="cosmos-shape s-4" viewBox="0 0 100 100" aria-hidden="true">
      <path d="M50,50 m0,-34 a34,34 0 1,1 -34,34 a22,22 0 1,1 22,-22 a14,14 0 1,1 -14,14 a8,8 0 1,1 8,-8" fill="none" stroke="currentColor" stroke-width="1.4"/>
    </svg>

    <svg class="cosmos-shape s-5" viewBox="0 0 100 100" aria-hidden="true">
      <g fill="none" stroke="currentColor" stroke-width="1.2">
        <circle cx="50" cy="50" r="11"/>
        <line x1="50" y1="22" x2="50" y2="6"/>
        <line x1="50" y1="78" x2="50" y2="94"/>
        <line x1="22" y1="50" x2="6"  y2="50"/>
        <line x1="78" y1="50" x2="94" y2="50"/>
        <line x1="30" y1="30" x2="14" y2="14"/>
        <line x1="70" y1="30" x2="86" y2="14"/>
        <line x1="30" y1="70" x2="14" y2="86"/>
        <line x1="70" y1="70" x2="86" y2="86"/>
      </g>
    </svg>

    <svg class="cosmos-shape s-6" viewBox="0 0 100 100" aria-hidden="true">
      <g fill="none" stroke="currentColor" stroke-width="1.1">
        <circle cx="50" cy="50" r="40"/>
        <circle cx="50" cy="50" r="26"/>
        <line x1="10" y1="50" x2="90" y2="50"/>
        <line x1="50" y1="10" x2="50" y2="90"/>
        <line x1="22" y1="22" x2="78" y2="78"/>
        <line x1="78" y1="22" x2="22" y2="78"/>
      </g>
    </svg>

    <svg class="cosmos-shape s-7" viewBox="0 0 100 100" aria-hidden="true">
      <g fill="none" stroke="currentColor" stroke-width="1.2">
        <polygon points="50,10 80,28 80,72 50,90 20,72 20,28"/>
        <polygon points="50,25 70,37 70,63 50,75 30,63 30,37"/>
      </g>
    </svg>

    <svg class="cosmos-shape s-8" viewBox="0 0 100 100" aria-hidden="true">
      <g fill="none" stroke="currentColor" stroke-width="1.1">
        <path d="M20,50 Q35,30 50,50 T80,50"/>
        <path d="M20,60 Q35,40 50,60 T80,60"/>
        <path d="M20,40 Q35,20 50,40 T80,40"/>
        <path d="M20,70 Q35,50 50,70 T80,70"/>
      </g>
    </svg>

    <svg class="cosmos-shape s-9" viewBox="0 0 100 100" aria-hidden="true">
      <g fill="none" stroke="currentColor" stroke-width="1.1">
        <ellipse cx="50" cy="50" rx="42" ry="14"/>
        <ellipse cx="50" cy="50" rx="42" ry="14" transform="rotate(60 50 50)"/>
        <ellipse cx="50" cy="50" rx="42" ry="14" transform="rotate(120 50 50)"/>
        <circle cx="50" cy="50" r="6"/>
      </g>
    </svg>
  `;

  const wrap = document.createElement('div');
  wrap.className = 'cosmos-shapes';
  wrap.setAttribute('aria-hidden', 'true');
  wrap.innerHTML = SHAPES_HTML;

  const stars = document.createElement('div');
  stars.className = 'cosmos-stars';
  stars.setAttribute('aria-hidden', 'true');

  const ribbon = document.createElement('div');
  ribbon.className = 'cosmos-ribbon';
  ribbon.setAttribute('aria-hidden', 'true');

  // Insert behind everything (z-index handled by CSS)
  document.body.insertBefore(stars,  document.body.firstChild);
  document.body.insertBefore(ribbon, document.body.firstChild);
  document.body.insertBefore(wrap,   document.body.firstChild);
})();
