import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { IndicatorL3 } from './indicator-l3.entity';

@Entity('evaluation_items')
export class EvaluationItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 200 })
  name: string;

  @Column({ unique: true, length: 20 })
  code: string;

  @Column({ nullable: true, type: 'text' })
  description: string;

  @Column({ nullable: true, type: 'text' })
  baoshanFeature: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  maxScore: number;

  @Column({ nullable: true, type: 'text' })
  scoringCriteria: string;

  @Column({ default: 0 })
  sortOrder: number;

  @ManyToOne(() => IndicatorL3, (l3) => l3.evaluationItems)
  @JoinColumn({ name: 'indicator_id' })
  indicator: IndicatorL3;

  @Column()
  indicatorId: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
