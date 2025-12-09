import { Repository } from 'typeorm';
import { School } from './entities/school.entity';
import { EducationGroup } from './entities/education-group.entity';
import { CreateSchoolDto } from './dto/create-school.dto';
import { UpdateSchoolDto } from './dto/update-school.dto';
import { QuerySchoolDto } from './dto/query-school.dto';
import { CreateEducationGroupDto } from './dto/create-education-group.dto';
export declare class SchoolsService {
    private schoolsRepository;
    private groupsRepository;
    constructor(schoolsRepository: Repository<School>, groupsRepository: Repository<EducationGroup>);
    createSchool(createSchoolDto: CreateSchoolDto): Promise<School>;
    findAllSchools(query: QuerySchoolDto): Promise<{
        data: School[];
        total: number;
        page: number;
        pageSize: number;
    }>;
    findOneSchool(id: string): Promise<School>;
    updateSchool(id: string, updateSchoolDto: UpdateSchoolDto): Promise<School>;
    removeSchool(id: string): Promise<void>;
    createGroup(dto: CreateEducationGroupDto): Promise<EducationGroup>;
    findAllGroups(): Promise<EducationGroup[]>;
    findOneGroup(id: string): Promise<EducationGroup>;
}
