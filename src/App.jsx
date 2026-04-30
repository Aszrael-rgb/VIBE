import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Player from './components/Player';
import SongCard from './components/SongCard';
import { MusicService } from './services/MusicService';
import { Search as SearchIcon, Bell, User, ChevronLeft, ChevronRight } from 'lucide-react';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [trendingSongs, setTrendingSongs] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTrending();
  }, []);

  const fetchTrending = async () => {
    setLoading(true);
    const songs = await MusicService.getTrending();
    setTrendingSongs(songs);
    setLoading(false);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    setActiveTab('search');
    const results = await MusicService.searchYouTube(searchQuery);
    setSearchResults(results);
    setLoading(false);
  };

  const playSong = (song) => {
    setCurrentSong(song);
  };

  return (
    <div className="app-container">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="main-content">
        <header className="top-bar glass">
          <div className="nav-arrows">
            <button className="arrow-btn"><ChevronLeft /></button>
            <button className="arrow-btn"><ChevronRight /></button>
          </div>

          <form className="search-box" onSubmit={handleSearch}>
            <SearchIcon size={20} className="search-icon" />
            <input 
              type="text" 
              placeholder="Buscar en YouTube Music..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>

          <div className="user-actions">
            <button className="action-btn"><Bell size={20} /></button>
            <button className="profile-btn"><User size={20} /></button>
          </div>
        </header>

        <div className="content-scroll">
          {activeTab === 'home' && (
            <section className="home-section">
              <div className="hero-banner">
                <div className="hero-content">
                  <span className="badge">VANCED METHOD</span>
                  <h1>YouTube sin límites</h1>
                  <p>Toda la música de YouTube, sin anuncios, en segundo plano y directo a tus oídos.</p>
                  <button className="play-now-btn">Descubrir</button>
                </div>
              </div>

              <div className="section-header">
                <h2>Tendencias en YouTube</h2>
                <button className="show-all" onClick={fetchTrending}>Actualizar</button>
              </div>

              <div className="songs-grid">
                {trendingSongs.map((song) => (
                  <SongCard key={song.id} song={song} onPlay={playSong} />
                ))}
              </div>
            </section>
          )}

          {activeTab === 'search' && (
            <section className="search-section">
              <div className="section-header">
                <h2>{searchResults.length > 0 ? `Resultados para "${searchQuery}"` : 'Busca en YouTube'}</h2>
              </div>
              
              {loading ? (
                <div className="loader">Extrayendo audio de YouTube...</div>
              ) : (
                <div className="songs-grid">
                  {searchResults.map((song) => (
                    <SongCard key={song.id} song={song} onPlay={playSong} />
                  ))}
                </div>
              )}
            </section>
          )}
        </div>
      </main>

      <Player currentSong={currentSong} />
    </div>
  );
}

export default App;
