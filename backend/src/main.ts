import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { GlobalExceptionFilter, TransformInterceptor } from './common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 全局前缀
  app.setGlobalPrefix('api');

  // 启用 CORS
  app.enableCors({
    origin: ['http://localhost:8000', 'http://127.0.0.1:8000'],
    credentials: true,
  });

  // 全局异常过滤器
  app.useGlobalFilters(new GlobalExceptionFilter());

  // 全局响应转换拦截器
  app.useGlobalInterceptors(new TransformInterceptor());

  // 全局验证管道
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Swagger 配置
  const config = new DocumentBuilder()
    .setTitle('宝山区小学成熟度测评管理系统')
    .setDescription('上海市宝山区小学成熟度测评指标体系管理系统 API 文档')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Swagger docs: http://localhost:${port}/api/docs`);
}
bootstrap();
