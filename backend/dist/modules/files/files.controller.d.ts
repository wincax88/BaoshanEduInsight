import { Response } from 'express';
import { FilesService } from './files.service';
export declare class FilesController {
    private readonly filesService;
    constructor(filesService: FilesService);
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
    downloadFile(fileName: string, res: Response): Promise<void>;
    getFileUrl(fileName: string, expiry?: number): Promise<{
        url: string;
    }>;
    deleteFile(fileName: string): Promise<{
        message: string;
    }>;
    listFiles(prefix?: string): Promise<any[]>;
}
