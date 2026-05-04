import { NextResponse } from 'next/server';

const DEFAULT_OVERPASS = 'https://overpass-api.de/api/interpreter';
const MAX_QUERY_CHARS = 200_000;

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function POST(req: Request) {
  let query: string;
  try {
    const body = (await req.json()) as unknown;
    query = typeof body === 'object' && body !== null && 'query' in body
      ? String((body as { query?: unknown }).query ?? '')
      : '';
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const trimmed = query.trim();
  if (!trimmed) {
    return NextResponse.json({ error: 'Missing query' }, { status: 400 });
  }
  if (trimmed.length > MAX_QUERY_CHARS) {
    return NextResponse.json({ error: 'Query too large' }, { status: 400 });
  }

  const upstream = process.env.OVERPASS_API_URL ?? DEFAULT_OVERPASS;
  const form = new URLSearchParams({ data: trimmed });

  let res: Response;
  try {
    res = await fetch(upstream, {
      method: 'POST',
      body: form,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      cache: 'no-store',
      signal: AbortSignal.timeout(55_000),
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Upstream fetch failed';
    return NextResponse.json({ error: message }, { status: 502 });
  }

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    return NextResponse.json(
      {
        error: 'Overpass returned an error',
        status: res.status,
        detail: text.slice(0, 800),
      },
      { status: 502 }
    );
  }

  const json: unknown = await res.json().catch(() => null);
  if (json === null) {
    return NextResponse.json({ error: 'Invalid JSON from Overpass' }, { status: 502 });
  }

  return NextResponse.json(json);
}
