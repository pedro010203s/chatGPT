import { useAppStore } from '../state/store'

export function ControlsPanel() {
  const sex = useAppStore((s) => s.sex)
  const setSex = useAppStore((s) => s.setSex)
  const playing = useAppStore((s) => s.playing)
  const togglePlaying = useAppStore((s) => s.togglePlaying)
  const speed = useAppStore((s) => s.speed)
  const setSpeed = useAppStore((s) => s.setSpeed)
  const hovered = useAppStore((s) => s.hoveredPartName)

  return (
    <div className="controls-panel">
      <div className="row">
        <strong>Modelo:</strong>
        <div className="segmented">
          <button className={sex === 'male' ? 'active' : ''} onClick={() => setSex('male')}>Masculino</button>
          <button className={sex === 'female' ? 'active' : ''} onClick={() => setSex('female')}>Feminino</button>
        </div>
      </div>
      <div className="row">
        <strong>Animação:</strong>
        <button onClick={togglePlaying}>{playing ? 'Pausar' : 'Reproduzir'}</button>
      </div>
      <div className="row">
        <strong>Velocidade:</strong>
        <input
          type="range"
          min={0}
          max={3}
          step={0.1}
          value={speed}
          onChange={(e) => setSpeed(parseFloat(e.target.value))}
        />
        <span>{speed.toFixed(1)}x</span>
      </div>
      <div className="row">
        <strong>Hover:</strong>
        <span>{hovered ?? '—'}</span>
      </div>
    </div>
  )
}
