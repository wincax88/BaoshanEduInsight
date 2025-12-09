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
exports.ScoresService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const assessment_score_entity_1 = require("./entities/assessment-score.entity");
let ScoresService = class ScoresService {
    scoreRepository;
    constructor(scoreRepository) {
        this.scoreRepository = scoreRepository;
    }
    async create(dto, userId) {
        const score = this.scoreRepository.create({
            ...dto,
            scoredBy: userId,
            scoredAt: new Date(),
        });
        return this.scoreRepository.save(score);
    }
    async batchCreate(dto, userId) {
        const scores = dto.scores.map((s) => this.scoreRepository.create({
            ...s,
            taskId: dto.taskId,
            scoreType: dto.scoreType,
            scoredBy: userId,
            scoredAt: new Date(),
        }));
        return this.scoreRepository.save(scores);
    }
    async findByTask(taskId, scoreType) {
        const where = { taskId };
        if (scoreType) {
            where.scoreType = scoreType;
        }
        return this.scoreRepository.find({
            where,
            relations: ['evaluationItem', 'evaluationItem.indicator'],
            order: { createdAt: 'ASC' },
        });
    }
    async findOne(id) {
        const score = await this.scoreRepository.findOne({
            where: { id },
            relations: ['evaluationItem', 'task'],
        });
        if (!score) {
            throw new common_1.NotFoundException('评分记录不存在');
        }
        return score;
    }
    async update(id, dto, userId) {
        const score = await this.findOne(id);
        Object.assign(score, dto, {
            scoredBy: userId,
            scoredAt: new Date(),
        });
        return this.scoreRepository.save(score);
    }
    async remove(id) {
        const score = await this.findOne(id);
        await this.scoreRepository.remove(score);
    }
    async getStatisticsByTask(taskId) {
        const scores = await this.findByTask(taskId);
        const selfScores = scores.filter((s) => s.scoreType === assessment_score_entity_1.ScoreType.SELF);
        const supervisionScores = scores.filter((s) => s.scoreType === assessment_score_entity_1.ScoreType.SUPERVISION);
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
};
exports.ScoresService = ScoresService;
exports.ScoresService = ScoresService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(assessment_score_entity_1.AssessmentScore)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ScoresService);
//# sourceMappingURL=scores.service.js.map