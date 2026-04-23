import React, { useState } from 'react';
import Casilla from './Casilla';
import './Tablero.css';

const SERPIENTES = { 99: 78, 95: 75, 92: 88, 89: 68, 74: 53, 64: 60, 62: 19, 49: 11, 46: 25, 16: 6 };
const ESCALERAS  = { 4: 14, 9: 31, 20: 38, 28: 84, 40: 59, 51: 67, 63: 81, 71: 91 };

const DADOS = () => Math.floor(Math.random() * 6) + 1;

function Tablero() {
  const [posiciones, setPosiciones] = useState([0, 0]);
  const [turno, setTurno] = useState(0);
  const [dado, setDado] = useState(null);
  const [mensaje, setMensaje] = useState('¡Turno del Jugador 1 🔴!');
  const [ganador, setGanador] = useState(null);
  const [historial, setHistorial] = useState([]);

  const lanzarDado = () => {
    if (ganador) return;

    const resultado = DADOS();
    setDado(resultado);

    const nuevasPosiciones = [...posiciones];
    let pos = nuevasPosiciones[turno] + resultado;
    let info = `J${turno + 1}: sacó ${resultado}`;

    if (pos > 100) {
      info += ` → se pasa (queda en ${nuevasPosiciones[turno]})`;
      setMensaje(`⛔ Te pasas! Necesitas exacto para llegar a 100. Turno J${turno === 0 ? 2 : 1}`);
    } else {
      if (SERPIENTES[pos]) {
        info += ` → 🐍 Serpiente! ${pos} → ${SERPIENTES[pos]}`;
        pos = SERPIENTES[pos];
        setMensaje(`🐍 ¡Serpiente! Bajaste al ${pos}. Turno J${turno === 0 ? 2 : 1}`);
      } else if (ESCALERAS[pos]) {
        info += ` → 🪜 Escalera! ${pos} → ${ESCALERAS[pos]}`;
        pos = ESCALERAS[pos];
        setMensaje(`🪜 ¡Escalera! Subiste al ${pos}. Turno J${turno === 0 ? 2 : 1}`);
      } else {
        setMensaje(`Turno J${turno === 0 ? 2 : 1} ${turno === 0 ? '🔵' : '🔴'}`);
      }

      nuevasPosiciones[turno] = pos;

      if (pos === 100) {
        setGanador(turno + 1);
        setMensaje(`🏆 ¡Jugador ${turno + 1} ${turno === 0 ? '🔴' : '🔵'} GANÓ!`);
      }
    }

    setHistorial(prev => [info, ...prev.slice(0, 7)]);
    setPosiciones(nuevasPosiciones);
    setTurno(prev => (prev === 0 ? 1 : 0));
  };

  const reiniciar = () => {
    setPosiciones([0, 0]);
    setTurno(0);
    setDado(null);
    setGanador(null);
    setMensaje('¡Turno del Jugador 1 🔴!');
    setHistorial([]);
  };

  // Construir tablero en zigzag (100 → 1)
  const casillas = [];
  for (let fila = 9; fila >= 0; fila--) {
    const filaNum = 9 - fila;
    const inicio = filaNum % 2 === 0
      ? fila * 10 + 1
      : fila * 10 + 10;
    for (let col = 0; col < 10; col++) {
      const num = filaNum % 2 === 0 ? inicio + col : inicio - col;
      const jugadoresAqui = posiciones
        .map((pos, i) => (pos === num ? i + 1 : null))
        .filter(Boolean);
      const especial = SERPIENTES[num]
        ? 'serpiente-cabeza'
        : ESCALERAS[num]
        ? 'escalera-inicio'
        : '';
      casillas.push(
        <Casilla key={num} numero={num} jugadores={jugadoresAqui} especial={especial} />
      );
    }
  }

  return (
    <div className="juego">
      <div className="tablero">{casillas}</div>

      <div className="panel">
        <div className="estado">{mensaje}</div>

        <div className="posiciones">
          <p>🔴 J1: casilla <strong>{posiciones[0]}</strong></p>
          <p>🔵 J2: casilla <strong>{posiciones[1]}</strong></p>
        </div>

        {dado && <div className="dado">🎲 {dado}</div>}

        {!ganador ? (
          <button className="btn" onClick={lanzarDado}>
            🎲 Lanzar dado — J{turno + 1} {turno === 0 ? '🔴' : '🔵'}
          </button>
        ) : (
          <button className="btn ganador" onClick={reiniciar}>
            🔄 Jugar de nuevo
          </button>
        )}

        <div className="historial">
          <h3>Historial</h3>
          {historial.map((h, i) => <p key={i}>• {h}</p>)}
        </div>
      </div>
    </div>
  );
}

export default Tablero;