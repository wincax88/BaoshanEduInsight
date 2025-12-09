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
exports.AssessmentsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const assessment_task_entity_1 = require("./entities/assessment-task.entity");
let AssessmentsService = class AssessmentsService {
    taskRepository;
    constructor(taskRepository) {
        this.taskRepository = taskRepository;
    }
    async create(dto, userId) {
        const task = this.taskRepository.create({
            ...dto,
            createdBy: userId,
        });
        return this.taskRepository.save(task);
    }
    async findAll(query) {
        const { page = 1, pageSize = 10, schoolId, status, academicYear, } = query;
        const qb = this.taskRepository
            .createQueryBuilder('task')
            .leftJoinAndSelect('task.school', 'school');
        if (schoolId) {
            qb.andWhere('task.schoolId = :schoolId', { schoolId });
        }
        if (status) {
            qb.andWhere('task.status = :status', { status });
        }
        if (academicYear) {
            qb.andWhere('task.academicYear = :academicYear', { academicYear });
        }
        const [data, total] = await qb
            .orderBy('task.createdAt', 'DESC')
            .skip((page - 1) * pageSize)
            .take(pageSize)
            .getManyAndCount();
        return { data, total, page, pageSize };
    }
    async findOne(id) {
        const task = await this.taskRepository.findOne({
            where: { id },
            relations: ['school', 'scores', 'scores.evaluationItem'],
        });
        if (!task) {
            throw new common_1.NotFoundException('测评任务不存在');
        }
        return task;
    }
    async update(id, dto) {
        const task = await this.findOne(id);
        Object.assign(task, dto);
        return this.taskRepository.save(task);
    }
    async remove(id) {
        const task = await this.findOne(id);
        await this.taskRepository.remove(task);
    }
    async updateStatus(id, status) {
        const task = await this.findOne(id);
        task.status = status;
        return this.taskRepository.save(task);
    }
    async calculateTotalScore(id) {
        const task = await this.taskRepository.findOne({
            where: { id },
            relations: ['scores'],
        });
        if (!task) {
            throw new common_1.NotFoundException('测评任务不存在');
        }
        const totalScore = task.scores.reduce((sum, score) => {
            return sum + Number(score.score);
        }, 0);
        task.totalScore = totalScore;
        return this.taskRepository.save(task);
    }
};
exports.AssessmentsService = AssessmentsService;
exports.AssessmentsService = AssessmentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(assessment_task_entity_1.AssessmentTask)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], AssessmentsService);
//# sourceMappingURL=assessments.service.js.map