import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
  MaxLength,
} from 'class-validator';
import { SchoolType, SchoolCategory } from '../entities/school.entity';

export class CreateSchoolDto {
  @ApiProperty({ description: '学校名称' })
  @IsNotEmpty({ message: '学校名称不能为空' })
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiProperty({ description: '学校编码' })
  @IsNotEmpty({ message: '学校编码不能为空' })
  @IsString()
  @MaxLength(50)
  code: string;

  @ApiPropertyOptional({ description: '学校类型', enum: SchoolType })
  @IsOptional()
  @IsEnum(SchoolType)
  type?: SchoolType;

  @ApiPropertyOptional({ description: '学校类别', enum: SchoolCategory })
  @IsOptional()
  @IsEnum(SchoolCategory)
  category?: SchoolCategory;

  @ApiPropertyOptional({ description: '学校地址' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  address?: string;

  @ApiPropertyOptional({ description: '所属区域' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  district?: string;

  @ApiPropertyOptional({ description: '校长姓名' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  principal?: string;

  @ApiPropertyOptional({ description: '联系电话' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;

  @ApiPropertyOptional({ description: '学生人数' })
  @IsOptional()
  @IsNumber()
  studentCount?: number;

  @ApiPropertyOptional({ description: '教师人数' })
  @IsOptional()
  @IsNumber()
  teacherCount?: number;

  @ApiPropertyOptional({ description: '建校年份' })
  @IsOptional()
  @IsNumber()
  foundedYear?: number;

  @ApiPropertyOptional({ description: '所属教育集团ID' })
  @IsOptional()
  @IsString()
  groupId?: string;
}
