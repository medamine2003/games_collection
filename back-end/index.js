import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 7000;
const MONGODB_URI = "mongodb://127.0.0.1:27017/game_collection_db";

// Schéma du jeu
const gameSchema = new mongoose.Schema({
  titre: { type: String, required: true },
  genre: { type: [String], required: true },
  plateforme: { type: [String], required: true },
  editeur: { type: String, required: true },
  developpeur: { type: String, required: true },
  annee_sortie: { type: Number, required: true },
  metacritic_score: Number,
  temps_jeu_heures: { type: Number, default: 0 },
  termine: { type: Boolean, default: false },
  favori: { type: Boolean, default: false },
  date_ajout: { type: Date, default: Date.now },
  date_modification: { type: Date, default: Date.now }
});

const Game = mongoose.model('Game', gameSchema);

// Routes
app.get("/", (req, res) => {
  res.json({ message: "API Gestion de Jeux Vidéo" });
});

// POST /api/games - Ajouter un jeu
app.post("/api/games", async (req, res) => {
  try {
    const game = await Game.create(req.body);
    res.status(201).json(game);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET /api/games - Lister tous les jeux
app.get("/api/games", async (req, res) => {
  try {
    const games = await Game.find(req.query);
    res.json({ count: games.length, games });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/games/:id - Un jeu
app.get("/api/games/:id", async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) return res.status(404).json({ error: "Jeu non trouvé" });
    res.json(game);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/games/:id - Modifier un jeu
app.put("/api/games/:id", async (req, res) => {
  try {
    const game = await Game.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!game) return res.status(404).json({ error: "Jeu non trouvé" });
    res.json(game);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE /api/games/:id - Supprimer un jeu
app.delete("/api/games/:id", async (req, res) => {
  try {
    const game = await Game.findByIdAndDelete(req.params.id);
    if (!game) return res.status(404).json({ error: "Jeu non trouvé" });
    res.json({ message: "Jeu supprimé" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/games/:id/favorite - Favori
app.post("/api/games/:id/favorite", async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    game.favori = !game.favori;
    await game.save();
    res.json(game);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/stats - Statistiques
app.get("/api/stats", async (req, res) => {
  try {
    const games = await Game.find();
    res.json({
      total_jeux: games.length,
      jeux_termines: games.filter(g => g.termine).length,
      jeux_favoris: games.filter(g => g.favori).length,
      temps_jeu_total_heures: games.reduce((sum, g) => sum + g.temps_jeu_heures, 0),
      score_metacritic_moyen: games.length ? Math.round(games.reduce((sum, g) => sum + (g.metacritic_score || 0), 0) / games.length) : 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/export - Exporter
app.get("/api/export", async (req, res) => {
  try {
    const games = await Game.find();
    res.setHeader('Content-Disposition', 'attachment; filename=games.json');
    res.json(games);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Démarrage
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log("✅ MongoDB connecté");
    app.listen(PORT, () => console.log(`🚀 Serveur sur http://localhost:${PORT}`));
  })
  .catch(error => console.error("❌ Erreur:", error));