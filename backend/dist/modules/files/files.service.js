"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var FilesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilesService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const Minio = __importStar(require("minio"));
const uuid_1 = require("uuid");
const path = __importStar(require("path"));
let FilesService = FilesService_1 = class FilesService {
    configService;
    logger = new common_1.Logger(FilesService_1.name);
    minioClient;
    bucketName;
    constructor(configService) {
        this.configService = configService;
        this.minioClient = new Minio.Client({
            endPoint: this.configService.get('minio.endpoint', 'localhost'),
            port: this.configService.get('minio.port', 9000),
            useSSL: this.configService.get('minio.useSSL', false),
            accessKey: this.configService.get('minio.accessKey', 'minioadmin'),
            secretKey: this.configService.get('minio.secretKey', 'minioadmin'),
        });
        this.bucketName = this.configService.get('minio.bucket', 'baoshan-edu');
    }
    async onModuleInit() {
        try {
            const bucketExists = await this.minioClient.bucketExists(this.bucketName);
            if (!bucketExists) {
                await this.minioClient.makeBucket(this.bucketName);
                this.logger.log(`Bucket "${this.bucketName}" created successfully`);
                const policy = {
                    Version: '2012-10-17',
                    Statement: [
                        {
                            Effect: 'Allow',
                            Principal: { AWS: ['*'] },
                            Action: ['s3:GetObject'],
                            Resource: [`arn:aws:s3:::${this.bucketName}/*`],
                        },
                    ],
                };
                await this.minioClient.setBucketPolicy(this.bucketName, JSON.stringify(policy));
            }
            this.logger.log(`MinIO connected, using bucket: ${this.bucketName}`);
        }
        catch (error) {
            this.logger.warn(`MinIO initialization failed: ${error.message}. File upload may not work.`);
        }
    }
    async uploadFile(file, folder = 'attachments') {
        const fileId = (0, uuid_1.v4)();
        const ext = path.extname(file.originalname);
        const fileName = `${folder}/${fileId}${ext}`;
        const metaData = {
            'Content-Type': file.mimetype,
            'X-Original-Name': encodeURIComponent(file.originalname),
        };
        await this.minioClient.putObject(this.bucketName, fileName, file.buffer, file.size, metaData);
        const endpoint = this.configService.get('minio.endpoint', 'localhost');
        const port = this.configService.get('minio.port', 9000);
        const useSSL = this.configService.get('minio.useSSL', false);
        const protocol = useSSL ? 'https' : 'http';
        const url = `${protocol}://${endpoint}:${port}/${this.bucketName}/${fileName}`;
        return {
            fileId,
            fileName,
            originalName: file.originalname,
            mimeType: file.mimetype,
            size: file.size,
            url,
        };
    }
    async uploadMultipleFiles(files, folder = 'attachments') {
        const results = await Promise.all(files.map((file) => this.uploadFile(file, folder)));
        return results;
    }
    async deleteFile(fileName) {
        try {
            await this.minioClient.removeObject(this.bucketName, fileName);
        }
        catch (error) {
            this.logger.error(`Failed to delete file: ${fileName}`, error);
            throw error;
        }
    }
    async getFileUrl(fileName, expiry = 3600) {
        try {
            return await this.minioClient.presignedGetObject(this.bucketName, fileName, expiry);
        }
        catch (error) {
            this.logger.error(`Failed to get file URL: ${fileName}`, error);
            throw error;
        }
    }
    async getFileStream(fileName) {
        try {
            return await this.minioClient.getObject(this.bucketName, fileName);
        }
        catch (error) {
            this.logger.error(`Failed to get file stream: ${fileName}`, error);
            throw error;
        }
    }
    async listFiles(prefix = '') {
        return new Promise((resolve, reject) => {
            const files = [];
            const stream = this.minioClient.listObjects(this.bucketName, prefix, true);
            stream.on('data', (obj) => {
                files.push(obj);
            });
            stream.on('end', () => {
                resolve(files);
            });
            stream.on('error', (err) => {
                reject(err);
            });
        });
    }
};
exports.FilesService = FilesService;
exports.FilesService = FilesService = FilesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], FilesService);
//# sourceMappingURL=files.service.js.map