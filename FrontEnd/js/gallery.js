const API_URL = "http://localhost:5678/api";

function createCategoryContainer() {
    const divCategories = document.createElement("div");
    divCategories.classList.add("allCategory");

    const divGallery = document.querySelector(".gallery");
    divGallery.parentNode.insertBefore(divCategories, divGallery);

    return { divCategories, divGallery };
}

// FONCTION collecter backend
async function collectProject() {
    const { divCategories, divGallery } = createCategoryContainer();

    const response = await fetch(`${API_URL}/works`);
    const projects = await response.json();

    divGallery.innerHTML = "";

    projects.forEach(project => createProject(project, divGallery));

    await createFilterButtons(divCategories);
    applyFilters(divCategories, divGallery);
}


// FONCTION création des projets
function createProject(project, divGallery) {
    const figure = document.createElement("figure");
    figure.classList.add("project");
    figure.dataset.id = project.id;
    figure.dataset.category = project.categoryId;
    const img = document.createElement("img");
    img.src = project.imageUrl;
    img.alt = project.title;
    const figcaption = document.createElement("figcaption");
    figcaption.textContent = project.title;
    figure.appendChild(img);
    figure.appendChild(figcaption);
    divGallery.appendChild(figure);
}

// FONCTION création des filtres
async function createFilterButtons(divCategories) {
    divCategories.innerHTML = "";

    const buttonAll = document.createElement("button");
    buttonAll.textContent = "Tous";
    buttonAll.dataset.category = "all";
    buttonAll.classList.add("activeButton");
    divCategories.appendChild(buttonAll);

    const response = await fetch(`${API_URL}/categories`);
    const categories = await response.json();

    categories.forEach(category => {
        const button = document.createElement("button");
        button.textContent = category.name;
        button.dataset.category = category.id;
        divCategories.appendChild(button);
    });
}

// FONCTION utilisation des filtres
function applyFilters(divCategories, divGallery) {
    const buttons = divCategories.querySelectorAll("button");
    const figures = divGallery.querySelectorAll("figure");

    buttons.forEach(button => {
        button.addEventListener("click", () => {
            const idButton = button.dataset.category;

            buttons.forEach(button => button.classList.remove("activeButton"));
            button.classList.add("activeButton");

            figures.forEach(figure => {
                const idFigure = figure.dataset.category;

                if (idButton === "all") {
                    figure.style.display = "block";
                } else if (idButton === idFigure) {
                    figure.style.display = "block";
                } else {
                    figure.style.display = "none";
                }
            });
        });
    });
}


collectProject();