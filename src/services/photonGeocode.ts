export type AreaSearchHit = {
  lat: number;
  lng: number;
  label: string;
};

type PhotonFeature = {
  geometry?: { type?: string; coordinates?: [number, number] };
  properties?: Record<string, unknown>;
};

type PhotonResponse = { features?: PhotonFeature[] };

function str(v: unknown): string | undefined {
  return typeof v === 'string' && v.trim() ? v.trim() : undefined;
}

function labelFromProperties(p: Record<string, unknown>): string {
  const parts = [
    str(p.name),
    str(p.city) || str(p.town) || str(p.village) || str(p.locality),
    str(p.state) || str(p.region),
    str(p.country),
  ].filter(Boolean) as string[];
  return parts.join(', ') || 'Unnamed place';
}

export async function searchAreaByQuery(
  query: string,
  signal?: AbortSignal
): Promise<AreaSearchHit[]> {
  const q = query.trim();
  if (!q) return [];

  const url = new URL('https://photon.komoot.io/api/');
  url.searchParams.set('q', q);
  url.searchParams.set('limit', '8');

  const res = await fetch(url.toString(), { signal });
  if (!res.ok) throw new Error(`Geocode HTTP ${res.status}`);

  const data = (await res.json()) as PhotonResponse;
  const features = data.features ?? [];

  const hits: AreaSearchHit[] = [];
  for (const f of features) {
    const coords = f.geometry?.coordinates;
    if (!coords || coords.length < 2) continue;
    const [lng, lat] = coords;
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) continue;
    const props = f.properties ?? {};
    hits.push({
      lat,
      lng,
      label: labelFromProperties(props),
    });
  }
  return hits;
}
