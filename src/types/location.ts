export interface Company {
  id: string;
  name: string;
}

export interface LocationType {
  id: string;
  name: string;
}

export interface LocationSubtype {
  id: string;
  typeId: string;
  name: string;
}

export interface Province {
  id: string;
  name: string;
}

export interface Location {
  id: number;
  name: string;
  business_type: string;
  latitude: number;
  longitude: number;
  address: string;
  phone_number: string;
  rate: number;
  rate_count: number;
  status: string;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface LocationImage {
  id: string;
  locationId: string;
  imagePath: string;
  isPrimary: boolean;
}

export interface Tag {
  id: string;
  name: string;
}

export interface Review {
  id: string;
  locationId: string;
  rating: number;
  comment?: string;
}

export interface SearchFilters {
  types?: string[];
  subtypes?: string[];
  provinces?: string[];
  companies?: string[];
  minRating?: number;
  maxPrice?: number;
  quality?: string;
  tags?: string[];
}
