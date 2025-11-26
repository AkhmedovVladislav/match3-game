import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { addLeaderboardEntry } from '../utils/leaderboard';
import Button from '../components/Button';
import '../styles/Text.css';
import '../styles/Button.css';
import '../styles/FinalScreenPage.css';

const FinalScreenPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { score, time, difficulty } = location.state as {
    score: number;
    time: number;
    difficulty: 'easy' | 'medium' | 'hard';
  };

  const [playerName, setPlayerName] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const snowRef = useRef<HTMLDivElement>(null);
  const confettiRef = useRef<HTMLDivElement>(null);
  const victorySound = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    victorySound.current = new Audio(`${process.env.PUBLIC_URL}/sounds/victory.mp3`);
    victorySound.current.volume = 0.6;
    victorySound.current.play().catch(() => {});

    const container = confettiRef.current;
    if (container) {
      const colors = ['#ff6b6b', '#4ecdc4', '#f1c40f', '#a0eaff', '#ff9ff3', '#f39c12'];
      for (let i = 0; i < 120; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = `${Math.random() * 100}vw`;
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDelay = `${Math.random() * 3}s`;
        confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
        container.appendChild(confetti);
        setTimeout(() => confetti.remove(), 5000);
      }
    }

    const snowContainer = snowRef.current;
    if (!snowContainer) return;
    const interval = setInterval(() => {
      const flake = document.createElement('div');
      flake.className = 'snowflake';
      flake.textContent = '❄️';
      flake.style.left = `${Math.random() * 100}%`;
      flake.style.animationDuration = `${4 + Math.random() * 4}s`;
      flake.style.opacity = String(0.8 + Math.random() * 0.2);
      flake.style.fontSize = `${15 + Math.random() * 20}px`;
      snowContainer.appendChild(flake);
      setTimeout(() => flake.remove(), 8000);
    }, 150);

    return () => clearInterval(interval);
  }, []);

  const handleSubmit = () => {
    if (!playerName.trim()) return;
    addLeaderboardEntry({ name: playerName.trim(), time, difficulty });
    setSubmitted(true);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div
      className="page-container"
      style={{
        background: 'linear-gradient(135deg, #001833 0%, #003366 50%, #004488 100%)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        position: 'relative',
      }}
      >
      <div className="snow-container" ref={snowRef}></div>
      <div className="confetti-container" ref={confettiRef}></div>

      <div className="final-panel">
        <h1 className="final-title">ПОБЕДА!</h1>
        <h2 className="final-subtitle">Новый год спасён!</h2>

        <div className="final-stats">
          <p><strong>Сложность:</strong> <span style={{ color: '#01c4c4ff' }}>{difficulty.toUpperCase()}</span></p>
          <p><strong>Очки:</strong> <span style={{ color: '#4ecdc4', fontSize: '2.2rem' }}>{score}</span></p>
          <p><strong>Время:</strong> <span style={{ color: '#a0eaff' }}>{formatTime(time)}</span></p>
        </div>

        {!submitted ? (
          <div className="player-input-container">
            <input
              type="text"
              placeholder="Ваше имя в историю..."
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
              className="player-input"
            />
            <div className="button-row">
              <Button onClick={handleSubmit}>Сохранить в легенды</Button>
              <Button onClick={() => navigate('/')}>Не сохранять</Button>
            </div>
          </div>
        ) : (
          <div style={{ margin: '40px 0' }}>
            <p style={{ fontSize: '2rem', color: '#01c4c4ff', marginBottom: '30px' }}>
              {playerName}, ты вошёл в историю!
            </p>
            <div className="button-row">
              <Button onClick={() => navigate('/leaderboard')}>Таблица лидеров</Button>
              <Button onClick={() => navigate('/')}>Главное меню</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FinalScreenPage;
