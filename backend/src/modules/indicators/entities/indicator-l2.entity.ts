import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { IndicatorL1 } from './indicator-l1.entity';
import { IndicatorL3 } from './indicator-l3.entity';

@Entity('indicator_l2')
export class IndicatorL2 {
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

  @ManyToOne(() => IndicatorL1, (l1) => l1.children)
  @JoinColumn({ name: 'parent_id' })
  parent: IndicatorL1;

  @Column()
  parentId: string;

  @OneToMany(() => IndicatorL3, (l3) => l3.parent)
  children: IndicatorL3[];

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
