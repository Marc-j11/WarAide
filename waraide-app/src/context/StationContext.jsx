import React, { createContext, useState } from 'react';

export const StationContext = createContext();

export function StationProvider({ children }) {
  const [stations, setStations] = useState([]);
  return <StationContext.Provider value={{ stations, setStations }}>{children}</StationContext.Provider>;
}
