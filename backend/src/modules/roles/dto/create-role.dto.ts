import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsArray,
  MaxLength,
} from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({ description: '角色名称' })
  @IsNotEmpty({ message: '角色名称不能为空' })
  @IsString()
  @MaxLength(50)
  name: string;

  @ApiProperty({ description: '角色编码' })
  @IsNotEmpty({ message: '角色编码不能为空' })
  @IsString()
  @MaxLength(50)
  code: string;

  @ApiPropertyOptional({ description: '角色描述' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;

  @ApiPropertyOptional({ description: '权限列表' })
  @IsOptional()
  @IsArray()
  permissions?: string[];
}
