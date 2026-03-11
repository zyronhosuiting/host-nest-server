import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Listing } from '../entities/listing.entity';
import { CreateListingDto, UpdateListingDto, QueryListingsDto } from './dto';

// Map frontend property-type filter keys → listing category keys
const PROPERTY_TYPE_CAT_MAP: Record<string, string[]> = {
  apartment: ['estate', 'luxury'],
  studio: ['tong', 'estate'],
  room: ['tong'],
  village: ['village', 'house'],
  serviced: ['luxury', 'commercial'],
};

@Injectable()
export class ListingsService {
  constructor(
    @InjectRepository(Listing)
    private readonly repo: Repository<Listing>,
  ) {}

  async findAll(query: QueryListingsDto): Promise<Listing[]> {
    const qb = this.repo.createQueryBuilder('listing');

    // Category filter (listing.categories array contains the value)
    if (query.category && query.category !== 'all') {
      qb.andWhere(':category = ANY(listing.categories)', {
        category: query.category,
      });
    }

    // Price range
    if (query.minPrice != null) {
      qb.andWhere('listing.price >= :minPrice', { minPrice: query.minPrice });
    }
    if (query.maxPrice != null) {
      qb.andWhere('listing.price <= :maxPrice', { maxPrice: query.maxPrice });
    }

    // District (partial match on location)
    if (query.district) {
      qb.andWhere('listing.location ILIKE :district', {
        district: `%${query.district}%`,
      });
    }

    // Bedrooms (min)
    if (query.minBedrooms != null) {
      qb.andWhere('listing.bedrooms >= :minBedrooms', {
        minBedrooms: query.minBedrooms,
      });
    }

    // Bathrooms (min)
    if (query.minBathrooms != null) {
      qb.andWhere('listing.bathrooms >= :minBathrooms', {
        minBathrooms: query.minBathrooms,
      });
    }

    // Area range
    if (query.areaRange) {
      if (query.areaRange.endsWith('+')) {
        const min = parseInt(query.areaRange);
        qb.andWhere('listing.area >= :areaMin', { areaMin: min });
      } else {
        const [min, max] = query.areaRange.split('-').map(Number);
        qb.andWhere('listing.area >= :areaMin AND listing.area <= :areaMax', {
          areaMin: min,
          areaMax: max,
        });
      }
    }

    // Amenities (must have ALL)
    if (query.amenities) {
      const list = query.amenities.split(',').map((a) => a.trim());
      qb.andWhere('listing.amenities @> :amenities', { amenities: list });
    }

    // Property type filter → maps to category keys
    if (query.propertyType) {
      const types = query.propertyType.split(',').map((t) => t.trim());
      const matchedCats = types.flatMap(
        (pt) => PROPERTY_TYPE_CAT_MAP[pt] ?? [],
      );
      if (matchedCats.length > 0) {
        qb.andWhere('listing.categories && :ptCats', {
          ptCats: matchedCats,
        });
      }
    }

    // Lease term filter
    if (query.leaseTerm) {
      const terms = query.leaseTerm.split(',').map((t) => t.trim());
      const conditions: string[] = [];
      const params: Record<string, string> = {};

      terms.forEach((term, i) => {
        if (term === '12months') {
          conditions.push(`listing."leaseTerm" ILIKE :lt${i}`);
          params[`lt${i}`] = '%12%';
        } else if (term === 'flexible') {
          conditions.push(
            `(listing."leaseTerm" ILIKE :lt${i}a OR listing."leaseTerm" ILIKE :lt${i}b)`,
          );
          params[`lt${i}a`] = '%彈%';
          params[`lt${i}b`] = '%靈活%';
        } else if (term === 'shortterm') {
          conditions.push(`listing."leaseTerm" ILIKE :lt${i}`);
          params[`lt${i}`] = '%短%';
        }
      });

      if (conditions.length > 0) {
        qb.andWhere(`(${conditions.join(' OR ')})`, params);
      }
    }

    // Move-in date filter
    if (query.moveIn) {
      // Show listings where availableDates is '即時入住' OR the parsed date <= moveIn
      qb.andWhere(
        `(listing."availableDates" LIKE '%即時%' OR listing."availableDates" <= :moveIn)`,
        { moveIn: query.moveIn },
      );
    }

    // Price per sqft
    if (query.minPricePerSqft != null) {
      qb.andWhere(
        'listing.area > 0 AND (listing.price::float / listing.area) >= :minPps',
        { minPps: query.minPricePerSqft },
      );
    }
    if (query.maxPricePerSqft != null) {
      qb.andWhere(
        'listing.area > 0 AND (listing.price::float / listing.area) <= :maxPps',
        { maxPps: query.maxPricePerSqft },
      );
    }

    // Map bounds
    if (
      query.north != null &&
      query.south != null &&
      query.east != null &&
      query.west != null
    ) {
      qb.andWhere(
        'listing.latitude BETWEEN :south AND :north AND listing.longitude BETWEEN :west AND :east',
        {
          north: query.north,
          south: query.south,
          east: query.east,
          west: query.west,
        },
      );
    }

    qb.orderBy('listing."updatedDate"', 'DESC');

    return qb.getMany();
  }

  async findOne(id: number): Promise<Listing> {
    const listing = await this.repo.findOne({ where: { id } });
    if (!listing) {
      throw new NotFoundException(`找不到此房源 (id: ${id})`);
    }
    return listing;
  }

  async create(dto: CreateListingDto): Promise<Listing> {
    const listing = this.repo.create(dto);
    return this.repo.save(listing);
  }

  async update(id: number, dto: UpdateListingDto): Promise<Listing> {
    const listing = await this.findOne(id);
    Object.assign(listing, dto);
    listing.updatedDate = new Date().toISOString().slice(0, 10);
    return this.repo.save(listing);
  }

  async remove(id: number): Promise<void> {
    const listing = await this.findOne(id);
    await this.repo.remove(listing);
  }

  /**
   * Append a photo URL to the listing's photos array.
   */
  async addPhoto(id: number, photoUrl: string): Promise<Listing> {
    const listing = await this.findOne(id);
    listing.photos = [...(listing.photos ?? []), photoUrl];
    return this.repo.save(listing);
  }

  /**
   * Remove a photo URL from the listing's photos array.
   */
  async removePhoto(id: number, photoUrl: string): Promise<Listing> {
    const listing = await this.findOne(id);
    listing.photos = (listing.photos ?? []).filter((p) => p !== photoUrl);
    // Adjust coverIndex if needed
    if (
      listing.coverIndex != null &&
      listing.coverIndex >= listing.photos.length
    ) {
      listing.coverIndex = listing.photos.length > 0 ? 0 : (null as any);
    }
    return this.repo.save(listing);
  }
}
