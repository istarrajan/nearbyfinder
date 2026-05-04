/**
 * Headers for calls to public Overpass endpoints.
 *
 * overpass-api.de returns HTTP 406 if the default Node `User-Agent` is used,
 * and (as of 2026) also returns 406 for many server requests that include
 * `Referer` — that header is meant for browser calls, not server-side scripts.
 *
 * Keep `User-Agent` short: some WAF rules reject substrings like "Overpass API"
 * inside the UA string (see Overpass-API#791, community reports).
 *
 * @see https://operations.osmfoundation.org/policies/api/
 */
function publicAppOrigin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '');
  if (fromEnv) return fromEnv;
  const vercel = process.env.VERCEL_URL;
  if (vercel) return `https://${vercel}`;
  return 'https://nearbyfinder.vercel.app';
}

function overpassUserAgent(origin: string): string {
  const custom = process.env.OVERPASS_USER_AGENT?.trim();
  if (custom) return custom;
  return `NearbyFinder/1.0 (+${origin})`;
}

export function overpassUpstreamHeaders(): Record<string, string> {
  const origin = publicAppOrigin();
  const headers: Record<string, string> = {
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    Accept: '*/*',
    'User-Agent': overpassUserAgent(origin),
  };
  const referer = process.env.OVERPASS_REFERER?.trim();
  if (referer) {
    headers.Referer = referer;
  }
  return headers;
}
