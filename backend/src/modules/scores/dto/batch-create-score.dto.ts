import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsUUID,
  IsEnum,
  IsArray,
  ValidateNested,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ScoreType } from '../entities/assessment-score.entity';

class ScoreItem {
  @ApiProperty({ description: '评价要素ID' })
  @IsNotEmpty()
  @IsUUID()
  evaluationItemId: string;

  @ApiProperty({ description: '分数' })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(100)
  score: number;

  @ApiProperty({ description: '佐证材料说明' })
  @IsOptional()
  @IsString()
  evidence?: string;

  @ApiProperty({ description: '评语' })
  @IsOptional()
  @IsString()
  comment?: string;
}

export class BatchCreateScoreDto {
  @ApiProperty({ description: '测评任务ID' })
  @IsNotEmpty({ message: '测评任务ID不能为空' })
  @IsUUID()
  taskId: string;

  @ApiProperty({ description: '评分类型', enum: ScoreType })
  @IsNotEmpty({ message: '评分类型不能为空' })
  @IsEnum(ScoreType)
  scoreType: ScoreType;

  @ApiProperty({ description: '评分列表', type: [ScoreItem] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ScoreItem)
  scores: ScoreItem[];
}
