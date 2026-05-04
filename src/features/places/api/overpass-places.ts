import { overpassUpstreamHeaders } from '@/lib/overpass-upstream';
import type { Category, OsmRefType, PlaceDetailItem, PlaceListItem } from '../types/places';
import {
  categoryGalleryImages,
  categoryHeroImage,
  formatOsmPlaceId,
} from '../types/places';

/** Direct Overpass URL (server-side only; browsers use /api/overpass to avoid CORS). */
const OVERPASS_DIRECT_URL =
  process.env.OVERPASS_API_URL ?? 'https://overpass-api.de/api/interpreter';

type OverpassElement = {
  type: 'node' | 'way' | 'relation';
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
};

type OverpassResponse = { elements?: OverpassElement[] };

function milesBetween(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3;
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const meters = R * c;
  return meters / 1609.344;
}

function buildAddress(tags: Record<string, string>): string {
  if (tags['addr:full']) return tags['addr:full'];
  const parts = [
    [tags['addr:housenumber'], tags['addr:street']].filter(Boolean).join(' '),
    tags['addr:city'] || tags['addr:place'] || tags['addr:town'],
    tags['addr:state'],
    tags['addr:postcode'],
  ].filter((p) => p && String(p).trim());
  if (parts.length) return parts.join(', ');
  return 'Address from OpenStreetMap (partial)';
}

function pickName(tags: Record<string, string>): string {
  return (
    tags.name ||
    tags['name:en'] ||
    tags.brand ||
    tags.operator ||
    'Unnamed place'
  );
}

function inferOpen(tags: Record<string, string>): boolean {
  const oh = tags.opening_hours?.toLowerCase();
  if (!oh) return true;
  if (oh.includes('24/7')) return true;
  if (oh === 'closed' || oh.startsWith('closed ')) return false;
  return true;
}

function mapTagsToCategory(
  tags: Record<string, string>
): Exclude<Category, 'all'> | null {
  const tourism = tags.tourism;
  if (
    tourism === 'hotel' ||
    tourism === 'motel' ||
    tourism === 'guest_house' ||
    tourism === 'hostel' ||
    tourism === 'apartment'
  ) {
    return 'hotels';
  }

  const a = tags.amenity;
  if (a === 'restaurant' || a === 'fast_food' || a === 'food_court') {
    return 'restaurants';
  }
  if (a === 'bar' || a === 'pub' || a === 'biergarten') {
    return 'restaurants';
  }
  if (a === 'cafe' || a === 'ice_cream') return 'cafes';
  if (a === 'pharmacy') return 'pharmacies';
  if (a === 'gym') return 'gyms';

  const shop = tags.shop;
  if (shop === 'hairdresser' || shop === 'beauty') return 'salons';

  const leisure = tags.leisure;
  if (leisure === 'fitness_centre' || leisure === 'sports_centre') {
    return 'gyms';
  }

  return null;
}

function elementCoords(el: OverpassElement): { lat: number; lon: number } | null {
  if (el.type === 'node' && el.lat != null && el.lon != null) {
    return { lat: el.lat, lon: el.lon };
  }
  if (el.center?.lat != null && el.center?.lon != null) {
    return { lat: el.center.lat, lon: el.center.lon };
  }
  return null;
}

function amenityLines(tags: Record<string, string>): string[] {
  const lines: string[] = [];
  const push = (label: string, key: string) => {
    const v = tags[key];
    if (v && v !== 'no') lines.push(`${label}: ${v}`);
  };
  push('Cuisine', 'cuisine');
  push('Diet', 'diet:vegan');
  push('Wheelchair', 'wheelchair');
  push('Wi-Fi', 'internet_access');
  push('Outdoor seating', 'outdoor_seating');
  push('Delivery', 'delivery');
  push('Takeaway', 'takeaway');
  push('Drive-through', 'drive_through');
  push('Stars', 'stars');
  push('Rooms', 'rooms');
  if (tags.brand) lines.push(`Brand: ${tags.brand}`);
  if (tags.operator && tags.operator !== tags.name) {
    lines.push(`Operator: ${tags.operator}`);
  }
  return lines.slice(0, 12);
}

function buildDescription(
  tags: Record<string, string>,
  category: Exclude<Category, 'all'>
): string {
  const fromTag =
    tags.description || tags['description:en'] || tags['note:en'] || tags.note;
  if (fromTag) return fromTag;

  const catLabel: Record<Exclude<Category, 'all'>, string> = {
    hotels: 'Hotel or lodging',
    restaurants: 'Restaurant or food venue',
    cafes: 'Café',
    salons: 'Hair or beauty',
    gyms: 'Fitness',
    pharmacies: 'Pharmacy',
  };
  const extra = amenityLines(tags);
  const base = `${catLabel[category]} listed on OpenStreetMap. Details may be incomplete; verify before visiting.`;
  if (!extra.length) return base;
  return `${base}\n\nTags: ${extra.join(' · ')}`;
}

