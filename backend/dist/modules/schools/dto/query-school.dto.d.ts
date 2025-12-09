import { SchoolType, SchoolCategory } from '../entities/school.entity';
export declare class QuerySchoolDto {
    page?: number;
    pageSize?: number;
    name?: string;
    type?: SchoolType;
    category?: SchoolCategory;
    district?: string;
    groupId?: string;
}
