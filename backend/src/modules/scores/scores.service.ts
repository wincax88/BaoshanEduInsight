import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AssessmentScore, ScoreType } from './entities/assessment-score.entity';
import { CreateScoreDto } from './dto/create-score.dto';
import { UpdateScoreDto } from './dto/update-score.dto';
import { BatchCreateScoreDto } from './dto/batch-create-score.dto';

@Injectable()
export class ScoresService {
  constructor(
    @InjectRepository(AssessmentScore)
    private scoreRepository: Repository<AssessmentScore>,
  ) {}

  async create(dto: CreateScoreDto, userId: string): Promise<AssessmentScore> {
    const score = this.scoreRepository.create({
      ...dto,
      scoredBy: userId,
      scoredAt: new Date(),
    });
    return this.scoreRepository.save(score);
  }

  async batchCreate(dto: BatchCreateScoreDto, userId: string): Promise<AssessmentScore[]> {
    const scores = dto.scores.map((s) =>
      this.scoreRepository.create({
        ...s,
        taskId: dto.taskId,
        scoreType: dto.scoreType,
        scoredBy: userId,
        scoredAt: new Date(),
      }),
    );
    return this.scoreRepository.save(scores);
  }

  async findByTask(taskId: string, scoreType?: ScoreType): Promise<AssessmentScore[]> {
    const where: any = { taskId };
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
