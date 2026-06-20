/**
 * Distance Haversine entre deux points GPS.
 * @param {{lat:number,lng:number}} a
 * @param {{lat:number,lng:number}} b
 * @returns {number} distance en mètres
 */
export function haversine(a, b) {
  if (!a || !b) return 0;
  const R = 6371000; // rayon Terre en m
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
  return R * c;
}

export default haversine;
