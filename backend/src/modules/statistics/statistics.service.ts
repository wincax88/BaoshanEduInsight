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
  // 优化：使用 JOIN 查询替代循环中的 N+1 查询
  async getIndicatorScoreDistribution(taskId?: string) {
    // 获取所有一级指标
    const indicators = await this.indicatorL1Repository.find({
      order: { sortOrder: 'ASC' },
    });

    // 一次性获取所有评价要素及其对应的一级指标ID
    const itemsWithL1 = await this.evaluationItemRepository
      .createQueryBuilder('item')
      .leftJoin('item.indicator', 'l3')
      .leftJoin('l3.parent', 'l2')
      .leftJoin('l2.parent', 'l1')
      .select(['item.id', 'l1.id'])
      .getRawMany();

    // 构建评价要素到一级指标的映射
    const itemToL1Map = new Map<string, string>();
    itemsWithL1.forEach((row) => {
      if (row.item_id && row.l1_id) {
        itemToL1Map.set(row.item_id, row.l1_id);
      }
    });

    if (!taskId) {
      // 返回所有已完成任务的平均得分
      // 一次性查询所有督导评分（已完成任务）
      const allScores = await this.scoreRepository
        .createQueryBuilder('score')
        .leftJoin('score.task', 'task')
        .where('score.scoreType = :scoreType', { scoreType: ScoreType.SUPERVISION })
        .andWhere('task.status = :status', { status: AssessmentStatus.COMPLETED })
        .select(['score.evaluationItemId', 'score.score'])
        .getRawMany();

      // 按一级指标聚合得分
      const l1ScoreMap = new Map<string, number[]>();
      allScores.forEach((score) => {
        const l1Id = itemToL1Map.get(score.score_evaluationItemId);
        if (l1Id) {
          if (!l1ScoreMap.has(l1Id)) {
            l1ScoreMap.set(l1Id, []);
          }
          l1ScoreMap.get(l1Id)!.push(Number(score.score_score));
        }
      });

      return indicators.map((indicator) => {
        const scores = l1ScoreMap.get(indicator.id) || [];
        const avgScore = scores.length > 0
          ? scores.reduce((sum, s) => sum + s, 0) / scores.length
          : 0;
        return {
          name: indicator.name,
          code: indicator.code,
          maxScore: indicator.weight,
          avgScore: Number(avgScore.toFixed(2)),
        };
      });
    }

    // 获取特定任务的指标得分
    // 一次性查询该任务的所有评分
    const taskScores = await this.scoreRepository
      .createQueryBuilder('score')
      .where('score.taskId = :taskId', { taskId })
      .select(['score.evaluationItemId', 'score.scoreType', 'score.score'])
      .getRawMany();

    // 按一级指标和评分类型聚合
    const l1SelfScoreMap = new Map<string, number>();
    const l1SupervisionScoreMap = new Map<string, number>();

    taskScores.forEach((score) => {
      const l1Id = itemToL1Map.get(score.score_evaluationItemId);
      if (l1Id) {
        const scoreValue = Number(score.score_score);
        if (score.score_scoreType === ScoreType.SELF) {
          l1SelfScoreMap.set(l1Id, (l1SelfScoreMap.get(l1Id) || 0) + scoreValue);
        } else if (score.score_scoreType === ScoreType.SUPERVISION) {
          l1SupervisionScoreMap.set(l1Id, (l1SupervisionScoreMap.get(l1Id) || 0) + scoreValue);
        }
      }
    });

    return indicators.map((indicator) => ({
      name: indicator.name,
      code: indicator.code,
      maxScore: indicator.weight,
      selfScore: Number((l1SelfScoreMap.get(indicator.id) || 0).toFixed(2)),
      supervisionScore: Number((l1SupervisionScoreMap.get(indicator.id) || 0).toFixed(2)),
    }));
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
