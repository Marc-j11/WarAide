/**
 * Service API WarAide — backend Express (../backend/).
 * Fallback sur les données locales si VITE_API_URL est absent ou injoignable.
 */

import { points, liaisons, destinations } from '../data';

const API_URL = import.meta.env.VITE_API_URL || '';
const TOKEN_KEY = 'waraide.token';

async function request(path, options = {}) {
  if (!API_URL) {
    throw new Error('VITE_API_URL non défini');
  }
  const token = localStorage.getItem(TOKEN_KEY);
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.error?.message || `HTTP ${res.status}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

function mapGare(g) {
  return {
    id: g.id,
    nom: g.nom,
    type: g.type,
    categorie: g.categorie,
    latitude: g.latitude,
    longitude: g.longitude,
  };
}

function mapLiaison(l) {
  return {
    id: l.id,
    depart: l.depart_nom,
    arrivee: l.arrivee_nom,
    transport: l.transport,
    direction: l.direction,
    prix: l.prix,
    temps: l.temps,
  };
}

function mapItineraire(data) {
  return {
    found: true,
    steps: (data.etapes || []).map((e) => ({
      type: 'transport',
      from: e.depart.nom,
      to: e.arrivee.nom,
      transport: e.transport,
      direction: e.direction,
      prix: e.prix,
      temps: e.temps,
      index: e.ordre,
    })),
    total: { prix: data.prixTotal ?? 0, temps: data.tempsTotal ?? 0 },
  };
}

export const api = {
  isConfigured: () => Boolean(API_URL),

  async getGares(search) {
    try {
      const query = search ? `?nom=${encodeURIComponent(search)}` : '';
      const res = await request(`/gares${query}`);
      return (res.data || []).map(mapGare);
    } catch {
      if (search) {
        return points.filter((p) =>
          p.nom.toLowerCase().includes(search.toLowerCase())
        );
      }
      return points;
    }
  },

  async getGaresProches(lat, lng, limit = 10) {
    try {
      const qs = new URLSearchParams({
        lat: String(lat),
        lng: String(lng),
        limit: String(limit),
      });
      const res = await request(`/gares/proches?${qs}`);
      return (res.data || []).map((g) => ({
        ...mapGare(g),
        distance: g.distance,
      }));
    } catch {
      return null;
    }
  },

  /** @deprecated utiliser getGares */
  async getPoints() {
    return this.getGares();
  },

  async getLiaisons() {
    try {
      const res = await request('/liaisons');
      return (res.data || []).map(mapLiaison);
    } catch {
      return liaisons;
    }
  },

  async getDestinations() {
    try {
      const gares = await this.getGares();
      return gares.filter(
        (p) => p.categorie === 'destination' || p.type === 'ecole'
      );
    } catch {
      return destinations;
    }
  },

  async searchItineraire(fromName, toName, critere = 'temps') {
    try {
      const gares = await this.getGares();
      const depart = gares.find((g) => g.nom === fromName);
      const arrivee = gares.find((g) => g.nom === toName);

      if (!depart || !arrivee) {
        return { found: false, steps: [], total: { prix: 0, temps: 0 } };
      }

      const res = await request('/itineraire', {
        method: 'POST',
        body: JSON.stringify({
          departId: depart.id,
          arriveeId: arrivee.id,
          critere,
        }),
      });

      return mapItineraire(res.data);
    } catch {
      return null;
    }
  },

  async submitEstablishment(payload) {
    try {
      const res = await request('/gares', {
        method: 'POST',
        body: JSON.stringify({
          nom: payload.nom,
          type: payload.categorie || 'ecole',
          categorie: payload.quartier
            ? `destination:${payload.quartier}`
            : 'destination',
        }),
      });
      return mapGare(res.data);
    } catch (e) {
      console.warn('Soumission locale (pas de backend) :', payload);
      return { ok: true, local: true, ...payload };
    }
  },

  async login({ email, password }) {
    const res = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (res.data.token) localStorage.setItem(TOKEN_KEY, res.data.token);
    return res.data;
  },

  async register({ name, email, password }) {
    const res = await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
    if (res.data.token) localStorage.setItem(TOKEN_KEY, res.data.token);
    return res.data;
  },

  logout() {
    localStorage.removeItem(TOKEN_KEY);
  },

  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },
};

export default api;
