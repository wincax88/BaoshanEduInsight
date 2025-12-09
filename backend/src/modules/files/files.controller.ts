import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  Query,
  Res,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import type { Response } from 'express';
import { FilesService, MinioFileInfo } from './files.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

// 允许的文件扩展名和 MIME 类型
const ALLOWED_EXTENSIONS = [
  '.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', // 图片
  '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', // 文档
  '.txt', '.csv', // 文本
  '.zip', '.rar', '.7z', // 压缩包
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

// 安全的文件夹名称正则（只允许字母、数字、下划线、连字符）
const SAFE_FOLDER_PATTERN = /^[a-zA-Z0-9_-]+$/;

/**
 * 验证文件名和扩展名安全性
 */
function validateFileName(file: Express.Multer.File): void {
  const originalName = file.originalname.toLowerCase();
  const ext = '.' + originalName.split('.').pop();

  // 检查扩展名
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    throw new BadRequestException(`不支持的文件类型: ${ext}`);
  }

  // 检查 MIME 类型
  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    throw new BadRequestException(`不支持的文件格式: ${file.mimetype}`);
  }

  // 检查文件名是否包含危险字符（防止路径遍历）
  if (originalName.includes('..') || originalName.includes('/') || originalName.includes('\\')) {
    throw new BadRequestException('文件名包含非法字符');
  }
}

/**
 * 验证并清理文件夹名称
 */
function sanitizeFolder(folder: string | undefined): string {
  if (!folder) return 'attachments';

  // 检查文件夹名称是否安全
  if (!SAFE_FOLDER_PATTERN.test(folder)) {
    throw new BadRequestException('文件夹名称只能包含字母、数字、下划线和连字符');
  }

  // 防止路径遍历
  if (folder.includes('..') || folder.includes('/') || folder.includes('\\')) {
    throw new BadRequestException('文件夹名称不能包含路径分隔符');
  }

  return folder;
}

@ApiTags('文件管理')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @ApiOperation({ summary: '上传单个文件（支持图片、PDF、Office文档等）' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
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
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }), // 10MB
        ],
      }),
    )
    file: Express.Multer.File,
    @Query('folder') folder?: string,
  ) {
    // 安全验证
    validateFileName(file);
    const safeFolder = sanitizeFolder(folder);
    return this.filesService.uploadFile(file, safeFolder);
  }

  @Post('upload-multiple')
  @ApiOperation({ summary: '上传多个文件（最多10个）' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
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
  })
  @UseInterceptors(FilesInterceptor('files', 10)) // 最多10个文件
  async uploadMultipleFiles(
    @UploadedFiles() files: Express.Multer.File[],
    @Query('folder') folder?: string,
  ) {
    // 安全验证：检查每个文件
    for (const file of files) {
      validateFileName(file);
      // 检查单个文件大小
      if (file.size > 10 * 1024 * 1024) {
        throw new BadRequestException(`文件 ${file.originalname} 超过10MB限制`);
      }
    }
    const safeFolder = sanitizeFolder(folder);
    return this.filesService.uploadMultipleFiles(files, safeFolder);
  }

  @Get('download/:fileName')
  @ApiOperation({ summary: '下载文件' })
  async downloadFile(
    @Param('fileName') fileName: string,
    @Res() res: Response,
  ) {
    try {
      const decodedFileName = decodeURIComponent(fileName);
      const stream = await this.filesService.getFileStream(decodedFileName);
      res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(decodedFileName)}"`);
      stream.pipe(res);
    } catch (error) {
      res.status(404).json({ message: '文件不存在' });
    }
  }

  @Get('url/:fileName')
  @ApiOperation({ summary: '获取文件预签名URL' })
  async getFileUrl(
    @Param('fileName') fileName: string,
    @Query('expiry') expiry?: number,
  ) {
    const decodedFileName = decodeURIComponent(fileName);
    const url = await this.filesService.getFileUrl(decodedFileName, expiry || 3600);
    return { url };
  }

  @Delete(':fileName')
  @ApiOperation({ summary: '删除文件' })
  async deleteFile(@Param('fileName') fileName: string) {
    const decodedFileName = decodeURIComponent(fileName);
    await this.filesService.deleteFile(decodedFileName);
    return { message: '删除成功' };
  }

  @Get('list')
  @ApiOperation({ summary: '列出文件' })
  async listFiles(@Query('prefix') prefix?: string): Promise<MinioFileInfo[]> {
    return this.filesService.listFiles(prefix || '');
  }
}
