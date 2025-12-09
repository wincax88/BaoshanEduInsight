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
exports.ScoresController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const scores_service_1 = require("./scores.service");
const create_score_dto_1 = require("./dto/create-score.dto");
const update_score_dto_1 = require("./dto/update-score.dto");
const batch_create_score_dto_1 = require("./dto/batch-create-score.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const assessment_score_entity_1 = require("./entities/assessment-score.entity");
let ScoresController = class ScoresController {
    scoresService;
    constructor(scoresService) {
        this.scoresService = scoresService;
    }
    create(dto, req) {
        return this.scoresService.create(dto, req.user.sub);
    }
    batchCreate(dto, req) {
        return this.scoresService.batchCreate(dto, req.user.sub);
    }
    findByTask(taskId, scoreType) {
        return this.scoresService.findByTask(taskId, scoreType);
    }
    getStatistics(taskId) {
        return this.scoresService.getStatisticsByTask(taskId);
    }
    findOne(id) {
        return this.scoresService.findOne(id);
    }
    update(id, dto, req) {
        return this.scoresService.update(id, dto, req.user.sub);
    }
    remove(id) {
        return this.scoresService.remove(id);
    }
};
exports.ScoresController = ScoresController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: '创建评分记录' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_score_dto_1.CreateScoreDto, Object]),
    __metadata("design:returntype", void 0)
], ScoresController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('batch'),
    (0, swagger_1.ApiOperation)({ summary: '批量创建评分记录' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [batch_create_score_dto_1.BatchCreateScoreDto, Object]),
    __metadata("design:returntype", void 0)
], ScoresController.prototype, "batchCreate", null);
__decorate([
    (0, common_1.Get)('task/:taskId'),
    (0, swagger_1.ApiOperation)({ summary: '获取任务的评分列表' }),
    __param(0, (0, common_1.Param)('taskId')),
    __param(1, (0, common_1.Query)('scoreType')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ScoresController.prototype, "findByTask", null);
__decorate([
    (0, common_1.Get)('task/:taskId/statistics'),
    (0, swagger_1.ApiOperation)({ summary: '获取任务评分统计' }),
    __param(0, (0, common_1.Param)('taskId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ScoresController.prototype, "getStatistics", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: '获取评分详情' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ScoresController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: '更新评分' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_score_dto_1.UpdateScoreDto, Object]),
    __metadata("design:returntype", void 0)
], ScoresController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: '删除评分' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ScoresController.prototype, "remove", null);
exports.ScoresController = ScoresController = __decorate([
    (0, swagger_1.ApiTags)('评分管理'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('scores'),
    __metadata("design:paramtypes", [scores_service_1.ScoresService])
], ScoresController);
//# sourceMappingURL=scores.controller.js.map