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
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { Response } from 'express';
import { FilesService } from './files.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('文件管理')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @ApiOperation({ summary: '上传单个文件' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        folder: {
          type: 'string',
          description: '文件夹路径',
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
    return this.filesService.uploadFile(file, folder || 'attachments');
  }

  @Post('upload-multiple')
  @ApiOperation({ summary: '上传多个文件' })
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
        },
        folder: {
          type: 'string',
          description: '文件夹路径',
        },
      },
    },
  })
  @UseInterceptors(FilesInterceptor('files', 10)) // 最多10个文件
  async uploadMultipleFiles(
    @UploadedFiles() files: Express.Multer.File[],
    @Query('folder') folder?: string,
  ) {
    return this.filesService.uploadMultipleFiles(files, folder || 'attachments');
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
  async listFiles(@Query('prefix') prefix?: string) {
    return this.filesService.listFiles(prefix || '');
  }
}
