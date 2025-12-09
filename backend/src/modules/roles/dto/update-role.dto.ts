import { PartialType } from '@nestjs/swagger';
import { CreateRoleDto } from './create-role.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsBoolean } from 'class-validator';

export class UpdateRoleDto extends PartialType(CreateRoleDto) {
  @ApiPropertyOptional({ description: '是否启用' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
