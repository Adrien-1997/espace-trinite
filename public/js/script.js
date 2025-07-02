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