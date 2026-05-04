import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { MapPin, Search, Navigation, Star, Phone, Clock, ChevronDown } from 'lucide-react';

type Category = 'all' | 'hotels' | 'restaurants' | 'salons' | 'cafes' | 'gyms' | 'pharmacies';

interface Place {
  id: string;
  name: string;
  category: Category;
  rating: number;
  reviews: number;
  distance: number;
  address: string;
  phone: string;
  isOpen: boolean;
  lat: number;
  lng: number;
  image: string;
}

const MOCK_PLACES: Place[] = [
  {
    id: '1',
    name: 'Grand Plaza Hotel',
    category: 'hotels',
    rating: 4.5,
    reviews: 328,
    distance: 0.5,
    address: '123 Main Street, Downtown',
    phone: '+1 234-567-8901',
    isOpen: true,
    lat: 40.7128,
    lng: -74.0060,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400'
  },
  {
    id: '2',
    name: 'The Italian Corner',
    category: 'restaurants',
    rating: 4.8,
    reviews: 542,
    distance: 0.3,
    address: '456 Oak Avenue, City Center',
    phone: '+1 234-567-8902',
    isOpen: true,
    lat: 40.7138,
    lng: -74.0070,
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400'
  },
  {
    id: '3',
    name: 'Luxe Hair Salon',
    category: 'salons',
    rating: 4.6,
    reviews: 215,
    distance: 0.7,
    address: '789 Pine Road, Westside',
    phone: '+1 234-567-8903',
    isOpen: true,
    lat: 40.7118,
    lng: -74.0050,
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400'
  },
  {
    id: '4',
    name: 'Sunrise Cafe',
    category: 'cafes',
    rating: 4.4,
    reviews: 487,
    distance: 0.2,
    address: '321 Elm Street, Park District',
    phone: '+1 234-567-8904',
    isOpen: true,
    lat: 40.7148,
    lng: -74.0080,
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400'
  },
  {
    id: '5',
    name: 'Comfort Inn & Suites',
    category: 'hotels',
    rating: 4.2,
    reviews: 298,
    distance: 1.2,
    address: '654 Broadway, Theater District',
    phone: '+1 234-567-8905',
    isOpen: true,
    lat: 40.7108,
    lng: -74.0040,
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400'
  },
  {
    id: '6',
    name: 'Sushi Paradise',
    category: 'restaurants',
    rating: 4.7,
    reviews: 621,
    distance: 0.9,
    address: '987 Market Street, Financial District',
    phone: '+1 234-567-8906',
    isOpen: false,
    lat: 40.7098,
    lng: -74.0030,
    image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400'
  },
  {
    id: '7',
    name: 'FitZone Gym',
    category: 'gyms',
    rating: 4.3,
    reviews: 412,
    distance: 0.6,
    address: '147 Athletic Way, Sports Complex',
    phone: '+1 234-567-8907',
    isOpen: true,
    lat: 40.7158,
    lng: -74.0090,
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400'
  },
  {
    id: '8',
    name: 'Style Studio Salon',
    category: 'salons',
    rating: 4.9,
    reviews: 156,
    distance: 1.5,
    address: '258 Fashion Boulevard, Uptown',
    phone: '+1 234-567-8908',
    isOpen: true,
    lat: 40.7088,
    lng: -74.0020,
    image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=400'
  },
  {
    id: '9',
    name: 'HealthPlus Pharmacy',
    category: 'pharmacies',
    rating: 4.1,
    reviews: 234,
    distance: 0.4,
    address: '369 Wellness Street, Medical Center',
    phone: '+1 234-567-8909',
    isOpen: true,
    lat: 40.7168,
    lng: -74.0100,
    image: 'https://images.unsplash.com/photo-1576602976047-174e57a47881?w=400'
  },
  {
    id: '10',
    name: 'Moonlight Bistro',
    category: 'restaurants',
    rating: 4.6,
    reviews: 389,
    distance: 0.8,
    address: '741 Gourmet Lane, Restaurant Row',
    phone: '+1 234-567-8910',
    isOpen: true,
    lat: 40.7078,
    lng: -74.0010,
    image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=400'
  }
];

const CATEGORIES = [
  { id: 'all' as Category, label: 'All', icon: '🏢' },
  { id: 'hotels' as Category, label: 'Hotels', icon: '🏨' },
  { id: 'restaurants' as Category, label: 'Restaurants', icon: '🍽️' },
  { id: 'cafes' as Category, label: 'Cafes', icon: '☕' },
  { id: 'salons' as Category, label: 'Salons', icon: '💇' },
  { id: 'gyms' as Category, label: 'Gyms', icon: '💪' },
  { id: 'pharmacies' as Category, label: 'Pharmacies', icon: '💊' }
];

export function PlaceFinder() {
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationPermission, setLocationPermission] = useState<'pending' | 'granted' | 'denied'>('pending');
  const [sortBy, setSortBy] = useState<'distance' | 'rating'>('distance');

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setLocationPermission('granted');
        },
        () => {
          setLocationPermission('denied');
          setUserLocation({ lat: 40.7128, lng: -74.0060 });
        }
      );
    } else {
      setUserLocation({ lat: 40.7128, lng: -74.0060 });
    }
  }, []);

  const filteredPlaces = MOCK_PLACES
    .filter(place => selectedCategory === 'all' || place.category === selectedCategory)
    .filter(place =>
      place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      place.address.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'distance') return a.distance - b.distance;
      return b.rating - a.rating;
    });

  const requestLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setLocationPermission('granted');
        },
        () => {
          setLocationPermission('denied');
        }
      );
    }
  };

  return (
    <div className="bg-gray-50">
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Find Places Near You</h2>

          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search places..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {locationPermission === 'denied' && (
              <button
                onClick={requestLocation}
                className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 whitespace-nowrap"
              >
                <Navigation className="w-5 h-5" />
                Enable Location
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm text-gray-600">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'distance' | 'rating')}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="distance">Distance</option>
              <option value="rating">Rating</option>
            </select>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
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
        {filteredPlaces.length === 0 ? (
          <div className="text-center py-16">
            <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No places found</h3>
            <p className="text-gray-500">Try adjusting your search or category filter</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredPlaces.map((place) => (
              <div
                key={place.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-100"
              >
                <div className="relative h-48">
                  <img
                    src={place.image}
                    alt={place.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3 bg-white px-2.5 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    {place.distance} mi
                  </div>
                  {!place.isOpen && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Closed
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="font-bold text-lg text-gray-900 mb-1">{place.name}</h3>

                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold text-gray-900">{place.rating}</span>
                    </div>
                    <span className="text-sm text-gray-500">({place.reviews} reviews)</span>
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
                    {place.phone}
                  </p>

                  <Link
                    to={`/place/${place.id}`}
                    className="block w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium text-center"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <p className="text-sm text-blue-900">
            <strong>Note:</strong> This demo uses mock data. To integrate real data, you can use APIs like:
            <br />
            • Google Places API (via Supabase Edge Functions for secure API key handling)
            <br />
            • Foursquare Places API
            <br />
            • Yelp Fusion API
            <br />
            • OpenStreetMap with Overpass API
          </p>
        </div>
      </div>
    </div>
  );
}
