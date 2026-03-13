import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RentalTransaction } from '../entities/rental-transaction.entity';
import { SchoolNet } from '../entities/school-net.entity';
import { ReferenceDataController } from './reference-data.controller';

@Module({
  imports: [TypeOrmModule.forFeature([RentalTransaction, SchoolNet])],
  controllers: [ReferenceDataController],
})
export class ReferenceDataModule {}
