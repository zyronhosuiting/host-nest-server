import { IsOptional, IsString, IsNumber, Min } from 'class-validator';

export class QueryListingsDto {
  @IsOptional()
  @IsString()
  category?: string; // e.g. 'estate', 'luxury'

  @IsOptional()
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  maxPrice?: number;

  @IsOptional()
  @IsString()
  district?: string; // partial match on location

  @IsOptional()
  @IsNumber()
  @Min(0)
  minBedrooms?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  minBathrooms?: number;

  @IsOptional()
  @IsString()
  areaRange?: string; // '200-400' | '400-600' | '600-800' | '800+'

  @IsOptional()
  @IsString()
  amenities?: string; // comma-separated, e.g. 'pool,gym'

  @IsOptional()
  @IsString()
  propertyType?: string; // comma-separated, e.g. 'apartment,studio'

  @IsOptional()
  @IsString()
  leaseTerm?: string; // comma-separated, e.g. '12months,flexible'

  @IsOptional()
  @IsString()
  moveIn?: string; // ISO date string — show listings available on or before

  @IsOptional()
  @IsNumber()
  @Min(0)
  minPricePerSqft?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  maxPricePerSqft?: number;

  // Map bounds filtering
  @IsOptional()
  @IsNumber()
  north?: number;

  @IsOptional()
  @IsNumber()
  south?: number;

  @IsOptional()
  @IsNumber()
  east?: number;

  @IsOptional()
  @IsNumber()
  west?: number;
}
