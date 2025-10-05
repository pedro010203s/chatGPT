import './App.css'
import { Scene3D } from './scene/Scene3D'
import { ControlsPanel } from './components/ControlsPanel'

function App() {
  return (
    <div className="app-root">
      <div className="canvas-wrap">
        <Scene3D />
      </div>
      <ControlsPanel />
    </div>
  )
}

export default App
