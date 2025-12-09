import { SchoolType, SchoolCategory } from '../entities/school.entity';
export declare class CreateSchoolDto {
    name: string;
    code: string;
    type?: SchoolType;
    category?: SchoolCategory;
    address?: string;
    district?: string;
    principal?: string;
    phone?: string;
    studentCount?: number;
    teacherCount?: number;
    foundedYear?: number;
    groupId?: string;
}
