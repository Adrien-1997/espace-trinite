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
// CARD VERS PHOTOS
// ----------------------------
document.addEventListener("DOMContentLoaded", () => {

  /* ---------- SLIDER ---------- */
  const slideButtons = document.querySelectorAll(".gallery-nav button");
  const slides       = document.querySelectorAll(".gallery-slide");

  /* 1. showSlide accessible globalement -------------------------------- */
  window.showSlide = function (index) {
    slides.forEach((slide, i) =>
      slide.classList.toggle("active", i === index)
    );
    slideButtons.forEach((btn, i) =>
      btn.classList.toggle("active", i === index)
    );
  };

  /* 2. init : slide Accueil active ------------------------------------- */
  showSlide(0);

  /* 3. clic sur les boutons nav ---------------------------------------- */
  slideButtons.forEach((btn, i) =>
    btn.addEventListener("click", () => showSlide(i))
  );

  /* 4. zoom image (inchangé) ------------------------------------------- */
  document.querySelectorAll(".gallery-mosaic img").forEach(img => {
    img.addEventListener("click", () => {
      if (document.getElementById("zoom-viewer")) return;
      const viewer = document.createElement("div");
      viewer.id = "zoom-viewer";
      viewer.innerHTML = `<img src="${img.src}" alt="Zoom">`;
      document.body.appendChild(viewer);
      viewer.addEventListener("click", () => viewer.remove());
    });
  });

  /* ---------- LIENS « + de photos » ---------- */
  const sectionIds = ["#accueil", "#goursat", "#orves", "#messiaen", "#labruyere"];

  document.querySelectorAll('a[href^="#"]').forEach(link => {
    const href  = link.getAttribute("href");
    const index = sectionIds.indexOf(href);
    if (index !== -1) {
      link.addEventListener("click", e => {
        e.preventDefault();
        // scroll vers la galerie puis affiche la bonne slide
        document.getElementById("galerie")?.scrollIntoView({ behavior: "smooth" });
        showSlide(index);
      });
    }
  });

  /* ---------- ouverture directe via hash URL ---------- */
  const startHash = window.location.hash;
  const startIdx  = sectionIds.indexOf(startHash);
  if (startIdx !== -1) {
    showSlide(startIdx);
    document.getElementById("galerie")?.scrollIntoView();
  }
});