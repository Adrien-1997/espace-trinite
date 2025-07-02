/* -------------------------------------------------
   MINI-ASSISTANT « Trouve ta salle idéale »
   — version complète, centrée et verrouillant le scroll
--------------------------------------------------*/
document.addEventListener("DOMContentLoaded", () => {

  /* =========  Sélecteurs  ========= */
  const toggleButtons = document.querySelectorAll(".assistant-toggle");
  const overlay      = document.getElementById("assistant-overlay");
  const cancelBtn    = document.getElementById("assistant-cancel");
  const submitBtn    = document.getElementById("assistant-submit");
  const resultBlock  = document.getElementById("assistant-result");

  const eventType    = document.getElementById("eventType");
  const participants = document.getElementById("participants");
  const duration     = document.getElementById("duration");
  const pmrCheck     = document.getElementById("pmr");


if (!toggleButtons.length || !overlay) {
  console.warn("Aucun bouton assistant ou overlay manquant");
  return;
}


  /* =========  Données salles  ========= */
  const rooms = [
    {
      id: "bruyere",
      name: "Salle La Bruyère",
      max: 60, min: 10, pmr: true,
      eventTypes: ["reunion", "conference", "dejeuner"],
      pricing: { heure: 200, demi: 580, journee: 800 }
    },
    {
      id: "goursat",
      name: "Salle Pierre Goursat",
      max: 60, min: 10, pmr: true,
      eventTypes: ["reunion", "conference", "dejeuner", "cocktail"],
      pricing: { heure: 150, demi: 460, journee: 640 }
    },
    {
      id: "orves",
      name: "Salle Estienne d'Orves",
      max: 25, min: 6, pmr: true,
      eventTypes: ["reunion", "conference"],
      pricing: { heure: 140, demi: 405, journee: 580 }
    },
    {
      id: "messiaen",
      name: "Salle Olivier Messiaen",
      max: 65, min: 20, pmr: false,
      eventTypes: ["conference", "dejeuner"],
      pricing: { heure: 190, demi: 540, journee: 740 }
    }
  ];

  /* =========  Helpers  ========= */
  let pageScrollY = 0; // ↙︎ mémorisera la position

  const openAssistant = () => {
    pageScrollY = window.pageYOffset || document.documentElement.scrollTop;
    // fige la page au scroll actuel
    document.documentElement.classList.add("no-scroll");
    document.body.classList.add("no-scroll");
    document.body.style.top = `-${pageScrollY}px`;

    overlay.style.display = "flex";
  };

  const closeAssistant = () => {
    overlay.style.display = "none";

    // retire le blocage
    document.documentElement.classList.remove("no-scroll");
    document.body.classList.remove("no-scroll");
    document.body.style.top = "";

    // remet la page là où elle était
    window.scrollTo(0, pageScrollY);
  };

  /*  Ferme au clic sur le fond sombre (mais pas si on clique dans le modal)  */
  overlay.addEventListener("click", (e) => {
    const clickedOutsideModal = !document.getElementById("assistant-modal").contains(e.target);
    if (clickedOutsideModal) {
      closeAssistant();
    }
  });

  // Toujours forcer la fermeture de l'overlay au chargement
  overlay.style.display = "none";
  document.body.classList.remove("no-scroll");
  document.documentElement.classList.remove("no-scroll");
  document.body.style.top = "";


  /* =========  Listeners (plusieurs boutons) ========= */
  toggleButtons.forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      openAssistant();
    });
  });

  cancelBtn.addEventListener("click", (e) => {
    e.preventDefault();
    closeAssistant();
  });

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeAssistant();
  });

  /* =========  Soumission du mini-formulaire  ========= */
  submitBtn.addEventListener("click", () => {

    /* ----- Réinitialisation du bloc résultat ----- */
    resultBlock.style.display = "none";
    resultBlock.className = "";

    /* ----- Lecture des valeurs saisies ----- */
    const type      = eventType.value;
    const nb        = parseInt(participants.value, 10) || 0;
    const wantPMR   = pmrCheck.checked;
    const dateStart = document.getElementById("dateStart")?.value;
    const dateEnd   = document.getElementById("dateEnd")?.value;

    /* ----- Filtrage des salles ----- */
    const matches = rooms.filter(r =>
      r.eventTypes.includes(type) &&
      nb >= r.min && nb <= r.max &&
      (!wantPMR || r.pmr)
    );

    if (!matches.length) {
      resultBlock.className = "result-empty";  // ajoute le fond noir
      resultBlock.innerHTML =
        "Aucune salle ne correspond exactement à votre besoin.<br>Contactez-nous pour une solution sur mesure.";
      resultBlock.style.display = "block";
      return;
    }

    /* ----- Classement par capacité la plus proche ----- */
    matches.sort((a, b) => (a.max - nb) - (b.max - nb));
    const best = matches[0];

    /* ----- Couleur de résultat ----- */
    const colorMap = {
      bruyere : "result-bruyere",
      goursat : "result-goursat",
      orves   : "result-orves",
      messiaen: "result-messiaen"
    };
    if (colorMap[best.id]) resultBlock.classList.add(colorMap[best.id]);

    /* ----- Libellés prix/durée ----- */


    // 1) Durée valide
    const dur = ["demi", "journee", "horaire"].includes(duration.value) ? duration.value : null;

    // 2) Libellé d’affichage
    const labelMap = { demi: "demi-journée", journee: "journée", horaire: "horaire" };
    const label    = dur ? labelMap[dur] : "durée non précisée";

    // 3) Clé de tarif dans l’objet pricing
    const priceKey = dur ? (dur === "horaire" ? "heure" : dur) : null;

    // 4) Prix affiché   <<-- AJOUTE CETTE LIGNE
    const price = priceKey ? `${best.pricing[priceKey]} € HT` : "sur devis";



    /* ----- Affichage résultat ----- */
    resultBlock.innerHTML = `
      <strong>${best.name}</strong><br>
      Capacité : jusqu’à ${best.max} pers.<br>
      Tarif ${label} : <strong>${price}</strong><br><br>
      <button id="devis-btn" class="btn btn-primary">Demander un devis</button>
    `;
    resultBlock.style.display = "block";

    /* ----- Pré-remplissage du formulaire de contact ----- */
    document.getElementById("devis-btn").addEventListener("click", () => {
      const pmrText = wantPMR ? "oui" : "non";

      const lignes = [
        "Bonjour,",
        "",
        "Je souhaite organiser un événement avec les critères suivants :",
        `- Type d’événement : ${type}`,
        `- Nombre de participants : ${nb}`,
        `- Durée : ${label}`,
        (dateStart && dateEnd) ? `- Période souhaitée : du ${dateStart} au ${dateEnd}` : null,
        `- Besoin d’accessibilité PMR : ${pmrText}`,
        "",
        "Pourriez-vous me faire une proposition adaptée ?",
        "Merci d’avance."
      ];

      const messageTxt = lignes.filter(Boolean).join("\n");

      const contactSection = document.getElementById("contact");
      const subjectField   = contactSection?.querySelector('input[placeholder*="Objet"], #contact-subject');
      const messageField   = contactSection?.querySelector('textarea, #contact-message');

      if (subjectField && messageField) {
        subjectField.value = "Demande de devis";
        messageField.value = messageTxt;
        contactSection.scrollIntoView({ behavior: "smooth" });
        closeAssistant();
      }
    }, { once: true }); // évite doublons
  });
});