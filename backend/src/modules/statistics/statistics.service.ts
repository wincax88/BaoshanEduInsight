import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { School } from '../schools/entities/school.entity';
import { AssessmentTask, AssessmentStatus } from '../assessments/entities/assessment-task.entity';
import { AssessmentScore, ScoreType } from '../scores/entities/assessment-score.entity';
import { IndicatorL1 } from '../indicators/entities/indicator-l1.entity';
import { EvaluationItem } from '../indicators/entities/evaluation-item.entity';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectRepository(School)
    private schoolRepository: Repository<School>,
    @InjectRepository(AssessmentTask)
    private taskRepository: Repository<AssessmentTask>,
    @InjectRepository(AssessmentScore)
    private scoreRepository: Repository<AssessmentScore>,
    @InjectRepository(IndicatorL1)
    private indicatorL1Repository: Repository<IndicatorL1>,
    @InjectRepository(EvaluationItem)
    private evaluationItemRepository: Repository<EvaluationItem>,
  ) {}

  // 获取总览统计数据
  async getOverview() {
    const schoolCount = await this.schoolRepository.count();

    const currentYear = new Date().getFullYear();
    const academicYear = `${currentYear}-${currentYear + 1}`;

    const totalTasks = await this.taskRepository.count();
    const yearTasks = await this.taskRepository.count({
      where: { academicYear },
    });

    const completedTasks = await this.taskRepository.count({
      where: { status: AssessmentStatus.COMPLETED },
    });

    // 计算平均得分
    const completedTasksWithScore = await this.taskRepository.find({
      where: { status: AssessmentStatus.COMPLETED },
      select: ['totalScore'],
    });

    const avgScore = completedTasksWithScore.length > 0
      ? completedTasksWithScore.reduce((sum, t) => sum + Number(t.totalScore || 0), 0) / completedTasksWithScore.length
      : 0;

    return {
      schoolCount,
      totalTasks,
      yearTasks,
      completedTasks,
      avgScore: Number(avgScore.toFixed(2)),
    };
  }

  // 获取测评进度统计
  async getAssessmentProgress() {
    const statusCounts = await this.taskRepository
      .createQueryBuilder('task')
      .select('task.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('task.status')
      .getRawMany();

    const statusMap: Record<string, string> = {
      draft: '草稿',
      self_evaluation: '自评中',
      supervision: '督导中',
      review: '审核中',
      completed: '已完成',
    };

    return statusCounts.map((item) => ({
      status: item.status,
      statusName: statusMap[item.status] || item.status,
      count: parseInt(item.count, 10),
    }));
  }

  // 获取一级指标得分分布（用于雷达图）
  async getIndicatorScoreDistribution(taskId?: string) {
    // 获取所有一级指标
    const indicators = await this.indicatorL1Repository.find({
      order: { sortOrder: 'ASC' },
    });

    if (!taskId) {
      // 返回所有已完成任务的平均得分
      const result = [];

      for (const indicator of indicators) {
        // 获取该一级指标下所有评价要素的ID
        const itemIds = await this.evaluationItemRepository
          .createQueryBuilder('item')
          .leftJoin('item.indicator', 'l3')
          .leftJoin('l3.parent', 'l2')
          .leftJoin('l2.parent', 'l1')
          .where('l1.id = :indicatorId', { indicatorId: indicator.id })
          .select('item.id')
          .getMany();

        if (itemIds.length === 0) {
          result.push({
            name: indicator.name,
            code: indicator.code,
            maxScore: indicator.weight,
            avgScore: 0,
          });
          continue;
        }

        // 计算该指标的平均得分
        const avgResult = await this.scoreRepository
          .createQueryBuilder('score')
          .leftJoin('score.task', 'task')
          .where('score.evaluationItemId IN (:...itemIds)', { itemIds: itemIds.map(i => i.id) })
          .andWhere('score.scoreType = :scoreType', { scoreType: ScoreType.SUPERVISION })
          .andWhere('task.status = :status', { status: AssessmentStatus.COMPLETED })
          .select('AVG(score.score)', 'avg')
          .getRawOne();

        result.push({
          name: indicator.name,
          code: indicator.code,
          maxScore: indicator.weight,
          avgScore: Number(Number(avgResult?.avg || 0).toFixed(2)),
        });
      }

      return result;
    }

    // 获取特定任务的指标得分
    const result = [];

    for (const indicator of indicators) {
      const itemIds = await this.evaluationItemRepository
        .createQueryBuilder('item')
        .leftJoin('item.indicator', 'l3')
        .leftJoin('l3.parent', 'l2')
        .leftJoin('l2.parent', 'l1')
        .where('l1.id = :indicatorId', { indicatorId: indicator.id })
        .select('item.id')
        .getMany();

      if (itemIds.length === 0) {
        result.push({
          name: indicator.name,
          code: indicator.code,
          maxScore: indicator.weight,
          selfScore: 0,
          supervisionScore: 0,
        });
        continue;
      }

      // 自评得分
      const selfResult = await this.scoreRepository
        .createQueryBuilder('score')
        .where('score.taskId = :taskId', { taskId })
        .andWhere('score.evaluationItemId IN (:...itemIds)', { itemIds: itemIds.map(i => i.id) })
        .andWhere('score.scoreType = :scoreType', { scoreType: ScoreType.SELF })
        .select('SUM(score.score)', 'sum')
        .getRawOne();

      // 督导得分
      const supervisionResult = await this.scoreRepository
        .createQueryBuilder('score')
        .where('score.taskId = :taskId', { taskId })
        .andWhere('score.evaluationItemId IN (:...itemIds)', { itemIds: itemIds.map(i => i.id) })
        .andWhere('score.scoreType = :scoreType', { scoreType: ScoreType.SUPERVISION })
        .select('SUM(score.score)', 'sum')
        .getRawOne();

      result.push({
        name: indicator.name,
        code: indicator.code,
        maxScore: indicator.weight,
        selfScore: Number(Number(selfResult?.sum || 0).toFixed(2)),
        supervisionScore: Number(Number(supervisionResult?.sum || 0).toFixed(2)),
      });
    }

    return result;
  }

  // 获取待办事项
  async getTodoList() {
    // 获取待处理的任务
    const pendingTasks = await this.taskRepository.find({
      where: [
        { status: AssessmentStatus.SELF_EVALUATION },
        { status: AssessmentStatus.SUPERVISION },
        { status: AssessmentStatus.REVIEW },
      ],
      relations: ['school'],
      order: { updatedAt: 'DESC' },
      take: 10,
    });

    const statusActionMap: Record<string, string> = {
      self_evaluation: '自评进行中',
      supervision: '督导评估进行中',
      review: '待审核',
    };

    return pendingTasks.map((task) => ({
      id: task.id,
      name: task.name,
      schoolName: task.school?.name,
      status: task.status,
      action: statusActionMap[task.status],
      updatedAt: task.updatedAt,
    }));
  }

  // 获取学校排名
  async getSchoolRanking(limit: number = 10) {
    const rankings = await this.taskRepository
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.school', 'school')
      .where('task.status = :status', { status: AssessmentStatus.COMPLETED })
      .andWhere('task.totalScore IS NOT NULL')
      .orderBy('task.totalScore', 'DESC')
      .take(limit)
      .getMany();

    return rankings.map((task, index) => ({
      rank: index + 1,
      schoolName: task.school?.name,
      academicYear: task.academicYear,
      totalScore: task.totalScore,
      taskName: task.name,
    }));
  }

  // 获取年度得分趋势
  async getScoreTrend() {
    const result = await this.taskRepository
      .createQueryBuilder('task')
      .select('task.academicYear', 'academicYear')
      .addSelect('AVG(task.totalScore)', 'avgScore')
      .addSelect('COUNT(*)', 'count')
      .where('task.status = :status', { status: AssessmentStatus.COMPLETED })
      .andWhere('task.totalScore IS NOT NULL')
      .groupBy('task.academicYear')
      .orderBy('task.academicYear', 'ASC')
      .getRawMany();

    return result.map((item) => ({
      academicYear: item.academicYear,
      avgScore: Number(Number(item.avgScore || 0).toFixed(2)),
      count: parseInt(item.count, 10),
    }));
  }
}
