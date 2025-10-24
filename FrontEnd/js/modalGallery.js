// FONCTION fermer la modale
function closeModal() {
    const modal = document.querySelector(".modal");
    const overlay = document.querySelector(".overlay");

    if (modal) modal.remove();
    if (overlay) overlay.remove();
}

// FONCTION galerie dans modale
function showGallery(modalSection, modalFooter, projects) {
    const modalGallery = document.createElement("div");
    modalGallery.classList.add("modal-gallery");

    projects.forEach(project => {
        const figure = document.createElement("figure");
        figure.dataset.id = project.id;

        createProject(project, figure);

        const fc = figure.querySelector("figcaption");
        if (fc) fc.remove();

        const deleteIcon = document.createElement("div");
        deleteIcon.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;
        deleteIcon.classList.add("delete-icon");
        deleteIcon.addEventListener("click", () => deleteProject(project.id));

        figure.appendChild(deleteIcon);
        modalGallery.appendChild(figure);
    });

    modalSection.insertBefore(modalGallery, modalFooter);
}

// FONCTION création base de la modale
function createModalBase(originalTitle = "Galerie photo") {
    const modalSection = document.createElement("section");
    modalSection.classList.add("modal");
    const overlayDiv = document.createElement("div");
    overlayDiv.classList.add("overlay");

    document.body.prepend(overlayDiv, modalSection);

    const modalHeader = document.createElement("header");
    modalHeader.classList.add("modal-header");
    const topIcons = document.createElement("div");
    topIcons.classList.add("modal-top-icons");
    const backArrow = document.createElement("div");

    backArrow.classList.add("back-arrow");
    backArrow.innerHTML = `<i class="fa-solid fa-arrow-left"></i>`;
    backArrow.style.visibility = "hidden";
    backArrow.style.pointerEvents = "none";

    const closeButton = document.createElement("div");
    closeButton.classList.add("close");
    closeButton.innerHTML = `<i class="fa-solid fa-xmark"></i>`;
    const modalTitle = document.createElement("span");

    modalTitle.classList.add("modal-title");
    modalTitle.textContent = originalTitle;

    topIcons.append(backArrow, closeButton);
    modalHeader.append(topIcons, modalTitle);
    modalSection.appendChild(modalHeader);

    const modalFooter = document.createElement("footer");
    modalFooter.classList.add("form-footer");
    addButton = document.createElement("button");
    addButton.classList.add("add-button");
    addButton.textContent = "Ajouter une photo";
    modalFooter.appendChild(addButton);
    modalSection.appendChild(modalFooter);

    return { modalSection, overlayDiv, backArrow, closeButton, modalTitle, modalFooter, addButton };
}

// FONCTION ouvrir modale galerie
async function openModalGallery() {
    document.querySelector(".modal")?.remove();
    document.querySelector(".overlay")?.remove();

    const { modalSection, overlayDiv, backArrow, closeButton, modalTitle, modalFooter, addButton } = createModalBase("Galerie photo");

    overlayDiv.addEventListener("click", closeModal);
    closeButton.addEventListener("click", closeModal);

    const response = await fetch(`${API_URL}/works`);
    const projects = await response.json();

    addButton.addEventListener("click", () => openAddImageModal(projects, backArrow, modalTitle));

    showGallery(modalSection, modalFooter, projects);
}

// FONCTION supprimer un projet
async function deleteProject(projectId) {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/works/${projectId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
    });

    if (response.ok) {
        const figureInModal = document.querySelector(`.modal-gallery [data-id='${projectId}']`);
        if (figureInModal) figureInModal.remove();

        const figureOnPage = document.querySelector(`.gallery [data-id='${projectId}']`);
        if (figureOnPage) figureOnPage.remove();
    } else {
        console.error("Erreur lors de la suppression du projet");
    }
}