import { useParams, Link, useNavigate } from "react-router";
import { MapPin, Star, Phone, Clock, Navigation, ArrowLeft, Globe, Share2 } from "lucide-react";

const MOCK_PLACES = [
  {
    id: '1',
    name: 'Grand Plaza Hotel',
    category: 'hotels',
    rating: 4.5,
    reviews: 328,
    distance: 0.5,
    address: '123 Main Street, Downtown',
    phone: '+1 234-567-8901',
    email: 'info@grandplaza.com',
    website: 'www.grandplazahotel.com',
    isOpen: true,
    hours: 'Open 24 hours',
    description: 'Grand Plaza Hotel offers luxurious accommodations in the heart of downtown. With spacious rooms, world-class amenities, and exceptional service, we provide the perfect blend of comfort and elegance for business and leisure travelers.',
    lat: 40.7128,
    lng: -74.0060,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
    amenities: ['Free WiFi', 'Swimming Pool', 'Fitness Center', 'Restaurant', 'Room Service', 'Parking'],
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800'
    ]
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
    email: 'reservations@italiancorner.com',
    website: 'www.italiancorner.com',
    isOpen: true,
    hours: 'Mon-Sun: 11:00 AM - 10:00 PM',
    description: 'Experience authentic Italian cuisine at The Italian Corner. Our chefs bring traditional recipes from Italy, using fresh ingredients and time-honored cooking techniques to create unforgettable dining experiences.',
    lat: 40.7138,
    lng: -74.0070,
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
    amenities: ['Outdoor Seating', 'Wine Bar', 'Takeout', 'Delivery', 'Private Events', 'Valet Parking'],
    images: [
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
      'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800',
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800'
    ]
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
    email: 'appointments@luxesalon.com',
    website: 'www.luxehairsalon.com',
    isOpen: true,
    hours: 'Tue-Sat: 9:00 AM - 7:00 PM, Sun: 10:00 AM - 5:00 PM',
    description: 'Luxe Hair Salon is your destination for premium hair care and styling. Our experienced stylists stay current with the latest trends and techniques to help you look and feel your best.',
    lat: 40.7118,
    lng: -74.0050,
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c35b?w=800',
    amenities: ['Hair Styling', 'Coloring', 'Treatments', 'Manicure', 'Pedicure', 'Makeup'],
    images: [
      'https://images.unsplash.com/photo-1560066984-138dadb4c35b?w=800',
      'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800',
      'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=800'
    ]
  }
];

export function PlaceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const place = MOCK_PLACES.find(p => p.id === id);

  if (!place) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Place not found</h2>
          <Link to="/" className="text-blue-600 hover:text-blue-700">
            Return to home
          </Link>
        </div>
      </div>
    );
  }

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
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{place.rating}</span>
                    <span className="text-gray-300">({place.reviews} reviews)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{place.distance} miles away</span>
                  </div>
                  {place.isOpen && (
                    <div className="flex items-center gap-1 bg-green-500/20 px-3 py-1 rounded-full">
                      <Clock className="w-4 h-4" />
                      <span>Open Now</span>
                    </div>
                  )}
                </div>
              </div>

              <button className="bg-white/90 backdrop-blur-sm p-3 rounded-lg hover:bg-white transition-all">
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
              <p className="text-gray-700 leading-relaxed">{place.description}</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Amenities & Services</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {place.amenities.map((amenity, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 text-gray-700 bg-gray-50 px-4 py-2 rounded-lg"
                  >
                    <div className="w-2 h-2 bg-blue-600 rounded-full" />
                    <span className="text-sm">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Gallery</h2>
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
                    <a href={`tel:${place.phone}`} className="text-sm text-blue-600 hover:underline">
                      {place.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Globe className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Website</p>
                    <a href={`https://${place.website}`} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                      {place.website}
                    </a>
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
                <a
                  href={`tel:${place.phone}`}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <Phone className="w-5 h-5" />
                  Call Now
                </a>

                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-white border-2 border-blue-600 text-blue-600 py-3 rounded-lg hover:bg-blue-50 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <Navigation className="w-5 h-5" />
                  Get Directions
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
