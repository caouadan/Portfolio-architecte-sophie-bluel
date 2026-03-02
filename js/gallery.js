// Mocked backend using static JSON files for GitHub Pages deployment.
// See `api.js` for implementation.

function createCategoryContainer() {
    const divCategories = document.createElement("div");
    divCategories.classList.add("allCategory");

    const divGallery = document.querySelector(".gallery");
    divGallery.parentNode.insertBefore(divCategories, divGallery);

    return { divCategories, divGallery };
}

// FONCTION collecter backend (now mocked)
async function collectProject() {
    const { divCategories, divGallery } = createCategoryContainer();
    try {
        const projects = await api.getWorks();
        divGallery.innerHTML = "";
        projects.forEach((project) => createProject(project, divGallery));
        const categories = await api.getCategories();
        await createFilterButtons(divCategories, categories);
        applyFilters(divCategories, divGallery);
    } catch (err) {
        console.error("Unable to fetch projects or categories:", err);
        const divGallery = document.querySelector(".gallery");
        if (divGallery) {
            divGallery.textContent = "Impossible de charger les projets (erreur réseau).";
        }
    }
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
async function createFilterButtons(divCategories, categories) {
    divCategories.innerHTML = "";

    const buttonAll = document.createElement("button");
    buttonAll.textContent = "Tous";
    buttonAll.dataset.category = "all";
    buttonAll.classList.add("activeButton");
    divCategories.appendChild(buttonAll);

    categories.forEach((category) => {
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