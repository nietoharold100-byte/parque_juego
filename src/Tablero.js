import React, { useState } from 'react';
import Casilla from './Casilla';
import './Tablero.css';

const SERPIENTES = { 99:78, 95:75, 92:88, 89:68, 74:53, 64:60, 62:19, 49:11, 46:25, 16:6 };
const ESCALERAS  = { 4:14, 9:31, 20:38, 28:84, 40:59, 51:67, 63:81, 71:91 };

function tirarDado() { return Math.floor(Math.random() * 6) + 1; }

function Tablero() {
  const [posiciones, setPosiciones]     = useState([0, 0]);
  const [turno, setTurno]               = useState(0);
  const [dado, setDado]                 = useState(null);
  const [dadoAnimando, setDadoAnimando] = useState(false);
  const [fichaAnimando, setFichaAnimando] = useState(null);
  const [mensaje, setMensaje]           = useState('¡Turno del Jugador 1 🔴!');
  const [ganador, setGanador]           = useState(null);
  const [historial, setHistorial]       = useState([]);
  const [modoDrag, setModoDrag]         = useState(false);
  const [dadoLanzado, setDadoLanzado]   = useState(false);

  const moverJugador = (jugadorIdx, nuevaPos, resultado) => {
    let pos = nuevaPos;
    let info = `J${jugadorIdx + 1}: sacó ${resultado} → casilla ${pos}`;

    if (pos > 100) {
      setMensaje(`⛔ ¡Te pasas! Quédate en ${posiciones[jugadorIdx]}. Turno J${jugadorIdx === 0 ? 2 : 1}`);
      setHistorial(prev => [`J${jugadorIdx+1}: sacó ${resultado} → se pasa`, ...prev.slice(0,7)]);
      setTurno(prev => prev === 0 ? 1 : 0);
      setDadoLanzado(false);
      return;
    }

    if (SERPIENTES[pos]) {
      info += ` 🐍→${SERPIENTES[pos]}`;
      pos = SERPIENTES[pos];
      setMensaje(`🐍 ¡Serpiente! Bajaste al ${pos}. Turno J${jugadorIdx === 0 ? 2 : 1}`);
    } else if (ESCALERAS[pos]) {
      info += ` 🪜→${ESCALERAS[pos]}`;
      pos = ESCALERAS[pos];
      setMensaje(`🪜 ¡Escalera! Subiste al ${pos}. Turno J${jugadorIdx === 0 ? 2 : 1}`);
    } else {
      setMensaje(`Turno J${jugadorIdx === 0 ? 2 : 1} ${jugadorIdx === 0 ? '🔵' : '🔴'}`);
    }

    setFichaAnimando(jugadorIdx + 1);
    setTimeout(() => setFichaAnimando(null), 600);

    const nuevas = [...posiciones];
    nuevas[jugadorIdx] = pos;
    setPosiciones(nuevas);
    setHistorial(prev => [info, ...prev.slice(0, 7)]);

    if (pos === 100) {
      setGanador(jugadorIdx + 1);
      setMensaje(`🏆 ¡Jugador ${jugadorIdx + 1} ${jugadorIdx === 0 ? '🔴' : '🔵'} GANÓ!`);
      return;
    }

    setTurno(prev => prev === 0 ? 1 : 0);
    setDadoLanzado(false);
  };

  const lanzarDado = () => {
    if (ganador || modoDrag) return;
    setDadoAnimando(true);
    let count = 0;
    const intervalo = setInterval(() => {
      setDado(tirarDado());
      count++;
      if (count >= 8) {
        clearInterval(intervalo);
        setDadoAnimando(false);
        const resultado = tirarDado();
        setDado(resultado);
        setDadoLanzado(true);
        moverJugador(turno, posiciones[turno] + resultado, resultado);
      }
    }, 80);
  };

  const handleDrop = (casillaDrop) => {
    if (!modoDrag || !dadoLanzado || ganador) return;
    const resultado = dado;
    const destEsperado = posiciones[turno] + resultado;
    if (casillaDrop !== Math.min(destEsperado, 100)) {
      setMensaje(`⚠️ Debes soltar en la casilla ${Math.min(destEsperado, 100)}`);
      return;
    }
    moverJugador(turno, destEsperado, resultado);
  };

  const lanzarDadoModo = () => {
    if (ganador || dadoLanzado) return;
    setDadoAnimando(true);
    let count = 0;
    const intervalo = setInterval(() => {
      setDado(tirarDado());
      count++;
      if (count >= 8) {
        clearInterval(intervalo);
        setDadoAnimando(false);
        const resultado = tirarDado();
        setDado(resultado);
        setDadoLanzado(true);
        setMensaje(`🎲 Sacaste ${resultado}. ¡Arrastra tu ficha ${resultado} casillas!`);
      }
    }, 80);
  };

  const reiniciar = () => {
    setPosiciones([0, 0]);
    setTurno(0); setDado(null);
    setGanador(null); setDadoLanzado(false);
    setMensaje('¡Turno del Jugador 1 🔴!');
    setHistorial([]);
  };

  // Construir tablero zigzag
  const casillas = [];
  for (let fila = 9; fila >= 0; fila--) {
    const filaNum = 9 - fila;
    for (let col = 0; col < 10; col++) {
      const num = filaNum % 2 === 0
        ? fila * 10 + 1 + col
        : fila * 10 + 10 - col;
      const jugadoresAqui = posiciones
        .map((pos, i) => pos === num ? i + 1 : null)
        .filter(Boolean);
      const especial = SERPIENTES[num] ? 'serpiente-cabeza'
                     : ESCALERAS[num]  ? 'escalera-inicio' : '';
      casillas.push(
        <Casilla
          key={num}
          numero={num}
          jugadores={jugadoresAqui}
          especial={especial}
          onDrop={handleDrop}
          fichaAnimando={fichaAnimando}
        />
      );
    }
  }

  const dadoEmoji = ['', '⚀','⚁','⚂','⚃','⚄','⚅'];
  const fichaEmoji = ['🔴', '🔵'];

  return (
    <div className="juego">
      <div className="tablero-wrap">
        <div className="tablero">{casillas}</div>
        <div className="leyenda">
          <span className="leyenda-item serpiente">🐍 Serpiente = bajas</span>
          <span className="leyenda-item escalera">🪜 Escalera = subes</span>
        </div>
      </div>

      <div className="panel">
        <div className={`estado ${ganador ? 'estado-ganador' : ''}`}>{mensaje}</div>

        <div className="posiciones">
          {[0, 1].map((idx) => (
            <div
              key={idx}
              className={`pos-card ${turno === idx && !ganador ? 'activo' : ''}`}
            >
              <div className="pos-info">
                <span
                  className={`ficha-panel ${fichaAnimando === idx + 1 ? 'ficha-animando' : ''} ${
                    modoDrag && dadoLanzado && turno === idx && posiciones[idx] === 0 ? 'ficha-draggable' : ''
                  }`}
                  draggable={modoDrag && dadoLanzado && turno === idx}
                  onDragStart={(e) => e.dataTransfer.setData('jugador', idx + 1)}
                  title={modoDrag && dadoLanzado && turno === idx ? 'Arrastra esta ficha al tablero' : ''}
                >
                  {fichaEmoji[idx]}
                </span>
                <span>
                  J{idx + 1} — {posiciones[idx] === 0 ? 'inicio' : `casilla ${posiciones[idx]}`}
                </span>
              </div>
              {posiciones[idx] === 0 && modoDrag && dadoLanzado && turno === idx && (
                <span className="drag-hint">¡Arrástrala!</span>
              )}
            </div>
          ))}
        </div>

        <div className="modo-toggle">
          <button
            className={`modo-btn ${!modoDrag ? 'activo' : ''}`}
            onClick={() => { setModoDrag(false); setDadoLanzado(false); }}
          >🤖 Auto</button>
          <button
            className={`modo-btn ${modoDrag ? 'activo' : ''}`}
            onClick={() => { setModoDrag(true); setDadoLanzado(false); }}
          >🖐 Drag</button>
        </div>

        {dado && (
          <div className={`dado ${dadoAnimando ? 'dado-animando' : 'dado-resultado'}`}>
            {dadoEmoji[dado]}
          </div>
        )}

        {!ganador ? (
          modoDrag ? (
            <button className="btn" onClick={lanzarDadoModo} disabled={dadoLanzado}>
              {dadoLanzado ? `🖐 Arrastra ${fichaEmoji[turno]} a casilla ${Math.min(posiciones[turno] + (dado||0), 100)}` : '🎲 Lanzar dado'}
            </button>
          ) : (
            <button className="btn" onClick={lanzarDado}>
              🎲 Lanzar — J{turno + 1} {fichaEmoji[turno]}
            </button>
          )
        ) : (
          <button className="btn btn-ganador" onClick={reiniciar}>🔄 Jugar de nuevo</button>
        )}

        <div className="historial">
          <h3>📜 Historial</h3>
          {historial.length === 0
            ? <p className="sin-historial">Aún no hay movimientos</p>
            : historial.map((h, i) => <p key={i} className="hist-item">• {h}</p>)
          }
        </div>
      </div>
    </div>
  );
}

export default Tablero;