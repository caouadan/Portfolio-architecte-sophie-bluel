// FONCTION envoie des infos et récupération token
async function userAuth() {
    try {
        const userId = {
            email: document.querySelector("[name=email]").value,
            password: document.querySelector("[name=password]").value,
        };
        const body = JSON.stringify(userId);

        const informationId = await fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body
        });

        if (!informationId.ok) {
            return null;
        }

        const identification = await informationId.json();
        return identification.token;

    } catch (error) {
        console.error(error);
        return null;
    }
}

// FONCTION message erreur
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

// FONCTION se connecter
function loginHere() {
    const loginForm = document.querySelector(".login-form");

    loginForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const token = await userAuth();

        if (token) {
            localStorage.setItem("token", token);
            window.location.href = "index.html";
        } else {
            showLoginError("Votre adresse e-mail ou votre mot de passe est incorrect. Veuillez réessayer.");
            console.error("Problème d'authentification.");
        }
    });
}

loginHere();