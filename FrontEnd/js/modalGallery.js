// FONCTION ouvrir modale
async function openModalGallery() {
    // Supprimer ancienne modale et overlay
    const existingModal = document.querySelector(".modal");
    const existingOverlay = document.querySelector(".overlay");
    if (existingModal) existingModal.remove();
    if (existingOverlay) existingOverlay.remove();

    // Récupération des projets depuis le backend
    const response = await fetch("http://localhost:5678/api/works");
    const projects = await response.json();

    // Création modale et overlay
    const divModal = document.createElement("div");
    const divOverlay = document.createElement("div");
    divModal.classList.add("modal");
    divOverlay.classList.add("overlay");
    document.body.prepend(divOverlay, divModal);

    // Création header modale
    const divHeader = document.createElement("div");
    const divTopIcons = document.createElement("div");
    const divBack = document.createElement("div");
    const divClose = document.createElement("div");
    const modalTitle = document.createElement("span");

    divHeader.classList.add("modal-header");
    divTopIcons.classList.add("modal-top-icons");
    divBack.classList.add("back-arrow");
    divClose.classList.add("close");
    modalTitle.classList.add("modal-title");

    divBack.innerHTML = `<i class="fa-solid fa-arrow-left"></i>`;
    divClose.innerHTML = `<i class="fa-solid fa-xmark"></i>`;
    modalTitle.textContent = "Galerie photo";

    // Cacher back au départ
    divBack.style.visibility = "hidden";
    divBack.style.pointerEvents = "none";

    divTopIcons.append(divBack, divClose);
    divHeader.append(divTopIcons, modalTitle);
    divModal.appendChild(divHeader);

    // Création galerie de la modale
    const divModalGallery = document.createElement("div");
    divModalGallery.classList.add("modal-gallery");

    projects.forEach(project => {
        const figure = document.createElement("figure");
        figure.dataset.id = project.id;

        // Appeler la fonction de création de contenu
        createProject(project, figure);

        // Supprimer figcaption si nécessaire
        const fc = figure.querySelector("figcaption");
        if (fc) fc.remove();

        // Création icône poubelle
        const deleteIcon = document.createElement("div");
        deleteIcon.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;
        deleteIcon.classList.add("delete-icon");
        deleteIcon.addEventListener("click", () => deleteProject(project.id));

        figure.appendChild(deleteIcon);
        divModalGallery.appendChild(figure);
    });

    divModal.appendChild(divModalGallery);

    // Création footer modale
    const formFooter = document.createElement("div");
    formFooter.classList.add("form-footer");

    const addButton = document.createElement("button");
    addButton.classList.add("add-button");
    addButton.textContent = "Ajouter une photo";

    formFooter.appendChild(addButton);
    divModal.appendChild(formFooter);

    // FONCTION fermer la modale
    function closeModal() {
        const modal = document.querySelector(".modal");
        const overlay = document.querySelector(".overlay");

        if (modal) modal.remove();
        if (overlay) overlay.remove();
    }

    // Event listeners pour fermer modale
    divOverlay.addEventListener("click", closeModal);
    divClose.addEventListener("click", closeModal);

    // Event listener pour formulaire ajout photo
    addButton.addEventListener("click", () => openAddImageModal(projects, divBack, modalTitle));
}

// FONCTION supprimer un projet
async function deleteProject(projectId) {
    const token = localStorage.getItem("token");

    const response = await fetch(`http://localhost:5678/api/works/${projectId}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    if (response.ok) {
        // Supprimer figure dans modale
        const figureInModal = document.querySelector(`.modal-gallery figure[data-id='${projectId}']`);
        if (figureInModal) figureInModal.remove();

        // Supprimer figure sur la page principale
        const figureOnPage = document.querySelector(`.project[data-id='${projectId}']`);
        if (figureOnPage) figureOnPage.remove();

    } else {
        console.error("Erreur lors de la suppression du projet");
    }
}
