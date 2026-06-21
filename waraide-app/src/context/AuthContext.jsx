import React, { createContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api.js';

export const AuthContext = createContext(null);

const STORAGE_KEY = 'waraide.user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    else localStorage.removeItem(STORAGE_KEY);
  }, [user]);

  const login = useCallback(async (credentials) => {
    if (api.isConfigured()) {
      const { user: u } = await api.login(credentials);
      setUser(u);
      return u;
    }
    const prenom = credentials?.email?.split('@')[0] || 'Utilisateur';
    const userObj = { prenom, nom: '', email: credentials?.email };
    setUser(userObj);
    return userObj;
  }, []);

  const register = useCallback(async ({ name, email, password }) => {
    if (api.isConfigured()) {
      const { user: u } = await api.register({ name, email, password });
      setUser(u);
      return u;
    }
    const parts = (name || '').trim().split(/\s+/);
    const userObj = {
      prenom: parts[0] || 'Utilisateur',
      nom: parts.slice(1).join(' '),
      email,
    };
    setUser(userObj);
    return userObj;
  }, []);

  const logout = useCallback(() => {
    api.logout();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
