import React, { createContext, useState, useMemo, useEffect, useCallback } from 'react';
import { points as localPoints, liaisons as localLiaisons, destinations as localDestinations } from '../data';
import api from '../services/api.js';

export const StationContext = createContext(null);

export function StationProvider({ children }) {
  const [points, setPoints] = useState(localPoints);
  const [liaisons, setLiaisons] = useState(localLiaisons);
  const [destinations, setDestinations] = useState(localDestinations);
  const [loading, setLoading] = useState(api.isConfigured());

  const reloadData = useCallback(async () => {
    if (!api.isConfigured()) return;
    setLoading(true);
    try {
      const [gares, lns, dests] = await Promise.all([
        api.getGares(),
        api.getLiaisons(),
        api.getDestinations(),
      ]);
      setPoints(gares);
      setLiaisons(lns);
      setDestinations(dests);
    } catch {
      // conserve les données locales en cas d'échec
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reloadData();
  }, [reloadData]);

  const [selectedDestination, setSelectedDestination] = useState(null);
  const [userPosition, setUserPosition] = useState(null);

  useEffect(() => {
    if (destinations.length && !selectedDestination) {
      setSelectedDestination(destinations[0]);
    }
  }, [destinations, selectedDestination]);

  const stations = useMemo(
    () => points.filter((p) => p.categorie === 'transport' || p.type === 'gare'),
    [points]
  );

  const value = {
    points,
    liaisons,
    destinations,
    stations,
    loading,
    reloadData,
    selectedDestination,
    setSelectedDestination,
    userPosition,
    setUserPosition,
  };

  return (
    <StationContext.Provider value={value}>{children}</StationContext.Provider>
  );
}
