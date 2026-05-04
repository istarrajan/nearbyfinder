'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import Link from 'next/link';
import { MapPin, Search, Star, Phone, Clock } from 'lucide-react';
import type { Category, PlaceListItem } from '@/features/places/types/places';
import { fetchNearbyPlaces } from '@/features/places/api/overpass-places';
import { searchAreaByQuery } from '@/features/places/api/photon-geocode';
import { FALLBACK_MAP_CENTER, writeLastUserLocation } from '@/lib/geo-storage';

const GEO_OPTIONS: PositionOptions = {
  enableHighAccuracy: false,
  timeout: 12_000,
  maximumAge: 300_000,
};

const CATEGORIES = [
  { id: 'all' as Category, label: 'All', icon: '🏢' },
  { id: 'hotels' as Category, label: 'Hotels', icon: '🏨' },
  { id: 'restaurants' as Category, label: 'Restaurants', icon: '🍽️' },
  { id: 'cafes' as Category, label: 'Cafes', icon: '☕' },
  { id: 'salons' as Category, label: 'Salons', icon: '💇' },
  { id: 'gyms' as Category, label: 'Gyms', icon: '💪' },
  { id: 'pharmacies' as Category, label: 'Pharmacies', icon: '💊' },
];

function formatMiles(mi: number): string {
  return (Math.round(mi * 10) / 10).toFixed(1);
}

