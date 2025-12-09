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
exports.AssessmentsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const assessments_service_1 = require("./assessments.service");
const create_assessment_dto_1 = require("./dto/create-assessment.dto");
const update_assessment_dto_1 = require("./dto/update-assessment.dto");
const query_assessment_dto_1 = require("./dto/query-assessment.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const assessment_task_entity_1 = require("./entities/assessment-task.entity");
let AssessmentsController = class AssessmentsController {
    assessmentsService;
    constructor(assessmentsService) {
        this.assessmentsService = assessmentsService;
    }
    create(dto, req) {
        return this.assessmentsService.create(dto, req.user.sub);
    }
    findAll(query) {
        return this.assessmentsService.findAll(query);
    }
    findOne(id) {
        return this.assessmentsService.findOne(id);
    }
    update(id, dto) {
        return this.assessmentsService.update(id, dto);
    }
    remove(id) {
        return this.assessmentsService.remove(id);
    }
    updateStatus(id, status) {
        return this.assessmentsService.updateStatus(id, status);
    }
    calculateScore(id) {
        return this.assessmentsService.calculateTotalScore(id);
    }
};
exports.AssessmentsController = AssessmentsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: '创建测评任务' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_assessment_dto_1.CreateAssessmentDto, Object]),
    __metadata("design:returntype", void 0)
], AssessmentsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: '获取测评任务列表' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_assessment_dto_1.QueryAssessmentDto]),
    __metadata("design:returntype", void 0)
], AssessmentsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: '获取测评任务详情' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AssessmentsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: '更新测评任务' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_assessment_dto_1.UpdateAssessmentDto]),
    __metadata("design:returntype", void 0)
], AssessmentsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: '删除测评任务' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AssessmentsController.prototype, "remove", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    (0, swagger_1.ApiOperation)({ summary: '更新测评状态' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], AssessmentsController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Post)(':id/calculate-score'),
    (0, swagger_1.ApiOperation)({ summary: '计算总分' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AssessmentsController.prototype, "calculateScore", null);
exports.AssessmentsController = AssessmentsController = __decorate([
    (0, swagger_1.ApiTags)('测评任务'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('assessments'),
    __metadata("design:paramtypes", [assessments_service_1.AssessmentsService])
], AssessmentsController);
//# sourceMappingURL=assessments.controller.js.map