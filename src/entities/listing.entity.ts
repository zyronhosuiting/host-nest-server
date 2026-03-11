import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Favorite } from './favorite.entity';

@Entity('listings')
export class Listing {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'text', array: true, default: '{}' })
  categories: string[]; // e.g. ['all', 'estate']

  @Column()
  location: string; // e.g. '太古城，東區'

  @Column()
  mapLocation: string; // e.g. '太古城'

  @Column({ type: 'decimal', precision: 10, scale: 6 })
  latitude: number;

  @Column({ type: 'decimal', precision: 10, scale: 6 })
  longitude: number;

  @Column({ default: '' })
  badge: string; // e.g. '業主直租', '新上架'

  @Column()
  subtitle: string; // e.g. '私人屋苑 · 2房1廁 · 即租'

  @Column()
  availableDates: string; // e.g. '即時入住' or '2025年4月1日起'

  @Column({ type: 'date' })
  listedDate: string;

  @Column({ type: 'date' })
  updatedDate: string;

  @Column({ type: 'int' })
  price: number; // HKD per month

  @Column({ type: 'decimal', precision: 3, scale: 1, default: 0 })
  rating: number;

  @Column({ type: 'int', default: 0 })
  reviews: number;

  @Column({ type: 'text', array: true, default: '{}' })
  photos: string[];

  @Column({ type: 'int', nullable: true })
  coverIndex: number;

  // ── Detail fields (merged from ListingExtra) ──

  @Column({ type: 'int', default: 0 })
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

  // ── Timestamps ──

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // ── Relations ──

  @OneToMany(() => Favorite, (fav) => fav.listing)
  favorites: Favorite[];
}
