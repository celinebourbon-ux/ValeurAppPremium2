/* © Céline Bourbon — Méthode V.A.L.E.U.R© */
;(function() {
'use strict';

class JournalManager {
  static entries = [];
  static PAGE_SIZE = 15;
  static currentPage = 0;

  static init() {
    this.entries = ValeurCore.load('journal', []);

    // FAB
    const fab = document.getElementById('fab-journal');
    if (fab) fab.addEventListener('click', () => this.openModal());

    // Quick form (modal)
    const quickForm = document.getElementById('quick-journal-form');
    if (quickForm) quickForm.addEventListener('submit', e => this.saveEntry(e));

    // Full form (journal.html)
    const fullForm = document.getElementById('journal-form-full');
    if (fullForm) fullForm.addEventListener('submit', e => this.saveEntry(e));

    // Filters
    ['filter-masque','filter-period'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('change', () => this.renderEntries(true));
    });

    // Load more
    const loadMore = document.getElementById('load-more');
    if (loadMore) loadMore.addEventListener('click', () => this.loadMoreEntries());

    // Init timestamp
    const ts = document.getElementById('timestamp-input');
    if (ts) ts.value = new Date().toISOString().slice(0,16);

    this.updateStats();
    this.renderEntries(true);
  }

  static openModal() {
    const modal = document.getElementById('journal-modal');
    if (modal) {
      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    }
  }

  static closeModal() {
    const modal = document.getElementById('journal-modal');
    if (modal) {
      modal.style.display = 'none';
      document.body.style.overflow = '';
    }
  }

  static saveEntry(e) {
    e.preventDefault();
    const fd = new FormData(e.target);

    const entry = {
      id: Date.now(),
      timestamp: fd.get('timestamp') || new Date().toISOString(),
      masque: fd.get('masque'),
      V: fd.get('V') || '',
      A: fd.get('A') || '',
      L: fd.get('L') || '',
      E: fd.get('E') || '',
      U: fd.get('U') || '',
      R: fd.get('R') || ''
    };

    if (!entry.masque) { ValeurCore.showToast('⚠️ Choisissez un masque !'); return; }

    this.entries.unshift(entry);
    ValeurCore.save('journal', this.entries);

    this.renderEntries(true);
    this.updateStats();

    e.target.reset();
    const ts = e.target.querySelector('[name="timestamp"]');
    if (ts) ts.value = new Date().toISOString().slice(0,16);

    this.closeModal();
    ValeurCore.showToast('✨ Entrée sauvegardée');

    // Progress check & confetti milestone
    const total = this.entries.length;
    if ([1,5,10,20,30,50].includes(total)) {
      setTimeout(() => {
        ValeurCore.launchConfetti();
        ValeurCore.showToast(`🎉 ${total} entrée${total>1?'s':''} ! Bravo pour votre engagement !`, 4000);
      }, 500);
    }

    // Refresh dashboard elements if present
    if (typeof refreshDashboard === 'function') refreshDashboard();
    if (typeof generateCarteMasques === 'function') generateCarteMasques();
  }

  static getFiltered() {
    const filterMasque = document.getElementById('filter-masque')?.value || '';
    const filterPeriod = parseInt(document.getElementById('filter-period')?.value) || 0;

    let filtered = [...this.entries];

    if (filterMasque) filtered = filtered.filter(e => e.masque === filterMasque);

    if (filterPeriod) {
      const cutoff = Date.now() - filterPeriod * 24 * 60 * 60 * 1000;
      filtered = filtered.filter(e => new Date(e.timestamp).getTime() > cutoff);
    }

    return filtered;
  }

  static renderEntries(reset = false) {
    const container = document.getElementById('entries-list');
    if (!container) return;

    if (reset) this.currentPage = 0;

    const filtered = this.getFiltered();
    const start = 0;
    const end = (this.currentPage + 1) * this.PAGE_SIZE;
    const toShow = filtered.slice(start, end);

    // Count
    const countEl = document.getElementById('entries-count');
    if (countEl) countEl.textContent = filtered.length;

    if (toShow.length === 0) {
      container.innerHTML = `
        <div style="text-align:center; padding: 3rem 1rem; color: var(--text-muted);">
          <p style="font-size: 2rem; margin-bottom: 1rem;">📭</p>
          <p>Aucune entrée pour ces critères.<br>Commencez à observer vos masques !</p>
        </div>`;
      const lb = document.getElementById('load-more');
      if (lb) lb.style.display = 'none';
      return;
    }

    container.innerHTML = toShow.map(entry => this.renderEntryCard(entry)).join('');

    const lb = document.getElementById('load-more');
    if (lb) lb.style.display = filtered.length > end ? 'block' : 'none';
  }

  static renderEntryCard(entry) {
    const cfg = ValeurCore.config.masques[entry.masque] || {};
    const date = new Date(entry.timestamp);
    const dateStr = date.toLocaleDateString('fr-FR', {day:'2-digit', month:'short', year:'numeric'});
    const timeStr = date.toLocaleTimeString('fr-FR', {hour:'2-digit', minute:'2-digit'});

    return `
      <div class="entry-card glass-card">
        <div class="entry-header">
          <span class="entry-masque-tag" style="color:${cfg.couleur || '#C9A84C'}; border-color:${cfg.couleur || '#C9A84C'}40;">
            ${cfg.emoji || '❓'} ${cfg.peur || entry.masque}
          </span>
          <span class="entry-date">${dateStr} · ${timeStr}</span>
        </div>
        <div class="entry-content">
          ${entry.V ? `<p><strong>V</strong> ${entry.V.substring(0,120)}${entry.V.length>120?'…':''}</p>` : ''}
          ${entry.A ? `<p><strong>A</strong> ${entry.A.substring(0,100)}${entry.A.length>100?'…':''}</p>` : ''}
          ${entry.E ? `<p><strong>E</strong> ${entry.E.substring(0,100)}${entry.E.length>100?'…':''}</p>` : ''}
        </div>
      </div>`;
  }

  static loadMoreEntries() {
    this.currentPage++;
    this.renderEntries(false);
  }

  static updateStats() {
    const totalEl = document.getElementById('total-entries');
    if (totalEl) totalEl.textContent = this.entries.length;

    // Streak
    const dates = [...new Set(this.entries.map(e => new Date(e.timestamp).toDateString()))];
    let streak = 0;
    const today = new Date().toDateString();
    if (dates.includes(today)) {
      streak = 1;
      let prev = new Date();
      prev.setDate(prev.getDate() - 1);
      while (dates.includes(prev.toDateString())) {
        streak++;
        prev.setDate(prev.getDate() - 1);
      }
    }
    const streakEl = document.getElementById('streak-days');
    if (streakEl) streakEl.textContent = streak;

    // Most active mask
    const counts = {};
    this.entries.forEach(e => { if (e.masque) counts[e.masque] = (counts[e.masque] || 0) + 1; });
    const sorted = Object.entries(counts).sort((a,b) => b[1] - a[1]);
    const mostActiveEl = document.getElementById('most-active-mask');
    if (mostActiveEl) {
      if (sorted.length) {
        const cfg = ValeurCore.config.masques[sorted[0][0]];
        mostActiveEl.textContent = `${cfg?.emoji || ''} ${cfg?.peur || sorted[0][0]}`;
      } else {
        mostActiveEl.textContent = '—';
      }
    }
  }

  static quickEntry() { this.openModal(); }
}

window.JournalManager = JournalManager;
window.closeJournalModal = () => JournalManager.closeModal();
})();
