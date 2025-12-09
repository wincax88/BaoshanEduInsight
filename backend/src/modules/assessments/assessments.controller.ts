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
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AssessmentsService } from './assessments.service';
import { CreateAssessmentDto } from './dto/create-assessment.dto';
import { UpdateAssessmentDto } from './dto/update-assessment.dto';
import { QueryAssessmentDto } from './dto/query-assessment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AssessmentStatus } from './entities/assessment-task.entity';

@ApiTags('测评任务')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('assessments')
export class AssessmentsController {
  constructor(private readonly assessmentsService: AssessmentsService) {}

  @Post()
  @ApiOperation({ summary: '创建测评任务' })
  create(@Body() dto: CreateAssessmentDto, @Request() req) {
    return this.assessmentsService.create(dto, req.user.sub);
  }

  @Get()
  @ApiOperation({ summary: '获取测评任务列表' })
  findAll(@Query() query: QueryAssessmentDto) {
    return this.assessmentsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取测评任务详情' })
  findOne(@Param('id') id: string) {
    return this.assessmentsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新测评任务' })
  update(@Param('id') id: string, @Body() dto: UpdateAssessmentDto) {
    return this.assessmentsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除测评任务' })
  remove(@Param('id') id: string) {
    return this.assessmentsService.remove(id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: '更新测评状态' })
  updateStatus(@Param('id') id: string, @Body('status') status: AssessmentStatus) {
    return this.assessmentsService.updateStatus(id, status);
  }

  @Post(':id/calculate-score')
  @ApiOperation({ summary: '计算总分' })
  calculateScore(@Param('id') id: string) {
    return this.assessmentsService.calculateTotalScore(id);
  }
}
