import { useContext, useMemo } from 'react';
import { StationContext } from '../context/StationContext.jsx';
import { haversine } from '../utils/distance.js';

/**
 * Renvoie les stations triées par distance par rapport à une position.
 * Si aucune position n'est fournie, renvoie la liste brute.
 */
export default function useStations(position) {
  const ctx = useContext(StationContext);
  if (!ctx) throw new Error('useStations doit être utilisé dans <StationProvider>');

  const { stations, liaisons, points, destinations, selectedDestination } = ctx;

  const stationsWithDistance = useMemo(() => {
    if (!position) return stations.map((s) => ({ ...s, distance: null }));
    return stations
      .map((s) => ({
        ...s,
        distance: haversine(
          { lat: position.latitude, lng: position.longitude },
          { lat: s.latitude, lng: s.longitude }
        ),
      }))
      .sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity));
  }, [stations, position]);

  return {
    stations: stationsWithDistance,
    liaisons,
    points,
    destinations,
    selectedDestination,
  };
}
