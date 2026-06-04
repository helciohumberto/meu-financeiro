export default function Titlebar({ mode }) {
  return (
    <div className={`titlebar ${mode}`}>
      
      {/* Lado esquerdo */}
      <div className="titlebar-left">
        <span id="app-title" className="app-title">VEGA</span>
      </div>

      {/* Texto central */}
      <div className="titlebar-center">
        Desenvolvido por: <strong>Hélcio Humberto</strong>
      </div>

      {/* Controles da janela */}
      <div className="window-controls">
        <button onClick={() => window.api.minimize()}>—</button>
        <button onClick={() => window.api.maximize()}>□</button>
        <button className="close-btn" onClick={() => window.api.close()}>×</button>
      </div>

    </div>
  );
}
