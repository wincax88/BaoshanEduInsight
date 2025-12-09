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
exports.EvaluationItem = void 0;
const typeorm_1 = require("typeorm");
const indicator_l3_entity_1 = require("./indicator-l3.entity");
let EvaluationItem = class EvaluationItem {
    id;
    name;
    code;
    description;
    baoshanFeature;
    maxScore;
    scoringCriteria;
    sortOrder;
    indicator;
    indicatorId;
    isActive;
    createdAt;
    updatedAt;
};
exports.EvaluationItem = EvaluationItem;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], EvaluationItem.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 200 }),
    __metadata("design:type", String)
], EvaluationItem.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true, length: 20 }),
    __metadata("design:type", String)
], EvaluationItem.prototype, "code", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'text' }),
    __metadata("design:type", String)
], EvaluationItem.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'text' }),
    __metadata("design:type", String)
], EvaluationItem.prototype, "baoshanFeature", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], EvaluationItem.prototype, "maxScore", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'text' }),
    __metadata("design:type", String)
], EvaluationItem.prototype, "scoringCriteria", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], EvaluationItem.prototype, "sortOrder", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => indicator_l3_entity_1.IndicatorL3, (l3) => l3.evaluationItems),
    (0, typeorm_1.JoinColumn)({ name: 'indicator_id' }),
    __metadata("design:type", indicator_l3_entity_1.IndicatorL3)
], EvaluationItem.prototype, "indicator", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], EvaluationItem.prototype, "indicatorId", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], EvaluationItem.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], EvaluationItem.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], EvaluationItem.prototype, "updatedAt", void 0);
exports.EvaluationItem = EvaluationItem = __decorate([
    (0, typeorm_1.Entity)('evaluation_items')
], EvaluationItem);
//# sourceMappingURL=evaluation-item.entity.js.map