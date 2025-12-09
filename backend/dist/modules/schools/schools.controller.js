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
exports.SchoolsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const schools_service_1 = require("./schools.service");
const create_school_dto_1 = require("./dto/create-school.dto");
const update_school_dto_1 = require("./dto/update-school.dto");
const query_school_dto_1 = require("./dto/query-school.dto");
const create_education_group_dto_1 = require("./dto/create-education-group.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let SchoolsController = class SchoolsController {
    schoolsService;
    constructor(schoolsService) {
        this.schoolsService = schoolsService;
    }
    createSchool(createSchoolDto) {
        return this.schoolsService.createSchool(createSchoolDto);
    }
    findAllSchools(query) {
        return this.schoolsService.findAllSchools(query);
    }
    findOneSchool(id) {
        return this.schoolsService.findOneSchool(id);
    }
    updateSchool(id, updateSchoolDto) {
        return this.schoolsService.updateSchool(id, updateSchoolDto);
    }
    removeSchool(id) {
        return this.schoolsService.removeSchool(id);
    }
    createGroup(dto) {
        return this.schoolsService.createGroup(dto);
    }
    findAllGroups() {
        return this.schoolsService.findAllGroups();
    }
    findOneGroup(id) {
        return this.schoolsService.findOneGroup(id);
    }
};
exports.SchoolsController = SchoolsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: '创建学校' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_school_dto_1.CreateSchoolDto]),
    __metadata("design:returntype", void 0)
], SchoolsController.prototype, "createSchool", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: '获取学校列表' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_school_dto_1.QuerySchoolDto]),
    __metadata("design:returntype", void 0)
], SchoolsController.prototype, "findAllSchools", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: '获取学校详情' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SchoolsController.prototype, "findOneSchool", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: '更新学校' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_school_dto_1.UpdateSchoolDto]),
    __metadata("design:returntype", void 0)
], SchoolsController.prototype, "updateSchool", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: '删除学校' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SchoolsController.prototype, "removeSchool", null);
__decorate([
    (0, common_1.Post)('groups'),
    (0, swagger_1.ApiOperation)({ summary: '创建教育集团' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_education_group_dto_1.CreateEducationGroupDto]),
    __metadata("design:returntype", void 0)
], SchoolsController.prototype, "createGroup", null);
__decorate([
    (0, common_1.Get)('groups/list'),
    (0, swagger_1.ApiOperation)({ summary: '获取教育集团列表' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SchoolsController.prototype, "findAllGroups", null);
__decorate([
    (0, common_1.Get)('groups/:id'),
    (0, swagger_1.ApiOperation)({ summary: '获取教育集团详情' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SchoolsController.prototype, "findOneGroup", null);
exports.SchoolsController = SchoolsController = __decorate([
    (0, swagger_1.ApiTags)('学校管理'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('schools'),
    __metadata("design:paramtypes", [schools_service_1.SchoolsService])
], SchoolsController);
//# sourceMappingURL=schools.controller.js.map