import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

interface ErrorResponse {
  code: number;
  message: string;
  data: null;
  timestamp: string;
  path: string;
}

/**
 * 全局 HTTP 异常过滤器
 * 统一处理所有 HTTP 异常，返回标准化的响应格式
 */
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status: number;
    let message: string;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const responseObj = exceptionResponse as Record<string, any>;
        message = responseObj.message || exception.message;
        // 处理 class-validator 的验证错误数组
        if (Array.isArray(message)) {
          message = message.join(', ');
        }
      } else {
        message = exception.message;
      }
    } else if (exception instanceof Error) {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = exception.message || '服务器内部错误';
      // 记录非 HTTP 异常的详细信息
      this.logger.error(`Unexpected error: ${exception.message}`, exception.stack);
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = '未知错误';
      this.logger.error('Unknown error occurred', exception);
    }

    const errorResponse: ErrorResponse = {
      code: status,
      message,
      data: null,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    // 记录错误日志（非 404 错误）
    if (status !== HttpStatus.NOT_FOUND) {
      this.logger.warn(
        `[${request.method}] ${request.url} - ${status} - ${message}`,
      );
    }

    response.status(status).json(errorResponse);
  }
}
