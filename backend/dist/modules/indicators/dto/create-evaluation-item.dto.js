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
exports.CreateEvaluationItemDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateEvaluationItemDto {
    name;
    code;
    indicatorId;
    description;
    baoshanFeature;
    maxScore;
    scoringCriteria;
    sortOrder;
}
exports.CreateEvaluationItemDto = CreateEvaluationItemDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: '评价要素名称', example: '章程制定与执行' }),
    (0, class_validator_1.IsNotEmpty)({ message: '评价要素名称不能为空' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], CreateEvaluationItemDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '评价要素编码', example: 'EI-01' }),
    (0, class_validator_1.IsNotEmpty)({ message: '评价要素编码不能为空' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(20),
    __metadata("design:type", String)
], CreateEvaluationItemDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '所属三级指标ID' }),
    (0, class_validator_1.IsNotEmpty)({ message: '所属三级指标不能为空' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateEvaluationItemDto.prototype, "indicatorId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: '评价要素描述' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEvaluationItemDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: '宝山区特色检测点' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEvaluationItemDto.prototype, "baoshanFeature", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: '最高分值', example: 5 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateEvaluationItemDto.prototype, "maxScore", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: '评分标准' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEvaluationItemDto.prototype, "scoringCriteria", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: '排序', default: 0 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateEvaluationItemDto.prototype, "sortOrder", void 0);
//# sourceMappingURL=create-evaluation-item.dto.js.map