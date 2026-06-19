import React from 'react';
import './Button.css';

export default function Button({ children, onClick, className = '' }) {
  return (
    <button className={`wa-button ${className}`} onClick={onClick}>
      {children}
    </button>
  );
}
