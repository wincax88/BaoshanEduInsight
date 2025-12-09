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
exports.StatisticsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const statistics_service_1 = require("./statistics.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let StatisticsController = class StatisticsController {
    statisticsService;
    constructor(statisticsService) {
        this.statisticsService = statisticsService;
    }
    getOverview() {
        return this.statisticsService.getOverview();
    }
    getAssessmentProgress() {
        return this.statisticsService.getAssessmentProgress();
    }
    getIndicatorScoreDistribution(taskId) {
        return this.statisticsService.getIndicatorScoreDistribution(taskId);
    }
    getTodoList() {
        return this.statisticsService.getTodoList();
    }
    getSchoolRanking(limit) {
        return this.statisticsService.getSchoolRanking(limit || 10);
    }
    getScoreTrend() {
        return this.statisticsService.getScoreTrend();
    }
};
exports.StatisticsController = StatisticsController;
__decorate([
    (0, common_1.Get)('overview'),
    (0, swagger_1.ApiOperation)({ summary: '获取总览数据' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], StatisticsController.prototype, "getOverview", null);
__decorate([
    (0, common_1.Get)('assessment-progress'),
    (0, swagger_1.ApiOperation)({ summary: '获取测评进度统计' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], StatisticsController.prototype, "getAssessmentProgress", null);
__decorate([
    (0, common_1.Get)('indicator-scores'),
    (0, swagger_1.ApiOperation)({ summary: '获取指标得分分布' }),
    __param(0, (0, common_1.Query)('taskId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StatisticsController.prototype, "getIndicatorScoreDistribution", null);
__decorate([
    (0, common_1.Get)('todo-list'),
    (0, swagger_1.ApiOperation)({ summary: '获取待办事项' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], StatisticsController.prototype, "getTodoList", null);
__decorate([
    (0, common_1.Get)('school-ranking'),
    (0, swagger_1.ApiOperation)({ summary: '获取学校排名' }),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], StatisticsController.prototype, "getSchoolRanking", null);
__decorate([
    (0, common_1.Get)('score-trend'),
    (0, swagger_1.ApiOperation)({ summary: '获取得分趋势' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], StatisticsController.prototype, "getScoreTrend", null);
exports.StatisticsController = StatisticsController = __decorate([
    (0, swagger_1.ApiTags)('统计分析'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('statistics'),
    __metadata("design:paramtypes", [statistics_service_1.StatisticsService])
], StatisticsController);
//# sourceMappingURL=statistics.controller.js.map