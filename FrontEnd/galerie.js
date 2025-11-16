// // Cette fonction va récupérer les travaux (works) depuis ton back-end
// async function getWorks() {
//   const response = await fetch("http://localhost:5678/api/works");
//   const works = await response.json();
//   console.log("works récupérés :", works);
//   return works;
// }

// // Cette fonction va afficher les travaux dans la galerie
// async function displayGallery() {
//   try {
//     const works = await getWorks();
//     const gallery = document.querySelector(".gallery");

//     // On vide la galerie au cas où
//     gallery.innerHTML = "";

//     // Pour chaque work, on crée un <figure> avec une <img> et un <figcaption>
//     works.forEach(work => {
//       const figure = document.createElement("figure");

//       const img = document.createElement("img");
//       img.src = work.imageUrl;
//       img.alt = work.title;

//       const figcaption = document.createElement("figcaption");
//       figcaption.textContent = work.title;

//       figure.appendChild(img);
//       figure.appendChild(figcaption);
//       gallery.appendChild(figure);
//     });
//   } catch (error) {
//     console.error("Erreur lors du chargement des travaux :", error);
//   }
// }

// // On lance l'affichage quand la page est chargée
// document.addEventListener("DOMContentLoaded", () => {
//   displayGallery();
// });



// gggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggg
// URL de base de ton API
const API_BASE_URL = "http://localhost:5678/api";

// On gardera tous les travaux ici pour pouvoir filtrer sans refaire un fetch à chaque fois
let allWorks = [];

/************ 1. Récupérer les travaux ************/
async function getWorks() {
  const response = await fetch(`${API_BASE_URL}/works`);
  if (!response.ok) {
    throw new Error("Erreur API works : " + response.status);
  }
  const works = await response.json();
  return works;
}

/************ 2. Récupérer les catégories ************/
async function getCategories() {
  const response = await fetch(`${API_BASE_URL}/categories`);
  if (!response.ok) {
    throw new Error("Erreur API categories : " + response.status);
  }
  const categories = await response.json();
  return categories;
}

/************ 3. Afficher une liste de travaux ************/
function displayGallery(works) {
  const gallery = document.querySelector(".gallery");
  gallery.innerHTML = "";

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
}

/************ 4. Créer dynamiquement les filtres ************/
async function createFilters() {
  const filtresContainer = document.querySelector(".filtres");
  filtresContainer.innerHTML = ""; // au cas où

  // On récupère en parallèle catégories + travaux
  const [categories, works] = await Promise.all([
    getCategories(),
    getWorks()
  ]);

  // On garde tous les travaux en mémoire
  allWorks = works;

  // On affiche tout au début
  displayGallery(allWorks);

  // ---- Bouton "Tous" ----
  const btnTous = document.createElement("button");
  btnTous.textContent = "Tous";
  btnTous.classList.add("active");
  filtresContainer.appendChild(btnTous);

  btnTous.addEventListener("click", () => {
    setActiveButton(btnTous);
    displayGallery(allWorks);
  });

  // ---- Boutons pour chaque catégorie ----
  categories.forEach(category => {
    const button = document.createElement("button");
    button.textContent = category.name;
    filtresContainer.appendChild(button);

    button.addEventListener("click", () => {
      setActiveButton(button);

      const filtered = allWorks.filter(
        work => work.categoryId === category.id
      );
      displayGallery(filtered);
    });
  });
}

/************ 5. Gérer le style "bouton actif" ************/
function setActiveButton(activeButton) {
  const allButtons = document.querySelectorAll(".filtres button");
  allButtons.forEach(btn => btn.classList.remove("active"));
  activeButton.classList.add("active");
}

/************ 6. Lancer tout au chargement ************/
document.addEventListener("DOMContentLoaded", () => {
  createFilters().catch(err =>
    console.error("Erreur lors de l'initialisation des filtres :", err)
  );
});
