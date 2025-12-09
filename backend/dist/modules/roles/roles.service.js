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
exports.RolesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const role_entity_1 = require("./entities/role.entity");
let RolesService = class RolesService {
    rolesRepository;
    constructor(rolesRepository) {
        this.rolesRepository = rolesRepository;
    }
    async create(createRoleDto) {
        const existing = await this.rolesRepository.findOne({
            where: [{ name: createRoleDto.name }, { code: createRoleDto.code }],
        });
        if (existing) {
            throw new common_1.ConflictException('角色名称或编码已存在');
        }
        const role = this.rolesRepository.create(createRoleDto);
        return this.rolesRepository.save(role);
    }
    async findAll() {
        return this.rolesRepository.find({
            order: { createdAt: 'ASC' },
        });
    }
    async findOne(id) {
        const role = await this.rolesRepository.findOne({ where: { id } });
        if (!role) {
            throw new common_1.NotFoundException('角色不存在');
        }
        return role;
    }
    async update(id, updateRoleDto) {
        const role = await this.findOne(id);
        Object.assign(role, updateRoleDto);
        return this.rolesRepository.save(role);
    }
    async remove(id) {
        const role = await this.findOne(id);
        if (role.isSystem) {
            throw new common_1.ConflictException('系统角色不能删除');
        }
        await this.rolesRepository.remove(role);
    }
};
exports.RolesService = RolesService;
exports.RolesService = RolesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(role_entity_1.Role)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], RolesService);
//# sourceMappingURL=roles.service.js.map