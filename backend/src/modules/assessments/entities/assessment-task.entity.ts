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
import { School } from '../../schools/entities/school.entity';
import { AssessmentScore } from '../../scores/entities/assessment-score.entity';

export enum AssessmentStatus {
  DRAFT = 'draft',
  SELF_EVALUATION = 'self_evaluation',
  SUPERVISION = 'supervision',
  REVIEW = 'review',
  COMPLETED = 'completed',
}

@Entity('assessment_tasks')
export class AssessmentTask {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 200 })
  name: string;

  @Column({ length: 50 })
  academicYear: string;

  @Column({ nullable: true, type: 'text' })
  description: string;

  @ManyToOne(() => School)
  @JoinColumn({ name: 'school_id' })
  school: School;

  @Column()
  schoolId: string;

  @Column({
    type: 'enum',
    enum: AssessmentStatus,
    default: AssessmentStatus.DRAFT,
  })
  status: AssessmentStatus;

  @Column({ nullable: true })
  selfEvaluationStartDate: Date;

  @Column({ nullable: true })
  selfEvaluationEndDate: Date;

  @Column({ nullable: true })
  supervisionStartDate: Date;

  @Column({ nullable: true })
  supervisionEndDate: Date;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  totalScore: number;

  @Column({ nullable: true, type: 'text' })
  supervisionOpinion: string;

  @OneToMany(() => AssessmentScore, (score) => score.task)
  scores: AssessmentScore[];

  @Column({ nullable: true })
  createdBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
