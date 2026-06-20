/**
 * Helpers de géolocalisation.
 */

export function toLatLng(coords) {
  if (!coords) return null;
  return { lat: coords.latitude, lng: coords.longitude };
}

/**
 * Trouve le point le plus proche d'une position donnée.
 */
export function findNearest(position, points) {
  if (!position || !points?.length) return null;
  let best = null;
  let bestDist = Infinity;
  const { latitude: lat1, longitude: lng1 } = position;

  for (const p of points) {
    const dLat = (p.latitude - lat1) * Math.PI / 180;
    const dLng = (p.longitude - lng1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1 * Math.PI / 180) *
        Math.cos(p.latitude * Math.PI / 180) *
        Math.sin(dLng / 2) ** 2;
    const d = 2 * 6371000 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    if (d < bestDist) {
      bestDist = d;
      best = { ...p, distance: d };
    }
  }
  return best;
}
