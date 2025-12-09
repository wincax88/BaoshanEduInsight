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
exports.CreateSchoolDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const school_entity_1 = require("../entities/school.entity");
class CreateSchoolDto {
    name;
    code;
    type;
    category;
    address;
    district;
    principal;
    phone;
    studentCount;
    teacherCount;
    foundedYear;
    groupId;
}
exports.CreateSchoolDto = CreateSchoolDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: '学校名称' }),
    (0, class_validator_1.IsNotEmpty)({ message: '学校名称不能为空' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateSchoolDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '学校编码' }),
    (0, class_validator_1.IsNotEmpty)({ message: '学校编码不能为空' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], CreateSchoolDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: '学校类型', enum: school_entity_1.SchoolType }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(school_entity_1.SchoolType),
    __metadata("design:type", String)
], CreateSchoolDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: '学校类别', enum: school_entity_1.SchoolCategory }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(school_entity_1.SchoolCategory),
    __metadata("design:type", String)
], CreateSchoolDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: '学校地址' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], CreateSchoolDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: '所属区域' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], CreateSchoolDto.prototype, "district", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: '校长姓名' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateSchoolDto.prototype, "principal", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: '联系电话' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(20),
    __metadata("design:type", String)
], CreateSchoolDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: '学生人数' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateSchoolDto.prototype, "studentCount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: '教师人数' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateSchoolDto.prototype, "teacherCount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: '建校年份' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateSchoolDto.prototype, "foundedYear", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: '所属教育集团ID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSchoolDto.prototype, "groupId", void 0);
//# sourceMappingURL=create-school.dto.js.map