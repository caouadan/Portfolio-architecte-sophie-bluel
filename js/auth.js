function initLoggedInMode() {
    if (isLoggedIn()) {
        logout();
        editBar();
        createModifymode();
        const buttonFilters = document.querySelector(".allCategory");
        buttonFilters.style.display = "none";
    }
}

initLoggedInMode();

function isLoggedIn() {
    return !!localStorage.getItem("token");
}

function logout() {
    const log = document.querySelector(".changelog");
    log.innerText = "logout";
    log.addEventListener("click", (event) => {
        event.preventDefault();
        localStorage.clear();
        window.location.href = "index.html";
    });
}

function editBar() {
    const bar = document.createElement("div");
    bar.classList.add("bar-edit");
    bar.innerHTML = `<i class="fa-regular fa-pen-to-square" style="margin: 10px;"></i> Mode édition`;
    document.body.prepend(bar);
}

function createModifymode() {
    const portfolio = document.querySelector("#portfolio");
    const portfolioTitle = document.querySelector(".portfolio-title");
    const divTitleproject = document.createElement("div");
    const textModify = document.createElement("span");
    textModify.classList.add("modify");
    divTitleproject.classList.add("modify-section");
    textModify.innerHTML = `<i class="fa-regular fa-pen-to-square" style="margin-right: 10px;"></i> Modifier`;

    divTitleproject.appendChild(portfolioTitle);
    divTitleproject.appendChild(textModify);
    portfolio.prepend(divTitleproject);

    textModify.addEventListener("click", () => {
        openModalGallery();
    });
}
