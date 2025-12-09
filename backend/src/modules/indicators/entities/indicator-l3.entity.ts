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
import { IndicatorL2 } from './indicator-l2.entity';
import { EvaluationItem } from './evaluation-item.entity';

@Entity('indicator_l3')
export class IndicatorL3 {
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

  @ManyToOne(() => IndicatorL2, (l2) => l2.children)
  @JoinColumn({ name: 'parent_id' })
  parent: IndicatorL2;

  @Column()
  parentId: string;

  @OneToMany(() => EvaluationItem, (item) => item.indicator)
  evaluationItems: EvaluationItem[];

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
