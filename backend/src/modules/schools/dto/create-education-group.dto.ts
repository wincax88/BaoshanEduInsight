import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, MaxLength } from 'class-validator';

export class CreateEducationGroupDto {
  @ApiProperty({ description: '集团名称' })
  @IsNotEmpty({ message: '集团名称不能为空' })
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiProperty({ description: '集团编码' })
  @IsNotEmpty({ message: '集团编码不能为空' })
  @IsString()
  @MaxLength(50)
  code: string;

  @ApiPropertyOptional({ description: '集团描述' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiPropertyOptional({ description: '领衔学校' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  leadSchool?: string;
}
