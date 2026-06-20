import { useEffect, useState } from 'react';

/**
 * Récupère la position GPS de l'utilisateur (une seule fois).
 * Retourne { position, error, loading }.
 */
export default function useGeolocation(options = {}) {
  const [position, setPosition] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!('geolocation' in navigator)) {
      setError('Géolocalisation non supportée par ce navigateur.');
      setLoading(false);
      return;
    }

    const opts = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000,
      ...options,
    };

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        });
        setLoading(false);
      },
      (err) => {
        setError(err.message || 'Erreur de géolocalisation');
        setLoading(false);
      },
      opts
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { position, error, loading };
}
