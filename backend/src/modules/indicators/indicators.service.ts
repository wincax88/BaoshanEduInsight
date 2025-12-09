import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IndicatorL1 } from './entities/indicator-l1.entity';
import { IndicatorL2 } from './entities/indicator-l2.entity';
import { IndicatorL3 } from './entities/indicator-l3.entity';
import { EvaluationItem } from './entities/evaluation-item.entity';
import { CreateIndicatorL1Dto } from './dto/create-indicator-l1.dto';
import { CreateIndicatorL2Dto } from './dto/create-indicator-l2.dto';
import { CreateIndicatorL3Dto } from './dto/create-indicator-l3.dto';
import { CreateEvaluationItemDto } from './dto/create-evaluation-item.dto';

@Injectable()
export class IndicatorsService {
  constructor(
    @InjectRepository(IndicatorL1)
    private l1Repository: Repository<IndicatorL1>,
    @InjectRepository(IndicatorL2)
    private l2Repository: Repository<IndicatorL2>,
    @InjectRepository(IndicatorL3)
    private l3Repository: Repository<IndicatorL3>,
    @InjectRepository(EvaluationItem)
    private itemRepository: Repository<EvaluationItem>,
  ) {}

  // 获取完整指标树
  async getIndicatorTree() {
    const l1List = await this.l1Repository.find({
      relations: [
        'children',
        'children.children',
        'children.children.evaluationItems',
      ],
      order: { sortOrder: 'ASC' },
    });
    return l1List;
  }

  // L1 CRUD
  async createL1(dto: CreateIndicatorL1Dto): Promise<IndicatorL1> {
    const existing = await this.l1Repository.findOne({
      where: { code: dto.code },
    });
    if (existing) {
      throw new ConflictException('指标编码已存在');
    }
    const entity = this.l1Repository.create(dto);
    return this.l1Repository.save(entity);
  }

  async findAllL1(): Promise<IndicatorL1[]> {
    return this.l1Repository.find({
      relations: ['children'],
      order: { sortOrder: 'ASC' },
    });
  }

  async findOneL1(id: string): Promise<IndicatorL1> {
    const entity = await this.l1Repository.findOne({
      where: { id },
      relations: ['children', 'children.children'],
    });
    if (!entity) {
      throw new NotFoundException('一级指标不存在');
    }
    return entity;
  }

  async updateL1(id: string, dto: Partial<CreateIndicatorL1Dto>) {
    const entity = await this.findOneL1(id);
    Object.assign(entity, dto);
    return this.l1Repository.save(entity);
  }

  async removeL1(id: string): Promise<void> {
    const entity = await this.findOneL1(id);
    await this.l1Repository.remove(entity);
  }

  // L2 CRUD
  async createL2(dto: CreateIndicatorL2Dto): Promise<IndicatorL2> {
    const existing = await this.l2Repository.findOne({
      where: { code: dto.code },
    });
    if (existing) {
      throw new ConflictException('指标编码已存在');
    }
    const entity = this.l2Repository.create(dto);
    return this.l2Repository.save(entity);
  }

  async findAllL2(parentId?: string): Promise<IndicatorL2[]> {
    const where = parentId ? { parentId } : {};
    return this.l2Repository.find({
      where,
      relations: ['parent', 'children'],
      order: { sortOrder: 'ASC' },
    });
  }

  async findOneL2(id: string): Promise<IndicatorL2> {
    const entity = await this.l2Repository.findOne({
      where: { id },
      relations: ['parent', 'children'],
    });
    if (!entity) {
      throw new NotFoundException('二级指标不存在');
    }
    return entity;
  }

  async updateL2(id: string, dto: Partial<CreateIndicatorL2Dto>) {
    const entity = await this.findOneL2(id);
    Object.assign(entity, dto);
    return this.l2Repository.save(entity);
  }

  async removeL2(id: string): Promise<void> {
    const entity = await this.findOneL2(id);
    await this.l2Repository.remove(entity);
  }

  // L3 CRUD
  async createL3(dto: CreateIndicatorL3Dto): Promise<IndicatorL3> {
    const existing = await this.l3Repository.findOne({
      where: { code: dto.code },
    });
    if (existing) {
      throw new ConflictException('指标编码已存在');
    }
    const entity = this.l3Repository.create(dto);
    return this.l3Repository.save(entity);
  }

  async findAllL3(parentId?: string): Promise<IndicatorL3[]> {
    const where = parentId ? { parentId } : {};
    return this.l3Repository.find({
      where,
      relations: ['parent', 'evaluationItems'],
      order: { sortOrder: 'ASC' },
    });
  }

  async findOneL3(id: string): Promise<IndicatorL3> {
    const entity = await this.l3Repository.findOne({
      where: { id },
      relations: ['parent', 'evaluationItems'],
    });
    if (!entity) {
      throw new NotFoundException('三级指标不存在');
    }
    return entity;
  }

  async updateL3(id: string, dto: Partial<CreateIndicatorL3Dto>) {
    const entity = await this.findOneL3(id);
    Object.assign(entity, dto);
    return this.l3Repository.save(entity);
  }

  async removeL3(id: string): Promise<void> {
    const entity = await this.findOneL3(id);
    await this.l3Repository.remove(entity);
  }

  // Evaluation Item CRUD
  async createItem(dto: CreateEvaluationItemDto): Promise<EvaluationItem> {
    const existing = await this.itemRepository.findOne({
      where: { code: dto.code },
    });
    if (existing) {
      throw new ConflictException('评价要素编码已存在');
    }
    const entity = this.itemRepository.create(dto);
    return this.itemRepository.save(entity);
  }

  async findAllItems(indicatorId?: string): Promise<EvaluationItem[]> {
    const where = indicatorId ? { indicatorId } : {};
    return this.itemRepository.find({
      where,
      relations: ['indicator'],
      order: { sortOrder: 'ASC' },
    });
  }

  async findOneItem(id: string): Promise<EvaluationItem> {
    const entity = await this.itemRepository.findOne({
      where: { id },
      relations: ['indicator'],
    });
    if (!entity) {
      throw new NotFoundException('评价要素不存在');
    }
    return entity;
  }

  async updateItem(id: string, dto: Partial<CreateEvaluationItemDto>) {
    const entity = await this.findOneItem(id);
    Object.assign(entity, dto);
    return this.itemRepository.save(entity);
  }

  async removeItem(id: string): Promise<void> {
    const entity = await this.findOneItem(id);
    await this.itemRepository.remove(entity);
  }
}
