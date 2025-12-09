import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { AssessmentScore, ScoreType } from './entities/assessment-score.entity';
import { CreateScoreDto } from './dto/create-score.dto';
import { UpdateScoreDto } from './dto/update-score.dto';
import { BatchCreateScoreDto } from './dto/batch-create-score.dto';

@Injectable()
export class ScoresService {
  private readonly logger = new Logger(ScoresService.name);

  constructor(
    @InjectRepository(AssessmentScore)
    private scoreRepository: Repository<AssessmentScore>,
    private dataSource: DataSource,
  ) {}

  async create(dto: CreateScoreDto, userId: string): Promise<AssessmentScore> {
    const score = this.scoreRepository.create({
      ...dto,
      scoredBy: userId,
      scoredAt: new Date(),
    });
    return this.scoreRepository.save(score);
  }

  /**
   * 批量创建评分 - 使用事务确保数据一致性
   * 如果任一评分保存失败，所有操作将回滚
   */
  async batchCreate(dto: BatchCreateScoreDto, userId: string): Promise<AssessmentScore[]> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const savedScores: AssessmentScore[] = [];

      for (const scoreDto of dto.scores) {
        // 检查是否已存在该评分
        const existing = await queryRunner.manager.findOne(AssessmentScore, {
          where: {
            taskId: dto.taskId,
            evaluationItemId: scoreDto.evaluationItemId,
            scoreType: dto.scoreType,
          },
        });

        if (existing) {
          // 更新现有评分
          existing.score = scoreDto.score;
          existing.evidence = scoreDto.evidence || existing.evidence;
          existing.comment = scoreDto.comment || existing.comment;
          existing.scoredBy = userId;
          existing.scoredAt = new Date();
          const updated = await queryRunner.manager.save(existing);
          savedScores.push(updated);
        } else {
          // 创建新评分
          const score = queryRunner.manager.create(AssessmentScore, {
            ...scoreDto,
            taskId: dto.taskId,
            scoreType: dto.scoreType,
            scoredBy: userId,
            scoredAt: new Date(),
          });
          const saved = await queryRunner.manager.save(score);
          savedScores.push(saved);
        }
      }

      await queryRunner.commitTransaction();
      this.logger.log(`Batch saved ${savedScores.length} scores for task ${dto.taskId}`);
      return savedScores;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(`Failed to batch save scores for task ${dto.taskId}`, error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findByTask(taskId: string, scoreType?: ScoreType): Promise<AssessmentScore[]> {
    const where: { taskId: string; scoreType?: ScoreType } = { taskId };
    if (scoreType) {
      where.scoreType = scoreType;
    }
    return this.scoreRepository.find({
      where,
      relations: ['evaluationItem', 'evaluationItem.indicator'],
      order: { createdAt: 'ASC' },
    });
  }

  async findOne(id: string): Promise<AssessmentScore> {
    const score = await this.scoreRepository.findOne({
      where: { id },
      relations: ['evaluationItem', 'task'],
    });
    if (!score) {
      throw new NotFoundException('评分记录不存在');
    }
    return score;
  }

  async update(id: string, dto: UpdateScoreDto, userId: string): Promise<AssessmentScore> {
    const score = await this.findOne(id);
    Object.assign(score, dto, {
      scoredBy: userId,
      scoredAt: new Date(),
    });
    return this.scoreRepository.save(score);
  }

  async remove(id: string): Promise<void> {
    const score = await this.findOne(id);
    await this.scoreRepository.remove(score);
  }

  async getStatisticsByTask(taskId: string) {
    const scores = await this.findByTask(taskId);

    const selfScores = scores.filter((s) => s.scoreType === ScoreType.SELF);
    const supervisionScores = scores.filter((s) => s.scoreType === ScoreType.SUPERVISION);

    const selfTotal = selfScores.reduce((sum, s) => sum + Number(s.score), 0);
    const supervisionTotal = supervisionScores.reduce((sum, s) => sum + Number(s.score), 0);

    return {
      selfScoreCount: selfScores.length,
      supervisionScoreCount: supervisionScores.length,
      selfTotal,
      supervisionTotal,
      scores,
    };
  }
}
