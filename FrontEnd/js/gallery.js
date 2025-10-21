const divCategories = document.createElement("div");
divCategories.classList.add("allCategory");
const divGallery = document.querySelector(".gallery");
divGallery.parentNode.insertBefore(divCategories, divGallery);

// FONCTION collecter backend + filtrer
async function collectProject() {
    const response = await fetch("http://localhost:5678/api/works");
    const projects = await response.json();

    divGallery.innerHTML = "";

    projects.forEach(project => createProject(project, divGallery));

    createFilterButtons(divCategories, projects);
    applyFilters();
}

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

function createFilterButtons(divCategories, projects) {
    divCategories.innerHTML = "";

    const buttonAll = document.createElement("button");
    buttonAll.textContent = "Tous";
    buttonAll.dataset.category = "all";
    buttonAll.classList.add("activeButton");
    divCategories.appendChild(buttonAll);

    const categoriesMap = new Map();
    projects.forEach(project => {
        categoriesMap.set(project.category.id, project.category.name);
    });

    categoriesMap.forEach((name, id) => {
        const button = document.createElement("button");
        button.textContent = name;
        button.dataset.category = id;
        divCategories.appendChild(button);
    });
}

function applyFilters() {
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
