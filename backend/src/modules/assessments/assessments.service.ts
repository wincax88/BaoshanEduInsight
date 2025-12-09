import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AssessmentTask, AssessmentStatus } from './entities/assessment-task.entity';
import { CreateAssessmentDto } from './dto/create-assessment.dto';
import { UpdateAssessmentDto } from './dto/update-assessment.dto';
import { QueryAssessmentDto } from './dto/query-assessment.dto';

@Injectable()
export class AssessmentsService {
  constructor(
    @InjectRepository(AssessmentTask)
    private taskRepository: Repository<AssessmentTask>,
  ) {}

  async create(dto: CreateAssessmentDto, userId: string): Promise<AssessmentTask> {
    const task = this.taskRepository.create({
      ...dto,
      createdBy: userId,
    });
    return this.taskRepository.save(task);
  }

  async findAll(query: QueryAssessmentDto) {
    const {
      page = 1,
      pageSize = 10,
      schoolId,
      status,
      academicYear,
    } = query;

    const qb = this.taskRepository
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.school', 'school');

    if (schoolId) {
      qb.andWhere('task.schoolId = :schoolId', { schoolId });
    }
    if (status) {
      qb.andWhere('task.status = :status', { status });
    }
    if (academicYear) {
      qb.andWhere('task.academicYear = :academicYear', { academicYear });
    }

    const [data, total] = await qb
      .orderBy('task.createdAt', 'DESC')
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();

    return { data, total, page, pageSize };
  }

  async findOne(id: string): Promise<AssessmentTask> {
    const task = await this.taskRepository.findOne({
      where: { id },
      relations: ['school', 'scores', 'scores.evaluationItem'],
    });
    if (!task) {
      throw new NotFoundException('测评任务不存在');
    }
    return task;
  }

  async update(id: string, dto: UpdateAssessmentDto): Promise<AssessmentTask> {
    const task = await this.findOne(id);
    Object.assign(task, dto);
    return this.taskRepository.save(task);
  }

  async remove(id: string): Promise<void> {
    const task = await this.findOne(id);
    await this.taskRepository.remove(task);
  }

  async updateStatus(id: string, status: AssessmentStatus): Promise<AssessmentTask> {
    const task = await this.findOne(id);
    task.status = status;
    return this.taskRepository.save(task);
  }

  async calculateTotalScore(id: string): Promise<AssessmentTask> {
    const task = await this.taskRepository.findOne({
      where: { id },
      relations: ['scores'],
    });
    if (!task) {
      throw new NotFoundException('测评任务不存在');
    }

    const totalScore = task.scores.reduce((sum, score) => {
      return sum + Number(score.score);
    }, 0);

    task.totalScore = totalScore;
    return this.taskRepository.save(task);
  }
}
