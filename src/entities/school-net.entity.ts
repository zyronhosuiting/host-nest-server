import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('school_nets')
export class SchoolNet {
  @PrimaryColumn()
  mapLocation: string; // e.g. '太古城'

  @Column()
  primarySchoolNet: string; // e.g. '第14組'

  @Column()
  secondarySchoolNet: string; // e.g. '東區'
}
