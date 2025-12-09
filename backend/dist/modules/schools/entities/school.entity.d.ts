import { EducationGroup } from './education-group.entity';
export declare enum SchoolType {
    PUBLIC = "public",
    PRIVATE = "private"
}
export declare enum SchoolCategory {
    PRIMARY = "primary",
    JUNIOR = "junior",
    NINE_YEAR = "nine_year"
}
export declare class School {
    id: string;
    name: string;
    code: string;
    type: SchoolType;
    category: SchoolCategory;
    address: string;
    district: string;
    principal: string;
    phone: string;
    studentCount: number;
    teacherCount: number;
    foundedYear: number;
    educationGroup: EducationGroup;
    groupId: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
