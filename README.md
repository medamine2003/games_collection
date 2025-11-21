🎮 Game Collection — API & Interface Graphique

Une application complète pour gérer une collection de jeux vidéo avec API RESTful et interface graphique.
Les utilisateurs peuvent ajouter, consulter, modifier et supprimer des jeux de leur collection personnelle.

🚀 Fonctionnalités principales

🔐 Authentification (optionnelle pour futures extensions)

📋 CRUD complet sur les jeux vidéo

✅ Validation des données côté serveur

⚙️ Architecture claire côté backend et frontend

🌍 Interface graphique pour gérer les données

💄 UI avec Bootstrap 5 ou Tailwind CSS (au choix)
⚙️ Installation et configuration
1. Cloner le projet
git clone https://github.com/ton-compte/game-collection.git
cd game-collection

2. Configurer le backend
cd backend
npm install

🧾 Fichier .env

Crée un fichier .env à la racine du dossier backend :

PORT=8000
MONGO_URI=mongodb://localhost:27017/game_collection_db

3. Lancer le backend
npm start


ou en mode développement :

npm run dev


Par défaut : 👉 http://localhost:8000/api

4. Configurer le frontend
cd ../frontend
npm install

⚙️ Fichier src/config/api.js
const API_URL = "http://localhost:8000/api";
export default API_URL;

5. Lancer le frontend
npm run dev


Par défaut : 👉 http://localhost:5173

💻 Scripts utiles

Frontend (React)

Commande	Description

## npm run dev	Démarre le front en mode développement

## npm run build	Génère la version de production
## npm run preview	Teste la version buildée localement
## Backend (Node)
## Commande	Description
## npm run dev	Démarre le serveur avec nodemon
## npm start	Démarre le serveur en production
## 🔌 Endpoints principaux (API REST)
## 🎮 Jeux Vidéo
## Méthode	Endpoint	Description
## POST	/api/games	Ajouter un nouveau jeu
## GET	/api/games	Lister tous les jeux
## GET	/api/games/:id	Obtenir un jeu spécifique
## PUT	/api/games/:id	Modifier un jeu
## DELETE	/api/games/:id	Supprimer un jeu

Exemple de jeu :

{
  "id": "auto-généré",
  "titre": "The Legend of Zelda: Breath of the Wild",
  "genre": ["Action", "Aventure", "RPG"],
  "plateforme": ["Nintendo Switch"],
  "editeur": "Nintendo",
  "developpeur": "Nintendo EPD",
  "annee_sortie": 2017,
  "metacritic_score": 97,
  "temps_jeu_heures": 85,
  "termine": true,
  "date_ajout": "2025-11-21T10:00:00Z",
  "date_modification": "2025-11-21T10:00:00Z"
}

🔍 Recherche et statistiques

🔎 Recherche et filtrage :
GET /api/games?genre=RPG&plateforme=PC

📊 Statistiques :
GET /api/stats (nombre total de jeux, temps de jeu total, etc.)

⭐ Favoris :
POST /api/games/:id/favorite

📁 Export des données :
GET /api/games/export

🧾 Validation des données
const gameSchema = {
  titre: { type: 'string', required: true, minLength: 1 },
  genre: { type: 'array', required: true, minItems: 1 },
  plateforme: { type: 'array', required: true, minItems: 1 },
  annee_sortie: { type: 'number', min: 1970, max: new Date().getFullYear() },
  metacritic_score: { type: 'number', min: 0, max: 100 },
  temps_jeu_heures: { type: 'number', min: 0 },
  termine: { type: 'boolean', required: true }
};

🧰 Objectifs d’apprentissage

✅ Comprendre les opérations CRUD avec MongoDB

✅ Implémenter une API RESTful

✅ Gérer la validation des données

✅ Utiliser les bonnes pratiques de développement

✅ Traiter les erreurs et les réponses HTTP

👨‍💻 Auteur

Développé par : Mohamed Amine Aissaoui

📄 Licence

Ce projet est sous licence MIT.
![Description de l'image](assets/image.png)
