# Portfolio Sophie Bluel

Un portfolio d'architecte d'intérieur avec une zone admin pour gérer les projets.

## Quick Start

Identifiants de connexion (pré-remplis dans le formulaire) :

- Email : `admin@admin.com`
- Mot de passe : `admin123`

## Qu'est-ce que c'est ?

- Page d'accueil : Affiche la galerie des projets
- Page de connexion : Zone d'authentification (démo)
- Zone admin : Ajouter/supprimer des projets après connexion

## Dossiers

```
├── index.html          # Page d'accueil
├── login.html          # Page de connexion
├── assets/             # Images et styles CSS
├── data/               # Fichiers JSON (données)
│   ├── users.json      # Comptes utilisateurs
│   ├── works.json      # Projets
│   └── categories.json # Catégories
└── js/                 # Code JavaScript
    ├── api.js          # API mockée simple
    ├── login.js        # Logique de connexion
    ├── gallery.js      # Affichage galerie
    └── ...
```

## Comment ça marche (pour un junior frontend)

### API mockée

Pas de vrai serveur backend ! À la place, on utilise une API simple qui :

- Charge les données depuis des fichiers JSON (data/works.json, data/categories.json)
- Utilise `fetch` et `async/await`
- Stocke les modifications dans le navigateur avec `localStorage`

Exemple simple dans api.js :

```javascript
async getWorks() {
    const response = await fetch("data/works.json");
    const works = await response.json();
    localStorage.setItem("works", JSON.stringify(works));
    return works;
}
```

### Authentification

Les identifiants sont vérifiés directement dans le code (démo) :

- Email : `admin@admin.com`
- Mot de passe : `admin123`
- Un token fictif est stocké dans `localStorage`

### Ajouter/Supprimer des projets

Les modifications ne sont sauvegardées que dans `localStorage` (le navigateur), pas en base de données. Donc :

- Si tu rafraîchis la page : les changements restent
- Si tu fermes complètement l'onglet : tout est réinitialisé

## Points importants

- Les identifiants sont visibles dans le code (ok pour une démo)
- Les données persistent pendant la session utilisateur
- C'est une simulation, pas un vrai backend
- À ne pas utiliser en production avec des vraies données

---

Projet de portfolio frontend pour apprendre JavaScript, fetch, et localStorage.
