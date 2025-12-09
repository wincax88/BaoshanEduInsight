import { SchoolsService } from './schools.service';
import { CreateSchoolDto } from './dto/create-school.dto';
import { UpdateSchoolDto } from './dto/update-school.dto';
import { QuerySchoolDto } from './dto/query-school.dto';
import { CreateEducationGroupDto } from './dto/create-education-group.dto';
export declare class SchoolsController {
    private readonly schoolsService;
    constructor(schoolsService: SchoolsService);
    createSchool(createSchoolDto: CreateSchoolDto): Promise<import("./entities/school.entity").School>;
    findAllSchools(query: QuerySchoolDto): Promise<{
        data: import("./entities/school.entity").School[];
        total: number;
        page: number;
        pageSize: number;
    }>;
    findOneSchool(id: string): Promise<import("./entities/school.entity").School>;
    updateSchool(id: string, updateSchoolDto: UpdateSchoolDto): Promise<import("./entities/school.entity").School>;
    removeSchool(id: string): Promise<void>;
    createGroup(dto: CreateEducationGroupDto): Promise<import("./entities/education-group.entity").EducationGroup>;
    findAllGroups(): Promise<import("./entities/education-group.entity").EducationGroup[]>;
    findOneGroup(id: string): Promise<import("./entities/education-group.entity").EducationGroup>;
}
