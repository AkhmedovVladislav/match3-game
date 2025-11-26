import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Board from "../components/Board";
import { useGameLogic } from "../hooks/useGameLogic";
import { formatTime } from "../utils/timerUtils";
import '../styles/GamePage.css';
import '../styles/Button.css';
import '../styles/Text.css';
import Button from "../components/Button"; 

const elements = ['🎄','🎁','❄️','🔔','🌟','🍪'];

const GamePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { difficulty } = location.state as { difficulty: 'easy' | 'medium' | 'hard' };

  const {
    grid,
    score,
    time,
    selectedCell,
    selectedTargetElement,
    goalScore,
    handleCellClick,
    handleRefresh,
    resetGame,
    animation,
    size,
  } = useGameLogic({
    difficulty,
    elements,
    onGameOver: (score, time) => navigate("/final", { state: { score, time, difficulty } })
  });

  const snowRef = useRef<HTMLDivElement | null>(null);
  const confettiRef = useRef<HTMLDivElement | null>(null);

  const matchSound = useRef<HTMLAudioElement | null>(null);
  const clickSound = useRef<HTMLAudioElement | null>(null);
  const errorSound = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    matchSound.current = new Audio(`${process.env.PUBLIC_URL}/sounds/match.mp3`);   
    clickSound.current = new Audio(`${process.env.PUBLIC_URL}/sounds/click.mp3`);     
    errorSound.current = new Audio(`${process.env.PUBLIC_URL}/sounds/error.mp3`);       

    [matchSound, clickSound, errorSound].forEach(sound => {
      if (sound.current) sound.current.volume = 0.4;
    });
  }, []);

  useEffect(() => {
    if (animation.matches.length > 0) {
      matchSound.current?.play();
    }
  }, [animation.matches]);

  useEffect(() => {
    if (animation.shake) {
      errorSound.current?.play();
    }
  }, [animation.shake]);

  useEffect(() => {
    const container = snowRef.current;
    if (!container) return;

    const interval = setInterval(() => {
      const flake = document.createElement("div");
      flake.className = "snowflake";
      flake.textContent = "❄️";
      flake.style.left = `${Math.random() * 100}%`;
      const duration = 4 + Math.random() * 3;
      flake.style.animationDuration = `${duration}s`;
      container.appendChild(flake);
      setTimeout(() => flake.remove(), duration * 1000);
    }, 200);

    return () => clearInterval(interval);
  }, []);

  const spawnConfetti = () => {
    const container = confettiRef.current;
    if (!container) return;

    for (let i = 0; i < 15; i++) {
      const confetti = document.createElement("div");
      confetti.className = "confetti";
      confetti.style.left = `${Math.random() * container.offsetWidth}px`;
      confetti.style.top = `0px`;
      confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 70%, 60%)`;
      container.appendChild(confetti);

      const duration = 1 + Math.random() * 1.5;
      confetti.style.animationDuration = `${duration}s`;

      setTimeout(() => confetti.remove(), duration * 1000);
    }
  };

  const handleCellClickWithSound = (row: number, col: number) => {
    clickSound.current?.play();
    handleCellClick(row, col);
    spawnConfetti();
  };

  const [soundEnabled, setSoundEnabled] = useState(true);  

  const soundtrackRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
  soundtrackRef.current = new Audio(`${process.env.PUBLIC_URL}/sounds/soundtrack.mp3`); 
  soundtrackRef.current.loop = true;
  soundtrackRef.current.volume = 0.3;  

  if (soundEnabled) {
    soundtrackRef.current.play().catch(() => {});  
  } else {
    soundtrackRef.current.pause();
  }

  return () => soundtrackRef.current?.pause();  
  }, [soundEnabled]);

  return (
    <div
      className="game-container"
      style={{
        backgroundImage: `url(${process.env.PUBLIC_URL}/images/image5.jpg)`,
      }}
    >
      <div className="snow-container" ref={snowRef}></div>
      <div className="confetti-container" ref={confettiRef}></div>

      <h2>Сложность игры: {difficulty}</h2>
      <div className="score-time-container">
        <span>Время: {formatTime(time)}</span>
        <span>Очки: {score}/{goalScore}</span>
      </div>
      <div className="game-buttons">
        <Button onClick={resetGame}>Перезапустить игру</Button>
        <Button onClick={handleRefresh}>Обновить поле (-5 очков)</Button>
        <Button onClick={() => navigate("/")}>Вернуться в настройки</Button>
        <Button 
          onClick={() => setSoundEnabled(prev => !prev)}
          className={`sound-toggle ${soundEnabled ? 'sound-on' : 'sound-off'}`}>
          {soundEnabled ? '🔊' : '🔇'}
        </Button>
        </div>

      {difficulty === "hard" && selectedTargetElement && (
        <h4>Целевой предмет: {selectedTargetElement}</h4>
      )}

      <Board
        grid={grid}
        onCellClick={handleCellClickWithSound}
        selected={selectedCell}
        size={size}
        animation={animation}
      />
    </div>
  );
};

export default GamePage;