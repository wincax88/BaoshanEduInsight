import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';
import { SchoolType, SchoolCategory } from '../entities/school.entity';

export class QuerySchoolDto {
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

  @ApiPropertyOptional({ description: '学校名称' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: '学校类型', enum: SchoolType })
  @IsOptional()
  @IsEnum(SchoolType)
  type?: SchoolType;

  @ApiPropertyOptional({ description: '学校类别', enum: SchoolCategory })
  @IsOptional()
  @IsEnum(SchoolCategory)
  category?: SchoolCategory;

  @ApiPropertyOptional({ description: '所属区域' })
  @IsOptional()
  @IsString()
  district?: string;

  @ApiPropertyOptional({ description: '所属教育集团ID' })
  @IsOptional()
  @IsString()
  groupId?: string;
}
