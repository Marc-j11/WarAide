import React, { createContext, useState, useEffect, useCallback } from 'react';

export const AuthContext = createContext(null);

const STORAGE_KEY = 'waraide.user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : { nom: 'Konan', prenom: 'Yao' };
    } catch {
      return { nom: 'Konan', prenom: 'Yao' };
    }
  });

  useEffect(() => {
    if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    else localStorage.removeItem(STORAGE_KEY);
  }, [user]);

  const login = useCallback(async (credentials) => {
    // Simule une authentification minimale et stocke un objet `user` avec `prenom`.
    const prenom =
      credentials?.prenom || (credentials?.email ? credentials.email.split('@')[0] : 'Utilisateur');
    const nom = credentials?.nom || '';
    const userObj = { nom, prenom, email: credentials?.email };
    setUser(userObj);
    return userObj;
  }, []);

  const register = useCallback(async ({ name, email, password }) => {
    // Simule une création de compte basique — on extrait prénom/nom depuis `name`.
    const parts = (name || '').trim().split(/\s+/);
    const prenom = parts[0] || (email ? email.split('@')[0] : 'Utilisateur');
    const nom = parts.slice(1).join(' ') || '';
    const userObj = { nom, prenom, email };
    setUser(userObj);
    return userObj;
  }, []);

  const logout = useCallback(() => setUser(null), []);

  return (
    <AuthContext.Provider value={{ user, setUser, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
