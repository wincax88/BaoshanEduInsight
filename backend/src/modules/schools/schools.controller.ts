import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SchoolsService } from './schools.service';
import { CreateSchoolDto } from './dto/create-school.dto';
import { UpdateSchoolDto } from './dto/update-school.dto';
import { QuerySchoolDto } from './dto/query-school.dto';
import { CreateEducationGroupDto } from './dto/create-education-group.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('学校管理')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('schools')
export class SchoolsController {
  constructor(private readonly schoolsService: SchoolsService) {}

  // School endpoints
  @Post()
  @ApiOperation({ summary: '创建学校' })
  createSchool(@Body() createSchoolDto: CreateSchoolDto) {
    return this.schoolsService.createSchool(createSchoolDto);
  }

  @Get()
  @ApiOperation({ summary: '获取学校列表' })
  findAllSchools(@Query() query: QuerySchoolDto) {
    return this.schoolsService.findAllSchools(query);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取学校详情' })
  findOneSchool(@Param('id') id: string) {
    return this.schoolsService.findOneSchool(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新学校' })
  updateSchool(
    @Param('id') id: string,
    @Body() updateSchoolDto: UpdateSchoolDto,
  ) {
    return this.schoolsService.updateSchool(id, updateSchoolDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除学校' })
  removeSchool(@Param('id') id: string) {
    return this.schoolsService.removeSchool(id);
  }

  // Education Group endpoints
  @Post('groups')
  @ApiOperation({ summary: '创建教育集团' })
  createGroup(@Body() dto: CreateEducationGroupDto) {
    return this.schoolsService.createGroup(dto);
  }

  @Get('groups/list')
  @ApiOperation({ summary: '获取教育集团列表' })
  findAllGroups() {
    return this.schoolsService.findAllGroups();
  }

  @Get('groups/:id')
  @ApiOperation({ summary: '获取教育集团详情' })
  findOneGroup(@Param('id') id: string) {
    return this.schoolsService.findOneGroup(id);
  }
}
