import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumber,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class CreateEvaluationItemDto {
  @ApiProperty({ description: '评价要素名称', example: '章程制定与执行' })
  @IsNotEmpty({ message: '评价要素名称不能为空' })
  @IsString()
  @MaxLength(200)
  name: string;

  @ApiProperty({ description: '评价要素编码', example: 'EI-01' })
  @IsNotEmpty({ message: '评价要素编码不能为空' })
  @IsString()
  @MaxLength(20)
  code: string;

  @ApiProperty({ description: '所属三级指标ID' })
  @IsNotEmpty({ message: '所属三级指标不能为空' })
  @IsUUID()
  indicatorId: string;

  @ApiPropertyOptional({ description: '评价要素描述' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: '宝山区特色检测点' })
  @IsOptional()
  @IsString()
  baoshanFeature?: string;

  @ApiPropertyOptional({ description: '最高分值', example: 5 })
  @IsOptional()
  @IsNumber()
  maxScore?: number;

  @ApiPropertyOptional({ description: '评分标准' })
  @IsOptional()
  @IsString()
  scoringCriteria?: string;

  @ApiPropertyOptional({ description: '排序', default: 0 })
  @IsOptional()
  @IsNumber()
  sortOrder?: number;
}
