import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { StationContext } from '../context/StationContext.jsx';
import MapBox from '../components/MapBox.jsx';
import Card from '../components/Card.jsx';
import Button from '../components/common/Button.jsx';

export default function Map() {
  const navigate = useNavigate();
  const { stations, selectedDestination } = useContext(StationContext);

  // Projette quelques stations sur la fausse carte
  const points = stations.slice(0, 5).map((s, i) => ({
    x: 40 + i * 55,
    y: 60 + (i % 2) * 60,
    r: 6,
    color: i === 0 ? 'var(--wa-green)' : i === 4 ? 'var(--wa-red)' : 'var(--wa-blue)',
    label: i === 0 ? s.nom : undefined,
  }));

  return (
    <>
      <div className="wa-header">
        <button className="wa-back" onClick={() => navigate(-1)}>
          <i className="ti ti-chevron-left" />
        </button>
        <h1>Carte</h1>
      </div>

      <div className="wa-body">
        <MapBox
          height={280}
          paths={['M40 220 Q90 180 140 140 Q200 90 260 40']}
          points={points}
        >
          <div
            style={{
              position: 'absolute',
              top: 10,
              left: 10,
              background: 'rgba(20,20,28,0.85)',
              borderRadius: 8,
              padding: '8px 10px',
              fontSize: 11,
              color: 'var(--wa-text-soft)',
            }}
          >
            <Legend color="var(--wa-green)" label="Départ" />
            <Legend color="var(--wa-blue)" label="Correspondance" />
            <Legend color="var(--wa-red)" label="Arrivée" />
          </div>
        </MapBox>

        {selectedDestination && (
          <Card>
            <p style={{ fontSize: 14, fontWeight: 500, margin: '0 0 4px' }}>
              Destination · {selectedDestination.nom}
            </p>
            <p style={{ fontSize: 12, color: 'var(--wa-text-muted)', margin: 0 }}>
              ~45 min · 500 F CFA · 2 correspondances
            </p>
          </Card>
        )}

        <Button icon="ti-navigation">Démarrer la navigation</Button>
      </div>
    </>
  );
}

function Legend({ color, label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: color,
          display: 'inline-block',
        }}
      />
      {label}
    </div>
  );
}
