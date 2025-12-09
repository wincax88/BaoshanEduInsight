import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { IndicatorL2 } from './indicator-l2.entity';

@Entity('indicator_l1')
export class IndicatorL1 {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ unique: true, length: 20 })
  code: string;

  @Column({ nullable: true, length: 500 })
  description: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  weight: number;

  @Column({ default: 0 })
  sortOrder: number;

  @OneToMany(() => IndicatorL2, (l2) => l2.parent)
  children: IndicatorL2[];

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
