
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


// --- Fonctions 

// Ouvrir la modale sur la vue Galerie

function openModalOnGallery() {
  modal.classList.remove("hidden");       // on affiche la modale
  galleryView.classList.remove("hidden");  // on montre lma vue galerie
  addView.classList.add("hidden");         // on cache la vue ajout
}

// Fermer complètement la modale
function closeModal() {
  modal.classList.add("hidden");     //  Cache la modale 
}

// Afficher la vue Ajout photo 

function showAddView() {                          //    montre madale 2
  galleryView.classList.add("hidden");   // on cache la vue galerie
  addView.classList.remove("hidden");     // on affiche la vue ajout
}

// Revenir à la vue Galerie
function showGalleryView() {                          //montre modale 1
  addView.classList.add("hidden");         // on cache la vue ajout
  galleryView.classList.remove("hidden");   // on montre  la vue galerie
}

// --- Écouteurs d'événements 

// Clic sur le bouton modifier pour ouvrir la modale
editBtn.addEventListener("click", openModalOnGallery);

// Clic sur Ajouter une photo pour bascule vers la vue d'ajout
addPhotoBtn.addEventListener("click", (e) => {
  e.preventDefault(); 
  showAddView();
});

// Clic sur la flèche retour pour revenir à la galerie
backBtn.addEventListener("click", (e) => {
  e.preventDefault();
  showGalleryView();
});

// Clic sur la croix pour fermer la modale 
closeBtn.addEventListener("click", () => {
  closeModal();
  clearError();
});

// Clic sur l'overlay pour fermer la modale
overlay.addEventListener("click", () => {
  closeModal();
  clearError();
});



const API_URL = "http://localhost:5678/api/works";

// Initialise la galerie du modal dès que le HTML est chargé

document.addEventListener("DOMContentLoaded", () => {
  loadModalGallery();
});


//      Fonction ajout gallery et suppression

//  RÉCUPÉRATION DES TRAVAUX -  puis les afficher dans la gallerie 

async function loadModalGallery() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) {
      console.error("Erreur GET /works :", res.status);
      return;
    }
    const works = await res.json();
    generateModalGallery(works);
  } catch (err) {
    console.error("Erreur réseau GET /works :", err);
  }
}

//  SUPPRESSION PROJET 

async function deleteWorkApi(id) {
  const token = localStorage.getItem("token");
  console.log("Token utilisé :", token);

  if (!token) {
    alert("Tu dois être connecté·e pour supprimer un projet.");
    return false;
  }

  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  console.log("DELETE status :", res.status);

  if (res.status === 401) {
    alert("Non autorisé (401) : vérifie que tu es bien connecté·e.");
    return false;
  }

  if (!res.ok) {
    alert("Erreur pendant la suppression.");
    return false;
  }

  return true;        // tout s’est bien passé
}

//  GÉNÉRATION DE LA GALERIE MODALE

function generateModalGallery(works) {
  const modalGallery = document.querySelector(".modal-gallery");
  modalGallery.innerHTML = "";

  works.forEach(work => {
    const figure = document.createElement("figure");
    figure.classList.add("modal-gallery-figure");
    figure.dataset.id = work.id;          // ajout attribut qui recupère le ID du work

    const img = document.createElement("img");
    img.src = work.imageUrl;
    img.alt = work.title; 
                               
    const deleteBtn = document.createElement("button");   //Créer les bouttons de la supression 
    deleteBtn.classList.add("modal-trash-btn");
    deleteBtn.setAttribute("aria-label", "Supprimer le projet");
    deleteBtn.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;

    //  clic sur la corbeille

    deleteBtn.addEventListener("click", async (event) => {
      event.preventDefault();

      const ok = await deleteWorkApi(work.id);

      if (ok) {
        // 1. On enlève la vignette de la modale
        figure.remove();

        // 2. On enlève aussi l’élément de la galerie principale
        const mainFigure = document.querySelector(`.gallery figure[data-id="${work.id}"]`);
        if (mainFigure) mainFigure.remove();
      }
    });

    figure.appendChild(img);
    figure.appendChild(deleteBtn);
    modalGallery.appendChild(figure);
  });
}


//    AJOUT PREOJET 


// CONFIG

const API_WORKS = "http://localhost:5678/api/works";
const API_CATEGORIES = "http://localhost:5678/api/categories";

const addForm = document.querySelector(".modal-form");
const fileInput = document.getElementById("file-input");
const titleInput = document.getElementById("photo-title");
const categorySelect = document.getElementById("photo-category");
const uploadZone = document.querySelector(".upload-zone");
const errorMsg = document.getElementById("form-error");


// INIT AU CHARGEMENT

document.addEventListener("DOMContentLoaded", () => {
  loadCategories();
  setupAddForm();
});


// 1. Charger les catégories depuis l'API

async function loadCategories() {
  try {
    const res = await fetch(API_CATEGORIES);
    if (!res.ok) {
      console.error("Erreur GET /categories :", res.status);
      return;
    }
    const categories = await res.json();

    // On vide et on remet l'option par défaut

    categorySelect.innerHTML = '<option value="">Sélectionner une catégorie</option>';

    categories.forEach(cat => {
      const option = document.createElement("option");
      option.value = cat.id;            // important pour l'API
      option.textContent = cat.name;   // ce que voit l'utilisateur
      categorySelect.appendChild(option);
    });
  } catch (err) {
    console.error("Erreur réseau /categories :", err);
  }
}


// 2. Configuration du formulaire (preview + submit)

function setupAddForm() {
  // Preview quand on choisit une image
  fileInput.addEventListener("change", handlePreview);     //fonction qui gère l'apercu de l'image 

  // Envoi du formulaire
  addForm.addEventListener("submit", handleSubmit);      // fonction qui gère l'envoi du projet
}

