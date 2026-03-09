/* © Céline Bourbon — Méthode V.A.L.E.U.R© */
document.addEventListener('DOMContentLoaded', () => {
  JournalManager.init();
  generateCarteMasques();
  refreshDashboard();

  // Hamburger
  const ham = document.getElementById('hamburger');
  const nav = document.getElementById('nav-menu');
  if (ham && nav) {
    ham.addEventListener('click', () => {
      ham.classList.toggle('active');
      nav.classList.toggle('active');
    });
    document.addEventListener('click', e => {
      if (!ham.contains(e.target) && !nav.contains(e.target)) {
        ham.classList.remove('active');
        nav.classList.remove('active');
      }
    });
  }

  // Scroll progress bar
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY / (document.body.scrollHeight - window.innerHeight);
    ValeurCore.updateProgressBar(scrolled * 100);
  });
});

function refreshDashboard() {
  const score = ValeurCore.calculateNatureScore();
  const phase = ValeurCore.getCurrentPhase();
  const journal = ValeurCore.load('journal', []);

  // Stats
  const natureEl = document.getElementById('nature-score');
  if (natureEl) natureEl.textContent = score + '%';

  const phaseEl = document.getElementById('phase-actuelle');
  if (phaseEl) phaseEl.textContent = (phase.index + 1) + ' / 6';

  const masqueActif = ValeurCore.getActiveMasque();
  const masqueEl = document.getElementById('masque-actif');
  if (masqueEl) {
    if (masqueActif) {
      const cfg = ValeurCore.config.masques[masqueActif];
      masqueEl.textContent = cfg.emoji;
      masqueEl.title = cfg.peur;
    } else {
      masqueEl.textContent = '✨';
    }
  }

  // Phase title & defi
  const phaseTitreEl = document.getElementById('phase-titre');
  if (phaseTitreEl) phaseTitreEl.textContent = phase.nom + ' — ' + phase.desc;

  const defiEl = document.getElementById('defi-jour');
  if (defiEl) {
    if (journal.length === 0) {
      defiEl.textContent = 'Commencez par le questionnaire pour découvrir vos masques dominants.';
    } else {
      const defis = [
        'Observez quel masque se présente aujourd\'hui. Nommez-le sans le juger.',
        'Repérez un déclencheur aujourd\'hui. Quelle peur se cache derrière ?',
        'Localisez l\'émotion dans votre corps avant de la nommer.',
        'Identifiez un conflit entre un masque et votre nature profonde.',
        'Choisissez une action consciente plutôt que réactionnelle.',
        'Ancrez une nouvelle posture avec un geste, un mot, une respiration.'
      ];
      defiEl.textContent = '💡 ' + defis[phase.index];
    }
  }

  // Module link
  const moduleLink = document.getElementById('module-link');
  if (moduleLink) {
    const modules = ['module-0.html', 'module-v.html', 'module-a.html', 'module-l.html', 'module-e.html', 'module-u.html', 'module-r.html'];
    moduleLink.href = modules[Math.min(phase.index, modules.length - 1)] || 'module-0.html';
    moduleLink.textContent = journal.length === 0 ? 'Découvrir la méthode →' : `Module ${phase.nom} →`;
  }

  // Recent journal entries
  const recentEl = document.getElementById('journal-recent');
  if (recentEl) {
    const recent = journal.slice(0, 3);
    if (!recent.length) {
      recentEl.innerHTML = `<p style="text-align:center;opacity:0.5;font-style:italic;padding:1rem 0;">
        Aucune entrée encore. Faites le questionnaire, puis revenez observer vos masques.
      </p>`;
    } else {
      recentEl.innerHTML = recent.map(e => {
        const cfg = ValeurCore.config.masques[e.masque] || {};
        const d = new Date(e.timestamp).toLocaleDateString('fr-FR', {day:'2-digit', month:'short'});
        return `<div class="journal-preview-item">
          ${cfg.emoji || '?'} <strong>${d}</strong> — ${(e.V || e.A || '...').substring(0, 90)}…
        </div>`;
      }).join('');
    }
  }
}

window.refreshDashboard = refreshDashboard;
