import React from 'react';

function MenuButton({ isOpen, onClick }) {
  return (
    <button 
      className={`menu-button ${isOpen ? 'open' : ''}`}
      onClick={onClick}
      aria-label="Toggle menu"
    >
      <span></span>
      <span></span>
      <span></span>
    </button>
  );
}

export default MenuButton; 