document.addEventListener("DOMContentLoaded", () => {

  const toggleButtons = document.querySelectorAll(".assistant-toggle");
  const overlay       = document.getElementById("assistant-overlay");
  const cancelBtn     = document.getElementById("assistant-cancel");
  const submitBtn     = document.getElementById("assistant-submit");
  const resultBlock   = document.getElementById("assistant-result");

  const eventType     = document.getElementById("eventType");
  const participants  = document.getElementById("participants");
  const duration      = document.getElementById("duration");
  const pmrCheck      = document.getElementById("pmr");

  if (!toggleButtons.length || !overlay || !submitBtn || !eventType || !participants) {
    console.warn("Éléments requis manquants pour le mini-assistant");
    return;
  }

  /* =========  Données salles  ========= */
  const rooms = [
    {
      id: "messiaen",
      name: "Salle Olivier Messiaen",
      max: 65, min: 20, pmr: false,
      eventTypes: [
        { type: "conference", label: "Conférence",       capacity: 65 },
        { type: "reunion",    label: "Réunion en U",     capacity: 40 },
        { type: "classe",     label: "Salle de classe",  capacity: 38 }
      ],
      pricing: { heure: 190, demi: 540, journee: 740 }
    },
    {
      id: "bruyere",
      name: "Salle La Bruyère",
      max: 50, min: 10, pmr: true,
      eventTypes: [
        { type: "conference", label: "Conférence",       capacity: 50 },
        { type: "reunion",    label: "Réunion en U",     capacity: 30 },
        { type: "classe",     label: "Salle de classe",  capacity: 30 }
      ],
      pricing: { heure: 200, demi: 580, journee: 800 }
    },
    {
      id: "goursat",
      name: "Salle Pierre Goursat",
      max: 25, min: 10, pmr: true,
      eventTypes: [
        { type: "conference", label: "Conférence",       capacity: 25 },
        { type: "reunion",    label: "Réunion en U",     capacity: 18 },
        { type: "classe",     label: "Salle de classe",  capacity: 20 }
      ],
      pricing: { heure: 150, demi: 460, journee: 640 }
    },
    {
      id: "orves",
      name: "Salle Estienne d'Orves",
      max: 25, min: 6, pmr: true,
      eventTypes: [
        { type: "conference", label: "Conférence",       capacity: 25 },
        { type: "reunion",    label: "Réunion en U",     capacity: 16 },
        { type: "classe",     label: "Salle de classe",  capacity: 18 }
      ],
      pricing: { heure: 140, demi: 405, journee: 580 }
    }
  ];
  
  let pageScrollY = 0;

  const openAssistant = () => {
    pageScrollY = window.pageYOffset || document.documentElement.scrollTop;
    document.documentElement.classList.add("no-scroll");
    document.body.classList.add("no-scroll");
    document.body.style.top = `-${pageScrollY}px`;
    overlay.style.display = "flex";
  };

  const closeAssistant = () => {
    overlay.style.display = "none";
    document.documentElement.classList.remove("no-scroll");
    document.body.classList.remove("no-scroll");
    document.body.style.top = "";
    window.scrollTo(0, pageScrollY);
  };

  overlay.addEventListener("click", (e) => {
    const modal = document.getElementById("assistant-modal");
    if (!modal || !modal.contains(e.target)) closeAssistant();
  });

  overlay.style.display = "none";
  document.body.classList.remove("no-scroll");
  document.documentElement.classList.remove("no-scroll");
  document.body.style.top = "";

  toggleButtons.forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      openAssistant();
    });
  });

  cancelBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    closeAssistant();
  });

  submitBtn.addEventListener("click", () => {
    resultBlock.style.display = "none";
    resultBlock.className = "";

    const type = eventType.value;
    const nb = parseInt(participants.value, 10) || 0;
    const wantPMR = pmrCheck.checked;
    const dateStart = document.getElementById("dateStart")?.value;
    const dateEnd = document.getElementById("dateEnd")?.value;

    const matches = rooms.filter(r =>
      r.eventTypes.some(e => e.type === type) &&
      nb >= r.min && nb <= r.max &&
      (!wantPMR || r.pmr)
    );

    if (!matches.length) {
      resultBlock.className = "result-empty";
      resultBlock.innerHTML =
        "Aucune salle ne correspond exactement à votre besoin.<br>Contactez-nous pour une solution sur mesure.";
      resultBlock.style.display = "block";
      return;
    }

    matches.sort((a, b) => (a.max - nb) - (b.max - nb));
    const best = matches[0];

    const colorMap = {
      bruyere: "result-bruyere",
      goursat: "result-goursat",
      orves: "result-orves",
      messiaen: "result-messiaen"
    };
    if (colorMap[best.id]) resultBlock.classList.add(colorMap[best.id]);

    const dur = ["demi", "journee", "horaire"].includes(duration.value) ? duration.value : null;
    const labelMap = { demi: "demi-journée", journee: "journée", horaire: "horaire" };
    const label = dur ? labelMap[dur] : "durée non précisée";
    const priceKey = dur ? (dur === "horaire" ? "heure" : dur) : null;
    const price = priceKey ? `${best.pricing[priceKey]} € HT` : "sur devis";

    resultBlock.innerHTML = `
      <strong>${best.name}</strong><br>
      Capacité : jusqu’à ${best.max} pers.<br>
      Tarif ${label} : <strong>${price}</strong><br><br>
      <button id="devis-btn" class="btn btn-primary">Demander un devis</button>
    `;
    resultBlock.style.display = "block";

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
      const subjectField = contactSection?.querySelector('input[placeholder*="Objet"], #contact-subject');
      const messageField = contactSection?.querySelector('textarea, #contact-message');

      if (subjectField && messageField) {
        subjectField.value = "Demande de devis";
        messageField.value = messageTxt;
      }

      closeAssistant();
      setTimeout(() => {
        contactSection?.scrollIntoView({ behavior: "smooth" });
      }, 50);
    }, { once: true });
  });
});
