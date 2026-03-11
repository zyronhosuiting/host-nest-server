import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Listing } from '../entities/listing.entity';
import { Category } from '../entities/category.entity';
import { SchoolNet } from '../entities/school-net.entity';
import { RentalTransaction } from '../entities/rental-transaction.entity';

import {
  SEED_LISTINGS,
  SEED_CATEGORIES,
  SEED_SCHOOL_NETS,
  SEED_RENTAL_TRANSACTIONS,
} from './seed.data';

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(Listing)
    private readonly listingRepo: Repository<Listing>,
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
    @InjectRepository(SchoolNet)
    private readonly schoolNetRepo: Repository<SchoolNet>,
    @InjectRepository(RentalTransaction)
    private readonly rentalTransactionRepo: Repository<RentalTransaction>,
  ) {}

  async onModuleInit() {
    await this.seed();
  }

  async seed() {
    // Only seed if tables are empty
    const listingCount = await this.listingRepo.count();
    if (listingCount > 0) {
      this.logger.log('Database already seeded — skipping.');
      return;
    }

    this.logger.log('Seeding database...');

    // Categories
    for (const cat of SEED_CATEGORIES) {
      await this.categoryRepo.save(this.categoryRepo.create(cat));
    }
    this.logger.log(`Seeded ${SEED_CATEGORIES.length} categories`);

    // School nets
    for (const sn of SEED_SCHOOL_NETS) {
      await this.schoolNetRepo.save(this.schoolNetRepo.create(sn));
    }
    this.logger.log(`Seeded ${SEED_SCHOOL_NETS.length} school nets`);

    // Listings (with detail fields merged in)
    for (const data of SEED_LISTINGS) {
      await this.listingRepo.save(this.listingRepo.create(data));
    }
    this.logger.log(`Seeded ${SEED_LISTINGS.length} listings`);

    // Rental transactions
    for (const data of SEED_RENTAL_TRANSACTIONS) {
      await this.rentalTransactionRepo.save(
        this.rentalTransactionRepo.create(data),
      );
    }
    this.logger.log(`Seeded ${SEED_RENTAL_TRANSACTIONS.length} rental transactions`);

    this.logger.log('✅ Database seeding complete!');
  }
}
