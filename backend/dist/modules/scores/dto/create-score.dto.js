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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateScoreDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const assessment_score_entity_1 = require("../entities/assessment-score.entity");
class CreateScoreDto {
    taskId;
    evaluationItemId;
    scoreType;
    score;
    evidence;
    comment;
    attachments;
}
exports.CreateScoreDto = CreateScoreDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: '测评任务ID' }),
    (0, class_validator_1.IsNotEmpty)({ message: '测评任务ID不能为空' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateScoreDto.prototype, "taskId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '评价要素ID' }),
    (0, class_validator_1.IsNotEmpty)({ message: '评价要素ID不能为空' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateScoreDto.prototype, "evaluationItemId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '评分类型', enum: assessment_score_entity_1.ScoreType }),
    (0, class_validator_1.IsNotEmpty)({ message: '评分类型不能为空' }),
    (0, class_validator_1.IsEnum)(assessment_score_entity_1.ScoreType),
    __metadata("design:type", String)
], CreateScoreDto.prototype, "scoreType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '分数', example: 4.5 }),
    (0, class_validator_1.IsNotEmpty)({ message: '分数不能为空' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], CreateScoreDto.prototype, "score", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: '佐证材料说明' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateScoreDto.prototype, "evidence", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: '评语' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateScoreDto.prototype, "comment", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: '附件列表' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], CreateScoreDto.prototype, "attachments", void 0);
//# sourceMappingURL=create-score.dto.js.map