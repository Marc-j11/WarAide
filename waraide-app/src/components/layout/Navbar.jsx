import React from 'react';
import { NavLink } from 'react-router-dom';

const items = [
  { to: '/', icon: 'ti-home', label: 'Accueil', end: true },
  { to: '/stations', icon: 'ti-map-pin', label: 'Gares' },
  { to: '/map', icon: 'ti-map', label: 'Carte' },
  { to: '/add-establishment', icon: 'ti-plus', label: 'Ajouter' },
];

export default function Navbar() {
  return (
    <nav className="wa-nav">
      {items.map((it) => (
        <NavLink
          key={it.to}
          to={it.to}
          end={it.end}
          className={({ isActive }) => 'wa-nav-item' + (isActive ? ' active' : '')}
        >
          <i className={`ti ${it.icon}`} />
          <span>{it.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
