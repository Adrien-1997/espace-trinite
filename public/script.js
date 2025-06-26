// ----------------------------
// ANIMATION D'ENTRÉE DES SECTIONS AU SCROLL
// ----------------------------

document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll("section");

  // Crée un observer pour ajouter la classe 'visible' aux sections quand elles entrent dans le viewport
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  }, {
    threshold: 0.1 // Déclenche quand 10% de la section est visible
  });

  sections.forEach(section => {
    observer.observe(section);
  });
});

// ----------------------------
// SWIPER
// ----------------------------

document.addEventListener("DOMContentLoaded", () => {
  const slideButtons = document.querySelectorAll(".gallery-nav button");
  const slides = document.querySelectorAll(".gallery-slide");

  // Active the requested slide
  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle("active", i === index);
    });

    slideButtons.forEach((btn, i) => {
      btn.classList.toggle("active", i === index);
    });
  }

  // Initialisation
  showSlide(0);

  // Click handler
  slideButtons.forEach((btn, i) => {
    btn.addEventListener("click", () => {
      showSlide(i);
    });
  });

  // Zoom image on click (facultatif)
  document.querySelectorAll(".gallery-mosaic img").forEach(img => {
    img.addEventListener("click", () => {
      if (document.getElementById("zoom-viewer")) return;

      const viewer = document.createElement("div");
      viewer.id = "zoom-viewer";
      viewer.innerHTML = `
        <img src="${img.src}" alt="Zoomed image" />
      `;
      document.body.appendChild(viewer);

      viewer.addEventListener("click", () => viewer.remove());
    });
  });
});

// ----------------------------
// ZOOM SUR LES IMAGES
// ----------------------------

document.addEventListener("DOMContentLoaded", () => {
  // Active uniquement sur desktop
  if (window.innerWidth <= 768) return;

  document.querySelectorAll('.gallery-mosaic img').forEach(img => {
    img.addEventListener('click', () => {
      if (document.getElementById('zoom-viewer')) return;

      const viewer = document.createElement('div');
      viewer.id = 'zoom-viewer';
      viewer.innerHTML = `
        <div class="zoom-backdrop"></div>
        <img src="${img.src}" alt="Zoomed image" class="zoomed-image" />
      `;
      document.body.appendChild(viewer);

      viewer.addEventListener('click', () => {
        viewer.remove();
      });
    });
  });
});

// ----------------------------
// Smooth scroll fallback + compatibilité étendue (IE/anciens Safari)
// ----------------------------

document.addEventListener("DOMContentLoaded", function () {
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach(link => {
    link.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");

      // Ignore les faux liens ou liens externes
      if (targetId.length > 1 && targetId.startsWith("#")) {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();

          // Calcule la position de destination
          const yOffset = -70; // Décalage si header sticky (ajuste si besoin)
          const y = targetElement.getBoundingClientRect().top + window.pageYOffset + yOffset;

          // Défilement fluide
          window.scrollTo({
            top: y,
            behavior: "smooth"
          });
        }
      }
    });
  });
});


/* -------------------------------------------------
    MINI-ASSISTANT — Trouve ta salle idéale
--------------------------------------------------*/

