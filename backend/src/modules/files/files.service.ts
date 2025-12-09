import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';

@Injectable()
export class FilesService implements OnModuleInit {
  private readonly logger = new Logger(FilesService.name);
  private minioClient: Minio.Client;
  private bucketName: string;

  constructor(private configService: ConfigService) {
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

        // 设置 bucket 策略允许公开读取
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
    } catch (error) {
      this.logger.warn(`MinIO initialization failed: ${error.message}. File upload may not work.`);
    }
  }

  async uploadFile(
    file: Express.Multer.File,
    folder: string = 'attachments',
  ): Promise<{
    fileId: string;
    fileName: string;
    originalName: string;
    mimeType: string;
    size: number;
    url: string;
  }> {
    const fileId = uuidv4();
    const ext = path.extname(file.originalname);
    const fileName = `${folder}/${fileId}${ext}`;

    const metaData = {
      'Content-Type': file.mimetype,
      'X-Original-Name': encodeURIComponent(file.originalname),
    };

    await this.minioClient.putObject(
      this.bucketName,
      fileName,
      file.buffer,
      file.size,
      metaData,
    );

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

  async uploadMultipleFiles(
    files: Express.Multer.File[],
    folder: string = 'attachments',
  ) {
    const results = await Promise.all(
      files.map((file) => this.uploadFile(file, folder)),
    );
    return results;
  }

  async deleteFile(fileName: string): Promise<void> {
    try {
      await this.minioClient.removeObject(this.bucketName, fileName);
    } catch (error) {
      this.logger.error(`Failed to delete file: ${fileName}`, error);
      throw error;
    }
  }

  async getFileUrl(fileName: string, expiry: number = 3600): Promise<string> {
    try {
      return await this.minioClient.presignedGetObject(
        this.bucketName,
        fileName,
        expiry,
      );
    } catch (error) {
      this.logger.error(`Failed to get file URL: ${fileName}`, error);
      throw error;
    }
  }

  async getFileStream(fileName: string) {
    try {
      return await this.minioClient.getObject(this.bucketName, fileName);
    } catch (error) {
      this.logger.error(`Failed to get file stream: ${fileName}`, error);
      throw error;
    }
  }

  async listFiles(prefix: string = ''): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const files: any[] = [];
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
}
