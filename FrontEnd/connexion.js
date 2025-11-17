  // Récupère le nom de la page actuelle
  const currentPage = window.location.pathname.split("/").pop();

  // Sélectionne tous les liens du menu
  const links = document.querySelectorAll("nav a");

  links.forEach(link => {
    const linkPage = link.getAttribute("href");

    // Si le lien correspond à la page actuelle → ajoute la classe active
    if (linkPage === currentPage) {
      link.classList.add("active");
    }
  });