export function PlaceFinder() {
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [gpsLocation, setGpsLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationPermission, setLocationPermission] = useState<'pending' | 'granted' | 'denied'>('pending');
  const [areaLabel, setAreaLabel] = useState('Getting your location…');
  const [locationPanelOpen, setLocationPanelOpen] = useState(false);
  const [areaSearchInput, setAreaSearchInput] = useState('');
  const [areaSearchLoading, setAreaSearchLoading] = useState(false);
  const [areaSearchError, setAreaSearchError] = useState<string | null>(null);
  const [areaSearchResults, setAreaSearchResults] = useState<
    { lat: number; lng: number; label: string }[]
  >([]);
  const [sortBy, setSortBy] = useState<'distance' | 'rating'>('distance');
  const [places, setPlaces] = useState<PlaceListItem[]>([]);
  const [placesLoading, setPlacesLoading] = useState(false);
  const [placesError, setPlacesError] = useState<string | null>(null);
  const [refetchIndex, setRefetchIndex] = useState(0);
  const areaSearchAbortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => areaSearchAbortRef.current?.abort();
  }, []);

  const applyGpsSuccess = useCallback((lat: number, lng: number) => {
    setGpsLocation({ lat, lng });
    setUserLocation({ lat, lng });
    setLocationPermission('granted');
    setAreaLabel('Your current location');
  }, []);

  const applyGpsDenied = useCallback(() => {
    setGpsLocation(null);
    setUserLocation(FALLBACK_MAP_CENTER);
    setLocationPermission('denied');
    setAreaLabel('New York area (default — location denied or unavailable)');
  }, []);

  useEffect(() => {
    if (!('geolocation' in navigator)) {
      applyGpsDenied();
      return;
    }

    let cancelled = false;
    const safetyTimer = window.setTimeout(() => {
      if (cancelled) return;
      applyGpsDenied();
      setAreaLabel(
        'Default area (location timed out — allow location or use “Change area” to pick a city)'
      );
    }, 14_000);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (cancelled) return;
        window.clearTimeout(safetyTimer);
        applyGpsSuccess(position.coords.latitude, position.coords.longitude);
      },
      () => {
        if (cancelled) return;
        window.clearTimeout(safetyTimer);
        applyGpsDenied();
      },
      GEO_OPTIONS
    );

    return () => {
      cancelled = true;
      window.clearTimeout(safetyTimer);
    };
  }, [applyGpsDenied, applyGpsSuccess]);

  useEffect(() => {
    if (!userLocation) return;
    writeLastUserLocation(userLocation);
  }, [userLocation]);

  useEffect(() => {
    if (!userLocation) return;
    const ac = new AbortController();
    setPlacesLoading(true);
    setPlacesError(null);
    fetchNearbyPlaces(userLocation.lat, userLocation.lng, { signal: ac.signal })
      .then(setPlaces)
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        setPlacesError(
          'Could not load places. The OpenStreetMap Overpass service may be busy — try again in a moment.'
        );
        setPlaces([]);
      })
      .finally(() => {
        if (!ac.signal.aborted) setPlacesLoading(false);
      });
    return () => ac.abort();
  }, [userLocation?.lat, userLocation?.lng, refetchIndex]);

  const filteredPlaces = useMemo(() => {
    return places
      .filter((place) => selectedCategory === 'all' || place.category === selectedCategory)
      .filter(
        (place) =>
          place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          place.address.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => {
        if (sortBy === 'distance') return a.distance - b.distance;
        const ar = a.rating ?? -1;
        const br = b.rating ?? -1;
        return br - ar;
      });
  }, [places, selectedCategory, searchQuery, sortBy]);

  const requestLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          applyGpsSuccess(position.coords.latitude, position.coords.longitude);
        },
        () => {
          setLocationPermission('denied');
        },
        GEO_OPTIONS
      );
    }
  };

  const useMyLocation = () => {
    if (gpsLocation) {
      setUserLocation(gpsLocation);
      setAreaLabel('Your current location');
      setLocationPanelOpen(false);
      return;
    }
    requestLocation();
  };

  const pickManualArea = (hit: { lat: number; lng: number; label: string }) => {
    setUserLocation({ lat: hit.lat, lng: hit.lng });
    setAreaLabel(hit.label);
    setLocationPanelOpen(false);
    setAreaSearchInput('');
    setAreaSearchResults([]);
    setAreaSearchError(null);
  };

  const runAreaSearch = () => {
    const q = areaSearchInput.trim();
    if (!q) {
      setAreaSearchResults([]);
      setAreaSearchError('Enter a city, neighborhood, or address.');
      return;
    }
    areaSearchAbortRef.current?.abort();
    const ac = new AbortController();
    areaSearchAbortRef.current = ac;
    setAreaSearchLoading(true);
    setAreaSearchError(null);
    searchAreaByQuery(q, ac.signal)
      .then((hits) => {
        if (ac.signal.aborted) return;
        setAreaSearchResults(hits);
        if (!hits.length) setAreaSearchError('No matches — try a different search.');
      })
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        if (err instanceof Error && err.name === 'AbortError') return;
        if (ac.signal.aborted) return;
        setAreaSearchError('Search failed. Try again in a moment.');
        setAreaSearchResults([]);
      })
      .finally(() => {
        if (!ac.signal.aborted) setAreaSearchLoading(false);
      });
  };

  const awaitingLocation = !userLocation;

  return (
    <div className="bg-gray-50">
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Find Places Near You</h2>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between mb-4 pb-4 border-b border-gray-100">
            <div className="flex items-start gap-2 text-sm text-gray-600 min-w-0">
              <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div className="min-w-0">
                <p>
                  <span className="font-medium text-gray-800">Searching near: </span>
                  <span className="text-gray-700">{areaLabel}</span>
                </p>
                {locationPermission === 'denied' && !gpsLocation && (
                  <p className="text-xs text-gray-500 mt-1">
                    Location access is off — search for an area or allow location so “Use my location” can work.
                  </p>
                )}
              </div>
            </div>
            <div className="flex flex-wrap gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setLocationPanelOpen((o) => !o);
                  setAreaSearchError(null);
                }}
                className="px-3 py-2 text-sm font-medium rounded-lg border border-gray-300 bg-white text-gray-800 hover:bg-gray-50"
              >
                {locationPanelOpen ? 'Close' : 'Change area'}
              </button>
              <button
                type="button"
                onClick={useMyLocation}
                className="px-3 py-2 text-sm font-medium rounded-lg border border-blue-200 bg-blue-50 text-blue-800 hover:bg-blue-100"
              >
                Use my location
              </button>
            </div>
          </div>

          {locationPanelOpen && (
            <div className="mb-4 p-4 rounded-xl border border-gray-200 bg-gray-50/80">
              <p className="text-sm text-gray-600 mb-3">
                Search for a city, neighborhood, or place name. Area suggestions use{' '}
                <a
                  href="https://photon.komoot.io/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Photon
                </a>{' '}
                (OpenStreetMap-based geocoding). Nearby listings use the{' '}
                <span className="font-medium">Overpass API</span> only.
              </p>
              <div className="flex flex-col sm:flex-row gap-2 mb-3">
                <input
                  type="text"
                  value={areaSearchInput}
                  onChange={(e) => setAreaSearchInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') runAreaSearch();
                  }}
                  placeholder="e.g. Shibuya, Tokyo or Austin TX"
                  className="flex-1 px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />
                <button
                  type="button"
                  onClick={runAreaSearch}
                  disabled={areaSearchLoading}
                  className="px-4 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 disabled:opacity-60"
                >
                  {areaSearchLoading ? 'Searching…' : 'Search area'}
                </button>
              </div>
              {areaSearchError && (
                <p className="text-sm text-amber-800 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 mb-2">
                  {areaSearchError}
                </p>
              )}
              {areaSearchResults.length > 0 && (
                <ul className="max-h-56 overflow-y-auto rounded-lg border border-gray-200 bg-white divide-y divide-gray-100">
                  {areaSearchResults.map((hit, i) => (
                    <li key={`${hit.lat}-${hit.lng}-${i}`}>
                      <button
                        type="button"
                        onClick={() => pickManualArea(hit)}
                        className="w-full text-left px-3 py-2.5 text-sm text-gray-800 hover:bg-blue-50"
                      >
                        {hit.label}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search places..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                disabled={awaitingLocation || placesLoading}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm text-gray-600">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'distance' | 'rating')}
              disabled={awaitingLocation}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="distance">Distance</option>
              <option value="rating">Rating (OSM has no ratings; unrated sort last)</option>
            </select>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {CATEGORIES.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => setSelectedCategory(category.id)}
                disabled={awaitingLocation}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span className="mr-1.5">{category.icon}</span>
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {awaitingLocation || placesLoading ? (
          <div className="text-center py-16">
            <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4 animate-pulse" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {awaitingLocation ? 'Getting your location…' : 'Loading nearby places…'}
            </h3>
            <p className="text-gray-500">Live data from OpenStreetMap (Overpass API)</p>
          </div>
        ) : placesError ? (
          <div className="text-center py-16 max-w-lg mx-auto">
            <MapPin className="w-16 h-16 text-amber-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Could not load places</h3>
            <p className="text-gray-600 mb-4">{placesError}</p>
            <button
              type="button"
              onClick={() => setRefetchIndex((n) => n + 1)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        ) : filteredPlaces.length === 0 ? (
          <div className="text-center py-16">
            <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No places found</h3>
            <p className="text-gray-500">Try another category or widen your search terms</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredPlaces.map((place) => (
              <div
                key={place.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-100"
              >
                <div className="relative h-48">
                  <img src={place.image} alt={place.name} className="w-full h-full object-cover" />
                  <div className="absolute top-3 right-3 bg-white px-2.5 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    {formatMiles(place.distance)} mi
                  </div>
                  {!place.isOpen && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Closed
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="font-bold text-lg text-gray-900 mb-1">{place.name}</h3>

                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    {place.rating != null ? (
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold text-gray-900">{place.rating}</span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500">Not rated (OSM)</span>
                    )}
                    {place.reviews != null && (
                      <span className="text-sm text-gray-500">({place.reviews} reviews)</span>
                    )}
                    {place.isOpen && (
                      <div className="ml-auto flex items-center gap-1 text-green-600 text-sm">
                        <Clock className="w-4 h-4" />
                        Open
                      </div>
                    )}
                  </div>

                  <p className="text-sm text-gray-600 mb-2 flex items-start gap-2">
                    <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-gray-400" />
                    {place.address}
                  </p>

                  <p className="text-sm text-gray-600 mb-4 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    {place.phone === '—' ? <span className="text-gray-400">No phone listed</span> : place.phone}
                  </p>

                  <Link
                    href={`/place/${place.id}`}
                    className="block w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium text-center"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 p-4 bg-emerald-50 rounded-lg border border-emerald-100">
          <p className="text-sm text-emerald-950">
            <strong>Live data:</strong> Places come from{' '}
            <a
              className="text-emerald-800 underline font-medium"
              href="https://www.openstreetmap.org/copyright"
              target="_blank"
              rel="noopener noreferrer"
            >
              OpenStreetMap
            </a>{' '}
            via the{' '}
            <a
              className="text-emerald-800 underline font-medium"
              href="https://wiki.openstreetmap.org/wiki/Overpass_API"
              target="_blank"
              rel="noopener noreferrer"
            >
              Overpass API
            </a>
            . No API key is required. Coverage depends on local mappers; images are stock photos by category.
          </p>
        </div>
      </div>
    </div>
  );
}