// 2.a Preview de l'image choisie

function handlePreview() {
  const file = fileInput.files[0];      //récuperer l'image choisi 
  if (!file) return;

  // Option : vérifier taille max 4 Mo

  const maxSize = 4 * 1024 * 1024;
  if (file.size > maxSize) {
    showError("L'image dépasse 4 Mo.");
    fileInput.value = "";             
    return;
  }

  // On supprime le contenu actuel (icône, bouton, texte)

  uploadZone.innerHTML = "";

  const img = document.createElement("img");
  img.src = URL.createObjectURL(file);     //afficher l'image dans la zonz après l'ajout
  uploadZone.appendChild(img);  
}

// 2.b Envoi du formulaire à l'API

async function handleSubmit(event) {                
  event.preventDefault();
  clearError();

  const file = fileInput.files[0];          //on récupère l'image 
  const title = titleInput.value.trim();         // on récupère le titre
  const category = categorySelect.value;          //On récupère la catégorie 
  const token = localStorage.getItem("token");

  // Vérifications

  if (!file || !title || !category) {
    showError("Merci de remplir tous les champs et de choisir une image.");
    return;
  }
  

  if (!token) {
    showError("Tu dois être connecté·e pour ajouter un projet.");
    return;
  }
  

  const formData = new FormData();       
  formData.append("image", file);
  formData.append("title", title);
  formData.append("category", category);

  try {
    const res = await fetch(API_WORKS, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`

        // NE PAS mettre de "Content-Type" ici
      },
      body: formData
    });


    // Fonction qui affiche que le projet est rajouté si API OK

    function showSuccessMessage(msg) {
  const success = document.createElement("p");
  success.textContent = msg;
  success.style.color = "green";
  success.style.marginTop = "10px";
  success.style.fontWeight = "bold";

  addForm.appendChild(success);

  // Le message disparaît après 3 secondes
  setTimeout(() => {
    success.remove();
  }, 3000);
}


    if (!res.ok) {
      console.error("Erreur POST /works :", res.status);
      showError("Erreur lors de l'envoi du formulaire.");
      return;
    }

    const newWork = await res.json();
    console.log("Nouveau projet ajouté :", newWork);

    // Vérifie que l’API a bien renvoyé un objet avec un id
  if (newWork && newWork.id) {

  // ✔ Message de confirmation
  showSuccessMessage("Le projet a été ajouté avec succès !");

  addForm.reset();
  uploadZone.innerHTML = ""; // Si tu as une zone d’aperçu
  } else {
  showError("L'API n'a pas renvoyé une réponse valide.");
  }

    // 1. Ajout dans la galerie principale

    addWorkToMainGallery(newWork);

    // 2. Ajout dans la galerie de la modale

    addWorkToModalGallery(newWork);

    // 3. Réinitialiser le formulaire
    resetAddForm();

    // 4. Revenir à la vue "Galerie photo" de la modale si tu veux

    //  switchToGalleryView();

  } catch (err) {
    console.error("Erreur réseau POST /works :", err);
    showError("Problème de connexion avec le serveur.");
  }
}

// 3. Affichage / reset des erreurs

function showError(message) {
  if (errorMsg) {
    errorMsg.textContent = message;
  } else {
    alert(message);
  }
}

function clearError() {
  if (errorMsg) {
    errorMsg.textContent = "";
  }
}

// 4. Réinitialiser le formulaire après succès

function resetAddForm() {               
  addForm.reset();                    // Vider le formulaire 
  clearError();

  // remettre la zone d'upload dans son état initial aprèsla validation.

  uploadZone.innerHTML = `
    <i class="fa-regular fa-image upload-icon"></i>
    <input type="file" id="file-input" accept="image/png, image/jpeg" hidden>
    <label for="file-input" class="upload-btn">+ Ajouter photo</label>
    <small>jpg, png • 4mo max</small>
  `;      // retire l'image 

  //  Il faut ré-attacher l'event "change" sur le nouveau input

  const newFileInput = document.getElementById("file-input");
  newFileInput.addEventListener("change", handlePreview);
}


// 5. Ajouter le nouveau projet dans les deux galeries

function addWorkToMainGallery(work) {
  const gallery = document.querySelector(".gallery");
  if (!gallery) return;

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
}

function addWorkToModalGallery(work) {
  const modalGallery = document.querySelector(".modal-gallery");
  if (!modalGallery) return;

  // utilisation de  fonction createModalWorkElement(work)

  const figure = document.createElement("figure");
  figure.classList.add("modal-gallery-figure");
  figure.dataset.id = work.id;

  const img = document.createElement("img");
  img.src = work.imageUrl;
  img.alt = work.title;

  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("modal-trash-btn");
  deleteBtn.setAttribute("aria-label", "Supprimer le projet");
  deleteBtn.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;

  // même logique de delete que pour les autres

  deleteBtn.addEventListener("click", async () => {
    const ok = await deleteWorkApi(work.id);  //  fonction pour la suppression
    if (ok) {
      figure.remove();
      const mainFigure = document.querySelector(`.gallery figure[data-id="${work.id}"]`);
      if (mainFigure) mainFigure.remove();
    }
  });

  figure.appendChild(img);
  figure.appendChild(deleteBtn);
  modalGallery.appendChild(figure);
}

// 6. Revenir à la vue "Galerie photo" de la modale

// function switchToGalleryView() {
//   const galleryView = document.querySelector(".modal-gallery-view");
//   const addView = document.querySelector(".modal-add-view");

//   if (!galleryView || !addView) return;

//   addView.classList.add("hidden");
//   galleryView.classList.remove("hidden");
// }


