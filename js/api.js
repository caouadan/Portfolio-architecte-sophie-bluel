// API mockée simplifiée pour démonstration frontend (GitHub Pages)

const api = {
    // Récupérer tous les projets (charge depuis JSON puis utilise localStorage)
    async getWorks() {
        try {
            const response = await fetch("data/works.json");
            const works = await response.json();
            localStorage.setItem("works", JSON.stringify(works));
            return works;
        } catch (error) {
            console.error("Erreur lors du chargement des projets:", error);
            return [];
        }
    },

    // Récupérer toutes les catégories
    async getCategories() {
        try {
            const response = await fetch("data/categories.json");
            const categories = await response.json();
            localStorage.setItem("categories", JSON.stringify(categories));
            return categories;
        } catch (error) {
            console.error("Erreur lors du chargement des catégories:", error);
            return [];
        }
    },

    // Connexion simple (identifiants codés en dur pour la démo)
    login(email, password) {
        const emailCorrect = email === "admin@admin.com";
        const passwordCorrect = password === "admin123";

        if (emailCorrect && passwordCorrect) {
            // Stocker un token fictif pour vérifier l'authentification
            localStorage.setItem("token", "demo-token-123");
            return "demo-token-123";
        }

        return null;
    },

    // Ajouter un nouveau projet
    addWork(title, categoryId, imageUrl) {
        // Vérifier que l'utilisateur est connecté
        const token = localStorage.getItem("token");
        if (!token) {
            throw new Error("Vous devez être connecté pour ajouter un projet");
        }

        // Récupérer les projets actuels
        const works = JSON.parse(localStorage.getItem("works")) || [];

        // Créer un nouvel ID (le plus grand ID + 1)
        const newId = works.length > 0 ? Math.max(...works.map(w => w.id)) + 1 : 1;

        // Créer le nouvel objet projet
        const newWork = {
            id: newId,
            title,
            imageUrl,
            categoryId: parseInt(categoryId)
        };

        // Ajouter à la liste et sauvegarder
        works.push(newWork);
        localStorage.setItem("works", JSON.stringify(works));

        return newWork;
    },

    // Supprimer un projet
    deleteWork(id) {
        // Vérifier que l'utilisateur est connecté
        const token = localStorage.getItem("token");
        if (!token) {
            throw new Error("Vous devez être connecté pour supprimer un projet");
        }

        // Récupérer les projets actuels
        let works = JSON.parse(localStorage.getItem("works")) || [];

        // Filtrer pour retirer le projet avec cet ID
        works = works.filter(work => work.id !== id);

        // Sauvegarder la liste mise à jour
        localStorage.setItem("works", JSON.stringify(works));

        return true;
    }
};
