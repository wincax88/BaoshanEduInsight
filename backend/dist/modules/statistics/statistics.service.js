"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatisticsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const school_entity_1 = require("../schools/entities/school.entity");
const assessment_task_entity_1 = require("../assessments/entities/assessment-task.entity");
const assessment_score_entity_1 = require("../scores/entities/assessment-score.entity");
const indicator_l1_entity_1 = require("../indicators/entities/indicator-l1.entity");
const evaluation_item_entity_1 = require("../indicators/entities/evaluation-item.entity");
let StatisticsService = class StatisticsService {
    schoolRepository;
    taskRepository;
    scoreRepository;
    indicatorL1Repository;
    evaluationItemRepository;
    constructor(schoolRepository, taskRepository, scoreRepository, indicatorL1Repository, evaluationItemRepository) {
        this.schoolRepository = schoolRepository;
        this.taskRepository = taskRepository;
        this.scoreRepository = scoreRepository;
        this.indicatorL1Repository = indicatorL1Repository;
        this.evaluationItemRepository = evaluationItemRepository;
    }
    async getOverview() {
        const schoolCount = await this.schoolRepository.count();
        const currentYear = new Date().getFullYear();
        const academicYear = `${currentYear}-${currentYear + 1}`;
        const totalTasks = await this.taskRepository.count();
        const yearTasks = await this.taskRepository.count({
            where: { academicYear },
        });
        const completedTasks = await this.taskRepository.count({
            where: { status: assessment_task_entity_1.AssessmentStatus.COMPLETED },
        });
        const completedTasksWithScore = await this.taskRepository.find({
            where: { status: assessment_task_entity_1.AssessmentStatus.COMPLETED },
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
    async getAssessmentProgress() {
        const statusCounts = await this.taskRepository
            .createQueryBuilder('task')
            .select('task.status', 'status')
            .addSelect('COUNT(*)', 'count')
            .groupBy('task.status')
            .getRawMany();
        const statusMap = {
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
    async getIndicatorScoreDistribution(taskId) {
        const indicators = await this.indicatorL1Repository.find({
            order: { sortOrder: 'ASC' },
        });
        if (!taskId) {
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
                        avgScore: 0,
                    });
                    continue;
                }
                const avgResult = await this.scoreRepository
                    .createQueryBuilder('score')
                    .leftJoin('score.task', 'task')
                    .where('score.evaluationItemId IN (:...itemIds)', { itemIds: itemIds.map(i => i.id) })
                    .andWhere('score.scoreType = :scoreType', { scoreType: assessment_score_entity_1.ScoreType.SUPERVISION })
                    .andWhere('task.status = :status', { status: assessment_task_entity_1.AssessmentStatus.COMPLETED })
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
            const selfResult = await this.scoreRepository
                .createQueryBuilder('score')
                .where('score.taskId = :taskId', { taskId })
                .andWhere('score.evaluationItemId IN (:...itemIds)', { itemIds: itemIds.map(i => i.id) })
                .andWhere('score.scoreType = :scoreType', { scoreType: assessment_score_entity_1.ScoreType.SELF })
                .select('SUM(score.score)', 'sum')
                .getRawOne();
            const supervisionResult = await this.scoreRepository
                .createQueryBuilder('score')
                .where('score.taskId = :taskId', { taskId })
                .andWhere('score.evaluationItemId IN (:...itemIds)', { itemIds: itemIds.map(i => i.id) })
                .andWhere('score.scoreType = :scoreType', { scoreType: assessment_score_entity_1.ScoreType.SUPERVISION })
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
    async getTodoList() {
        const pendingTasks = await this.taskRepository.find({
            where: [
                { status: assessment_task_entity_1.AssessmentStatus.SELF_EVALUATION },
                { status: assessment_task_entity_1.AssessmentStatus.SUPERVISION },
                { status: assessment_task_entity_1.AssessmentStatus.REVIEW },
            ],
            relations: ['school'],
            order: { updatedAt: 'DESC' },
            take: 10,
        });
        const statusActionMap = {
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
    async getSchoolRanking(limit = 10) {
        const rankings = await this.taskRepository
            .createQueryBuilder('task')
            .leftJoinAndSelect('task.school', 'school')
            .where('task.status = :status', { status: assessment_task_entity_1.AssessmentStatus.COMPLETED })
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
    async getScoreTrend() {
        const result = await this.taskRepository
            .createQueryBuilder('task')
            .select('task.academicYear', 'academicYear')
            .addSelect('AVG(task.totalScore)', 'avgScore')
            .addSelect('COUNT(*)', 'count')
            .where('task.status = :status', { status: assessment_task_entity_1.AssessmentStatus.COMPLETED })
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
};
exports.StatisticsService = StatisticsService;
exports.StatisticsService = StatisticsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(school_entity_1.School)),
    __param(1, (0, typeorm_1.InjectRepository)(assessment_task_entity_1.AssessmentTask)),
    __param(2, (0, typeorm_1.InjectRepository)(assessment_score_entity_1.AssessmentScore)),
    __param(3, (0, typeorm_1.InjectRepository)(indicator_l1_entity_1.IndicatorL1)),
    __param(4, (0, typeorm_1.InjectRepository)(evaluation_item_entity_1.EvaluationItem)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], StatisticsService);
//# sourceMappingURL=statistics.service.js.map