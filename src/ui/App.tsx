import React from 'react';
import { MuscleViewer } from './MuscleViewer';

export function App() {
  return (
    <div className="app">
      <div className="header">
        <h1>Sistema Muscular 3D</h1>
        <div className="spacer" />
        <div className="badge">React • Three.js • r3f</div>
      </div>
      <MuscleViewer />
    </div>
  );
}
