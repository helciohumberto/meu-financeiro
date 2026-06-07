export default function Titlebar({ mode }) {
  return (
    <div className={`titlebar ${mode}`}>

      <div className="window-controls">
        <button onClick={() => window.api.minimize()}>—</button>
        <button onClick={() => window.api.maximize()}>□</button>
        <button className="close-btn" onClick={() => window.api.close()}>×</button>
      </div>

    </div>
  );
}
