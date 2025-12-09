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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IndicatorsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const indicators_service_1 = require("./indicators.service");
const create_indicator_l1_dto_1 = require("./dto/create-indicator-l1.dto");
const create_indicator_l2_dto_1 = require("./dto/create-indicator-l2.dto");
const create_indicator_l3_dto_1 = require("./dto/create-indicator-l3.dto");
const create_evaluation_item_dto_1 = require("./dto/create-evaluation-item.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let IndicatorsController = class IndicatorsController {
    indicatorsService;
    constructor(indicatorsService) {
        this.indicatorsService = indicatorsService;
    }
    getTree() {
        return this.indicatorsService.getIndicatorTree();
    }
    createL1(dto) {
        return this.indicatorsService.createL1(dto);
    }
    findAllL1() {
        return this.indicatorsService.findAllL1();
    }
    findOneL1(id) {
        return this.indicatorsService.findOneL1(id);
    }
    updateL1(id, dto) {
        return this.indicatorsService.updateL1(id, dto);
    }
    removeL1(id) {
        return this.indicatorsService.removeL1(id);
    }
    createL2(dto) {
        return this.indicatorsService.createL2(dto);
    }
    findAllL2(parentId) {
        return this.indicatorsService.findAllL2(parentId);
    }
    findOneL2(id) {
        return this.indicatorsService.findOneL2(id);
    }
    updateL2(id, dto) {
        return this.indicatorsService.updateL2(id, dto);
    }
    removeL2(id) {
        return this.indicatorsService.removeL2(id);
    }
    createL3(dto) {
        return this.indicatorsService.createL3(dto);
    }
    findAllL3(parentId) {
        return this.indicatorsService.findAllL3(parentId);
    }
    findOneL3(id) {
        return this.indicatorsService.findOneL3(id);
    }
    updateL3(id, dto) {
        return this.indicatorsService.updateL3(id, dto);
    }
    removeL3(id) {
        return this.indicatorsService.removeL3(id);
    }
    createItem(dto) {
        return this.indicatorsService.createItem(dto);
    }
    findAllItems(indicatorId) {
        return this.indicatorsService.findAllItems(indicatorId);
    }
    findOneItem(id) {
        return this.indicatorsService.findOneItem(id);
    }
    updateItem(id, dto) {
        return this.indicatorsService.updateItem(id, dto);
    }
    removeItem(id) {
        return this.indicatorsService.removeItem(id);
    }
};
exports.IndicatorsController = IndicatorsController;
__decorate([
    (0, common_1.Get)('tree'),
    (0, swagger_1.ApiOperation)({ summary: '获取指标树' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], IndicatorsController.prototype, "getTree", null);
__decorate([
    (0, common_1.Post)('l1'),
    (0, swagger_1.ApiOperation)({ summary: '创建一级指标' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_indicator_l1_dto_1.CreateIndicatorL1Dto]),
    __metadata("design:returntype", void 0)
], IndicatorsController.prototype, "createL1", null);
__decorate([
    (0, common_1.Get)('l1'),
    (0, swagger_1.ApiOperation)({ summary: '获取一级指标列表' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], IndicatorsController.prototype, "findAllL1", null);
__decorate([
    (0, common_1.Get)('l1/:id'),
    (0, swagger_1.ApiOperation)({ summary: '获取一级指标详情' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], IndicatorsController.prototype, "findOneL1", null);
__decorate([
    (0, common_1.Patch)('l1/:id'),
    (0, swagger_1.ApiOperation)({ summary: '更新一级指标' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], IndicatorsController.prototype, "updateL1", null);
__decorate([
    (0, common_1.Delete)('l1/:id'),
    (0, swagger_1.ApiOperation)({ summary: '删除一级指标' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], IndicatorsController.prototype, "removeL1", null);
__decorate([
    (0, common_1.Post)('l2'),
    (0, swagger_1.ApiOperation)({ summary: '创建二级指标' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_indicator_l2_dto_1.CreateIndicatorL2Dto]),
    __metadata("design:returntype", void 0)
], IndicatorsController.prototype, "createL2", null);
__decorate([
    (0, common_1.Get)('l2'),
    (0, swagger_1.ApiOperation)({ summary: '获取二级指标列表' }),
    __param(0, (0, common_1.Query)('parentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], IndicatorsController.prototype, "findAllL2", null);
__decorate([
    (0, common_1.Get)('l2/:id'),
    (0, swagger_1.ApiOperation)({ summary: '获取二级指标详情' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], IndicatorsController.prototype, "findOneL2", null);
__decorate([
    (0, common_1.Patch)('l2/:id'),
    (0, swagger_1.ApiOperation)({ summary: '更新二级指标' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], IndicatorsController.prototype, "updateL2", null);
__decorate([
    (0, common_1.Delete)('l2/:id'),
    (0, swagger_1.ApiOperation)({ summary: '删除二级指标' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], IndicatorsController.prototype, "removeL2", null);
__decorate([
    (0, common_1.Post)('l3'),
    (0, swagger_1.ApiOperation)({ summary: '创建三级指标' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_indicator_l3_dto_1.CreateIndicatorL3Dto]),
    __metadata("design:returntype", void 0)
], IndicatorsController.prototype, "createL3", null);
__decorate([
    (0, common_1.Get)('l3'),
    (0, swagger_1.ApiOperation)({ summary: '获取三级指标列表' }),
    __param(0, (0, common_1.Query)('parentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], IndicatorsController.prototype, "findAllL3", null);
__decorate([
    (0, common_1.Get)('l3/:id'),
    (0, swagger_1.ApiOperation)({ summary: '获取三级指标详情' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], IndicatorsController.prototype, "findOneL3", null);
__decorate([
    (0, common_1.Patch)('l3/:id'),
    (0, swagger_1.ApiOperation)({ summary: '更新三级指标' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], IndicatorsController.prototype, "updateL3", null);
__decorate([
    (0, common_1.Delete)('l3/:id'),
    (0, swagger_1.ApiOperation)({ summary: '删除三级指标' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], IndicatorsController.prototype, "removeL3", null);
__decorate([
    (0, common_1.Post)('items'),
    (0, swagger_1.ApiOperation)({ summary: '创建评价要素' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_evaluation_item_dto_1.CreateEvaluationItemDto]),
    __metadata("design:returntype", void 0)
], IndicatorsController.prototype, "createItem", null);
__decorate([
    (0, common_1.Get)('items'),
    (0, swagger_1.ApiOperation)({ summary: '获取评价要素列表' }),
    __param(0, (0, common_1.Query)('indicatorId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], IndicatorsController.prototype, "findAllItems", null);
__decorate([
    (0, common_1.Get)('items/:id'),
    (0, swagger_1.ApiOperation)({ summary: '获取评价要素详情' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], IndicatorsController.prototype, "findOneItem", null);
__decorate([
    (0, common_1.Patch)('items/:id'),
    (0, swagger_1.ApiOperation)({ summary: '更新评价要素' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], IndicatorsController.prototype, "updateItem", null);
__decorate([
    (0, common_1.Delete)('items/:id'),
    (0, swagger_1.ApiOperation)({ summary: '删除评价要素' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], IndicatorsController.prototype, "removeItem", null);
exports.IndicatorsController = IndicatorsController = __decorate([
    (0, swagger_1.ApiTags)('指标管理'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('indicators'),
    __metadata("design:paramtypes", [indicators_service_1.IndicatorsService])
], IndicatorsController);
//# sourceMappingURL=indicators.controller.js.map