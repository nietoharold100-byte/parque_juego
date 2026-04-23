import React from 'react';
import './Casilla.css';

function Casilla({ numero, jugadores, especial }) {
  return (
    <div className={`casilla ${especial}`}>
      <span className="numero">{numero}</span>
      <div className="jugadores">
        {jugadores.map((j, i) => (
          <span key={i} className={`ficha jugador${j}`}>
            {j === 1 ? '🔴' : '🔵'}
          </span>
        ))}
      </div>
      {especial === 'serpiente-cabeza' && <span className="icono">🐍</span>}
      {especial === 'escalera-inicio' && <span className="icono">🪜</span>}
    </div>
  );
}

export default Casilla;