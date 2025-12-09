import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { School } from './entities/school.entity';
import { EducationGroup } from './entities/education-group.entity';
import { CreateSchoolDto } from './dto/create-school.dto';
import { UpdateSchoolDto } from './dto/update-school.dto';
import { QuerySchoolDto } from './dto/query-school.dto';
import { CreateEducationGroupDto } from './dto/create-education-group.dto';

@Injectable()
export class SchoolsService {
  constructor(
    @InjectRepository(School)
    private schoolsRepository: Repository<School>,
    @InjectRepository(EducationGroup)
    private groupsRepository: Repository<EducationGroup>,
  ) {}

  // School CRUD
  async createSchool(createSchoolDto: CreateSchoolDto): Promise<School> {
    const existing = await this.schoolsRepository.findOne({
      where: { code: createSchoolDto.code },
    });
    if (existing) {
      throw new ConflictException('学校编码已存在');
    }

    const school = this.schoolsRepository.create(createSchoolDto);
    return this.schoolsRepository.save(school);
  }

  async findAllSchools(query: QuerySchoolDto) {
    const {
      page = 1,
      pageSize = 10,
      name,
      type,
      category,
      district,
      groupId,
    } = query;

    const qb = this.schoolsRepository
      .createQueryBuilder('school')
      .leftJoinAndSelect('school.educationGroup', 'group');

    if (name) {
      qb.andWhere('school.name LIKE :name', { name: `%${name}%` });
    }
    if (type) {
      qb.andWhere('school.type = :type', { type });
    }
    if (category) {
      qb.andWhere('school.category = :category', { category });
    }
    if (district) {
      qb.andWhere('school.district = :district', { district });
    }
    if (groupId) {
      qb.andWhere('school.groupId = :groupId', { groupId });
    }

    const [data, total] = await qb
      .orderBy('school.createdAt', 'DESC')
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();

    return { data, total, page, pageSize };
  }

  async findOneSchool(id: string): Promise<School> {
    const school = await this.schoolsRepository.findOne({
      where: { id },
      relations: ['educationGroup'],
    });
    if (!school) {
      throw new NotFoundException('学校不存在');
    }
    return school;
  }

  async updateSchool(
    id: string,
    updateSchoolDto: UpdateSchoolDto,
  ): Promise<School> {
    const school = await this.findOneSchool(id);
    Object.assign(school, updateSchoolDto);
    return this.schoolsRepository.save(school);
  }

  async removeSchool(id: string): Promise<void> {
    const school = await this.findOneSchool(id);
    await this.schoolsRepository.remove(school);
  }

  // Education Group CRUD
  async createGroup(dto: CreateEducationGroupDto): Promise<EducationGroup> {
    const existing = await this.groupsRepository.findOne({
      where: { code: dto.code },
    });
    if (existing) {
      throw new ConflictException('集团编码已存在');
    }

    const group = this.groupsRepository.create(dto);
    return this.groupsRepository.save(group);
  }

  async findAllGroups(): Promise<EducationGroup[]> {
    return this.groupsRepository.find({
      relations: ['schools'],
      order: { createdAt: 'ASC' },
    });
  }

  async findOneGroup(id: string): Promise<EducationGroup> {
    const group = await this.groupsRepository.findOne({
      where: { id },
      relations: ['schools'],
    });
    if (!group) {
      throw new NotFoundException('教育集团不存在');
    }
    return group;
  }
}
