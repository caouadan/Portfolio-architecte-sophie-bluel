// Envoyer les identifiants pour authentification
function userAuth() {
    const email = document.querySelector("[name=email]").value;
    const password = document.querySelector("[name=password]").value;
    const token = api.login(email, password);
    return token;
}

// Afficher le message d'erreur
function showLoginError(message) {
    let error = document.querySelector(".login-problem");
    if (!error) {
        const loginForm = document.querySelector(".login-form");
        error = document.createElement("span");
        error.classList.add("login-problem");
        loginForm.parentNode.insertBefore(error, loginForm);
    }
    error.textContent = message;
}

// G\u00e9rer la soumission du formulaire
function loginHere() {
    const loginForm = document.querySelector(".login-form");

    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const token = userAuth();

        if (token) {
            // L'utilisateur est connect\u00e9, aller \u00e0 la page d'accueil
            window.location.href = "index.html";
        } else {
            // Les identifiants sont incorrects
            showLoginError("Adresse e-mail ou mot de passe incorrect.");
        }
    });
}

loginHere();