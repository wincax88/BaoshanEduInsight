import { AssessmentsService } from './assessments.service';
import { CreateAssessmentDto } from './dto/create-assessment.dto';
import { UpdateAssessmentDto } from './dto/update-assessment.dto';
import { QueryAssessmentDto } from './dto/query-assessment.dto';
import { AssessmentStatus } from './entities/assessment-task.entity';
export declare class AssessmentsController {
    private readonly assessmentsService;
    constructor(assessmentsService: AssessmentsService);
    create(dto: CreateAssessmentDto, req: any): Promise<import("./entities/assessment-task.entity").AssessmentTask>;
    findAll(query: QueryAssessmentDto): Promise<{
        data: import("./entities/assessment-task.entity").AssessmentTask[];
        total: number;
        page: number;
        pageSize: number;
    }>;
    findOne(id: string): Promise<import("./entities/assessment-task.entity").AssessmentTask>;
    update(id: string, dto: UpdateAssessmentDto): Promise<import("./entities/assessment-task.entity").AssessmentTask>;
    remove(id: string): Promise<void>;
    updateStatus(id: string, status: AssessmentStatus): Promise<import("./entities/assessment-task.entity").AssessmentTask>;
    calculateScore(id: string): Promise<import("./entities/assessment-task.entity").AssessmentTask>;
}
