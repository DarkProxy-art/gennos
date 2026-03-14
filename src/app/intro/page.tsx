'use client'

import { useEffect, useRef } from 'react';
import Head from 'next/head';
import styles from './intro.module.css';

export default function IntroPage() {
  const canvasRef = useRef(null);
  const flightRef = useRef(null);

  useEffect(() => {
    let scrollHandler = null;
    let resizeHandler = null;

    // Importar dinámicamente para evitar SSR issues
    import('../../../public/synapseFlight.js').then(({ SynapseFlight }) => {
      if (canvasRef.current && !flightRef.current) {
        // Crear datos simulados del kernel para demo
        const mockKernelData = {
          nodes: Array.from({ length: 512 }, (_, i) => ({
            id: `node_${i}`,
            type: ['agent', 'model', 'data', 'connection', 'portal'][Math.floor(Math.random() * 5)],
            position: {
              x: (Math.random() - 0.5) * 60,
              y: (Math.random() - 0.5) * 60,
              z: (Math.random() - 0.5) * 60
            },
            connections: Math.floor(Math.random() * 8) + 1,
            activity: Math.random()
          }))
        };

        flightRef.current = new SynapseFlight('synapseCanvas', mockKernelData);

        // Ocultar loading screen después de inicialización
        setTimeout(() => {
          const loading = document.getElementById('loadingScreen');
          if (loading) {
            loading.style.opacity = '0';
            setTimeout(() => loading.style.display = 'none', 500);
          }
        }, 2000);
      }
    });

    // Sistema de indicadores en tiempo real
    const updateIndicators = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.body.scrollHeight - window.innerHeight;
      const scrollPercent = Math.max(0, Math.min(1, scrollTop / docHeight));

      // Actualizar barra de progreso
      const progressFill = document.getElementById('scrollProgress');
      if (progressFill) {
        progressFill.style.width = `${scrollPercent * 100}%`;
      }

      // Actualizar indicador de fase
      const phases = document.querySelectorAll('.phase');
      phases.forEach((phase, index) => {
        const phaseStart = index * 0.25;
        const phaseEnd = (index + 1) * 0.25;
        const isActive = scrollPercent >= phaseStart && scrollPercent < phaseEnd;

        if (isActive) {
          phase.setAttribute('data-active', 'true');
        } else {
          phase.removeAttribute('data-active');
        }
      });

      // Actualizar valor de actividad
      const activityValue = document.getElementById('activityValue');
      if (activityValue) {
        const activity = Math.floor(scrollPercent * 100);
        activityValue.textContent = `${activity}%`;
      }
    };

    // Throttled scroll handler
    let ticking = false;
    scrollHandler = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateIndicators();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', scrollHandler);

    // Resize handler
    resizeHandler = () => {
      if (flightRef.current?.engine) {
        flightRef.current.engine.resize();
      }
    };
    window.addEventListener('resize', resizeHandler);

    // Cleanup
    return () => {
      if (scrollHandler) window.removeEventListener('scroll', scrollHandler);
      if (resizeHandler) window.removeEventListener('resize', resizeHandler);
      if (flightRef.current) {
        flightRef.current.dispose();
        flightRef.current = null;
      }
    };
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>NeoProxy - Synapse Flight</title>
        <meta name="description" content="Enter the NeoProxy neural network through an interactive 3D synapse flight experience" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* Canvas 3D */}
      <canvas
        id="synapseCanvas"
        ref={canvasRef}
        className={styles.canvas}
      />

      {/* HUD Overlay */}
      <div className={styles.hud}>
        <div className={styles.hudHeader}>
          <div className={styles.logo}>
            <span className={styles.neoproxy}>NEO</span>
            <span className={styles.proxy}>PROXY</span>
          </div>
          <div className={styles.tagline}>
            SYNAPSE FLIGHT
          </div>
        </div>

        <div className={styles.hudStats}>
          <div className={styles.stat}>
            <span className={styles.statLabel}>NODES</span>
            <span className={styles.statValue}>512</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>CONNECTIONS</span>
            <span className={styles.statValue}>2.4K</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>ACTIVITY</span>
            <span className={styles.statValue} id="activityValue">LIVE</span>
          </div>
        </div>

        <div className={styles.scrollIndicator}>
          <div className={styles.scrollText}>
            <span>SCROLL TO TRAVEL</span>
            <div className={styles.scrollArrow}>↓</div>
          </div>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} id="scrollProgress"></div>
          </div>
        </div>

        <div className={styles.phaseIndicator}>
          <div className={`${styles.phase}`} data-active="true">
            <span className={styles.phaseNumber}>01</span>
            <span className={styles.phaseName}>BOOT</span>
          </div>
          <div className={styles.phase}>
            <span className={styles.phaseNumber}>02</span>
            <span className={styles.phaseName}>EXPLORE</span>
          </div>
          <div className={styles.phase}>
            <span className={styles.phaseNumber}>03</span>
            <span className={styles.phaseName}>FLIGHT</span>
          </div>
          <div className={styles.phase}>
            <span className={styles.phaseNumber}>04</span>
            <span className={styles.phaseName}>INTERFACE</span>
          </div>
        </div>
      </div>

      {/* Instructions Overlay */}
      <div className={styles.instructions}>
        <div className={styles.instructionCard}>
          <h3>🧠 Neural Navigation</h3>
          <p>Your scroll controls the journey through NeoProxy's digital consciousness</p>
        </div>

        <div className={styles.instructionCard}>
          <h3>⚡ Live Data</h3>
          <p>512 active nodes pulse with real-time kernel activity</p>
        </div>

        <div className={styles.instructionCard}>
          <h3>🎵 Audio Reactive</h3>
          <p>Sound frequencies adapt to network activity patterns</p>
        </div>
      </div>

      {/* Skip Button */}
      <button className={styles.skipButton} onClick={() => window.location.href = '/network'}>
        SKIP INTRO →
      </button>

      {/* Loading Screen */}
      <div className={styles.loading} id="loadingScreen">
        <div className={styles.loadingContent}>
          <div className={styles.loadingSpinner}></div>
          <p>Initializing Synapse Flight...</p>
          <div className={styles.loadingBar}>
            <div className={styles.loadingFill}></div>
          </div>
        </div>
      </div>
    </div>
  );
}