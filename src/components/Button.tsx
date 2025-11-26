import React from "react";
import "../styles/Button.css";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  
}

const Button: React.FC<ButtonProps> = ({ children, onClick, ...props }) => {
  const playClickSound = () => {
    const audio = new Audio("/sounds/button.mp3");
    audio.volume = 0.4;
    audio.play().catch(() => {}); 
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    playClickSound();
    onClick?.(e);
  };

  return (
    <button
      className="button"
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;