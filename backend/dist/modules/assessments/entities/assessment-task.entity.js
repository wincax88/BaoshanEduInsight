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
exports.AssessmentTask = exports.AssessmentStatus = void 0;
const typeorm_1 = require("typeorm");
const school_entity_1 = require("../../schools/entities/school.entity");
const assessment_score_entity_1 = require("../../scores/entities/assessment-score.entity");
var AssessmentStatus;
(function (AssessmentStatus) {
    AssessmentStatus["DRAFT"] = "draft";
    AssessmentStatus["SELF_EVALUATION"] = "self_evaluation";
    AssessmentStatus["SUPERVISION"] = "supervision";
    AssessmentStatus["REVIEW"] = "review";
    AssessmentStatus["COMPLETED"] = "completed";
})(AssessmentStatus || (exports.AssessmentStatus = AssessmentStatus = {}));
let AssessmentTask = class AssessmentTask {
    id;
    name;
    academicYear;
    description;
    school;
    schoolId;
    status;
    selfEvaluationStartDate;
    selfEvaluationEndDate;
    supervisionStartDate;
    supervisionEndDate;
    totalScore;
    supervisionOpinion;
    scores;
    createdBy;
    createdAt;
    updatedAt;
};
exports.AssessmentTask = AssessmentTask;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], AssessmentTask.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 200 }),
    __metadata("design:type", String)
], AssessmentTask.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50 }),
    __metadata("design:type", String)
], AssessmentTask.prototype, "academicYear", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'text' }),
    __metadata("design:type", String)
], AssessmentTask.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => school_entity_1.School),
    (0, typeorm_1.JoinColumn)({ name: 'school_id' }),
    __metadata("design:type", school_entity_1.School)
], AssessmentTask.prototype, "school", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], AssessmentTask.prototype, "schoolId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: AssessmentStatus,
        default: AssessmentStatus.DRAFT,
    }),
    __metadata("design:type", String)
], AssessmentTask.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], AssessmentTask.prototype, "selfEvaluationStartDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], AssessmentTask.prototype, "selfEvaluationEndDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], AssessmentTask.prototype, "supervisionStartDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], AssessmentTask.prototype, "supervisionEndDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], AssessmentTask.prototype, "totalScore", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'text' }),
    __metadata("design:type", String)
], AssessmentTask.prototype, "supervisionOpinion", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => assessment_score_entity_1.AssessmentScore, (score) => score.task),
    __metadata("design:type", Array)
], AssessmentTask.prototype, "scores", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], AssessmentTask.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], AssessmentTask.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], AssessmentTask.prototype, "updatedAt", void 0);
exports.AssessmentTask = AssessmentTask = __decorate([
    (0, typeorm_1.Entity)('assessment_tasks')
], AssessmentTask);
//# sourceMappingURL=assessment-task.entity.js.map