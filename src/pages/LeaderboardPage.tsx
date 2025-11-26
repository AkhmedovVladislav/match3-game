import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import '../styles/Text.css';
import '../styles/Button.css';
import '../styles/LeaderBoard.css';
import { getLeaderboard } from '../utils/leaderboard';

const LeaderBoard = () => {
  const navigate = useNavigate();
  const snowRef = useRef<HTMLDivElement>(null);
  const leaderboard = getLeaderboard();

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

  return (
    <div
      className="page-container"
      style={{
        backgroundImage: `url(${process.env.PUBLIC_URL}/images/leaderboard-bg.jpg)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="snow-container" ref={snowRef}></div>

      <div className="leaderboard-panel">
        <h1 className="leaderboard-title">Таблица лидеров</h1>

        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Имя</th>
              <th>Время</th>
              <th>Сложность</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((entry, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{entry.name}</td>
                <td>formatTime({entry.time})</td>
                <td>{entry.difficulty}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <Button onClick={() => navigate('/')} className="button leaderboard-button">
          Вернуться в главное меню
        </Button>
      </div>
    </div>
  );
};

export default LeaderBoard;
