import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('rental_transactions')
export class RentalTransaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  date: string;

  @Column()
  district: string; // e.g. '太古城'

  @Column()
  building: string;

  @Column()
  categories: string; // space-separated cat keys, e.g. 'estate'

  @Column()
  unitType: string; // e.g. '2房1廁'

  @Column({ type: 'int' })
  area: number; // square feet

  @Column({ type: 'int' })
  monthlyRent: number;
}
