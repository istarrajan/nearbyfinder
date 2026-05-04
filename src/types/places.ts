export type Category =
  | 'all'
  | 'hotels'
  | 'restaurants'
  | 'salons'
  | 'cafes'
  | 'gyms'
  | 'pharmacies';

export type OsmRefType = 'node' | 'way';

export interface PlaceListItem {
  id: string;
  name: string;
  category: Exclude<Category, 'all'>;
  /** OSM has no star ratings */
  rating: number | null;
  /** OSM has no review counts */
  reviews: number | null;
  distance: number;
  address: string;
  phone: string;
  isOpen: boolean;
  lat: number;
  lng: number;
  image: string;
}

export interface PlaceDetailItem extends PlaceListItem {
  email: string;
  website: string;
  hours: string;
  description: string;
  amenities: string[];
  images: string[];
}

export function categoryHeroImage(category: Exclude<Category, 'all'>): string {
  const map: Record<Exclude<Category, 'all'>, string> = {
    hotels:
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
    restaurants:
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
    cafes:
      'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800',
    salons:
      'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800',
    gyms:
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800',
    pharmacies:
      'https://images.unsplash.com/photo-1576602976047-174e57a47881?w=800',
  };
  return map[category];
}

export function categoryGalleryImages(
  category: Exclude<Category, 'all'>
): string[] {
  const byCategory: Record<Exclude<Category, 'all'>, [string, string, string]> =
    {
      hotels: [
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
        'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800',
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800',
      ],
      restaurants: [
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
        'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800',
        'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800',
      ],
      cafes: [
        'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800',
        'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800',
        'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800',
      ],
      salons: [
        'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800',
        'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800',
        'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=800',
      ],
      gyms: [
        'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800',
        'https://images.unsplash.com/photo-1571902943202-507ec2618e98?w=800',
        'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800',
      ],
      pharmacies: [
        'https://images.unsplash.com/photo-1576602976047-174e57a47881?w=800',
        'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800',
        'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800',
      ],
    };
  return byCategory[category];
}

export function parseOsmPlaceId(
  id: string
): { osmType: OsmRefType; osmId: number } | null {
  const m = /^osm-(n|w)-(\d+)$/.exec(id);
  if (!m) return null;
  const osmType: OsmRefType = m[1] === 'n' ? 'node' : 'way';
  const osmId = Number(m[2], 10);
  if (!Number.isFinite(osmId)) return null;
  return { osmType, osmId };
}

export function formatOsmPlaceId(osmType: OsmRefType, osmId: number): string {
  const letter = osmType === 'node' ? 'n' : 'w';
  return `osm-${letter}-${osmId}`;
}
