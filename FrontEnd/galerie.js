

// AFFICHAGE DYNAMIQUE POUR les filtres et les travaux
// URL de base de  API
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
    figure.dataset.id = work.id;    

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
  const [categories, works] = await Promise.all([getCategories(), getWorks()]);

  // On garde tous les travaux en mémoire
  allWorks = works;

           // On affiche tout au début
  displayGallery(allWorks);                 // afficher tous les travaux dansla gallerie

  //  Bouton Tous
  const btnTous = document.createElement("button");
  btnTous.textContent = "Tous";
  btnTous.classList.add("active");
  filtresContainer.appendChild(btnTous);

  btnTous.addEventListener("click", () => {
    setActiveButton(btnTous);
    displayGallery(allWorks);
  });

  //  Boutons pour chaque catégorie 
  categories.forEach(category => {
    const button = document.createElement("button");
    button.textContent = category.name;
    filtresContainer.appendChild(button);

    button.addEventListener("click", () => {
      setActiveButton(button);

      const filtered = allWorks.filter(work => work.categoryId === category.id);
      displayGallery(filtered);
    });
  });
}
       // 5. Gérer le style "bouton actif"

function setActiveButton(activeButton) {
  const allButtons = document.querySelectorAll(".filtres button");
  allButtons.forEach(btn => btn.classList.remove("active"));
  activeButton.classList.add("active");
}
        //  6. Lancer tout au chargement 

document.addEventListener("DOMContentLoaded", function() {
  createFilters();
});

        //  GESTION DU MODE ÉDITION SUR LA PAGE D'ACCUEIL

document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");

  const editionBanner = document.querySelector(".edition");     // <div class="edition hidden">
  const editArea      = document.querySelector(".edit-area");   // <div class="edit-area hidden">
  const filtres       = document.querySelector(".filtres");     // <div class="filtres"></div>
  const loginLink     = document.querySelector('nav ul li a[href="Connexion.html"]');

  // --- Si l'utilisateur est connecté (token présent) 

  if (token) {
    // Afficher le bandeau "mode édition" et le bouton "modifier"
     editionBanner.classList.remove("hidden");  //afficher mode edition 
      editArea.classList.remove("hidden");   //afficher le bouton modifier 

     filtres.classList.add("hidden");     // Cacher les filtres
     loginLink.textContent = "logout";    // Remplacer "login" par logout

     loginLink.addEventListener("click", (event) => {      // Gestion de la déconnexion
        event.preventDefault();
        localStorage.removeItem("token");          // on supprime le token
        window.location.href = "index.html";       // on recharge la page en mode visiteur
      });
    
  } else {                                          // Si l'utilisateur n'est PAS connecté 
    if (editionBanner) editionBanner.classList.add("hidden");
    if (editArea)      editArea.classList.add("hidden");
    if (filtres)       filtres.classList.remove("hidden");
  }
});






