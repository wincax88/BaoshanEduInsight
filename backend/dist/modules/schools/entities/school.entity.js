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
exports.School = exports.SchoolCategory = exports.SchoolType = void 0;
const typeorm_1 = require("typeorm");
const education_group_entity_1 = require("./education-group.entity");
var SchoolType;
(function (SchoolType) {
    SchoolType["PUBLIC"] = "public";
    SchoolType["PRIVATE"] = "private";
})(SchoolType || (exports.SchoolType = SchoolType = {}));
var SchoolCategory;
(function (SchoolCategory) {
    SchoolCategory["PRIMARY"] = "primary";
    SchoolCategory["JUNIOR"] = "junior";
    SchoolCategory["NINE_YEAR"] = "nine_year";
})(SchoolCategory || (exports.SchoolCategory = SchoolCategory = {}));
let School = class School {
    id;
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
    educationGroup;
    groupId;
    isActive;
    createdAt;
    updatedAt;
};
exports.School = School;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], School.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100 }),
    __metadata("design:type", String)
], School.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true, length: 50 }),
    __metadata("design:type", String)
], School.prototype, "code", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: SchoolType,
        default: SchoolType.PUBLIC,
    }),
    __metadata("design:type", String)
], School.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: SchoolCategory,
        default: SchoolCategory.PRIMARY,
    }),
    __metadata("design:type", String)
], School.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, length: 255 }),
    __metadata("design:type", String)
], School.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, length: 50 }),
    __metadata("design:type", String)
], School.prototype, "district", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, length: 100 }),
    __metadata("design:type", String)
], School.prototype, "principal", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, length: 20 }),
    __metadata("design:type", String)
], School.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], School.prototype, "studentCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], School.prototype, "teacherCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], School.prototype, "foundedYear", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => education_group_entity_1.EducationGroup, (group) => group.schools, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'group_id' }),
    __metadata("design:type", education_group_entity_1.EducationGroup)
], School.prototype, "educationGroup", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], School.prototype, "groupId", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], School.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], School.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], School.prototype, "updatedAt", void 0);
exports.School = School = __decorate([
    (0, typeorm_1.Entity)('schools')
], School);
//# sourceMappingURL=school.entity.js.map