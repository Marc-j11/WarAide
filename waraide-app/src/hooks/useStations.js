import { useState, useEffect } from 'react';

export default function useStations() {
  const [stations, setStations] = useState([]);
  useEffect(() => {
    // load stations placeholder
  }, []);
  return stations;
}
