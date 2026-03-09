/* © Céline Bourbon — Méthode V.A.L.E.U.R© — Tous droits réservés */
;(function() {
'use strict';

class ValeurCore {
  static config = {
    masques: {
      rouge:  { couleur: '#EF4444', emoji: '🔴', peur: 'Mort / Maladie',        valeur: 'Sécurité intérieure',    manifestation: 'Hypervigilance somatique'  },
      orange: { couleur: '#F97316', emoji: '🟠', peur: 'Souffrance psychique',   valeur: 'Accueil émotionnel',     manifestation: 'Évitement émotionnel'      },
      jaune:  { couleur: '#EAB308', emoji: '🟡', peur: 'Inconnu / Incertitude',  valeur: 'Confiance au présent',   manifestation: 'Obsession de contrôle'     },
      vert:   { couleur: '#22C55E', emoji: '🟢', peur: 'Rejet / Abandon',        valeur: 'Authenticité relationnelle', manifestation: 'Insécurité relationnelle' },
      bleu:   { couleur: '#3B82F6', emoji: '🔵', peur: 'Impuissance',            valeur: 'Affirmation consciente', manifestation: 'Hypercontrôle relationnel' },
      indigo: { couleur: '#8B5CF6', emoji: '🟣', peur: 'Échec / Inadéquation',   valeur: 'Audace créatrice',       manifestation: 'Anxiété de performance'    },
      violet: { couleur: '#D946EF', emoji: '💜', peur: 'Perte d\'identité',      valeur: 'Fluidité identitaire',   manifestation: 'Angoisse existentielle'    }
    },
    phases: [
      { key: 'V', nom: 'VOIR',       desc: 'Identifier le masque actif et le déclencheur' },
      { key: 'A', nom: 'ACCUEILLIR', desc: 'Recevoir l\'émotion sans la fuir'              },
      { key: 'L', nom: 'LOCALISER',  desc: 'Trouver où ça se manifeste dans le corps'      },
      { key: 'E', nom: 'EXPLORER',   desc: 'Explorer le conflit intérieur profond'         },
      { key: 'U', nom: 'UNIFIER',    desc: 'Réconcilier les parties en conflit'            },
      { key: 'R', nom: 'RENFORCER',  desc: 'Ancrer la nouvelle posture consciente'         }
    ]
  };

  static save(key, data) {
    try { localStorage.setItem('valeur-' + key, JSON.stringify(data)); } catch(e) {}
  }

  static load(key, fallback) {
    try {
      const d = localStorage.getItem('valeur-' + key);
      return d ? JSON.parse(d) : (fallback !== undefined ? fallback : []);
    } catch(e) { return fallback !== undefined ? fallback : []; }
  }

  static updateProgressBar(pct) {
    const bar = document.getElementById('progress-bar');
    if (bar) bar.style.transform = 'scaleX(' + Math.min(pct / 100, 1) + ')';
  }

  static calculateNatureScore() {
    const journal = this.load('journal', []);
    if (!journal.length) return 0;
    const uniqueMasques = new Set(journal.map(e => e.masque)).size;
    const baseScore = Math.min(journal.length * 2.5, 70);
    const diversityBonus = uniqueMasques * 4.3;
    return Math.round(Math.min(baseScore + diversityBonus, 100));
  }

  static getCurrentPhase() {
    const score = this.calculateNatureScore();
    const idx = Math.min(Math.floor(score / 17), 5);
    return { index: idx, ...this.config.phases[idx] };
  }

  static getMasqueStats() {
    const journal = this.load('journal', []);
    const counts = {};
    journal.forEach(e => { if (e.masque) counts[e.masque] = (counts[e.masque] || 0) + 1; });
    return counts;
  }

  static getActiveMasque() {
    const stats = this.getMasqueStats();
    const entries = Object.entries(stats);
    if (!entries.length) return null;
    return entries.sort((a,b) => b[1] - a[1])[0][0];
  }

  static showToast(msg, duration = 3000) {
    let t = document.getElementById('global-toast');
    if (!t) {
      t = document.createElement('div');
      t.id = 'global-toast';
      t.className = 'toast';
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), duration);
  }

  static launchConfetti() {
    let canvas = document.getElementById('confetti-canvas');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.id = 'confetti-canvas';
      document.body.appendChild(canvas);
    }
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext('2d');
    const colors = ['#C9A84C','#E8CC82','#EF4444','#F97316','#EAB308','#22C55E','#3B82F6','#8B5CF6','#D946EF'];
    const particles = Array.from({length: 140}, () => ({
      x: Math.random() * canvas.width,
      y: -10,
      r: Math.random() * 8 + 4,
      d: Math.random() * 6 + 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      tilt: Math.random() * 30 - 15,
      tiltAngle: 0,
      tiltSpeed: Math.random() * 0.06 + 0.02
    }));
    let frame = 0;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.tiltAngle += p.tiltSpeed;
        p.y += (Math.cos(p.tiltAngle) + p.d);
        p.x += Math.sin(frame / 20) * 1.2;
        p.tilt = Math.sin(p.tiltAngle) * 15;
        ctx.beginPath();
        ctx.fillStyle = p.color;
        ctx.globalAlpha = 0.85;
        ctx.moveTo(p.x + p.tilt + p.r / 2, p.y);
        ctx.lineTo(p.x + p.tilt, p.y + p.r - 1);
        ctx.lineTo(p.x + p.tilt - p.r / 2, p.y);
        ctx.closePath();
        ctx.fill();
      });
      ctx.globalAlpha = 1;
      frame++;
      if (frame < 220) requestAnimationFrame(animate);
      else ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
    requestAnimationFrame(animate);
  }
}

// Anti-copy protection
document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('keydown', e => {
  if ((e.ctrlKey || e.metaKey) && ['c','x','u','s','p'].includes(e.key.toLowerCase())) e.preventDefault();
  if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && ['i','j'].includes(e.key.toLowerCase()))) e.preventDefault();
});
document.addEventListener('selectstart', e => {
  if (!e.target.matches('input,textarea,select')) e.preventDefault();
});

window.ValeurCore = ValeurCore;
})();
