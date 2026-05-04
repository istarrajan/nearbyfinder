import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import {
  MapPin,
  Star,
  Phone,
  Clock,
  Navigation,
  ArrowLeft,
  Globe,
  Share2,
  Mail,
} from 'lucide-react';
import type { PlaceDetailItem } from '../../types/places';
import { parseOsmPlaceId } from '../../types/places';
import { fetchPlaceDetail } from '../../services/overpassPlaces';
import {
  FALLBACK_MAP_CENTER,
  readLastUserLocation,
} from '../../lib/geoStorage';

function formatMiles(mi: number): string {
  return (Math.round(mi * 10) / 10).toFixed(1);
}

export function PlaceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [place, setPlace] = useState<PlaceDetailItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    const parsed = parseOsmPlaceId(id);
    if (!parsed) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    const ac = new AbortController();

    async function load() {
      setLoading(true);
      setNotFound(false);

      let user = readLastUserLocation();
      if (!user && 'geolocation' in navigator) {
        user = await new Promise<{ lat: number; lng: number }>((resolve) => {
          navigator.geolocation.getCurrentPosition(
            (p) =>
              resolve({
                lat: p.coords.latitude,
                lng: p.coords.longitude,
              }),
            () => resolve(FALLBACK_MAP_CENTER)
          );
        });
      }
      if (!user) user = FALLBACK_MAP_CENTER;

      try {
        const detail = await fetchPlaceDetail(
          parsed.osmType,
          parsed.osmId,
          user.lat,
          user.lng,
          ac.signal
        );
        if (ac.signal.aborted) return;
        if (!detail) {
          setPlace(null);
          setNotFound(true);
        } else {
          setPlace(detail);
        }
      } catch (e: unknown) {
        if (e instanceof DOMException && e.name === 'AbortError') return;
        if (e instanceof Error && e.name === 'AbortError') return;
        setPlace(null);
        setNotFound(true);
      } finally {
        if (!ac.signal.aborted) setLoading(false);
      }
    }

    void load();
    return () => ac.abort();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <MapPin className="w-14 h-14 text-gray-300 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Loading place from OpenStreetMap…</p>
        </div>
      </div>
    );
  }

  if (notFound || !place) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Place not found</h2>
          <p className="text-gray-600 mb-6 max-w-md">
            This link may be invalid, or the place is no longer in the map database.
          </p>
          <Link to="/" className="text-blue-600 hover:text-blue-700">
            Return to home
          </Link>
        </div>
      </div>
    );
  }

  const websiteHref =
    place.website && place.website.trim()
      ? `https://${place.website.replace(/^https?:\/\//i, '')}`
      : null;

  const osmRef = id ? parseOsmPlaceId(id) : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative h-96 bg-gray-900">
        <img
          src={place.image}
          alt={place.name}
          className="w-full h-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm p-3 rounded-lg hover:bg-white transition-all shadow-lg"
        >
          <ArrowLeft className="w-5 h-5 text-gray-900" />
        </button>

        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-2">{place.name}</h1>
                <div className="flex items-center gap-4 text-sm flex-wrap">
                  {place.rating != null ? (
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{place.rating}</span>
                      {place.reviews != null && (
                        <span className="text-gray-300">({place.reviews} reviews)</span>
                      )}
                    </div>
                  ) : (
                    <span className="text-gray-300">Not rated · OpenStreetMap</span>
                  )}
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{formatMiles(place.distance)} miles away</span>
                  </div>
                  {place.isOpen && (
                    <div className="flex items-center gap-1 bg-green-500/20 px-3 py-1 rounded-full">
                      <Clock className="w-4 h-4" />
                      <span>Open Now</span>
                    </div>
                  )}
                </div>
              </div>

              <button
                type="button"
                className="bg-white/90 backdrop-blur-sm p-3 rounded-lg hover:bg-white transition-all"
              >
                <Share2 className="w-5 h-5 text-gray-900" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">{place.description}</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Tags & services (OSM)</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {place.amenities.map((amenity, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 text-gray-700 bg-gray-50 px-4 py-2 rounded-lg"
                  >
                    <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0" />
                    <span className="text-sm">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Gallery</h2>
              <p className="text-sm text-gray-500 mb-4">
                Stock images by category — OpenStreetMap does not provide venue photos here.
              </p>
              <div className="grid grid-cols-3 gap-4">
                {place.images.map((img, index) => (
                  <div key={index} className="aspect-video rounded-lg overflow-hidden">
                    <img
                      src={img}
                      alt={`${place.name} ${index + 1}`}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <h3 className="font-bold text-lg text-gray-900 mb-4">Contact Information</h3>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Address</p>
                    <p className="text-sm text-gray-600">{place.address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Phone</p>
                    {place.phone !== '—' ? (
                      <a href={`tel:${place.phone}`} className="text-sm text-blue-600 hover:underline">
                        {place.phone}
                      </a>
                    ) : (
                      <p className="text-sm text-gray-500">Not listed on OpenStreetMap</p>
                    )}
                  </div>
                </div>

                {place.email ? (
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Email</p>
                      <a href={`mailto:${place.email}`} className="text-sm text-blue-600 hover:underline">
                        {place.email}
                      </a>
                    </div>
                  </div>
                ) : null}

                <div className="flex items-start gap-3">
                  <Globe className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Website</p>
                    {websiteHref ? (
                      <a
                        href={websiteHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline break-all"
                      >
                        {place.website}
                      </a>
                    ) : (
                      <p className="text-sm text-gray-500">Not listed on OpenStreetMap</p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Hours</p>
                    <p className="text-sm text-gray-600">{place.hours}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                {place.phone !== '—' ? (
                  <a
                    href={`tel:${place.phone}`}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
                  >
                    <Phone className="w-5 h-5" />
                    Call Now
                  </a>
                ) : null}

                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-white border-2 border-blue-600 text-blue-600 py-3 rounded-lg hover:bg-blue-50 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <Navigation className="w-5 h-5" />
                  Get Directions
                </a>

                {osmRef ? (
                  <a
                    href={`https://www.openstreetmap.org/${osmRef.osmType}/${osmRef.osmId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full text-sm text-center text-blue-600 hover:underline block pt-1"
                  >
                    View on OpenStreetMap
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
