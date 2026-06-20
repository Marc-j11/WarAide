import React, { createContext, useState, useMemo } from 'react';
import { points, liaisons, destinations } from '../data';

export const StationContext = createContext(null);

export function StationProvider({ children }) {
  const [selectedDestination, setSelectedDestination] = useState(
    destinations[0] || null
  );
  const [userPosition, setUserPosition] = useState(null);

  const stations = useMemo(
    () => points.filter((p) => p.categorie === 'transport'),
    []
  );

  const value = {
    points,
    liaisons,
    destinations,
    stations,
    selectedDestination,
    setSelectedDestination,
    userPosition,
    setUserPosition,
  };

  return (
    <StationContext.Provider value={value}>{children}</StationContext.Provider>
  );
}
