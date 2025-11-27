import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { addLeaderboardEntry } from '../utils/leaderboard';
import { formatTime } from "../utils/timerUtils";
import Button from '../components/Button';
import { startSnowfall } from '../utils/snowfall';
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


    const snowContainer = snowRef.current;
      if (!snowContainer) return;
      const stopSnow = startSnowfall(snowContainer);

      return () => stopSnow(); 
    }, []);

  const handleSubmit = () => {
    if (!playerName.trim()) return;
    addLeaderboardEntry({ name: playerName.trim(), time, difficulty });
    setSubmitted(true);
  };


  return (
    <div className="page-container">
      <div className="snow-container" ref={snowRef}></div>
      <div className="confetti-container" ref={confettiRef}></div>

      <div className="final-panel">
        <h1 className="final-title">ПОБЕДА!</h1>
        <h2 className="final-subtitle">Новый год спасён!</h2>

        <div className="final-stats">
          <p><strong>Сложность:</strong> <span className="difficulty">{difficulty.toUpperCase()}</span></p>
          <p><strong>Очки:</strong> <span className="score">{score}</span></p>
          <p><strong>Время:</strong> <span className="time">{formatTime(time)}</span></p>
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
          <div className="final-message">
            {playerName}, ты вошёл в историю!
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
