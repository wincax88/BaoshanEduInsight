import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsUUID,
  IsDateString,
  MaxLength,
} from 'class-validator';

export class CreateAssessmentDto {
  @ApiProperty({ description: '任务名称', example: '2024-2025学年度综合督导' })
  @IsNotEmpty({ message: '任务名称不能为空' })
  @IsString()
  @MaxLength(200)
  name: string;

  @ApiProperty({ description: '学年', example: '2024-2025' })
  @IsNotEmpty({ message: '学年不能为空' })
  @IsString()
  @MaxLength(50)
  academicYear: string;

  @ApiProperty({ description: '学校ID' })
  @IsNotEmpty({ message: '学校不能为空' })
  @IsUUID()
  schoolId: string;

  @ApiPropertyOptional({ description: '任务描述' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: '自评开始日期' })
  @IsOptional()
  @IsDateString()
  selfEvaluationStartDate?: string;

  @ApiPropertyOptional({ description: '自评结束日期' })
  @IsOptional()
  @IsDateString()
  selfEvaluationEndDate?: string;

  @ApiPropertyOptional({ description: '督导开始日期' })
  @IsOptional()
  @IsDateString()
  supervisionStartDate?: string;

  @ApiPropertyOptional({ description: '督导结束日期' })
  @IsOptional()
  @IsDateString()
  supervisionEndDate?: string;
}
