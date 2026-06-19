import { useState, useEffect } from 'react';

export default function useGeolocation() {
  const [position, setPosition] = useState(null);
  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((p) => setPosition(p.coords));
  }, []);
  return position;
}
