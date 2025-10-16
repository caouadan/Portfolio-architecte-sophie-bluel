// FONCTION se connecter
function loginHere() {
    const loginForm = document.querySelector(".login-form");

    loginForm.addEventListener("submit", async function (event) {
        event.preventDefault();
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
        const identification = await informationId.json();

        const token = identification.token;

        if (token) {
            localStorage.setItem("token", token);
            window.location.href = "index.html";
        } else {
            let problemlog = document.querySelector(".login-problem");

            if (!problemlog) {
                problemlog = document.createElement("span");
                problemlog.classList.add("login-problem");
                problemlog.textContent = "Votre adresse e-mail ou votre mot de passe est incorrect. Veuillez réessayer.";
                loginForm.parentNode.insertBefore(problemlog, loginForm);
                console.error("Problème d'authentification.");
            }
        }

        /* console.log('logging in', { storedToken: localStorage.getItem("token"), token }); */

    });
}

loginHere();