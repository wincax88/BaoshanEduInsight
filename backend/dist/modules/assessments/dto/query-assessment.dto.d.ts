import { AssessmentStatus } from '../entities/assessment-task.entity';
export declare class QueryAssessmentDto {
    page?: number;
    pageSize?: number;
    schoolId?: string;
    status?: AssessmentStatus;
    academicYear?: string;
}
