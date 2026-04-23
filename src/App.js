import Tablero from './Tablero';
import './App.css';

function App() {
  return (
    <div className="App">
      <h1>🐍 Serpientes y Escaleras 🪜</h1>
      <p className="subtitulo">Arrastra tu ficha o lanza el dado automáticamente</p>
      <Tablero />
    </div>
  );
}

export default App;