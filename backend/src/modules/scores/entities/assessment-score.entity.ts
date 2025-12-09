import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { AssessmentTask } from '../../assessments/entities/assessment-task.entity';
import { EvaluationItem } from '../../indicators/entities/evaluation-item.entity';

export enum ScoreType {
  SELF = 'self',
  SUPERVISION = 'supervision',
}

@Entity('assessment_scores')
export class AssessmentScore {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => AssessmentTask, (task) => task.scores)
  @JoinColumn({ name: 'task_id' })
  task: AssessmentTask;

  @Column()
  taskId: string;

  @ManyToOne(() => EvaluationItem)
  @JoinColumn({ name: 'evaluation_item_id' })
  evaluationItem: EvaluationItem;

  @Column()
  evaluationItemId: string;

  @Column({
    type: 'enum',
    enum: ScoreType,
    default: ScoreType.SELF,
  })
  scoreType: ScoreType;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  score: number;

  @Column({ nullable: true, type: 'text' })
  evidence: string;

  @Column({ nullable: true, type: 'text' })
  comment: string;

  @Column('simple-array', { nullable: true })
  attachments: string[];

  @Column({ nullable: true })
  scoredBy: string;

  @Column({ nullable: true })
  scoredAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
