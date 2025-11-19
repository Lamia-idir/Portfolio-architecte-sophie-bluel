console.log("JS chargé !");

// Sélecteurs principaux
const editBtn      = document.getElementById("edit-btn");          // bouton crayon
const modal        = document.getElementById("modal");             // conteneur de la modale
const overlay      = modal.querySelector(".modal-overlay");        // clic extérieur
const closeBtn     = modal.querySelector(".modal-close");          // bouton croix

// Les deux "vues" à l'intérieur de la modale
const galleryView  = modal.querySelector(".modal-gallery-view");   // vue Galerie photo
const addView      = modal.querySelector(".modal-add-view");       // vue Ajout photo

// Boutons internes
const addPhotoBtn  = document.getElementById("add-photo-btn");     // "Ajouter une photo"
const backBtn  = modal.querySelector(".modal-back");           // flèche retour


// --- Fonctions utilitaires ---

// Ouvrir la modale sur la vue Galerie
function openModalOnGallery() {
  modal.classList.remove("hidden");   // on affiche la modale
  galleryView.classList.remove("hidden");
  addView.classList.add("hidden");
}

// Fermer complètement la modale
function closeModal() {
  modal.classList.add("hidden");
}

// Afficher la vue Ajout photo
function showAddView() {
  galleryView.classList.add("hidden");
  addView.classList.remove("hidden");
}

// Revenir à la vue Galerie
function showGalleryView() {
  addView.classList.add("hidden");
  galleryView.classList.remove("hidden");
}

// --- Écouteurs d'événements ---

// Clic sur le bouton "modifier" (crayon) → ouvrir la modale (galerie)
editBtn.addEventListener("click", openModalOnGallery);

// Clic sur "Ajouter une photo" → bascule vers la vue d'ajout
addPhotoBtn.addEventListener("click", (e) => {
  e.preventDefault(); // au cas où ce serait dans un form
  showAddView();
});

// Clic sur la flèche retour → revenir à la galerie
backBtn.addEventListener("click", (e) => {
  e.preventDefault();
  showGalleryView();
});

// Clic sur la croix → fermer la modale
closeBtn.addEventListener("click", closeModal);

// Clic sur l'overlay → fermer la modale
overlay.addEventListener("click", closeModal);
