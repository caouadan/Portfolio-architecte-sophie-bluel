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

## Déployer sur GitHub Pages

GitHub Pages publie gratuitement des sites web statiques (HTML/CSS/JS).

### Ce qu'il te faut

- Un compte GitHub (gratuit sur github.com)
- Git installé

### Les étapes

#### 1. Créer un repository sur GitHub

1. Va sur https://github.com/new
2. Donne un nom : `mon-portfolio` (ou ce que tu veux)
3. Coche "Public"
4. Clique "Create repository"

#### 2. Initialiser Git en local

Ouvre PowerShell dans ton dossier et tape :

```bash
git init
git add .
git commit -m "Premier commit du portfolio"
git branch -M main
```

#### 3. Connecter à GitHub

Remplace `TON_USER` et `mon-portfolio` :

```bash
git remote add origin https://github.com/TON_USER/mon-portfolio.git
git push -u origin main
```

#### 4. Activer GitHub Pages

1. Va sur ton repo (https://github.com/TON_USER/mon-portfolio)
2. Clique "Settings"
3. À gauche : "Pages"
4. Source : `Deploy from a branch`
5. Branche : `main`, dossier : `/root`
6. Clique "Save"

#### 5. C'est en ligne !

Après 1-2 minutes, ton site est accessible à :

```
https://TON_USER.github.io/mon-portfolio/
```

## Tester en local

Avant de publier sur GitHub :

```bash
# Avec Python
python -m http.server 8000

# Ou avec Node.js
npx http-server
```

Va sur `http://localhost:8000`

## Points importants

- Les identifiants sont visibles dans le code (ok pour une démo)
- Les données persistent pendant la session utilisateur
- C'est une simulation, pas un vrai backend
- À ne pas utiliser en production avec des vraies données

---

Projet de portfolio frontend pour apprendre JavaScript, fetch, et localStorage.
