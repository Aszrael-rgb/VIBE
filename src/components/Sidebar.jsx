import React from 'react';
import { Home, Search, Library, PlusSquare, Heart, Music2 } from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'home', icon: Home, label: 'Inicio' },
    { id: 'search', icon: Search, label: 'Buscar' },
    { id: 'library', icon: Library, label: 'Tu Biblioteca' },
  ];

  const playlistItems = [
    { icon: PlusSquare, label: 'Crear lista', color: '#fff' },
    { icon: Heart, label: 'Tus me gusta', color: '#8c52ff' },
  ];

  return (
    <aside className="sidebar">
      <div className="logo">
        <Music2 size={32} color="var(--accent)" />
        <span className="logo-text">VIBE</span>
      </div>

      <nav className="nav-menu">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => setActiveTab(item.id)}
          >
            <item.icon size={24} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="nav-section">
        {playlistItems.map((item, index) => (
          <button key={index} className="nav-item secondary">
            <item.icon size={24} color={item.color} />
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      <div className="divider"></div>

      <div className="playlists-scroll">
        {['Chill Mix', 'Late Night Drive', 'Workout Hits', 'Top 50 Global', 'Coding Beats'].map((playlist) => (
          <div key={playlist} className="playlist-link">
            {playlist}
          </div>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
