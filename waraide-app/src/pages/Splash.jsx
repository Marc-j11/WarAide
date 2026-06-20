import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Splash() {
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(() => navigate('/login'), 2500)
    return () => clearTimeout(timer)
  }, [navigate])

  return (
    <div className="splash-page">
      <div className="splash-content">
        <div className="splash-logo">
          <i className="ti ti-bus" style={{ fontSize: 80, color: 'var(--wa-orange)' }}></i>
        </div>
        <h1 className="splash-title">WarAide</h1>
        <p className="splash-tagline">Trouve ton trajet, simplement.</p>
        <div className="splash-loader">
          <div className="loader-bar"></div>
        </div>
      </div>

      <style>{`
        .splash-page {
          min-height: 100vh;
          background: var(--wa-bg);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--wa-text);
        }
        .splash-content { text-align: center; }
        .splash-logo {
          width: 140px; height: 140px;
          border-radius: 50%;
          background: rgba(255,140,0,0.12);
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 24px;
          border: 2px solid var(--wa-orange);
        }
        .splash-title {
          font-size: 42px; font-weight: 800;
          margin: 0 0 8px;
          letter-spacing: 1px;
        }
        .splash-tagline {
          color: var(--wa-muted, #9aa0a6);
          font-size: 15px;
          margin: 0 0 40px;
        }
        .splash-loader {
          width: 180px; height: 3px;
          background: rgba(255,255,255,0.08);
          border-radius: 4px;
          overflow: hidden;
          margin: 0 auto;
        }
        .loader-bar {
          width: 40%; height: 100%;
          background: var(--wa-orange);
          animation: slide 1.2s infinite ease-in-out;
        }
        @keyframes slide {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(350%); }
        }
      `}</style>
    </div>
  )
}
