import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth.js'

export default function Register() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const onChange = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.name || !form.email || !form.password) {
      setError('Tous les champs sont obligatoires.')
      return
    }
    if (form.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.')
      return
    }
    if (form.password !== form.confirm) {
      setError('Les mots de passe ne correspondent pas.')
      return
    }
    setLoading(true)
    try {
      await register({ name: form.name, email: form.email, password: form.password })
      navigate('/search')
    } catch (err) {
      setError("Erreur lors de l'inscription.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <i className="ti ti-user-plus" style={{ fontSize: 40, color: 'var(--wa-orange)' }}></i>
          <h1>Créer un compte</h1>
          <p>Rejoins WarAide en quelques secondes</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            <span>Nom complet</span>
            <input type="text" placeholder="Ton nom" value={form.name} onChange={onChange('name')} />
          </label>
          <label>
            <span>Email</span>
            <input type="email" placeholder="ton@email.com" value={form.email} onChange={onChange('email')} />
          </label>
          <label>
            <span>Mot de passe</span>
            <input type="password" placeholder="6 caractères minimum" value={form.password} onChange={onChange('password')} />
          </label>
          <label>
            <span>Confirmer le mot de passe</span>
            <input type="password" placeholder="••••••••" value={form.confirm} onChange={onChange('confirm')} />
          </label>

          {error && <div className="auth-error">{error}</div>}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Création...' : "S'inscrire"}
          </button>
        </form>

        <div className="auth-footer">
          Déjà un compte ?{' '}
          <Link to="/login" className="auth-link">Se connecter</Link>
        </div>
      </div>

      <style>{`
        .auth-page { min-height: 100vh; background: var(--wa-bg); display: flex; align-items: center; justify-content: center; padding: 20px; color: var(--wa-text); }
        .auth-card { width: 100%; max-width: 400px; background: var(--wa-card, #1a1d24); border-radius: 16px; padding: 32px 28px; border: 1px solid rgba(255,255,255,0.06); }
        .auth-header { text-align: center; margin-bottom: 28px; }
        .auth-header h1 { margin: 12px 0 4px; font-size: 24px; }
        .auth-header p { color: var(--wa-muted,#9aa0a6); margin: 0; font-size: 14px; }
        .auth-form { display: flex; flex-direction: column; gap: 14px; }
        .auth-form label { display: flex; flex-direction: column; gap: 6px; font-size: 13px; }
        .auth-form input { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); color: var(--wa-text); padding: 12px 14px; border-radius: 10px; font-size: 15px; outline: none; }
        .auth-form input:focus { border-color: var(--wa-orange); }
        .auth-error { background: rgba(239,68,68,0.1); color: #fca5a5; padding: 10px 12px; border-radius: 8px; font-size: 13px; }
        .btn-primary { background: var(--wa-orange); color: #fff; border: none; padding: 13px; border-radius: 10px; font-weight: 600; font-size: 15px; cursor: pointer; margin-top: 8px; }
        .btn-primary:disabled { opacity: .6; cursor: not-allowed; }
        .auth-footer { text-align: center; margin-top: 22px; font-size: 14px; color: var(--wa-muted,#9aa0a6); }
        .auth-link { color: var(--wa-orange); text-decoration: none; font-weight: 600; }
      `}</style>
    </div>
  )
}