document.addEventListener("DOMContentLoaded", () => {
  /* ----- Sélecteurs généraux ----- */
  const toggleBtn   = document.getElementById("assistant-toggle");
  const overlay     = document.getElementById("assistant-overlay");
  const cancelBtn   = document.getElementById("assistant-cancel");
  const submitBtn   = document.getElementById("assistant-submit");
  const resultBlock = document.getElementById("assistant-result");

  const eventType   = document.getElementById("eventType");
  const participants= document.getElementById("participants");
  const duration    = document.getElementById("duration");
  const pmrCheck    = document.getElementById("pmr");

  /* ----- Formulaire contact ----- */
  const contactSubject = document.getElementById("contact-subject");
  const contactMessage = document.getElementById("contact-message");
  const contactSection = document.getElementById("contact");

  if (!toggleBtn) return console.warn("Assistant non trouvé dans le DOM");

  /* ----- Données salles (brochure) ----- */
  const rooms = [
    {
      id: "bruyere",
      name: "Salle La Bruyère",
      max: 60,       min: 10, pmr: true,
      eventTypes: ["reunion","conference","dejeuner"],
      pricing: { heure:164, demi:485, journee:660 }
    },
    {
      id: "goursat",
      name: "Salle Pierre Goursat",
      max: 60,       min: 10, pmr: true,
      eventTypes: ["reunion","conference","dejeuner","cocktail"],
      pricing: { heure:115, demi:365, journee:510, soiree:448,
                 heure_30:127, demi_30:400, journee_30:555 }
    },
    {
      id: "orves",
      name: "Salle Estienne d'Orves",
      max: 25,       min: 6,  pmr: true,
      eventTypes: ["reunion","conference"],
      pricing: { heure:111, demi:340, journee:490 }
    },
    {
      id: "messiaen",
      name: "Salle Olivier Messiaen",
      max: 65,       min: 20, pmr: false,
      eventTypes: ["conference","dejeuner"],
      pricing: { heure:157, demi:460, journee:620 }
    }
  ];

  /* ----- Helpers ouverture/fermeture ----- */
  const openAssistant  = () => overlay.style.display = "flex";
  const closeAssistant = () => overlay.style.display = "none";

  toggleBtn.addEventListener("click", openAssistant);
  cancelBtn.addEventListener("click", closeAssistant);
  overlay.addEventListener("click", e => { if (e.target === overlay) closeAssistant(); });

  /* ----- Soumission du mini-formulaire ----- */
  submitBtn.addEventListener("click", () => {

    /* Réinitialise l’affichage résultat */
    resultBlock.style.display = "none";

    /* Récupération des réponses */
    const type    = eventType.value;                         // reunion / conference / cocktail / dejeuner
    const nb      = parseInt(participants.value, 10) || 0;
    const dur     = duration.value;                          // demi | journee | soiree
    const wantPMR = pmrCheck.checked;
    const dateStart = document.getElementById("dateStart")?.value;
    const dateEnd   = document.getElementById("dateEnd")?.value;

    /* Filtrage des salles */
    const matches = rooms.filter(r =>
      r.eventTypes.includes(type) &&
      nb >= r.min && nb <= r.max &&
      (!wantPMR || r.pmr)
    );

    /* --- S’il n’y a aucune salle adaptée --- */
    if (!matches.length) {
      resultBlock.innerHTML = "Aucune salle ne correspond exactement à votre besoin.<br>Contactez-nous pour une solution sur mesure.";
      resultBlock.style.display = "block";
      return;
    }

    /* --- Choix de la meilleure salle --- */
    matches.sort((a,b) => (a.max - nb) - (b.max - nb));
    const best = matches[0];

    const price = best.pricing[dur] ? best.pricing[dur] + " € HT" : "sur devis";
    const label = dur === "demi" ? "demi-journée"
               : dur === "journee" ? "journée"
               : "soirée";

    /* --- Affichage de la recommandation --- */
    resultBlock.innerHTML = `
      <strong>${best.name}</strong><br>
      Capacité : jusqu’à ${best.max} pers.<br>
      Tarif ${label} : <strong>${price}</strong><br><br>
      <button id="devis-btn" class="btn btn-primary">Demander un devis</button>
    `;
    resultBlock.style.display = "block";

    /* --- Bouton “Demander un devis” --- */
    document.getElementById("devis-btn").addEventListener("click", () => {
      const pmrText  = wantPMR ? "Oui" : "Non";
      const dateText = (dateStart && dateEnd)
          ? `- Période souhaitée : du ${dateStart} au ${dateEnd}\n`
          : "";

      const messageTxt = `Bonjour,

    Je souhaite organiser un événement avec les critères suivants :

    - Type d’événement : ${type}
    - Nombre de participants : ${nb}
    - Durée : ${label}
    ${dateText}
    - Besoin d’accessibilité PMR : ${pmrText}

    Pourriez-vous me faire une proposition adaptée ?
    Merci d’avance.`;

      /* 1) On tente de pré-remplir le formulaire “Contact” */
      const contactSection = document.getElementById("contact");
      const subjectField   = contactSection?.querySelector('input[placeholder*="Objet"], #contact-subject');
      const messageField   = contactSection?.querySelector('textarea, #contact-message');

      if (subjectField && messageField) {
        subjectField.value = "Demande de devis";
        messageField.value = messageTxt;

        /* Scroll doux vers la section contact */
        contactSection.scrollIntoView({ behavior: "smooth" });
        closeAssistant();                      // ferme la pop-up
      } else {
        /* 2) Fallback : ouvre le client mail avec le message */
        const mailBody = encodeURIComponent(messageTxt);
        window.location.href =
          `mailto:contact@espace-trinite.fr?subject=Demande de devis&body=${mailBody}`;
      }
    });
  });
});



