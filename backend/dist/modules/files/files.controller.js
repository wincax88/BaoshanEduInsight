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
exports.FilesController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const files_service_1 = require("./files.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const ALLOWED_EXTENSIONS = [
    '.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp',
    '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx',
    '.txt', '.csv',
    '.zip', '.rar', '.7z',
];
const ALLOWED_MIME_TYPES = [
    'image/jpeg', 'image/png', 'image/gif', 'image/bmp', 'image/webp',
    'application/pdf',
    'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain', 'text/csv',
    'application/zip', 'application/x-rar-compressed', 'application/x-7z-compressed',
];
const SAFE_FOLDER_PATTERN = /^[a-zA-Z0-9_-]+$/;
function validateFileName(file) {
    const originalName = file.originalname.toLowerCase();
    const ext = '.' + originalName.split('.').pop();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
        throw new common_1.BadRequestException(`不支持的文件类型: ${ext}`);
    }
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
        throw new common_1.BadRequestException(`不支持的文件格式: ${file.mimetype}`);
    }
    if (originalName.includes('..') || originalName.includes('/') || originalName.includes('\\')) {
        throw new common_1.BadRequestException('文件名包含非法字符');
    }
}
function sanitizeFolder(folder) {
    if (!folder)
        return 'attachments';
    if (!SAFE_FOLDER_PATTERN.test(folder)) {
        throw new common_1.BadRequestException('文件夹名称只能包含字母、数字、下划线和连字符');
    }
    if (folder.includes('..') || folder.includes('/') || folder.includes('\\')) {
        throw new common_1.BadRequestException('文件夹名称不能包含路径分隔符');
    }
    return folder;
}
let FilesController = class FilesController {
    filesService;
    constructor(filesService) {
        this.filesService = filesService;
    }
    async uploadFile(file, folder) {
        validateFileName(file);
        const safeFolder = sanitizeFolder(folder);
        return this.filesService.uploadFile(file, safeFolder);
    }
    async uploadMultipleFiles(files, folder) {
        for (const file of files) {
            validateFileName(file);
            if (file.size > 10 * 1024 * 1024) {
                throw new common_1.BadRequestException(`文件 ${file.originalname} 超过10MB限制`);
            }
        }
        const safeFolder = sanitizeFolder(folder);
        return this.filesService.uploadMultipleFiles(files, safeFolder);
    }
    async downloadFile(fileName, res) {
        try {
            const decodedFileName = decodeURIComponent(fileName);
            const stream = await this.filesService.getFileStream(decodedFileName);
            res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(decodedFileName)}"`);
            stream.pipe(res);
        }
        catch (error) {
            res.status(404).json({ message: '文件不存在' });
        }
    }
    async getFileUrl(fileName, expiry) {
        const decodedFileName = decodeURIComponent(fileName);
        const url = await this.filesService.getFileUrl(decodedFileName, expiry || 3600);
        return { url };
    }
    async deleteFile(fileName) {
        const decodedFileName = decodeURIComponent(fileName);
        await this.filesService.deleteFile(decodedFileName);
        return { message: '删除成功' };
    }
    async listFiles(prefix) {
        return this.filesService.listFiles(prefix || '');
    }
};
exports.FilesController = FilesController;
__decorate([
    (0, common_1.Post)('upload'),
    (0, swagger_1.ApiOperation)({ summary: '上传单个文件（支持图片、PDF、Office文档等）' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                    description: '支持: jpg, png, gif, pdf, doc, docx, xls, xlsx, ppt, pptx, txt, csv, zip, rar, 7z',
                },
                folder: {
                    type: 'string',
                    description: '文件夹路径（只能包含字母、数字、下划线、连字符）',
                },
            },
        },
    }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)(new common_1.ParseFilePipe({
        validators: [
            new common_1.MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }),
        ],
    }))),
    __param(1, (0, common_1.Query)('folder')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], FilesController.prototype, "uploadFile", null);
__decorate([
    (0, common_1.Post)('upload-multiple'),
    (0, swagger_1.ApiOperation)({ summary: '上传多个文件（最多10个）' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                files: {
                    type: 'array',
                    items: {
                        type: 'string',
                        format: 'binary',
                    },
                    description: '支持: jpg, png, gif, pdf, doc, docx, xls, xlsx, ppt, pptx, txt, csv, zip, rar, 7z',
                },
                folder: {
                    type: 'string',
                    description: '文件夹路径（只能包含字母、数字、下划线、连字符）',
                },
            },
        },
    }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('files', 10)),
    __param(0, (0, common_1.UploadedFiles)()),
    __param(1, (0, common_1.Query)('folder')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, String]),
    __metadata("design:returntype", Promise)
], FilesController.prototype, "uploadMultipleFiles", null);
__decorate([
    (0, common_1.Get)('download/:fileName'),
    (0, swagger_1.ApiOperation)({ summary: '下载文件' }),
    __param(0, (0, common_1.Param)('fileName')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], FilesController.prototype, "downloadFile", null);
__decorate([
    (0, common_1.Get)('url/:fileName'),
    (0, swagger_1.ApiOperation)({ summary: '获取文件预签名URL' }),
    __param(0, (0, common_1.Param)('fileName')),
    __param(1, (0, common_1.Query)('expiry')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], FilesController.prototype, "getFileUrl", null);
__decorate([
    (0, common_1.Delete)(':fileName'),
    (0, swagger_1.ApiOperation)({ summary: '删除文件' }),
    __param(0, (0, common_1.Param)('fileName')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FilesController.prototype, "deleteFile", null);
__decorate([
    (0, common_1.Get)('list'),
    (0, swagger_1.ApiOperation)({ summary: '列出文件' }),
    __param(0, (0, common_1.Query)('prefix')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FilesController.prototype, "listFiles", null);
exports.FilesController = FilesController = __decorate([
    (0, swagger_1.ApiTags)('文件管理'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('files'),
    __metadata("design:paramtypes", [files_service_1.FilesService])
], FilesController);
//# sourceMappingURL=files.controller.js.map