import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsNumber,
  IsArray,
  Min,
  Max,
} from 'class-validator';

export class UpdateScoreDto {
  @ApiPropertyOptional({ description: '分数' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  score?: number;

  @ApiPropertyOptional({ description: '佐证材料说明' })
  @IsOptional()
  @IsString()
  evidence?: string;

  @ApiPropertyOptional({ description: '评语' })
  @IsOptional()
  @IsString()
  comment?: string;

  @ApiPropertyOptional({ description: '附件列表' })
  @IsOptional()
  @IsArray()
  attachments?: string[];
}