export function buildNearbyOverpassQuery(
  lat: number,
  lng: number,
  radiusMeters: number
): string {
  const r = Math.min(Math.max(radiusMeters, 200), 8000);
  const around = `around:${r},${lat},${lng}`;
  return `
[out:json][timeout:35];
(
  node["tourism"="hotel"](${around});
  node["tourism"="motel"](${around});
  node["tourism"="guest_house"](${around});
  node["tourism"="hostel"](${around});
  way["tourism"="hotel"](${around});
  way["tourism"="motel"](${around});
  way["tourism"="guest_house"](${around});
  way["tourism"="hostel"](${around});

  node["amenity"="restaurant"](${around});
  node["amenity"="fast_food"](${around});
  node["amenity"="cafe"](${around});
  node["amenity"="pharmacy"](${around});
  node["amenity"="gym"](${around});
  node["amenity"="bar"](${around});
  node["amenity"="pub"](${around});
  way["amenity"="restaurant"](${around});
  way["amenity"="fast_food"](${around});
  way["amenity"="cafe"](${around});
  way["amenity"="pharmacy"](${around});
  way["amenity"="gym"](${around});
  way["amenity"="bar"](${around});
  way["amenity"="pub"](${around});

  node["shop"="hairdresser"](${around});
  node["shop"="beauty"](${around});
  way["shop"="hairdresser"](${around});
  way["shop"="beauty"](${around});

  node["leisure"="fitness_centre"](${around});
  way["leisure"="fitness_centre"](${around});
);
out center tags;
`.trim();
}

async function overpassFetch(
  query: string,
  signal?: AbortSignal
): Promise<OverpassElement[]> {
  const isBrowser = typeof window !== 'undefined';

  const res = isBrowser
    ? await fetch('/api/overpass', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
        signal,
      })
    : await fetch(OVERPASS_DIRECT_URL, {
        method: 'POST',
        body: new URLSearchParams({ data: query }),
        signal,
        headers: overpassUpstreamHeaders(),
      });

  if (!res.ok) {
    throw new Error(`Overpass HTTP ${res.status}`);
  }
  const json = (await res.json()) as OverpassResponse;
  return json.elements ?? [];
}

export async function fetchNearbyPlaces(
  lat: number,
  lng: number,
  options?: { radiusMeters?: number; signal?: AbortSignal }
): Promise<PlaceListItem[]> {
  const radiusMeters = options?.radiusMeters ?? 2500;
  const query = buildNearbyOverpassQuery(lat, lng, radiusMeters);
  const elements = await overpassFetch(query, options?.signal);

  const seenIds = new Set<string>();
  const seenRoughLocation = new Set<string>();
  const out: PlaceListItem[] = [];

  for (const el of elements) {
    if (el.type !== 'node' && el.type !== 'way') continue;
    const tags = el.tags ?? {};
    const category = mapTagsToCategory(tags);
    if (!category) continue;

    const coords = elementCoords(el);
    if (!coords) continue;

    const osmType: OsmRefType = el.type === 'node' ? 'node' : 'way';
    const id = formatOsmPlaceId(osmType, el.id);
    if (seenIds.has(id)) continue;

    const name = pickName(tags);
    const roughKey = `${name.toLowerCase()}|${coords.lat.toFixed(4)}|${coords.lon.toFixed(4)}`;
    if (seenRoughLocation.has(roughKey)) continue;
    seenIds.add(id);
    seenRoughLocation.add(roughKey);

    const phone = tags.phone || tags['contact:phone'] || '—';
    const image = categoryHeroImage(category);

    out.push({
      id,
      name,
      category,
      rating: null,
      reviews: null,
      distance: milesBetween(lat, lng, coords.lat, coords.lon),
      address: buildAddress(tags),
      phone,
      isOpen: inferOpen(tags),
      lat: coords.lat,
      lng: coords.lon,
      image,
    });
  }

  out.sort((a, b) => a.distance - b.distance);
  return out;
}

function singleElementQuery(osmType: OsmRefType, osmId: number): string {
  if (osmType === 'node') {
    return `[out:json][timeout:15];node(${osmId});out tags;`;
  }
  return `[out:json][timeout:15];way(${osmId});out center tags;`;
}

export async function fetchPlaceDetail(
  osmType: OsmRefType,
  osmId: number,
  userLat: number,
  userLng: number,
  signal?: AbortSignal
): Promise<PlaceDetailItem | null> {
  const elements = await overpassFetch(singleElementQuery(osmType, osmId), signal);
  const el = elements[0];
  if (!el) return null;

  const tags = el.tags ?? {};
  const category = mapTagsToCategory(tags);
  if (!category) return null;

  const coords = elementCoords(el);
  if (!coords) return null;

  const name = pickName(tags);
  const hero = categoryHeroImage(category);
  const hours = tags.opening_hours || 'Not listed on OpenStreetMap';
  const phone = tags.phone || tags['contact:phone'] || '—';
  const email = tags.email || tags['contact:email'] || '';
  const websiteRaw = tags.website || tags['contact:website'] || '';
  const website = websiteRaw.replace(/^https?:\/\//i, '');

  const amenities = amenityLines(tags);
  if (!amenities.length) {
    amenities.push('Details from community-contributed OSM data');
  }

  return {
    id: formatOsmPlaceId(osmType, osmId),
    name,
    category,
    rating: null,
    reviews: null,
    distance: milesBetween(userLat, userLng, coords.lat, coords.lon),
    address: buildAddress(tags),
    phone,
    isOpen: inferOpen(tags),
    lat: coords.lat,
    lng: coords.lon,
    image: hero,
    email,
    website,
    hours,
    description: buildDescription(tags, category),
    amenities,
    images: categoryGalleryImages(category),
  };
}
