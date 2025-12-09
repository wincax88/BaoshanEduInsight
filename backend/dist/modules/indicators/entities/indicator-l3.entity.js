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
exports.IndicatorL3 = void 0;
const typeorm_1 = require("typeorm");
const indicator_l2_entity_1 = require("./indicator-l2.entity");
const evaluation_item_entity_1 = require("./evaluation-item.entity");
let IndicatorL3 = class IndicatorL3 {
    id;
    name;
    code;
    description;
    weight;
    sortOrder;
    parent;
    parentId;
    evaluationItems;
    isActive;
    createdAt;
    updatedAt;
};
exports.IndicatorL3 = IndicatorL3;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], IndicatorL3.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100 }),
    __metadata("design:type", String)
], IndicatorL3.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true, length: 20 }),
    __metadata("design:type", String)
], IndicatorL3.prototype, "code", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, length: 500 }),
    __metadata("design:type", String)
], IndicatorL3.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], IndicatorL3.prototype, "weight", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], IndicatorL3.prototype, "sortOrder", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => indicator_l2_entity_1.IndicatorL2, (l2) => l2.children),
    (0, typeorm_1.JoinColumn)({ name: 'parent_id' }),
    __metadata("design:type", indicator_l2_entity_1.IndicatorL2)
], IndicatorL3.prototype, "parent", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], IndicatorL3.prototype, "parentId", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => evaluation_item_entity_1.EvaluationItem, (item) => item.indicator),
    __metadata("design:type", Array)
], IndicatorL3.prototype, "evaluationItems", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], IndicatorL3.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], IndicatorL3.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], IndicatorL3.prototype, "updatedAt", void 0);
exports.IndicatorL3 = IndicatorL3 = __decorate([
    (0, typeorm_1.Entity)('indicator_l3')
], IndicatorL3);
//# sourceMappingURL=indicator-l3.entity.js.map