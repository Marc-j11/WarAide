import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth.js'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!email || !password) {
      setError('Veuillez remplir tous les champs.')
      return
    }
    setLoading(true)
    try {
      await login({ email, password })
      navigate('/search')
    } catch (err) {
      setError('Identifiants invalides.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <i className="ti ti-bus" style={{ fontSize: 40, color: 'var(--wa-orange)' }}></i>
          <h1>Connexion</h1>
          <p>Bienvenue sur WarAide</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            <span>Email</span>
            <input
              type="email"
              placeholder="ton@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </label>

          <label>
            <span>Mot de passe</span>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </label>

          {error && <div className="auth-error">{error}</div>}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <div className="auth-footer">
          Pas encore de compte ?{' '}
          <Link to="/register" className="auth-link">Créer un compte</Link>
        </div>
      </div>

      <style>{`
        .auth-page {
          min-height: 100vh;
          background: var(--wa-bg);
          display: flex; align-items: center; justify-content: center;
          padding: 20px;
          color: var(--wa-text);
        }
        .auth-card {
          width: 100%; max-width: 400px;
          background: var(--wa-card, #1a1d24);
          border-radius: 16px;
          padding: 32px 28px;
          border: 1px solid rgba(255,255,255,0.06);
        }
        .auth-header { text-align: center; margin-bottom: 28px; }
        .auth-header h1 { margin: 12px 0 4px; font-size: 24px; }
        .auth-header p { color: var(--wa-muted,#9aa0a6); margin: 0; font-size: 14px; }
        .auth-form { display: flex; flex-direction: column; gap: 16px; }
        .auth-form label { display: flex; flex-direction: column; gap: 6px; font-size: 13px; }
        .auth-form input {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          color: var(--wa-text);
          padding: 12px 14px;
          border-radius: 10px;
          font-size: 15px;
          outline: none;
          transition: border .15s;
        }
        .auth-form input:focus { border-color: var(--wa-orange); }
        .auth-error {
          background: rgba(239,68,68,0.1);
          color: #fca5a5;
          padding: 10px 12px;
          border-radius: 8px;
          font-size: 13px;
        }
        .btn-primary {
          background: var(--wa-orange);
          color: #fff; border: none;
          padding: 13px;
          border-radius: 10px;
          font-weight: 600;
          font-size: 15px;
          cursor: pointer;
          margin-top: 8px;
        }
        .btn-primary:disabled { opacity: .6; cursor: not-allowed; }
        .auth-footer {
          text-align: center;
          margin-top: 22px;
          font-size: 14px;
          color: var(--wa-muted,#9aa0a6);
        }
        .auth-link { color: var(--wa-orange); text-decoration: none; font-weight: 600; }
      `}</style>
    </div>
  )
}
