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
exports.IndicatorsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const indicator_l1_entity_1 = require("./entities/indicator-l1.entity");
const indicator_l2_entity_1 = require("./entities/indicator-l2.entity");
const indicator_l3_entity_1 = require("./entities/indicator-l3.entity");
const evaluation_item_entity_1 = require("./entities/evaluation-item.entity");
let IndicatorsService = class IndicatorsService {
    l1Repository;
    l2Repository;
    l3Repository;
    itemRepository;
    constructor(l1Repository, l2Repository, l3Repository, itemRepository) {
        this.l1Repository = l1Repository;
        this.l2Repository = l2Repository;
        this.l3Repository = l3Repository;
        this.itemRepository = itemRepository;
    }
    async getIndicatorTree() {
        const l1List = await this.l1Repository.find({
            relations: [
                'children',
                'children.children',
                'children.children.evaluationItems',
            ],
            order: { sortOrder: 'ASC' },
        });
        return l1List;
    }
    async createL1(dto) {
        const existing = await this.l1Repository.findOne({
            where: { code: dto.code },
        });
        if (existing) {
            throw new common_1.ConflictException('指标编码已存在');
        }
        const entity = this.l1Repository.create(dto);
        return this.l1Repository.save(entity);
    }
    async findAllL1() {
        return this.l1Repository.find({
            relations: ['children'],
            order: { sortOrder: 'ASC' },
        });
    }
    async findOneL1(id) {
        const entity = await this.l1Repository.findOne({
            where: { id },
            relations: ['children', 'children.children'],
        });
        if (!entity) {
            throw new common_1.NotFoundException('一级指标不存在');
        }
        return entity;
    }
    async updateL1(id, dto) {
        const entity = await this.findOneL1(id);
        Object.assign(entity, dto);
        return this.l1Repository.save(entity);
    }
    async removeL1(id) {
        const entity = await this.findOneL1(id);
        await this.l1Repository.remove(entity);
    }
    async createL2(dto) {
        const existing = await this.l2Repository.findOne({
            where: { code: dto.code },
        });
        if (existing) {
            throw new common_1.ConflictException('指标编码已存在');
        }
        const entity = this.l2Repository.create(dto);
        return this.l2Repository.save(entity);
    }
    async findAllL2(parentId) {
        const where = parentId ? { parentId } : {};
        return this.l2Repository.find({
            where,
            relations: ['parent', 'children'],
            order: { sortOrder: 'ASC' },
        });
    }
    async findOneL2(id) {
        const entity = await this.l2Repository.findOne({
            where: { id },
            relations: ['parent', 'children'],
        });
        if (!entity) {
            throw new common_1.NotFoundException('二级指标不存在');
        }
        return entity;
    }
    async updateL2(id, dto) {
        const entity = await this.findOneL2(id);
        Object.assign(entity, dto);
        return this.l2Repository.save(entity);
    }
    async removeL2(id) {
        const entity = await this.findOneL2(id);
        await this.l2Repository.remove(entity);
    }
    async createL3(dto) {
        const existing = await this.l3Repository.findOne({
            where: { code: dto.code },
        });
        if (existing) {
            throw new common_1.ConflictException('指标编码已存在');
        }
        const entity = this.l3Repository.create(dto);
        return this.l3Repository.save(entity);
    }
    async findAllL3(parentId) {
        const where = parentId ? { parentId } : {};
        return this.l3Repository.find({
            where,
            relations: ['parent', 'evaluationItems'],
            order: { sortOrder: 'ASC' },
        });
    }
    async findOneL3(id) {
        const entity = await this.l3Repository.findOne({
            where: { id },
            relations: ['parent', 'evaluationItems'],
        });
        if (!entity) {
            throw new common_1.NotFoundException('三级指标不存在');
        }
        return entity;
    }
    async updateL3(id, dto) {
        const entity = await this.findOneL3(id);
        Object.assign(entity, dto);
        return this.l3Repository.save(entity);
    }
    async removeL3(id) {
        const entity = await this.findOneL3(id);
        await this.l3Repository.remove(entity);
    }
    async createItem(dto) {
        const existing = await this.itemRepository.findOne({
            where: { code: dto.code },
        });
        if (existing) {
            throw new common_1.ConflictException('评价要素编码已存在');
        }
        const entity = this.itemRepository.create(dto);
        return this.itemRepository.save(entity);
    }
    async findAllItems(indicatorId) {
        const where = indicatorId ? { indicatorId } : {};
        return this.itemRepository.find({
            where,
            relations: ['indicator'],
            order: { sortOrder: 'ASC' },
        });
    }
    async findOneItem(id) {
        const entity = await this.itemRepository.findOne({
            where: { id },
            relations: ['indicator'],
        });
        if (!entity) {
            throw new common_1.NotFoundException('评价要素不存在');
        }
        return entity;
    }
    async updateItem(id, dto) {
        const entity = await this.findOneItem(id);
        Object.assign(entity, dto);
        return this.itemRepository.save(entity);
    }
    async removeItem(id) {
        const entity = await this.findOneItem(id);
        await this.itemRepository.remove(entity);
    }
};
exports.IndicatorsService = IndicatorsService;
exports.IndicatorsService = IndicatorsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(indicator_l1_entity_1.IndicatorL1)),
    __param(1, (0, typeorm_1.InjectRepository)(indicator_l2_entity_1.IndicatorL2)),
    __param(2, (0, typeorm_1.InjectRepository)(indicator_l3_entity_1.IndicatorL3)),
    __param(3, (0, typeorm_1.InjectRepository)(evaluation_item_entity_1.EvaluationItem)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], IndicatorsService);
//# sourceMappingURL=indicators.service.js.map