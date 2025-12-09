"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IndicatorsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const indicators_service_1 = require("./indicators.service");
const indicators_controller_1 = require("./indicators.controller");
const indicator_l1_entity_1 = require("./entities/indicator-l1.entity");
const indicator_l2_entity_1 = require("./entities/indicator-l2.entity");
const indicator_l3_entity_1 = require("./entities/indicator-l3.entity");
const evaluation_item_entity_1 = require("./entities/evaluation-item.entity");
let IndicatorsModule = class IndicatorsModule {
};
exports.IndicatorsModule = IndicatorsModule;
exports.IndicatorsModule = IndicatorsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                indicator_l1_entity_1.IndicatorL1,
                indicator_l2_entity_1.IndicatorL2,
                indicator_l3_entity_1.IndicatorL3,
                evaluation_item_entity_1.EvaluationItem,
            ]),
        ],
        controllers: [indicators_controller_1.IndicatorsController],
        providers: [indicators_service_1.IndicatorsService],
        exports: [indicators_service_1.IndicatorsService],
    })
], IndicatorsModule);
//# sourceMappingURL=indicators.module.js.map