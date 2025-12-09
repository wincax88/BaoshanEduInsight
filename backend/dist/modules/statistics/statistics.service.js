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
        const itemsWithL1 = await this.evaluationItemRepository
            .createQueryBuilder('item')
            .leftJoin('item.indicator', 'l3')
            .leftJoin('l3.parent', 'l2')
            .leftJoin('l2.parent', 'l1')
            .select(['item.id', 'l1.id'])
            .getRawMany();
        const itemToL1Map = new Map();
        itemsWithL1.forEach((row) => {
            if (row.item_id && row.l1_id) {
                itemToL1Map.set(row.item_id, row.l1_id);
            }
        });
        if (!taskId) {
            const allScores = await this.scoreRepository
                .createQueryBuilder('score')
                .leftJoin('score.task', 'task')
                .where('score.scoreType = :scoreType', { scoreType: assessment_score_entity_1.ScoreType.SUPERVISION })
                .andWhere('task.status = :status', { status: assessment_task_entity_1.AssessmentStatus.COMPLETED })
                .select(['score.evaluationItemId', 'score.score'])
                .getRawMany();
            const l1ScoreMap = new Map();
            allScores.forEach((score) => {
                const l1Id = itemToL1Map.get(score.score_evaluationItemId);
                if (l1Id) {
                    if (!l1ScoreMap.has(l1Id)) {
                        l1ScoreMap.set(l1Id, []);
                    }
                    l1ScoreMap.get(l1Id).push(Number(score.score_score));
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
        const taskScores = await this.scoreRepository
            .createQueryBuilder('score')
            .where('score.taskId = :taskId', { taskId })
            .select(['score.evaluationItemId', 'score.scoreType', 'score.score'])
            .getRawMany();
        const l1SelfScoreMap = new Map();
        const l1SupervisionScoreMap = new Map();
        taskScores.forEach((score) => {
            const l1Id = itemToL1Map.get(score.score_evaluationItemId);
            if (l1Id) {
                const scoreValue = Number(score.score_score);
                if (score.score_scoreType === assessment_score_entity_1.ScoreType.SELF) {
                    l1SelfScoreMap.set(l1Id, (l1SelfScoreMap.get(l1Id) || 0) + scoreValue);
                }
                else if (score.score_scoreType === assessment_score_entity_1.ScoreType.SUPERVISION) {
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