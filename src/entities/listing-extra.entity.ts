import {
  Entity,
  PrimaryColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Listing } from './listing.entity';

@Entity('listing_extras')
export class ListingExtra {
  @PrimaryColumn()
  listingId: number;

  @Column({ type: 'int' })
  area: number; // in square feet

  @Column({ type: 'int', default: 0 })
  bedrooms: number;

  @Column({ type: 'int', default: 1 })
  bathrooms: number;

  @Column({ type: 'text', default: '' })
  description: string;

  @Column({ type: 'text', array: true, default: '{}' })
  features: string[]; // e.g. ['業主直租 — 免佣金', ...]

  @Column({ nullable: true })
  propertyType: string; // e.g. '私人屋苑'

  @Column({ nullable: true })
  leaseTerm: string; // e.g. '12個月'

  @Column({ nullable: true })
  ownerPhone: string;

  @Column({ type: 'text', array: true, default: '{}' })
  amenities: string[]; // e.g. ['elevator', 'security', 'gym']

  @OneToOne(() => Listing, (listing) => listing.extra, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'listingId' })
  listing: Listing;
}
