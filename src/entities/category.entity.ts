import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('categories')
export class Category {
  @PrimaryColumn()
  key: string; // e.g. 'all', 'estate', 'village'

  @Column()
  label: string; // e.g. '所有物業', '私人屋苑'

  @Column({ type: 'text' })
  icon: string; // SVG path string
}
