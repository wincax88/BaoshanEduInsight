"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatisticsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const statistics_controller_1 = require("./statistics.controller");
const statistics_service_1 = require("./statistics.service");
const school_entity_1 = require("../schools/entities/school.entity");
const assessment_task_entity_1 = require("../assessments/entities/assessment-task.entity");
const assessment_score_entity_1 = require("../scores/entities/assessment-score.entity");
const indicator_l1_entity_1 = require("../indicators/entities/indicator-l1.entity");
const evaluation_item_entity_1 = require("../indicators/entities/evaluation-item.entity");
let StatisticsModule = class StatisticsModule {
};
exports.StatisticsModule = StatisticsModule;
exports.StatisticsModule = StatisticsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                school_entity_1.School,
                assessment_task_entity_1.AssessmentTask,
                assessment_score_entity_1.AssessmentScore,
                indicator_l1_entity_1.IndicatorL1,
                evaluation_item_entity_1.EvaluationItem,
            ]),
        ],
        controllers: [statistics_controller_1.StatisticsController],
        providers: [statistics_service_1.StatisticsService],
        exports: [statistics_service_1.StatisticsService],
    })
], StatisticsModule);
//# sourceMappingURL=statistics.module.js.map