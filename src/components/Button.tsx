import React from "react";
import "../styles/Button.css";
import { playButtonClickSound } from "../utils/soundUtils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ children, onClick, ...props }) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    playButtonClickSound();
    onClick?.(e);
  };

  return (
    <button className="button" onClick={handleClick} {...props}>
      {children}
    </button>
  );
};

export default Button;
