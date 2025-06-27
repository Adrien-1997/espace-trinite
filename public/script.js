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

  /* === Helpers === */
  const closeBurger = () => {
    const burger   = document.querySelector('.burger');
    const navLinks = document.querySelector('.nav-links');
    if (burger && navLinks) {
      burger.classList.remove('active', 'open');
      navLinks.classList.remove('active', 'open');
      burger.setAttribute('aria-expanded', 'false');
    }
  };

  const openAssistant = () => {
    overlay.style.display = 'flex';      // affiche la pop-up
    document.body.style.overflow = 'hidden';
  };

  const closeAssistant = () => {
    closeBurger();                       // referme le menu mobile
    overlay.style.display = 'none';
    document.body.style.overflow = '';
  };

  /* === Listeners UNIQUES === */
  toggleBtn.addEventListener('click', (e) => {
    e.preventDefault();          // évite un éventuel href="#"
    e.stopImmediatePropagation(); // AUCUN autre handler ne reçoit ce clic
    openAssistant();
  });

  cancelBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopImmediatePropagation();
    closeAssistant();
  });

  /* clic sur fond sombre = fermeture */
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeAssistant();
  });

/* ----- Soumission du mini-formulaire ----- */
  submitBtn.addEventListener("click", () => {
    resultBlock.style.display = "none";

    const type      = eventType.value;
    const nb        = parseInt(participants.value, 10) || 0;
    const dur       = ["demi", "journee", "soiree"].includes(duration.value) ? duration.value : null;
    const wantPMR   = pmrCheck.checked;
    const dateStart = document.getElementById("dateStart")?.value;
    const dateEnd   = document.getElementById("dateEnd")?.value;

    const matches = rooms.filter(r =>
      r.eventTypes.includes(type) &&
      nb >= r.min && nb <= r.max &&
      (!wantPMR || r.pmr)
    );

    if (!matches.length) {
      resultBlock.innerHTML = "Aucune salle ne correspond exactement à votre besoin.<br>Contactez-nous pour une solution sur mesure.";
      resultBlock.style.display = "block";
      return;
    }

    matches.sort((a, b) => (a.max - nb) - (b.max - nb));
    const best = matches[0];

    let priceKey = null;
    if (dur && nb > 30 && best.pricing[`${dur}_30`]) {
      priceKey = `${dur}_30`;
    } else if (dur && best.pricing[dur]) {
      priceKey = dur;
    }

    const label = dur === "demi"    ? "demi-journée"
                : dur === "journee"  ? "journée"
                : dur === "soiree"   ? "soirée"
                : "durée non précisée";

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
        "Bonjour,\n",
        "",
        "Je souhaite organiser un événement avec les critères suivants :",
        `- Type d’événement : ${type}`,
        `- Nombre de participants : ${nb}`,
        `- Durée : ${label}`,
        (dateStart && dateEnd) ? `- Période souhaitée : du ${dateStart} au ${dateEnd}` : null,
        `- Besoin d’accessibilité PMR : ${pmrText}\n`,
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

        // Ferme le formulaire et libère le scroll
        closeAssistant();
      }
    });
  });
});






