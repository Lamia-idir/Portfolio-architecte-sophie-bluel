// Cette fonction va récupérer les travaux (works) depuis ton back-end
async function getWorks() {
  const response = await fetch("http://localhost:5678/api/works");
  const works = await response.json();
  return works;
}

// Cette fonction va afficher les travaux dans la galerie
async function displayGallery() {
  try {
    const works = await getWorks();
    const gallery = document.querySelector(".gallery");

    // On vide la galerie au cas où
    gallery.innerHTML = "";

    // Pour chaque work, on crée un <figure> avec une <img> et un <figcaption>
    works.forEach(work => {
      const figure = document.createElement("figure");

      const img = document.createElement("img");
      img.src = work.imageUrl;
      img.alt = work.title;

      const figcaption = document.createElement("figcaption");
      figcaption.textContent = work.title;

      figure.appendChild(img);
      figure.appendChild(figcaption);
      gallery.appendChild(figure);
    });
  } catch (error) {
    console.error("Erreur lors du chargement des travaux :", error);
  }
}

// On lance l'affichage quand la page est chargée
document.addEventListener("DOMContentLoaded", () => {
  displayGallery();
});
