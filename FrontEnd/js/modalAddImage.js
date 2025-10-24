// FONCTION message d'erreur
function showAddImageError(message) {
    let error = document.querySelector(".empty-problem");
    if (!error) {
        error = document.createElement("span");
        error.classList.add("empty-problem");
        const modalTitle = document.querySelector(".modal .modal-title");
        modalTitle.appendChild(error);
    }
    error.textContent = message;
}

// FONCTION preview image
function previewImage(input, divCaseAdd, addImgContainer) {
    const file = input.files[0];
    const oldProblem = divCaseAdd.querySelector(".image-problem");
    if (oldProblem) oldProblem.remove();
    if (!file) return;

    if (file.size > 4 * 1024 * 1024) {
        const problemImage = document.createElement("span");
        problemImage.classList.add("image-problem");
        problemImage.textContent = "Votre image dépasse le poids maximal.";
        divCaseAdd.appendChild(problemImage);
        console.error("Image trop lourde.");
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        addImgContainer.style.display = "none";
        const img = document.createElement("img");
        img.src = e.target.result;
        img.id = "preview";
        divCaseAdd.appendChild(img);
    };
    reader.readAsDataURL(file);
}

// FONCTION zone image
function createImageUploadSection() {
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
    const addImgContainer = document.createElement("div");
    addImgContainer.classList.add("addimg-container");

    ajouterPhoto.addEventListener("click", () => inputFile.click());
    inputFile.addEventListener("change", function () {
        previewImage(this, divCaseAdd, addImgContainer);
    });

    divCaseAdd.append(addImgContainer);
    addImgContainer.append(divImgIcon, ajouterPhoto, imgRequirement, inputFile);

    return { divCaseAdd, inputFile, addImgContainer };
}

// FONCTION formulaire d'ajout
function createAddImageForm(projects) {
    const form = document.createElement("form");
    form.classList.add("form-add");
    const labelTitle = document.createElement("label");
    labelTitle.textContent = "Titre";
    const inputTitle = document.createElement("input");
    inputTitle.name = "title";
    const labelCategory = document.createElement("label");
    labelCategory.textContent = "Catégorie";
    const selectWrapper = document.createElement("div");
    selectWrapper.classList.add("select-wrapper");
    const selectCategory = document.createElement("select");
    selectCategory.name = "category";

    const categoriesSet = new Map();
    projects.forEach(project => categoriesSet.set(project.category.id, project.category.name));
    categoriesSet.forEach((name, id) => {
        const option = document.createElement("option");
        option.value = id;
        option.textContent = name;
        selectCategory.appendChild(option);
    });

    const icon = document.createElement("i");
    icon.className = "fa-solid fa-chevron-down";
    selectWrapper.appendChild(selectCategory);
    selectWrapper.appendChild(icon);

    const modalFooter = document.createElement("footer");
    modalFooter.classList.add("form-footer");
    const buttonValidate = document.createElement("button");
    buttonValidate.type = "submit";
    buttonValidate.classList.add("button-validate");
    buttonValidate.textContent = "Valider";
    modalFooter.appendChild(buttonValidate);

    form.append(labelTitle, inputTitle, labelCategory, selectWrapper, modalFooter);

    return { form, inputTitle, selectCategory };
}

// FONCTION ajout dans les galeries
function addProjectToGalleries(newProject) {
    const divGallery = document.querySelector(".gallery");
    createProject(newProject, divGallery);

    const modalSectionGallery = document.querySelector(".modal-gallery");
    if (!modalSectionGallery) return;

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

    modalSectionGallery.appendChild(figure);
}

// FONCTION soumisson du formulaire
async function handleImageSubmit(e, inputFile, inputTitle, selectCategory, divCaseAdd, addImgContainer) {
    e.preventDefault();

    const file = inputFile.files[0];
    if (!file || !inputTitle.value) {
        showAddImageError("Veuillez remplir tous les champs avant de valider.");
        console.error("Formulaire incomplet.");
        return;
    }

    const formData = new FormData();
    formData.append("title", inputTitle.value);
    formData.append("category", selectCategory.value);
    formData.append("image", file);

    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/works`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` },
        body: formData
    });

    if (response.ok) {
        const newProject = await response.json();
        addProjectToGalleries(newProject);

        inputTitle.value = "";
        selectCategory.value = "";
        const preview = divCaseAdd.querySelector("#preview");
        if (preview) preview.remove();
        const errorForm = document.querySelector(".empty-problem");
        if (errorForm) errorForm.remove();

        addImgContainer.style.display = "flex";
    } else {
        console.error("Erreur lors de l'ajout du projet");
    }
}

// FONCTION ouvrir modale ajout image
async function openAddImageModal(projects, backArrow, modalTitle) {
    const modal = document.querySelector(".modal");
    const originalTitle = modalTitle.textContent;
    modalTitle.textContent = "Ajout photo";

    const modalGallery = modal.querySelector(".modal-gallery");
    if (modalGallery) modalGallery.style.display = "none";
    const oldFormFooter = modal.querySelector(".form-footer");
    if (oldFormFooter) oldFormFooter.style.display = "none";

    const { divCaseAdd, inputFile, addImgContainer } = createImageUploadSection();
    modal.appendChild(divCaseAdd);
    const { form, inputTitle, selectCategory } = createAddImageForm(projects);
    modal.appendChild(form);

    backArrow.style.visibility = "visible";
    backArrow.style.pointerEvents = "auto";
    backArrow.addEventListener("click", () => {
        form.style.display = "none";
        divCaseAdd.style.display = "none";
        if (modalGallery) modalGallery.style.display = "grid";
        if (oldFormFooter) oldFormFooter.style.display = "flex";
        modalTitle.textContent = originalTitle;
        backArrow.style.visibility = "hidden";
        backArrow.style.pointerEvents = "none";
    });

    form.addEventListener("submit", (e) => handleImageSubmit(e, inputFile, inputTitle, selectCategory, divCaseAdd, addImgContainer));
}