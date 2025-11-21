import React, { useState, useEffect } from 'react';

const API_URL = 'http://localhost:7000/api';

export default function GameForm() {
  const [games, setGames] = useState([]);
  const [stats, setStats] = useState({});
  const [filters, setFilters] = useState({ genre: '', plateforme: '', termine: '', favori: '' });
  const [formData, setFormData] = useState({
    titre: '', editeur: '', developpeur: '', annee_sortie: '',
    metacritic_score: '', temps_jeu_heures: 0, genre: '', plateforme: '', termine: false
  });

  useEffect(() => {
    loadGames();
    loadStats();
  }, []);

  const loadGames = async () => {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      const res = await fetch(`${API_URL}/games?${params}`);
      const data = await res.json();
      setGames(data.games || []);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const loadStats = async () => {
    try {
      const res = await fetch(`${API_URL}/stats`);
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error('Erreur stats:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const gameData = {
        ...formData,
        genre: formData.genre.split(',').map(s => s.trim()),
        plateforme: formData.plateforme.split(',').map(s => s.trim()),
        annee_sortie: parseInt(formData.annee_sortie),
        metacritic_score: formData.metacritic_score ? parseInt(formData.metacritic_score) : undefined,
        temps_jeu_heures: parseInt(formData.temps_jeu_heures) || 0
      };
      await fetch(`${API_URL}/games`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(gameData)
      });
      alert('Jeu ajouté !');
      setFormData({ titre: '', editeur: '', developpeur: '', annee_sortie: '', metacritic_score: '', temps_jeu_heures: 0, genre: '', plateforme: '', termine: false });
      loadGames();
      loadStats();
    } catch (error) {
      alert('Erreur');
    }
  };

  const toggleFavorite = async (id) => {
    await fetch(`${API_URL}/games/${id}/favorite`, { method: 'POST' });
    loadGames();
    loadStats();
  };

  const deleteGame = async (id) => {
    if (!confirm('Supprimer ce jeu ?')) return;
    await fetch(`${API_URL}/games/${id}`, { method: 'DELETE' });
    loadGames();
    loadStats();
  };

  const exportData = () => {
    window.open(`${API_URL}/export`, '_blank');
  };

  const allGenres = [...new Set(games.flatMap(g => g.genre))];
  const allPlateformes = [...new Set(games.flatMap(g => g.plateforme))];

  return (
    <div className="container my-5">

      <h1 className="text-center fw-bold mb-4 text-primary">🎮 Ma Collection de Jeux Vidéo</h1>

      {/* Stats */}
      <div className="row text-center mb-4">
        {[
          { label: "Total Jeux", value: stats.total_jeux },
          { label: "Terminés", value: stats.jeux_termines },
          { label: "Favoris", value: stats.jeux_favoris },
          { label: "Heures", value: (stats.temps_jeu_total_heures || 0) + "h" },
          { label: "Score Moyen", value: stats.score_metacritic_moyen }
        ].map((s, i) => (
          <div key={i} className="col-6 col-md-2 bg-primary text-white p-3 m-1 rounded">
            <small>{s.label}</small>
            <h3 className="fw-bold">{s.value || 0}</h3>
          </div>
        ))}
      </div>

      {/* Formulaire */}
      <div className="card mb-4">
        <div className="card-body">
          <h2 className="h4 mb-3">➕ Ajouter un Jeu</h2>

          <form onSubmit={handleSubmit} className="row g-3">
            <div className="col-md-4">
              <input type="text" className="form-control" placeholder="Titre *"
                value={formData.titre} required
                onChange={e => setFormData({...formData, titre: e.target.value})} />
            </div>

            <div className="col-md-4">
              <input type="text" className="form-control" placeholder="Éditeur *"
                value={formData.editeur} required
                onChange={e => setFormData({...formData, editeur: e.target.value})} />
            </div>

            <div className="col-md-4">
              <input type="text" className="form-control" placeholder="Développeur *"
                value={formData.developpeur} required
                onChange={e => setFormData({...formData, developpeur: e.target.value})} />
            </div>

            <div className="col-md-4">
              <input type="number" className="form-control" placeholder="Année *"
                value={formData.annee_sortie} required
                onChange={e => setFormData({...formData, annee_sortie: e.target.value})} />
            </div>

            <div className="col-md-4">
              <input type="number" className="form-control" placeholder="Score (0-100)"
                value={formData.metacritic_score}
                onChange={e => setFormData({...formData, metacritic_score: e.target.value})} />
            </div>

            <div className="col-md-4">
              <input type="number" className="form-control" placeholder="Heures de jeu"
                value={formData.temps_jeu_heures}
                onChange={e => setFormData({...formData, temps_jeu_heures: e.target.value})} />
            </div>

            <div className="col-md-6">
              <input type="text" className="form-control" placeholder="Genres (RPG, Action)"
                value={formData.genre} required
                onChange={e => setFormData({...formData, genre: e.target.value})} />
            </div>

            <div className="col-md-6">
              <input type="text" className="form-control" placeholder="Plateformes (PC, PS5)"
                value={formData.plateforme} required
                onChange={e => setFormData({...formData, plateforme: e.target.value})} />
            </div>

            <div className="col-12 form-check ms-2">
              <input type="checkbox" className="form-check-input"
                checked={formData.termine}
                onChange={e => setFormData({...formData, termine: e.target.checked})} />
              <label className="form-check-label">Jeu terminé</label>
            </div>

            <div className="col-12">
              <button type="submit" className="btn btn-primary w-100">
                Ajouter le Jeu
              </button>
            </div>

          </form>
        </div>
      </div>

      {/* Filtres */}
      <div className="d-flex flex-wrap gap-2 mb-4">
        <select className="form-select w-auto" value={filters.genre}
          onChange={e => setFilters({...filters, genre: e.target.value})}>
          <option value="">Tous les genres</option>
          {allGenres.map(g => <option key={g} value={g}>{g}</option>)}
        </select>

        <select className="form-select w-auto" value={filters.plateforme}
          onChange={e => setFilters({...filters, plateforme: e.target.value})}>
          <option value="">Toutes les plateformes</option>
          {allPlateformes.map(p => <option key={p} value={p}>{p}</option>)}
        </select>

        <select className="form-select w-auto" value={filters.termine}
          onChange={e => setFilters({...filters, termine: e.target.value})}>
          <option value="">Tous</option>
          <option value="true">Terminés</option>
          <option value="false">Non terminés</option>
        </select>

        <select className="form-select w-auto" value={filters.favori}
          onChange={e => setFilters({...filters, favori: e.target.value})}>
          <option value="">Tous</option>
          <option value="true">Favoris</option>
        </select>

        <button onClick={loadGames} className="btn btn-primary">Filtrer</button>
        <button onClick={exportData} className="btn btn-success">Exporter</button>
      </div>

      {/* Liste des jeux */}
      <div className="row g-3">
        {games.length === 0 ? (
          <div className="text-center text-muted py-5">
            <h2>Aucun jeu</h2>
            <p>Ajoutez votre premier jeu !</p>
          </div>
        ) : (
          games.map(game => (
            <div key={game._id} className="col-md-4">
              <div className={`card border ${game.favori ? 'border-warning' : ''}`}>
                <div className="card-body">

                  <h3 className="text-primary">{game.titre}</h3>

                  <p><strong>Éditeur:</strong> {game.editeur}</p>
                  <p><strong>Développeur:</strong> {game.developpeur}</p>
                  <p><strong>Année:</strong> {game.annee_sortie}</p>

                  {game.metacritic_score && (
                    <p><strong>Score:</strong> {game.metacritic_score}/100</p>
                  )}

                  <p><strong>Temps:</strong> {game.temps_jeu_heures}h</p>

                  {/* Badges */}
                  <div className="mb-3">
                    {game.genre.map(g => (
                      <span key={g} className="badge bg-info me-1">{g}</span>
                    ))}
                    {game.plateforme.map(p => (
                      <span key={p} className="badge bg-secondary me-1">{p}</span>
                    ))}
                    {game.termine && <span className="badge bg-success">✓ Terminé</span>}
                    {game.favori && <span className="badge bg-warning text-dark">⭐ Favori</span>}
                  </div>

                  {/* Boutons */}
                  <div className="d-flex gap-2">
                    <button onClick={() => toggleFavorite(game._id)} className="btn btn-warning w-50">
                      {game.favori ? '⭐' : '☆'}
                    </button>
                    <button onClick={() => deleteGame(game._id)} className="btn btn-danger w-50">
                      🗑️
                    </button>
                  </div>

                </div>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
