import React from 'react';
import '../styles/Cell.css';

interface CellProps {
  value: string;
  onClick: () => void;
  isSelected: boolean;
  extraClass?: string;
  style?: React.CSSProperties; 
}

const Cell = ({ value, onClick, isSelected, extraClass = "" }: CellProps) => {
  return (
    <div
      className={`cell ${isSelected ? "selected-cell" : ""} ${extraClass}`}
      onClick={onClick}
    >
      {value}
    </div>
  );
};

export default Cell;