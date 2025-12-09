import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
export declare class FilesService implements OnModuleInit {
    private configService;
    private readonly logger;
    private minioClient;
    private bucketName;
    constructor(configService: ConfigService);
    onModuleInit(): Promise<void>;
    uploadFile(file: Express.Multer.File, folder?: string): Promise<{
        fileId: string;
        fileName: string;
        originalName: string;
        mimeType: string;
        size: number;
        url: string;
    }>;
    uploadMultipleFiles(files: Express.Multer.File[], folder?: string): Promise<{
        fileId: string;
        fileName: string;
        originalName: string;
        mimeType: string;
        size: number;
        url: string;
    }[]>;
    deleteFile(fileName: string): Promise<void>;
    getFileUrl(fileName: string, expiry?: number): Promise<string>;
    getFileStream(fileName: string): Promise<import("stream").Readable>;
    listFiles(prefix?: string): Promise<any[]>;
}
