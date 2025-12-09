import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';
import { AssessmentStatus } from '../entities/assessment-task.entity';

export class QueryAssessmentDto {
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

  @ApiPropertyOptional({ description: '学校ID' })
  @IsOptional()
  @IsString()
  schoolId?: string;

  @ApiPropertyOptional({ description: '状态', enum: AssessmentStatus })
  @IsOptional()
  @IsEnum(AssessmentStatus)
  status?: AssessmentStatus;

  @ApiPropertyOptional({ description: '学年' })
  @IsOptional()
  @IsString()
  academicYear?: string;
}
