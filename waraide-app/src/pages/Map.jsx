import React, { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { StationContext } from '../context/StationContext.jsx';
import MapBox from '../components/MapBox.jsx';
import Card from '../components/Card.jsx';
import Button from '../components/common/Button.jsx';
import RouteCard from '../components/cards/RouteCard.jsx';
import { formatPrice, formatDuration } from '../utils/formatters.js';

export default function Map() {
  const navigate = useNavigate();
  const location = useLocation();
  const { stations, points, selectedDestination } = useContext(StationContext);

  const { route, from, to } = location.state || {};
  const hasRoute = route?.found && route.steps?.length > 0;

  const routePoints = hasRoute
    ? route.steps.flatMap((step, i) => {
        const pts = [];
        if (i === 0) pts.push(step.from);
        pts.push(step.to);
        return pts;
      })
    : [];

  const uniqueNames = [...new Set(routePoints)];
  const geoPoints = uniqueNames
    .map((nom) => points.find((p) => p.nom === nom))
    .filter(Boolean)
    .filter((p) => p.latitude != null);

  const mapDots = hasRoute && geoPoints.length >= 2
    ? geoPoints.map((s, i) => ({
        x: 30 + (i / Math.max(geoPoints.length - 1, 1)) * 220,
        y: 50 + (i % 2) * 40,
        r: 6,
        color:
          i === 0
            ? 'var(--wa-green)'
            : i === geoPoints.length - 1
              ? 'var(--wa-red)'
              : 'var(--wa-blue)',
        label: i === 0 || i === geoPoints.length - 1 ? s.nom.replace('Gare ', '') : undefined,
      }))
    : stations.slice(0, 5).map((s, i) => ({
        x: 40 + i * 55,
        y: 60 + (i % 2) * 60,
        r: 6,
        color: i === 0 ? 'var(--wa-green)' : i === 4 ? 'var(--wa-red)' : 'var(--wa-blue)',
        label: i === 0 ? s.nom : undefined,
      }));

  const pathD = mapDots.length >= 2
    ? `M${mapDots[0].x} ${mapDots[0].y} ${mapDots.slice(1).map((p) => `L${p.x} ${p.y}`).join(' ')}`
    : 'M40 220 Q90 180 140 140 Q200 90 260 40';

  return (
    <>
      <div className="wa-header">
        <button className="wa-back" onClick={() => navigate(-1)}>
          <i className="ti ti-chevron-left" />
        </button>
        <h1>{hasRoute ? `${from} → ${to}` : 'Carte'}</h1>
      </div>

      <div className="wa-body">
        <MapBox height={280} paths={[pathD]} points={mapDots}>
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

        {hasRoute ? (
          <>
            <Card>
              <p style={{ fontSize: 14, fontWeight: 500, margin: '0 0 4px' }}>
                Itinéraire · {route.steps.length} étape(s)
              </p>
              <p style={{ fontSize: 12, color: 'var(--wa-text-muted)', margin: 0 }}>
                ~{formatDuration(route.total.temps)} · {formatPrice(route.total.prix)}
              </p>
            </Card>
            {route.steps.map((step, i) => (
              <RouteCard key={i} step={step} />
            ))}
          </>
        ) : (
          selectedDestination && (
            <Card>
              <p style={{ fontSize: 14, fontWeight: 500, margin: '0 0 4px' }}>
                Destination · {selectedDestination.nom}
              </p>
              <p style={{ fontSize: 12, color: 'var(--wa-text-muted)', margin: 0 }}>
                Lancez une recherche pour afficher un itinéraire
              </p>
            </Card>
          )
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
