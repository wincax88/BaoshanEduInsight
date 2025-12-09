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
import { ScoresService } from './scores.service';
import { CreateScoreDto } from './dto/create-score.dto';
import { UpdateScoreDto } from './dto/update-score.dto';
import { BatchCreateScoreDto } from './dto/batch-create-score.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ScoreType } from './entities/assessment-score.entity';

@ApiTags('评分管理')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('scores')
export class ScoresController {
  constructor(private readonly scoresService: ScoresService) {}

  @Post()
  @ApiOperation({ summary: '创建评分记录' })
  create(@Body() dto: CreateScoreDto, @Request() req) {
    return this.scoresService.create(dto, req.user.sub);
  }

  @Post('batch')
  @ApiOperation({ summary: '批量创建评分记录' })
  batchCreate(@Body() dto: BatchCreateScoreDto, @Request() req) {
    return this.scoresService.batchCreate(dto, req.user.sub);
  }

  @Get('task/:taskId')
  @ApiOperation({ summary: '获取任务的评分列表' })
  findByTask(
    @Param('taskId') taskId: string,
    @Query('scoreType') scoreType?: ScoreType,
  ) {
    return this.scoresService.findByTask(taskId, scoreType);
  }

  @Get('task/:taskId/statistics')
  @ApiOperation({ summary: '获取任务评分统计' })
  getStatistics(@Param('taskId') taskId: string) {
    return this.scoresService.getStatisticsByTask(taskId);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取评分详情' })
  findOne(@Param('id') id: string) {
    return this.scoresService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新评分' })
  update(@Param('id') id: string, @Body() dto: UpdateScoreDto, @Request() req) {
    return this.scoresService.update(id, dto, req.user.sub);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除评分' })
  remove(@Param('id') id: string) {
    return this.scoresService.remove(id);
  }
}
