/* © Céline Bourbon — Méthode V.A.L.E.U.R© — Tous droits réservés */
/* Basé sur "De la peur à la joie d'être soi" — Éditions L'Harmattan */
/* Reproduction interdite */
;(function () {
  'use strict';

  var DATA = {
    rouge: {
      emoji: '🔴',
      nom: 'Masque Rouge',
      couleur: '#EF4444',
      tagline: 'Vous espionnez votre propre corps.',
      peur: 'Peur de la mort / de la maladie',
      manif: 'Surveiller chaque signal corporel, consulter internet avant le médecin, éviter ce qui rappelle la mort',
      aspiration: 'Confiance dans la sagesse de votre corps — présence complète, ici, maintenant, vivant·e',
      mirror: 'Et si votre corps n\'était pas votre ennemi — mais le seul endroit où votre peur a trouvé à s\'exprimer ?'
    },
    orange: {
      emoji: '🟠',
      nom: 'Masque Orange',
      couleur: '#F97316',
      tagline: 'Vous êtes fort·e pour les autres — mais vous fuyez vos propres émotions.',
      peur: 'Peur de la douleur / de la souffrance',
      manif: 'Changer de sujet, rendre service, fuir — tout plutôt que de ressentir jusqu\'au bout',
      aspiration: 'Ouverture émotionnelle authentique — la force de la vraie vulnérabilité, un accès à votre vitalité intérieure',
      mirror: 'Et si la force que vous montrez au monde était la cage que vous avez construite pour ne plus jamais souffrir ?'
    },
    jaune: {
      emoji: '🟡',
      nom: 'Masque Jaune',
      couleur: '#EAB308',
      tagline: 'L\'imprévu vous angoisse. Vous devez tout maîtriser.',
      peur: 'Peur de l\'inconnu / de l\'incertitude',
      manif: 'Sur-planifier, tout anticiper, poser des questions excessives, ne pas supporter les imprévus',
      aspiration: 'La confiance dans la vie — exister sans tout contrôler, la paix dans l\'incertitude',
      mirror: 'Et si le contrôle que vous exercez sur tout ne vous protégeait pas du danger — mais vous privait de la vie ?'
    },
    vert: {
      emoji: '🟢',
      nom: 'Masque Vert',
      couleur: '#22C55E',
      tagline: 'Vous vous adaptez à tout le monde sauf à vous-même.',
      peur: 'Peur du rejet / de l\'abandon',
      manif: 'Dire oui, s\'effacer, chercher à plaire et à réparer — disparaître pour rester aimé·e',
      aspiration: 'Des relations fondées sur la vérité — être aimé·e tel·le que vous êtes vraiment',
      mirror: 'Et si la peur d\'être quitté·e vous faisait disparaître avant même que l\'autre parte ?'
    },
    bleu: {
      emoji: '🔵',
      nom: 'Masque Bleu',
      couleur: '#3B82F6',
      tagline: 'Vous ne pouvez pas vous permettre de montrer votre faiblesse.',
      peur: 'Peur de l\'impuissance / de perdre le contrôle',
      manif: 'Diriger, tout porter seul·e, déléguer est impossible — l\'armure vous isole de l\'aide',
      aspiration: 'L\'interdépendance — donner ET recevoir, une force qui vient de l\'intérieur, pas de la maîtrise',
      mirror: 'Et si votre force était devenue la prison qui vous empêche de vraiment recevoir l\'amour que vous méritez ?'
    },
    indigo: {
      emoji: '🟣',
      nom: 'Masque Indigo',
      couleur: '#8B5CF6',
      tagline: 'Parfait — ou rien.',
      peur: 'Peur de l\'échec / de l\'inadéquation',
      manif: 'Remettre à plus tard, ne pas commencer, se juger sévèrement — la barre si haute qu\'elle paralyse',
      aspiration: 'Créer librement, sans se condamner — votre valeur ne dépend pas de vos performances',
      mirror: 'Qu\'avez-vous abandonné ou jamais commencé, par peur de ne pas être assez bon·ne ?'
    },
    violet: {
      emoji: '💜',
      nom: 'Masque Violet',
      couleur: '#D946EF',
      tagline: 'Qui êtes-vous sans vos rôles ?',
      peur: 'Peur de perdre son identité',
      manif: 'S\'accrocher aux rôles connus même devenus trop étroits — le changement terrorise',
      aspiration: 'Découvrir qui vous êtes vraiment sous les rôles — une identité plus profonde que tout',
      mirror: 'Vous avez déjà traversé des changements — et vous êtes encore vous. Votre identité est plus profonde que vos rôles.'
    }
  };

  function setText(id, val) {
    var el = document.getElementById(id);
    if (el) el.textContent = val;
  }

  function generateCarteMasques() {
    if (typeof ValeurCore === 'undefined') return;

    var id = ValeurCore.getActiveMasque();
    if (!id || !DATA[id]) return;

    var d = DATA[id];

    /* Couleur dynamique sur la section */
    var section = document.querySelector('.carte-section');
    if (section) section.style.setProperty('--cm-color', d.couleur);

    /* Remplissage des champs */
    setText('cm-emoji',      d.emoji);
    setText('cm-nom',        d.nom);
    setText('cm-tagline',    d.tagline);
    setText('cm-peur',       d.peur);
    setText('cm-manif',      d.manif);
    setText('cm-aspiration', d.aspiration);
    setText('cm-mirror',     d.mirror);

    /* Couleur du nom */
    var nom = document.getElementById('cm-nom');
    if (nom) {
      nom.style.color = d.couleur;
      nom.style.textShadow = '0 0 40px ' + d.couleur;
    }

    /* Bordures et labels colorés */
    document.querySelectorAll('.cm-row').forEach(function (el) {
      el.style.borderLeftColor = d.couleur;
    });
    document.querySelectorAll('.cm-row-label').forEach(function (el) {
      el.style.color = d.couleur;
    });

    /* Affichage */
    var sans = document.getElementById('carte-sans-data');
    var avec = document.getElementById('carte-avec-data');
    if (sans) sans.style.display = 'none';
    if (avec) avec.style.display = 'block';
  }

  window.generateCarteMasques = generateCarteMasques;

})();
