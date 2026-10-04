import React from 'react';
import { createRoot } from 'react-dom/client';
import Antigravity from './Antigravity.jsx';

function mountAntigravity() {
  const container = document.getElementById('antigravity-ambient-canvas');
  if (container && !container.dataset.mounted) {
    container.dataset.mounted = 'true';
    const root = createRoot(container);
    root.render(
      <Antigravity
        count={300}
        magnetRadius={6}
        ringRadius={7}
        waveSpeed={0.4}
        waveAmplitude={1}
        particleSize={1.5}
        lerpSpeed={0.05}
        color="#3535e8"
        autoAnimate={true}
        particleVariance={1}
      />
    );

    // Forward mouse events from projects section so cursor interaction works seamlessly with pointer-events: none
    const projectsSection = document.getElementById('projects');
    if (projectsSection) {
      projectsSection.addEventListener('pointermove', (e) => {
        const canvas = container.querySelector('canvas');
        if (canvas) {
          canvas.dispatchEvent(new PointerEvent('pointermove', {
            clientX: e.clientX,
            clientY: e.clientY,
            screenX: e.screenX,
            screenY: e.screenY,
            bubbles: true,
            cancelable: true
          }));
        }
      }, { passive: true });
    }
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountAntigravity);
} else {
  mountAntigravity();
}
