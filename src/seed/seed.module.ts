import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Listing } from '../entities/listing.entity';
import { Category } from '../entities/category.entity';
import { SchoolNet } from '../entities/school-net.entity';
import { RentalTransaction } from '../entities/rental-transaction.entity';

import { SeedService } from './seed.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Listing, Category, SchoolNet, RentalTransaction]),
  ],
  providers: [SeedService],
})
export class SeedModule {}
