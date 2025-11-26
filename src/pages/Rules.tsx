import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import '../styles/Text.css';
import '../styles/Button.css';
import '../styles/Rules.css';

const Rules = () => {
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
      flake.style.animationDuration = `${5 + Math.random() * 5}s`;
      flake.style.opacity = String(0.6 + Math.random() * 0.4);
      flake.style.fontSize = `${12 + Math.random() * 12}px`;
      container.appendChild(flake);
      setTimeout(() => flake.remove(), 10000);
    }, 220);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
  className="page-container"
  style={{
    minHeight: "100vh",
    background: "linear-gradient(135deg, #001833 0%, #003366 50%, #004488 100%)",
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px 10px",
    boxSizing: "border-box",
  }}
>
      <div className="snow-container" ref={snowRef}></div>

      <div className="rules-panel">
        <h1 className="rules-title">Правила игры</h1>

        <div className="rules-story">
          <p>
            В канун Нового года Дед Мороз составлял список детей, которые хорошо вели себя в уходящем году,
            чтобы подарить им подарки.
          </p>
          <p>
            Но злобный <strong>Гринч</strong> заколдовал компьютер Деда Мороза!
            Теперь база данных заработает только если кто-то победит в игру «Три в ряд».
          </p>
          <p className="highlight">
            Помоги Деду Морозу — спаси Новый год!
          </p>
        </div>

        <div className="rules-section">
          <h2>Как играть</h2>
          <p>
            Собирайте ряды из <strong>3 и более одинаковых предметов</strong> по горизонтали или вертикали.<br />
            Меняйте местами только <strong>соседние</strong> элементы.
          </p>

          <h2>Режимы сложности</h2>
          <ul>
            <li><strong>Простой:</strong> поле 12×12, цель — 40 очков, свободные свапы</li>
            <li><strong>Средний:</strong> поле 8×8, цель — 50 очков, только правильные свапы</li>
            <li><strong>Сложный:</strong> поле 8×8, цель — 25 очков, только один нужный предмет за матч!</li>
          </ul>

          <h2>Дополнительно</h2>
          <ul>
            <li>Очки начисляются за каждый удалённый предмет</li>
            <li>Кнопка «Обновить поле» — −5 очков</li>
            <li>Игра заканчивается при достижении цели</li>

          </ul>
        </div>

        <Button
          onClick={() => navigate('/')}
          className="button rules-button"
        >
          Вернуться в главное меню
        </Button>
      </div>
    </div>
  );
};

export default Rules;

