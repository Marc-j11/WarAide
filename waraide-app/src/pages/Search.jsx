import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StationContext } from '../context/StationContext.jsx';
import useAuth from '../hooks/useAuth.js';
import Button from '../components/common/Button.jsx';
import Input from '../components/common/Input.jsx';
import Card from '../components/Card.jsx';

const CRITERES = [
  { id: 'temps', label: 'Plus rapide', icon: 'ti-clock' },
  { id: 'prix', label: 'Moins cher', icon: 'ti-coin' },
];

export default function Search() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { selectedDestination, stations, points } = useContext(StationContext);

  const [depart, setDepart] = useState('');
  const [arrivee, setArrivee] = useState(selectedDestination?.nom || '');
  const [critere, setCritere] = useState('temps');

  const suggestions = ['Gare 9 Kilo', 'Gare Petro-Ivoire', 'BEM Abidjan'];

  const handleSearch = () => {
    const from = depart.trim() || stations[0]?.nom;
    const to = arrivee.trim() || selectedDestination?.nom;
    if (!from || !to) return;
    const qs = new URLSearchParams({ from, to, critere });
    navigate(`/result?${qs.toString()}`);
  };

  return (
    <>
      <div className="wa-header">
        <div>
          <p>Bonjour, {user?.prenom || 'invité'}</p>
          <h1>Où allez-vous ?</h1>
        </div>
      </div>

      <div className="wa-body">
        {selectedDestination && (
          <Card>
            <p style={{ fontSize: 11, color: 'var(--wa-text-muted)', margin: '0 0 6px' }}>
              Établissement de référence
            </p>
            <div className="wa-row">
              <div className="wa-icon-box orange">
                <i className="ti ti-building-community" style={{ fontSize: 18 }} />
              </div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 500, margin: 0 }}>
                  {selectedDestination.nom}
                </p>
                <p style={{ fontSize: 11, color: 'var(--wa-text-muted)', margin: '2px 0 0' }}>
                  Cocody Angré
                </p>
              </div>
            </div>
          </Card>
        )}

        <div style={{ height: 8 }} />

        <Input
          label="Départ"
          icon="ti-current-location"
          iconColor="var(--wa-green)"
          placeholder="Ma position ou une gare"
          value={depart}
          onChange={(e) => setDepart(e.target.value)}
          list="wa-stations"
        />

        <Input
          label="Destination"
          icon="ti-map-pin"
          iconColor="var(--wa-red-2)"
          placeholder="Saisir une destination"
          value={arrivee}
          onChange={(e) => setArrivee(e.target.value)}
          list="wa-stations"
        />

        <datalist id="wa-stations">
          {points.map((s) => (
            <option key={s.id} value={s.nom} />
          ))}
        </datalist>

        <p className="wa-section-label">Optimiser par</p>
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          {CRITERES.map((c) => {
            const active = critere === c.id;
            return (
              <button
                type="button"
                key={c.id}
                onClick={() => setCritere(c.id)}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  padding: '10px 8px',
                  background: active ? 'var(--wa-orange-bg)' : 'var(--wa-surface)',
                  border: `1px solid ${active ? 'var(--wa-orange)' : 'var(--wa-border-soft)'}`,
                  borderRadius: 10,
                  color: active ? 'var(--wa-orange-soft)' : 'var(--wa-text-muted)',
                  fontSize: 12,
                  cursor: 'pointer',
                }}
              >
                <i className={`ti ${c.icon}`} style={{ fontSize: 14 }} />
                {c.label}
              </button>
            );
          })}
        </div>

        <p className="wa-section-label">Destinations populaires</p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
          {suggestions.map((s) => (
            <span key={s} className="wa-chip" onClick={() => setArrivee(s)}>
              {s}
            </span>
          ))}
        </div>

        <Button icon="ti-search" onClick={handleSearch}>
          Rechercher
        </Button>

        <Button
          variant="dark"
          icon="ti-map-pin"
          onClick={() => navigate('/stations')}
        >
          Gares autour de moi
        </Button>
      </div>
    </>
  );
}
