import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { StationContext } from '../context/StationContext.jsx';
import useGeolocation from '../hooks/useGeolocation.js';
import useStations from '../hooks/useStations.js';
import StationCard from '../components/cards/StationCard.jsx';
import MapBox from '../components/MapBox.jsx';
import Loading from '../components/common/Loading.jsx';

export default function Stations() {
  const navigate = useNavigate();
  const { selectedDestination } = useContext(StationContext);
  const { position, loading, error } = useGeolocation();

  // Si pas de position GPS, on prend la destination comme point de référence
  const refPosition =
    position ||
    (selectedDestination
      ? {
          latitude: selectedDestination.latitude,
          longitude: selectedDestination.longitude,
        }
      : null);

  const { stations, liaisons } = useStations(refPosition);

  // Détermine les transports disponibles pour chaque station
  const stationsWithTransports = stations.map((s) => {
    const out = liaisons.filter((l) => l.depart === s.nom);
    const transports = Array.from(new Set(out.map((l) => l.transport)));
    return { ...s, transports: transports.length ? transports : ['woro'] };
  });

  return (
    <>
      <div className="wa-header">
        <button className="wa-back" onClick={() => navigate(-1)}>
          <i className="ti ti-chevron-left" />
        </button>
        <h1>
          Stations proches
          {selectedDestination ? ` de ${selectedDestination.nom}` : ''}
        </h1>
      </div>

      <div className="wa-body">
        <MapBox
          height={150}
          points={stationsWithTransports.slice(0, 6).map((s, i) => ({
            x: 40 + (i * 45) % 240,
            y: 30 + ((i * 27) % 90),
            r: 5,
            color: i === 0 ? 'var(--wa-orange)' : 'var(--wa-green)',
            label: i === 0 ? s.nom.replace('Gare ', '') : undefined,
          }))}
        />

        {loading && <Loading label="Localisation en cours…" />}
        {error && (
          <p style={{ fontSize: 12, color: 'var(--wa-text-muted)' }}>
            Géolocalisation indisponible ({error}) — affichage par défaut.
          </p>
        )}

        {stationsWithTransports.map((s) => (
          <StationCard
            key={s.id}
            station={s}
            onClick={() =>
              navigate(
                `/result?from=${encodeURIComponent(s.nom)}&to=${encodeURIComponent(
                  selectedDestination?.nom || ''
                )}`
              )
            }
          />
        ))}
      </div>
    </>
  );
}
