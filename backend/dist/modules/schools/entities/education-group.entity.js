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
exports.EducationGroup = void 0;
const typeorm_1 = require("typeorm");
const school_entity_1 = require("./school.entity");
let EducationGroup = class EducationGroup {
    id;
    name;
    code;
    description;
    leadSchool;
    schools;
    isActive;
    createdAt;
    updatedAt;
};
exports.EducationGroup = EducationGroup;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], EducationGroup.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100 }),
    __metadata("design:type", String)
], EducationGroup.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true, length: 50 }),
    __metadata("design:type", String)
], EducationGroup.prototype, "code", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, length: 500 }),
    __metadata("design:type", String)
], EducationGroup.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, length: 100 }),
    __metadata("design:type", String)
], EducationGroup.prototype, "leadSchool", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => school_entity_1.School, (school) => school.educationGroup),
    __metadata("design:type", Array)
], EducationGroup.prototype, "schools", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], EducationGroup.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], EducationGroup.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], EducationGroup.prototype, "updatedAt", void 0);
exports.EducationGroup = EducationGroup = __decorate([
    (0, typeorm_1.Entity)('education_groups')
], EducationGroup);
//# sourceMappingURL=education-group.entity.js.map