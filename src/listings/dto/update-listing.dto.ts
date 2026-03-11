import { CreateListingDto } from './create-listing.dto';

// Manual PartialType: all properties become optional
export class UpdateListingDto implements Partial<CreateListingDto> {
  name?: string;
  categories?: string[];
  location?: string;
  mapLocation?: string;
  latitude?: number;
  longitude?: number;
  badge?: string;
  subtitle?: string;
  availableDates?: string;
  listedDate?: string;
  updatedDate?: string;
  price?: number;
  rating?: number;
  reviews?: number;
  photos?: string[];
  coverIndex?: number;
  area?: number;
  bedrooms?: number;
  bathrooms?: number;
  description?: string;
  features?: string[];
  propertyType?: string;
  leaseTerm?: string;
  ownerPhone?: string;
  amenities?: string[];
}
