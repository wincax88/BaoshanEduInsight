import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsUUID,
  IsNumber,
  IsEnum,
  IsArray,
  Min,
  Max,
} from 'class-validator';
import { ScoreType } from '../entities/assessment-score.entity';

export class CreateScoreDto {
  @ApiProperty({ description: '测评任务ID' })
  @IsNotEmpty({ message: '测评任务ID不能为空' })
  @IsUUID()
  taskId: string;

  @ApiProperty({ description: '评价要素ID' })
  @IsNotEmpty({ message: '评价要素ID不能为空' })
  @IsUUID()
  evaluationItemId: string;

  @ApiProperty({ description: '评分类型', enum: ScoreType })
  @IsNotEmpty({ message: '评分类型不能为空' })
  @IsEnum(ScoreType)
  scoreType: ScoreType;

  @ApiProperty({ description: '分数', example: 4.5 })
  @IsNotEmpty({ message: '分数不能为空' })
  @IsNumber()
  @Min(0)
  @Max(100)
  score: number;

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
