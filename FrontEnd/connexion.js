  // Récupère le nom de la page actuelle

  const currentPage = window.location.pathname.split("/").pop();
 
  // Sélectionne tous les liens du menu

  const links = document.querySelectorAll("nav a");

  links.forEach(link => {
    const linkPage = link.getAttribute("href");

    // Si le lien correspond à la page actuelle on ajoute la classe active
    if (linkPage === currentPage) {
      link.classList.add("active");
    }
  });

//   connexion admin 

const loginForm = document.getElementById("login-form");
const errorMsg = document.getElementById("login-error");

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault(); // empêche le rafraîchissement de la page

  errorMsg.textContent = "";

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
   console.log("Tentative de connexion avec :", email, password);

  try {
    const response = await fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {

      // mauvais identifiants ou autre erreur
      errorMsg.textContent = "E-mail ou mot de passe incorrect.";
      return;
    }

    const data = await response.json();

      //  Connexion réussie
  console.log (" Connexion réussie. Token reçu :", data.token);

    // on stocke le token pour les futures requêtes (modifications, suppression…)

    localStorage.setItem("token", data.token);

    // redirection vers la page d’accueil
    
    window.location.href = "index.html";

  } catch (error) {
    console.error("Erreur réseau :", error);
    errorMsg.textContent = "Une erreur est survenue. Veuillez réessayer.";
  }
});

