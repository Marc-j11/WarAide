/**
 * Formatte une durée en minutes (entrée en minutes ou secondes).
 */
export function formatDuration(value, unit = 'min') {
  if (value == null) return '—';
  const minutes = unit === 'sec' ? Math.round(value / 60) : Math.round(value);
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h} h ${m}` : `${h} h`;
}

/**
 * Formatte un prix en francs CFA.
 */
export function formatPrice(value) {
  if (value == null) return '—';
  return `${Number(value).toLocaleString('fr-FR')} F CFA`;
}

/**
 * Formatte une distance en m ou km.
 */
export function formatDistance(meters) {
  if (meters == null) return '—';
  if (meters < 1000) return `${Math.round(meters)} m`;
  return `${(meters / 1000).toFixed(1)} km`;
}
