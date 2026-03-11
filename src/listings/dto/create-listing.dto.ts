import {
  IsString,
  IsNumber,
  IsArray,
  IsOptional,
  Min,
} from 'class-validator';

export class CreateListingDto {
  @IsString()
  name: string;

  @IsArray()
  @IsString({ each: true })
  categories: string[];

  @IsString()
  location: string;

  @IsString()
  mapLocation: string;

  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;

  @IsOptional()
  @IsString()
  badge?: string;

  @IsString()
  subtitle: string;

  @IsString()
  availableDates: string;

  @IsString()
  listedDate: string;

  @IsString()
  updatedDate: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsOptional()
  @IsNumber()
  rating?: number;

  @IsOptional()
  @IsNumber()
  reviews?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  photos?: string[];

  @IsOptional()
  @IsNumber()
  coverIndex?: number;

  // Detail fields
  @IsNumber()
  @Min(0)
  area: number;

  @IsNumber()
  @Min(0)
  bedrooms: number;

  @IsNumber()
  @Min(0)
  bathrooms: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  features?: string[];

  @IsOptional()
  @IsString()
  propertyType?: string;

  @IsOptional()
  @IsString()
  leaseTerm?: string;

  @IsOptional()
  @IsString()
  ownerPhone?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  amenities?: string[];
}
