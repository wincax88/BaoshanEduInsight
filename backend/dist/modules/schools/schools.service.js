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
exports.SchoolsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const school_entity_1 = require("./entities/school.entity");
const education_group_entity_1 = require("./entities/education-group.entity");
let SchoolsService = class SchoolsService {
    schoolsRepository;
    groupsRepository;
    constructor(schoolsRepository, groupsRepository) {
        this.schoolsRepository = schoolsRepository;
        this.groupsRepository = groupsRepository;
    }
    async createSchool(createSchoolDto) {
        const existing = await this.schoolsRepository.findOne({
            where: { code: createSchoolDto.code },
        });
        if (existing) {
            throw new common_1.ConflictException('学校编码已存在');
        }
        const school = this.schoolsRepository.create(createSchoolDto);
        return this.schoolsRepository.save(school);
    }
    async findAllSchools(query) {
        const { page = 1, pageSize = 10, name, type, category, district, groupId, } = query;
        const qb = this.schoolsRepository
            .createQueryBuilder('school')
            .leftJoinAndSelect('school.educationGroup', 'group');
        if (name) {
            qb.andWhere('school.name LIKE :name', { name: `%${name}%` });
        }
        if (type) {
            qb.andWhere('school.type = :type', { type });
        }
        if (category) {
            qb.andWhere('school.category = :category', { category });
        }
        if (district) {
            qb.andWhere('school.district = :district', { district });
        }
        if (groupId) {
            qb.andWhere('school.groupId = :groupId', { groupId });
        }
        const [data, total] = await qb
            .orderBy('school.createdAt', 'DESC')
            .skip((page - 1) * pageSize)
            .take(pageSize)
            .getManyAndCount();
        return { data, total, page, pageSize };
    }
    async findOneSchool(id) {
        const school = await this.schoolsRepository.findOne({
            where: { id },
            relations: ['educationGroup'],
        });
        if (!school) {
            throw new common_1.NotFoundException('学校不存在');
        }
        return school;
    }
    async updateSchool(id, updateSchoolDto) {
        const school = await this.findOneSchool(id);
        Object.assign(school, updateSchoolDto);
        return this.schoolsRepository.save(school);
    }
    async removeSchool(id) {
        const school = await this.findOneSchool(id);
        await this.schoolsRepository.remove(school);
    }
    async createGroup(dto) {
        const existing = await this.groupsRepository.findOne({
            where: { code: dto.code },
        });
        if (existing) {
            throw new common_1.ConflictException('集团编码已存在');
        }
        const group = this.groupsRepository.create(dto);
        return this.groupsRepository.save(group);
    }
    async findAllGroups() {
        return this.groupsRepository.find({
            relations: ['schools'],
            order: { createdAt: 'ASC' },
        });
    }
    async findOneGroup(id) {
        const group = await this.groupsRepository.findOne({
            where: { id },
            relations: ['schools'],
        });
        if (!group) {
            throw new common_1.NotFoundException('教育集团不存在');
        }
        return group;
    }
};
exports.SchoolsService = SchoolsService;
exports.SchoolsService = SchoolsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(school_entity_1.School)),
    __param(1, (0, typeorm_1.InjectRepository)(education_group_entity_1.EducationGroup)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], SchoolsService);
//# sourceMappingURL=schools.service.js.map