import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ListingExtra } from './listing-extra.entity';
import { Favorite } from './favorite.entity';

@Entity('listings')
export class Listing {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  categories: string; // space-separated category keys, e.g. 'all estate'

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

  @Column({ default: '' })
  badgeModifier: string; // CSS modifier class, e.g. 'card-badge--new'

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

  @Column({ type: 'int', default: 3 })
  photoCount: number; // number of carousel dots

  @Column({ default: '#5c6bc0' })
  color: string; // placeholder card color

  @Column({ type: 'text', array: true, default: '{}' })
  photos: string[];

  @Column({ type: 'int', nullable: true })
  coverIndex: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt_: Date;

  @OneToOne(() => ListingExtra, (extra) => extra.listing, { cascade: true })
  extra: ListingExtra;

  @OneToMany(() => Favorite, (fav) => fav.listing)
  favorites: Favorite[];
}
