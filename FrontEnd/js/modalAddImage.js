// FONCTION ouvrir la modale d’ajout
function openAddImageModal(projects, divBack, modalTitle) {
    const modal = document.querySelector(".modal");

    // Stocker le titre original pour pouvoir revenir dessus
    const originalTitle = modalTitle.textContent;
    modalTitle.textContent = "Ajout photo";

    // Masquer la galerie et le footer existants
    const modalGallery = modal.querySelector(".modal-gallery");
    if (modalGallery) modalGallery.style.display = "none";

    const oldFormFooter = modal.querySelector(".form-footer");
    if (oldFormFooter) oldFormFooter.style.display = "none";

    // SECTION AJOUT D'IMAGE
    const divCaseAdd = document.createElement("div");
    divCaseAdd.classList.add("case-add");

    const divImgIcon = document.createElement("div");
    divImgIcon.classList.add("img-icon");
    divImgIcon.innerHTML = `<i class="fa-regular fa-image"></i>`;

    const ajouterPhoto = document.createElement("button");
    ajouterPhoto.classList.add("ajouter-photo");
    ajouterPhoto.textContent = "+ Ajouter photo";

    const inputFile = document.createElement("input");
    inputFile.type = "file";
    inputFile.accept = "image/png, image/jpeg";
    inputFile.style.display = "none";

    const imgRequirement = document.createElement("span");
    imgRequirement.textContent = "jpg, png : 4mo max";

    // Ouvrir sélecteur de fichier
    ajouterPhoto.addEventListener("click", () => inputFile.click());

    // Aperçu image
    inputFile.addEventListener("change", function () {
        const file = this.files[0];
        const oldProblem = divCaseAdd.querySelector(".image-problem");
        if (oldProblem) oldProblem.remove();

        if (!file) return;

        if (file.size > 4 * 1024 * 1024) {
            const problemImage = document.createElement("span");
            problemImage.classList.add("image-problem");
            problemImage.textContent = "Image trop lourde.";
            divCaseAdd.appendChild(problemImage);
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            divCaseAdd.innerHTML = "";
            const img = document.createElement("img");
            img.src = e.target.result;
            img.id = "preview";
            divCaseAdd.appendChild(img);
        };
        reader.readAsDataURL(file);
    });

    divCaseAdd.append(divImgIcon, ajouterPhoto, imgRequirement, inputFile);
    modal.appendChild(divCaseAdd);

    // FORMULAIRE
    const form = document.createElement("form");
    form.classList.add("form-add");

    const labelTitle = document.createElement("label");
    labelTitle.textContent = "Titre";
    const inputTitle = document.createElement("input");
    inputTitle.name = "title";

    const labelCategory = document.createElement("label");
    labelCategory.textContent = "Catégorie";
    const selectCategory = document.createElement("select");
    selectCategory.name = "category";

    // Catégories uniques
    const categoriesSet = new Map();
    projects.forEach(project => {
        categoriesSet.set(project.category.id, project.category.name);
    });

    categoriesSet.forEach((name, id) => {
        const option = document.createElement("option");
        option.value = id;
        option.textContent = name;
        selectCategory.appendChild(option);
    });

    const formFooter = document.createElement("div");
    formFooter.classList.add("form-footer");

    const buttonValidate = document.createElement("button");
    buttonValidate.textContent = "Valider";
    buttonValidate.type = "submit";
    buttonValidate.classList.add("button-validate");

    formFooter.appendChild(buttonValidate);
    form.append(labelTitle, inputTitle, labelCategory, selectCategory, formFooter);
    modal.appendChild(form);

    // BOUTON RETOUR
    divBack.style.visibility = "visible";
    divBack.style.pointerEvents = "auto";

    divBack.addEventListener("click", () => {
        form.style.display = "none";
        divCaseAdd.style.display = "none";
        if (modalGallery) modalGallery.style.display = "grid";
        if (oldFormFooter) oldFormFooter.style.display = "flex";

        modalTitle.textContent = originalTitle;
        divBack.style.visibility = "hidden";
        divBack.style.pointerEvents = "none";
    });

    // VALIDATION DU FORMULAIRE
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const oldProblem = modalTitle.querySelector(".empty-problem");
        if (oldProblem) oldProblem.remove();

        const file = inputFile.files[0];
        if (!file || !inputTitle.value) {
            const problemEmpty = document.createElement("span");
            problemEmpty.classList.add("empty-problem");
            problemEmpty.textContent = "Veuillez remplir tous les champs avant de valider.";
            modalTitle.append(problemEmpty);
            console.error("Formulaire incomplet.");
            return;
        }

        const formData = new FormData();
        formData.append("title", inputTitle.value);
        formData.append("category", selectCategory.value);
        formData.append("image", file);

        const token = localStorage.getItem("token");

        const response = await fetch("http://localhost:5678/api/works", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: formData
        });

        if (response.ok) {
            const newProject = await response.json();
            addProjectToGalleries(newProject);
            const preview = divCaseAdd.querySelector("#preview");
            if (preview) preview.remove();
            form.reset();
        } else {
            console.error("Erreur lors de l'ajout du projet");
        }
    });

    // AJOUT DU PROJET
    function addProjectToGalleries(newProject) {
        // Galerie principale
        const divGallery = document.querySelector(".gallery");
        createProject(newProject, divGallery);
        applyFilters();

        // Galerie modale
        const divModalGallery = document.querySelector(".modal-gallery");
        if (divModalGallery) {
            const figure = document.createElement("figure");
            figure.dataset.id = newProject.id;
            figure.dataset.category = newProject.categoryId;

            const img = document.createElement("img");
            img.src = newProject.imageUrl;
            figure.appendChild(img);

            const deleteIcon = document.createElement("div");
            deleteIcon.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;
            deleteIcon.classList.add("delete-icon");
            deleteIcon.addEventListener("click", () => deleteProject(newProject.id));
            figure.appendChild(deleteIcon);

            divModalGallery.appendChild(figure);
        }
    }
}