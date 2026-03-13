import { Controller, Get, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RentalTransaction } from '../entities/rental-transaction.entity';
import { SchoolNet } from '../entities/school-net.entity';

@Controller('reference-data')
export class ReferenceDataController {
  constructor(
    @InjectRepository(RentalTransaction)
    private readonly rentalTxRepo: Repository<RentalTransaction>,
    @InjectRepository(SchoolNet)
    private readonly schoolNetRepo: Repository<SchoolNet>,
  ) {}

  /**
   * GET /api/reference-data/rental-transactions
   * Optional query: ?district=太古城
   */
  @Get('rental-transactions')
  getRentalTransactions(@Query('district') district?: string) {
    if (district) {
      return this.rentalTxRepo.find({
        where: { district },
        order: { date: 'DESC' },
      });
    }
    return this.rentalTxRepo.find({ order: { date: 'DESC' } });
  }

  /**
   * GET /api/reference-data/school-nets
   * Returns all school net records, or a single one by ?mapLocation=太古城
   */
  @Get('school-nets')
  getSchoolNets(@Query('mapLocation') mapLocation?: string) {
    if (mapLocation) {
      return this.schoolNetRepo.findOne({ where: { mapLocation } });
    }
    return this.schoolNetRepo.find();
  }
}
