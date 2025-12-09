import { PartialType } from '@nestjs/swagger';
import { CreateAssessmentDto } from './create-assessment.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateAssessmentDto extends PartialType(CreateAssessmentDto) {
  @ApiPropertyOptional({ description: '督导意见' })
  @IsOptional()
  @IsString()
  supervisionOpinion?: string;
}
