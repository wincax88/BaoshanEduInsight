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
exports.AssessmentScore = exports.ScoreType = void 0;
const typeorm_1 = require("typeorm");
const assessment_task_entity_1 = require("../../assessments/entities/assessment-task.entity");
const evaluation_item_entity_1 = require("../../indicators/entities/evaluation-item.entity");
var ScoreType;
(function (ScoreType) {
    ScoreType["SELF"] = "self";
    ScoreType["SUPERVISION"] = "supervision";
})(ScoreType || (exports.ScoreType = ScoreType = {}));
let AssessmentScore = class AssessmentScore {
    id;
    task;
    taskId;
    evaluationItem;
    evaluationItemId;
    scoreType;
    score;
    evidence;
    comment;
    attachments;
    scoredBy;
    scoredAt;
    createdAt;
    updatedAt;
};
exports.AssessmentScore = AssessmentScore;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], AssessmentScore.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => assessment_task_entity_1.AssessmentTask, (task) => task.scores),
    (0, typeorm_1.JoinColumn)({ name: 'task_id' }),
    __metadata("design:type", assessment_task_entity_1.AssessmentTask)
], AssessmentScore.prototype, "task", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], AssessmentScore.prototype, "taskId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => evaluation_item_entity_1.EvaluationItem),
    (0, typeorm_1.JoinColumn)({ name: 'evaluation_item_id' }),
    __metadata("design:type", evaluation_item_entity_1.EvaluationItem)
], AssessmentScore.prototype, "evaluationItem", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], AssessmentScore.prototype, "evaluationItemId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ScoreType,
        default: ScoreType.SELF,
    }),
    __metadata("design:type", String)
], AssessmentScore.prototype, "scoreType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], AssessmentScore.prototype, "score", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'text' }),
    __metadata("design:type", String)
], AssessmentScore.prototype, "evidence", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'text' }),
    __metadata("design:type", String)
], AssessmentScore.prototype, "comment", void 0);
__decorate([
    (0, typeorm_1.Column)('simple-array', { nullable: true }),
    __metadata("design:type", Array)
], AssessmentScore.prototype, "attachments", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], AssessmentScore.prototype, "scoredBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], AssessmentScore.prototype, "scoredAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], AssessmentScore.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], AssessmentScore.prototype, "updatedAt", void 0);
exports.AssessmentScore = AssessmentScore = __decorate([
    (0, typeorm_1.Entity)('assessment_scores')
], AssessmentScore);
//# sourceMappingURL=assessment-score.entity.js.map