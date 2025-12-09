import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { School } from './school.entity';

@Entity('education_groups')
export class EducationGroup {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ unique: true, length: 50 })
  code: string;

  @Column({ nullable: true, length: 500 })
  description: string;

  @Column({ nullable: true, length: 100 })
  leadSchool: string;

  @OneToMany(() => School, (school) => school.educationGroup)
  schools: School[];

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
