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
exports.CreateIndicatorL3Dto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateIndicatorL3Dto {
    name;
    code;
    parentId;
    description;
    weight;
    sortOrder;
}
exports.CreateIndicatorL3Dto = CreateIndicatorL3Dto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: '指标名称', example: '学校章程与制度' }),
    (0, class_validator_1.IsNotEmpty)({ message: '指标名称不能为空' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateIndicatorL3Dto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '指标编码', example: 'L3-01' }),
    (0, class_validator_1.IsNotEmpty)({ message: '指标编码不能为空' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(20),
    __metadata("design:type", String)
], CreateIndicatorL3Dto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '所属二级指标ID' }),
    (0, class_validator_1.IsNotEmpty)({ message: '所属二级指标不能为空' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateIndicatorL3Dto.prototype, "parentId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: '指标描述' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], CreateIndicatorL3Dto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: '权重(分值)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateIndicatorL3Dto.prototype, "weight", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: '排序', default: 0 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateIndicatorL3Dto.prototype, "sortOrder", void 0);
//# sourceMappingURL=create-indicator-l3.dto.js.map