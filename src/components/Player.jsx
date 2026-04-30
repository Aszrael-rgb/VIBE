import React, { useState, useEffect, useRef } from 'react';
import YouTube from 'react-youtube';
import { Play, Pause, SkipBack, SkipForward, Repeat, Shuffle, Volume2, Maximize2, ListMusic } from 'lucide-react';
import './Player.css';

const Player = ({ currentSong }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1); // YouTube volume is 0-100, we map 0-1 to 0-100
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const playerRef = useRef(null);
  const progressInterval = useRef(null);

  // Configuración de la Media Session API para Segundo Plano
  const updateMediaSession = () => {
    if ('mediaSession' in navigator && currentSong) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: currentSong.name,
        artist: currentSong.artist || 'YouTube Music',
        album: 'VIBE Music',
        artwork: [
          { src: currentSong.image[0].url, sizes: '512x512', type: 'image/jpeg' },
        ]
      });

      navigator.mediaSession.setActionHandler('play', () => {
        if (playerRef.current) playerRef.current.playVideo();
      });
      navigator.mediaSession.setActionHandler('pause', () => {
        if (playerRef.current) playerRef.current.pauseVideo();
      });
    }
  };

  useEffect(() => {
    updateMediaSession();
  }, [currentSong]);

  const onReady = (event) => {
    playerRef.current = event.target;
    playerRef.current.setVolume(volume * 100);
    // Play automatically when ready
    if (currentSong) {
      playerRef.current.playVideo();
    }
  };

  const onStateChange = (event) => {
    // 1 = playing, 2 = paused, 0 = ended
    if (event.data === 1) {
      setIsPlaying(true);
      setDuration(playerRef.current.getDuration());
      
      // Update progress every second
      progressInterval.current = setInterval(() => {
        if (playerRef.current) {
          const cTime = playerRef.current.getCurrentTime();
          const dur = playerRef.current.getDuration();
          setCurrentTime(cTime);
          setProgress((cTime / dur) * 100);
        }
      }, 1000);
    } else {
      setIsPlaying(false);
      clearInterval(progressInterval.current);
    }
  };

  const togglePlay = () => {
    if (!playerRef.current) return;
    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
  };

  const handleProgressChange = (e) => {
    if (!playerRef.current) return;
    const newProgress = e.target.value;
    setProgress(newProgress);
    const newTime = (newProgress / 100) * duration;
    playerRef.current.seekTo(newTime);
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e) => {
    const newVolume = e.target.value;
    setVolume(newVolume);
    if (playerRef.current) {
      playerRef.current.setVolume(newVolume * 100);
    }
  };

  const formatTime = (time) => {
    if (isNaN(time) || time === 0) return "0:00";
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (!currentSong) return <div className="player glass"></div>;

  const imageUrl = currentSong?.image?.[0]?.url || 'https://via.placeholder.com/50';

  // Configuración del IFrame oculto de YouTube
  const ytOpts = {
    height: '0', // Ocultamos el video
    width: '0',
    playerVars: {
      autoplay: 1,
      controls: 0,
      playsinline: 1, // Crucial para que no se abra a pantalla completa en iOS
    },
  };

  return (
    <footer className="player glass">
      {/* Reproductor oficial de YouTube (invisible) */}
      <div style={{ display: 'none' }}>
        <YouTube 
          videoId={currentSong.id} 
          opts={ytOpts} 
          onReady={onReady}
          onStateChange={onStateChange}
        />
      </div>
      
      <div className="song-info">
        <img src={imageUrl} alt={currentSong?.name} className="player-art" />
        <div className="player-metadata">
          <div className="player-song-name">{currentSong?.name || 'Untitled'}</div>
          <div className="player-artist-name">{currentSong?.artist || 'Unknown Artist'}</div>
        </div>
      </div>

      <div className="player-controls-container">
        <div className="control-buttons">
          <button className="control-btn secondary"><Shuffle size={18} /></button>
          <button className="control-btn secondary"><SkipBack size={24} fill="currentColor" /></button>
          <button className="control-btn play-pause" onClick={togglePlay}>
            {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
          </button>
          <button className="control-btn secondary"><SkipForward size={24} fill="currentColor" /></button>
          <button className="control-btn secondary"><Repeat size={18} /></button>
        </div>
        
        <div className="progress-container">
          <span className="time">{formatTime(currentTime)}</span>
          <input
            type="range"
            className="progress-bar"
            value={progress}
            onChange={handleProgressChange}
            min="0"
            max="100"
          />
          <span className="time">{formatTime(duration)}</span>
        </div>
      </div>

      <div className="extra-controls">
        <button className="control-btn secondary"><ListMusic size={20} /></button>
        <div className="volume-control">
          <Volume2 size={20} />
          <input
            type="range"
            className="volume-bar"
            value={volume}
            onChange={handleVolumeChange}
            min="0"
            max="1"
            step="0.01"
          />
        </div>
        <button className="control-btn secondary"><Maximize2 size={18} /></button>
      </div>
    </footer>
  );
};

export default Player;
