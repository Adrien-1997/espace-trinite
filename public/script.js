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

