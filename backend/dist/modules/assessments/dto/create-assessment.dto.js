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
exports.CreateAssessmentDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateAssessmentDto {
    name;
    academicYear;
    schoolId;
    description;
    selfEvaluationStartDate;
    selfEvaluationEndDate;
    supervisionStartDate;
    supervisionEndDate;
}
exports.CreateAssessmentDto = CreateAssessmentDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: '任务名称', example: '2024-2025学年度综合督导' }),
    (0, class_validator_1.IsNotEmpty)({ message: '任务名称不能为空' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], CreateAssessmentDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '学年', example: '2024-2025' }),
    (0, class_validator_1.IsNotEmpty)({ message: '学年不能为空' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], CreateAssessmentDto.prototype, "academicYear", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '学校ID' }),
    (0, class_validator_1.IsNotEmpty)({ message: '学校不能为空' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateAssessmentDto.prototype, "schoolId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: '任务描述' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAssessmentDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: '自评开始日期' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateAssessmentDto.prototype, "selfEvaluationStartDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: '自评结束日期' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateAssessmentDto.prototype, "selfEvaluationEndDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: '督导开始日期' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateAssessmentDto.prototype, "supervisionStartDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: '督导结束日期' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateAssessmentDto.prototype, "supervisionEndDate", void 0);
//# sourceMappingURL=create-assessment.dto.js.map