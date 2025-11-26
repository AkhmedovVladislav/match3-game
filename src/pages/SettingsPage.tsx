import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import '../styles/Global.css';
import '../styles/SettingsPage.css';

const SettingsPage = () => {
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const navigate = useNavigate();
  const snowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = snowRef.current;
    if (!container) return;

    const interval = setInterval(() => {
      const flake = document.createElement('div');
      flake.className = 'snowflake';
      flake.textContent = '❄️';
      flake.style.left = `${Math.random() * 100}%`;
      flake.style.animationDuration = `${4 + Math.random() * 4}s`;
      flake.style.opacity = String(0.7 + Math.random() * 0.3);
      flake.style.fontSize = `${10 + Math.random() * 15}px`;
      container.appendChild(flake);

      setTimeout(() => flake.remove(), 8000);
    }, 200);

    return () => clearInterval(interval);
  }, []);

  const startGame = () => {
    navigate('/game', { state: { difficulty } });
  };

  return (
    <div
      className="page-container settings-bg"
      style={{ backgroundImage: `url(/images/main-bg.jpg)` }}
    >
      <div className="snow-container" ref={snowRef}></div>

      <div className="panel">
        <h1 className="h1-glow">Спаси Новый год!</h1>
        <h2 className="h2-glow">Три в ряд</h2>

        <div className="difficulty-selector">
          <h3>Выберите уровень сложности:</h3>
          <div className="difficulty-options">
            {(['easy', 'medium', 'hard'] as const).map((level) => (
              <label
                key={level}
                className={`difficulty-option ${difficulty === level ? 'selected' : ''}`}
              >
                <input
                  type="radio"
                  name="difficulty"
                  value={level}
                  checked={difficulty === level}
                  onChange={() => setDifficulty(level)}
                />
                <span>
                  {level === 'easy' && 'Простой — для новичков'}
                  {level === 'medium' && 'Средний — классика'}
                  {level === 'hard' && 'Сложный — для мастеров!'}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="button-group">
          <Button onClick={startGame}>Начать игру</Button>
          <div className="button-row">
            <Button onClick={() => navigate('/rules')}>Правила игры</Button>
            <Button onClick={() => navigate('/leaderboard')}>Таблица лидеров</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
 
