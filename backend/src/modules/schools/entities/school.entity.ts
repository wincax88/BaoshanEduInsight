import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { EducationGroup } from './education-group.entity';

export enum SchoolType {
  PUBLIC = 'public',
  PRIVATE = 'private',
}

export enum SchoolCategory {
  PRIMARY = 'primary',
  JUNIOR = 'junior',
  NINE_YEAR = 'nine_year',
}

@Entity('schools')
export class School {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ unique: true, length: 50 })
  code: string;

  @Column({
    type: 'enum',
    enum: SchoolType,
    default: SchoolType.PUBLIC,
  })
  type: SchoolType;

  @Column({
    type: 'enum',
    enum: SchoolCategory,
    default: SchoolCategory.PRIMARY,
  })
  category: SchoolCategory;

  @Column({ nullable: true, length: 255 })
  address: string;

  @Column({ nullable: true, length: 50 })
  district: string;

  @Column({ nullable: true, length: 100 })
  principal: string;

  @Column({ nullable: true, length: 20 })
  phone: string;

  @Column({ nullable: true })
  studentCount: number;

  @Column({ nullable: true })
  teacherCount: number;

  @Column({ nullable: true })
  foundedYear: number;

  @ManyToOne(() => EducationGroup, (group) => group.schools, { nullable: true })
  @JoinColumn({ name: 'group_id' })
  educationGroup: EducationGroup;

  @Column({ nullable: true })
  groupId: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
