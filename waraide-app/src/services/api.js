/**
 * Service API WarAide.
 *
 * Pour l'instant l'application fonctionne avec les données locales
 * (src/data/points.js et liaisons.js). Ce module prépare l'appel
 * au backend Express présent dans le dossier ../backend/.
 *
 * Définissez VITE_API_URL dans .env pour pointer vers votre serveur.
 */

import { points, liaisons, destinations } from '../data';

const API_URL = import.meta.env.VITE_API_URL || '';

async function request(path, options = {}) {
  if (!API_URL) {
    throw new Error('VITE_API_URL non défini — utilisation des données locales.');
  }
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export const api = {
  // ---------- Points ----------
  async getPoints() {
    try {
      return await request('/api/points');
    } catch {
      return points;
    }
  },

  // ---------- Liaisons ----------
  async getLiaisons() {
    try {
      return await request('/api/liaisons');
    } catch {
      return liaisons;
    }
  },

  // ---------- Destinations ----------
  async getDestinations() {
    try {
      return await request('/api/destinations');
    } catch {
      return destinations;
    }
  },

  // ---------- Soumission d'un nouvel établissement ----------
  async submitEstablishment(payload) {
    try {
      return await request('/api/establishments', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    } catch (e) {
      console.warn('Soumission locale (pas de backend) :', payload);
      return { ok: true, local: true, ...payload };
    }
  },

  // ---------- Auth (placeholders) ----------
  async login(email, password) {
    try {
      return await request('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
    } catch {
      return { user: { email, prenom: 'Konan', nom: 'Yao' }, token: 'demo' };
    }
  },

  async register(payload) {
    try {
      return await request('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    } catch {
      return { user: payload, token: 'demo' };
    }
  },
};

export default api;
