export const LAST_USER_LOCATION_KEY = 'nearbyfinder:lastUserLocation';

export function readLastUserLocation(): { lat: number; lng: number } | null {
  try {
    const raw = sessionStorage.getItem(LAST_USER_LOCATION_KEY);
    if (!raw) return null;
    const p = JSON.parse(raw) as { lat?: number; lng?: number };
    if (typeof p.lat === 'number' && typeof p.lng === 'number') {
      return { lat: p.lat, lng: p.lng };
    }
  } catch {
    /* ignore */
  }
  return null;
}

export function writeLastUserLocation(loc: { lat: number; lng: number }) {
  sessionStorage.setItem(LAST_USER_LOCATION_KEY, JSON.stringify(loc));
}

export const FALLBACK_MAP_CENTER = { lat: 40.7128, lng: -74.006 };
