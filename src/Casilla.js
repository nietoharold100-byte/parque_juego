import React from 'react';
import './Casilla.css';

function Casilla({ numero, jugadores, especial, onDrop, fichaAnimando }) {
  const handleDragOver = (e) => e.preventDefault();

  const handleDrop = (e) => {
    e.preventDefault();
    if (onDrop) onDrop(numero);
  };

  return (
    <div
      className={`casilla ${especial} ${jugadores.length > 0 ? 'ocupada' : ''}`}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <span className="numero">{numero}</span>
      {especial === 'serpiente-cabeza' && <span className="icono-especial">🐍</span>}
      {especial === 'escalera-inicio'  && <span className="icono-especial">🪜</span>}
      <div className="fichas">
        {jugadores.map((j) => (
          <span
            key={j}
            className={`ficha jugador${j} ${fichaAnimando === j ? 'ficha-animando' : ''}`}
            draggable
            onDragStart={(e) => e.dataTransfer.setData('jugador', j)}
            title={`Jugador ${j}`}
          >
            {j === 1 ? '🔴' : '🔵'}
          </span>
        ))}
      </div>
    </div>
  );
}

export default Casilla;