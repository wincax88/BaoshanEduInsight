import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsBoolean, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';

export class QueryUserDto {
  @ApiPropertyOptional({ description: '页码', default: 1 })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  page?: number = 1;

  @ApiPropertyOptional({ description: '每页数量', default: 10 })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  pageSize?: number = 10;

  @ApiPropertyOptional({ description: '用户名' })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiPropertyOptional({ description: '真实姓名' })
  @IsOptional()
  @IsString()
  realName?: string;

  @ApiPropertyOptional({ description: '是否启用' })
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  isActive?: boolean;
}
