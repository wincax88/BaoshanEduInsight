import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { StatisticsService } from './statistics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('统计分析')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get('overview')
  @ApiOperation({ summary: '获取总览数据' })
  getOverview() {
    return this.statisticsService.getOverview();
  }

  @Get('assessment-progress')
  @ApiOperation({ summary: '获取测评进度统计' })
  getAssessmentProgress() {
    return this.statisticsService.getAssessmentProgress();
  }

  @Get('indicator-scores')
  @ApiOperation({ summary: '获取指标得分分布' })
  getIndicatorScoreDistribution(@Query('taskId') taskId?: string) {
    return this.statisticsService.getIndicatorScoreDistribution(taskId);
  }

  @Get('todo-list')
  @ApiOperation({ summary: '获取待办事项' })
  getTodoList() {
    return this.statisticsService.getTodoList();
  }

  @Get('school-ranking')
  @ApiOperation({ summary: '获取学校排名' })
  getSchoolRanking(@Query('limit') limit?: number) {
    return this.statisticsService.getSchoolRanking(limit || 10);
  }

  @Get('score-trend')
  @ApiOperation({ summary: '获取得分趋势' })
  getScoreTrend() {
    return this.statisticsService.getScoreTrend();
  }
}
