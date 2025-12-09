import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumber,
  MaxLength,
} from 'class-validator';

export class CreateIndicatorL1Dto {
  @ApiProperty({ description: '指标名称', example: '学校治理' })
  @IsNotEmpty({ message: '指标名称不能为空' })
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiProperty({ description: '指标编码', example: 'L1-01' })
  @IsNotEmpty({ message: '指标编码不能为空' })
  @IsString()
  @MaxLength(20)
  code: string;

  @ApiPropertyOptional({ description: '指标描述' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiPropertyOptional({ description: '权重(分值)', example: 15 })
  @IsOptional()
  @IsNumber()
  weight?: number;

  @ApiPropertyOptional({ description: '排序', default: 0 })
  @IsOptional()
  @IsNumber()
  sortOrder?: number;
}
