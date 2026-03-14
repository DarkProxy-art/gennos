'use client'

import { useEffect } from 'react'

export default function Page() {
  useEffect(() => {
    // Redirect to the cinematic intro experience
    if (typeof window !== 'undefined') {
      window.location.href = '/intro'
    }
  }, [])

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      background: 'linear-gradient(135deg, #000000 0%, #1a0a1a 50%, #0a0a1a 100%)',
      color: '#00ff9c',
      fontFamily: 'Space Grotesk, sans-serif'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          fontSize: '3rem',
          fontWeight: '700',
          color: '#ff0000',
          marginBottom: '1rem'
        }}>
          NEO PROXY
        </div>
        <div style={{
          fontSize: '1.5rem',
          color: '#00ff9c',
          marginBottom: '2rem'
        }}>
          INITIALIZING SYNAPSE FLIGHT...
        </div>
        <div style={{
          width: '200px',
          height: '2px',
          background: 'rgba(0, 255, 156, 0.3)',
          margin: '0 auto',
          borderRadius: '1px',
          overflow: 'hidden'
        }}>
          <div style={{
            height: '100%',
            background: 'linear-gradient(90deg, #00ff9c, #3aa8ff)',
            width: '100%',
            animation: 'loading 2s ease-in-out infinite'
          }} />
        </div>
      </div>
      <style jsx>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  )
}
