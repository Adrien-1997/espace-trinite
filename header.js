// --- 1. Scroll pour header transparent/fond blanc ---
window.addEventListener('scroll', () => {
  const header = document.getElementById('site-header');
  header.classList.toggle('scrolled', window.scrollY > 50);
});

document.addEventListener("DOMContentLoaded", () => {
  const burger = document.querySelector(".burger");
  const navLinks = document.querySelector(".nav-links");
  const navItems = document.querySelectorAll(".nav-links a");
  const sections = document.querySelectorAll("section[id]");

  // --- 2. Menu burger toggle ---
  burger.addEventListener("click", () => {
    burger.classList.toggle("open");
    navLinks.classList.toggle("active");
  });

  // --- 3. Fermeture menu au clic sur lien ---
  navItems.forEach(link => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("active");
      burger.classList.remove("open");
    });
  });

  // --- 4. Indicateur de section active ---
  window.addEventListener("scroll", () => {
    let currentSection = "";

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;

      if (window.scrollY >= sectionTop - 150 && window.scrollY < sectionTop + sectionHeight - 150) {
        currentSection = section.getAttribute("id");
      }
    });

    navItems.forEach(link => {
      link.classList.remove("active-section");
      if (link.getAttribute("href").includes(`#${currentSection}`)) {
        link.classList.add("active-section");
      }
    });
  });
});