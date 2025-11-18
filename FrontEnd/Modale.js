// /      GERER L'apparence des modale
const galleryView = document.querySelector(".modal-gallery-view");
const addView = document.querySelector(".modal-add-view");
const addPhotoBtn = document.getElementById("add-photo-btn");
const backBtn = document.querySelector(".modal-back");

addPhotoBtn.addEventListener("click", () => {
  galleryView.classList.add("hidden");
  addView.classList.remove("hidden");
});

backBtn.addEventListener("click", () => {
  addView.classList.add("hidden");
  galleryView.classList.remove("hidden");
});


          // GERER LA FERMETURE DE MODALE

const modal = document.getElementById("modal");
const modalOverlay = document.querySelector(".modal-overlay");
const closeModalBtn = document.querySelector(".modal-close");

function closeModal() {
  modal.classList.add("hidden");
}

closeModalBtn.addEventListener("click", closeModal);

modalOverlay.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    closeModal();
  }
});