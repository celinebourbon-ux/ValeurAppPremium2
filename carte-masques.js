/* © Céline Bourbon — Méthode V.A.L.E.U.R© */
;(function() {
'use strict';

const MASQUES_RINGS = [
  { id: 'violet', r: 256, couleur: '#D946EF', strokeW: 18 },
  { id: 'indigo', r: 224, couleur: '#8B5CF6', strokeW: 18 },
  { id: 'bleu',   r: 192, couleur: '#3B82F6', strokeW: 18 },
  { id: 'vert',   r: 160, couleur: '#22C55E', strokeW: 18 },
  { id: 'jaune',  r: 128, couleur: '#EAB308', strokeW: 18 },
  { id: 'orange', r: 96,  couleur: '#F97316', strokeW: 18 },
  { id: 'rouge',  r: 64,  couleur: '#EF4444', strokeW: 18 }
];

function generateCarteMasques() {
  const svg = document.getElementById('carte-masques');
  if (!svg) return;

  const cx = 300, cy = 300;
  const stats = ValeurCore.getMasqueStats();
  const maxCount = Math.max(...Object.values(stats), 1);

  const defs = `
    <defs>
      <radialGradient id="grad-nature" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#FFFFFF" stop-opacity="1"/>
        <stop offset="60%" stop-color="#F5E6B8" stop-opacity="0.9"/>
        <stop offset="100%" stop-color="#C9A84C" stop-opacity="0.6"/>
      </radialGradient>
      <filter id="glow-nature">
        <feGaussianBlur stdDeviation="8" result="blur"/>
        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      ${MASQUES_RINGS.map(m => `
        <filter id="glow-${m.id}">
          <feGaussianBlur stdDeviation="4" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      `).join('')}
    </defs>`;

  const rings = MASQUES_RINGS.map((m, i) => {
    const count = stats[m.id] || 0;
    const score = count / maxCount;
    const circumference = 2 * Math.PI * m.r;
    // score = 0 → full dashoffset (ring hidden), score = 1 → offset 0 (ring visible)
    const progressFilled = circumference * score;
    const progressEmpty = circumference - progressFilled;
    const baseOpacity = 0.15 + (1 - score) * 0.7;
    const duration = 28 + i * 3;
    const fillOpacity = 0.04 + score * 0.06;

    return `
      <!-- Background circle dim -->
      <circle cx="${cx}" cy="${cy}" r="${m.r}"
        stroke="${m.couleur}" stroke-width="${m.strokeW}"
        fill="none" opacity="0.06" stroke-dasharray="4 8"/>

      <!-- Background fill -->
      <circle cx="${cx}" cy="${cy}" r="${m.r}"
        stroke="none" fill="${m.couleur}" fill-opacity="${fillOpacity}"/>

      <!-- Progress ring (spinning) -->
      <circle class="mask-ring mask-${m.id}" cx="${cx}" cy="${cy}" r="${m.r}"
        stroke="${m.couleur}" stroke-width="${m.strokeW + 4}"
        fill="none"
        stroke-dasharray="${progressFilled} ${circumference}"
        stroke-dashoffset="0"
        stroke-linecap="round"
        opacity="${baseOpacity}"
        filter="url(#glow-${m.id})"
        data-masque="${m.id}" data-count="${count}" data-score="${Math.round(score * 100)}">
        <animateTransform attributeName="transform" type="rotate"
          values="0 ${cx} ${cy};360 ${cx} ${cy}"
          dur="${duration}s" repeatCount="indefinite"/>
      </circle>
    `;
  }).join('');

  // Centre SOI pulsing
  const centre = `
    <circle cx="${cx}" cy="${cy}" r="46" fill="url(#grad-nature)" filter="url(#glow-nature)" opacity="0.95">
      <animate attributeName="r" values="44;52;44" dur="4s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values="0.85;1;0.85" dur="4s" repeatCount="indefinite"/>
    </circle>
    <text x="${cx}" y="${cy - 4}" text-anchor="middle" dominant-baseline="middle"
      fill="#07091A" font-family="Cormorant Garamond, Georgia, serif"
      font-size="15" font-weight="700" letter-spacing="3">SOI</text>
    <text x="${cx}" y="${cy + 14}" text-anchor="middle" dominant-baseline="middle"
      fill="#07091A" font-family="Cormorant Garamond, Georgia, serif"
      font-size="9" font-weight="400" letter-spacing="1.5" opacity="0.8">nature authentique</text>
  `;

  svg.innerHTML = defs + rings + centre;

  // Légende
  const legendEl = document.getElementById('masques-legend');
  if (legendEl) {
    legendEl.innerHTML = MASQUES_RINGS.slice().reverse().map(m => {
      const cfg = ValeurCore.config.masques[m.id];
      const count = stats[m.id] || 0;
      const pct = maxCount > 0 ? Math.round((count / maxCount) * 100) : 0;
      return `
        <div class="legend-item">
          <span class="legend-emoji">${cfg.emoji}</span>
          <div class="legend-text">
            <strong>${cfg.peur}</strong>
            <small>${count} entrée${count !== 1 ? 's' : ''} — ${pct}% travaillé</small>
          </div>
        </div>`;
    }).join('');
  }

  // Tooltips
  svg.querySelectorAll('.mask-ring').forEach(ring => {
    ring.style.cursor = 'pointer';
    ring.addEventListener('mouseenter', () => {
      ring.style.filter = 'brightness(1.5)';
    });
    ring.addEventListener('mouseleave', () => {
      ring.style.filter = '';
    });
  });
}

window.generateCarteMasques = generateCarteMasques;
})();
