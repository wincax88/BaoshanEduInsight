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
import { IndicatorsService } from './indicators.service';
import { CreateIndicatorL1Dto } from './dto/create-indicator-l1.dto';
import { CreateIndicatorL2Dto } from './dto/create-indicator-l2.dto';
import { CreateIndicatorL3Dto } from './dto/create-indicator-l3.dto';
import { CreateEvaluationItemDto } from './dto/create-evaluation-item.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('指标管理')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('indicators')
export class IndicatorsController {
  constructor(private readonly indicatorsService: IndicatorsService) {}

  @Get('tree')
  @ApiOperation({ summary: '获取指标树' })
  getTree() {
    return this.indicatorsService.getIndicatorTree();
  }

  // L1 endpoints
  @Post('l1')
  @ApiOperation({ summary: '创建一级指标' })
  createL1(@Body() dto: CreateIndicatorL1Dto) {
    return this.indicatorsService.createL1(dto);
  }

  @Get('l1')
  @ApiOperation({ summary: '获取一级指标列表' })
  findAllL1() {
    return this.indicatorsService.findAllL1();
  }

  @Get('l1/:id')
  @ApiOperation({ summary: '获取一级指标详情' })
  findOneL1(@Param('id') id: string) {
    return this.indicatorsService.findOneL1(id);
  }

  @Patch('l1/:id')
  @ApiOperation({ summary: '更新一级指标' })
  updateL1(@Param('id') id: string, @Body() dto: Partial<CreateIndicatorL1Dto>) {
    return this.indicatorsService.updateL1(id, dto);
  }

  @Delete('l1/:id')
  @ApiOperation({ summary: '删除一级指标' })
  removeL1(@Param('id') id: string) {
    return this.indicatorsService.removeL1(id);
  }

  // L2 endpoints
  @Post('l2')
  @ApiOperation({ summary: '创建二级指标' })
  createL2(@Body() dto: CreateIndicatorL2Dto) {
    return this.indicatorsService.createL2(dto);
  }

  @Get('l2')
  @ApiOperation({ summary: '获取二级指标列表' })
  findAllL2(@Query('parentId') parentId?: string) {
    return this.indicatorsService.findAllL2(parentId);
  }

  @Get('l2/:id')
  @ApiOperation({ summary: '获取二级指标详情' })
  findOneL2(@Param('id') id: string) {
    return this.indicatorsService.findOneL2(id);
  }

  @Patch('l2/:id')
  @ApiOperation({ summary: '更新二级指标' })
  updateL2(@Param('id') id: string, @Body() dto: Partial<CreateIndicatorL2Dto>) {
    return this.indicatorsService.updateL2(id, dto);
  }

  @Delete('l2/:id')
  @ApiOperation({ summary: '删除二级指标' })
  removeL2(@Param('id') id: string) {
    return this.indicatorsService.removeL2(id);
  }

  // L3 endpoints
  @Post('l3')
  @ApiOperation({ summary: '创建三级指标' })
  createL3(@Body() dto: CreateIndicatorL3Dto) {
    return this.indicatorsService.createL3(dto);
  }

  @Get('l3')
  @ApiOperation({ summary: '获取三级指标列表' })
  findAllL3(@Query('parentId') parentId?: string) {
    return this.indicatorsService.findAllL3(parentId);
  }

  @Get('l3/:id')
  @ApiOperation({ summary: '获取三级指标详情' })
  findOneL3(@Param('id') id: string) {
    return this.indicatorsService.findOneL3(id);
  }

  @Patch('l3/:id')
  @ApiOperation({ summary: '更新三级指标' })
  updateL3(@Param('id') id: string, @Body() dto: Partial<CreateIndicatorL3Dto>) {
    return this.indicatorsService.updateL3(id, dto);
  }

  @Delete('l3/:id')
  @ApiOperation({ summary: '删除三级指标' })
  removeL3(@Param('id') id: string) {
    return this.indicatorsService.removeL3(id);
  }

  // Evaluation Item endpoints
  @Post('items')
  @ApiOperation({ summary: '创建评价要素' })
  createItem(@Body() dto: CreateEvaluationItemDto) {
    return this.indicatorsService.createItem(dto);
  }

  @Get('items')
  @ApiOperation({ summary: '获取评价要素列表' })
  findAllItems(@Query('indicatorId') indicatorId?: string) {
    return this.indicatorsService.findAllItems(indicatorId);
  }

  @Get('items/:id')
  @ApiOperation({ summary: '获取评价要素详情' })
  findOneItem(@Param('id') id: string) {
    return this.indicatorsService.findOneItem(id);
  }

  @Patch('items/:id')
  @ApiOperation({ summary: '更新评价要素' })
  updateItem(
    @Param('id') id: string,
    @Body() dto: Partial<CreateEvaluationItemDto>,
  ) {
    return this.indicatorsService.updateItem(id, dto);
  }

  @Delete('items/:id')
  @ApiOperation({ summary: '删除评价要素' })
  removeItem(@Param('id') id: string) {
    return this.indicatorsService.removeItem(id);
  }
}
