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

  @Column({ type: 'text', array: true, default: '{}' })
  categories: string[]; // e.g. ['estate']

  @Column()
  unitType: string; // e.g. '2房1廁'

  @Column({ type: 'int' })
  area: number; // square feet

  @Column({ type: 'int' })
  monthlyRent: number;
}
