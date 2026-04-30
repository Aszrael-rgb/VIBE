import React from 'react';
import { Play } from 'lucide-react';
import './SongCard.css';

const SongCard = ({ song, onPlay }) => {
  // Use a medium quality image with fallbacks
  const imageUrl = song?.image?.[2]?.url || song?.image?.[1]?.url || song?.image?.[0]?.url || 'https://via.placeholder.com/150';
  const artistName = song?.artist || song?.artists?.primary?.[0]?.name || 'Unknown Artist';

  return (
    <div className="song-card fade-in" onClick={() => song && onPlay(song)}>
      <div className="card-image-container">
        <img src={imageUrl} alt={song?.name || 'Song'} className="card-image" />
        <div className="play-overlay">
          <div className="play-button-circle">
            <Play fill="black" size={24} />
          </div>
        </div>
      </div>
      <div className="card-content">
        <h3 className="song-title">{song?.name || 'Untitled'}</h3>
        <p className="song-artist">{artistName}</p>
      </div>
    </div>
  );
};

export default SongCard;
