import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumber,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class CreateIndicatorL3Dto {
  @ApiProperty({ description: '指标名称', example: '学校章程与制度' })
  @IsNotEmpty({ message: '指标名称不能为空' })
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiProperty({ description: '指标编码', example: 'L3-01' })
  @IsNotEmpty({ message: '指标编码不能为空' })
  @IsString()
  @MaxLength(20)
  code: string;

  @ApiProperty({ description: '所属二级指标ID' })
  @IsNotEmpty({ message: '所属二级指标不能为空' })
  @IsUUID()
  parentId: string;

  @ApiPropertyOptional({ description: '指标描述' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiPropertyOptional({ description: '权重(分值)' })
  @IsOptional()
  @IsNumber()
  weight?: number;

  @ApiPropertyOptional({ description: '排序', default: 0 })
  @IsOptional()
  @IsNumber()
  sortOrder?: number;
}
