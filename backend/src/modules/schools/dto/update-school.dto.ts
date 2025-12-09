import { PartialType } from '@nestjs/swagger';
import { CreateSchoolDto } from './create-school.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsBoolean } from 'class-validator';

export class UpdateSchoolDto extends PartialType(CreateSchoolDto) {
  @ApiPropertyOptional({ description: '是否启用' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
