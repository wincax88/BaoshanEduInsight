import { School } from './school.entity';
export declare class EducationGroup {
    id: string;
    name: string;
    code: string;
    description: string;
    leadSchool: string;
    schools: School[];
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
