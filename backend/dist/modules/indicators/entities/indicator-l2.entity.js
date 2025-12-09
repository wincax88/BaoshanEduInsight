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
exports.IndicatorL2 = void 0;
const typeorm_1 = require("typeorm");
const indicator_l1_entity_1 = require("./indicator-l1.entity");
const indicator_l3_entity_1 = require("./indicator-l3.entity");
let IndicatorL2 = class IndicatorL2 {
    id;
    name;
    code;
    description;
    weight;
    sortOrder;
    parent;
    parentId;
    children;
    isActive;
    createdAt;
    updatedAt;
};
exports.IndicatorL2 = IndicatorL2;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], IndicatorL2.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100 }),
    __metadata("design:type", String)
], IndicatorL2.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true, length: 20 }),
    __metadata("design:type", String)
], IndicatorL2.prototype, "code", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, length: 500 }),
    __metadata("design:type", String)
], IndicatorL2.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], IndicatorL2.prototype, "weight", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], IndicatorL2.prototype, "sortOrder", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => indicator_l1_entity_1.IndicatorL1, (l1) => l1.children),
    (0, typeorm_1.JoinColumn)({ name: 'parent_id' }),
    __metadata("design:type", indicator_l1_entity_1.IndicatorL1)
], IndicatorL2.prototype, "parent", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], IndicatorL2.prototype, "parentId", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => indicator_l3_entity_1.IndicatorL3, (l3) => l3.parent),
    __metadata("design:type", Array)
], IndicatorL2.prototype, "children", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], IndicatorL2.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], IndicatorL2.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], IndicatorL2.prototype, "updatedAt", void 0);
exports.IndicatorL2 = IndicatorL2 = __decorate([
    (0, typeorm_1.Entity)('indicator_l2')
], IndicatorL2);
//# sourceMappingURL=indicator-l2.entity.js.map