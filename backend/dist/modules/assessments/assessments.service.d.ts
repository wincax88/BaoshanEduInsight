import { Repository } from 'typeorm';
import { AssessmentTask, AssessmentStatus } from './entities/assessment-task.entity';
import { CreateAssessmentDto } from './dto/create-assessment.dto';
import { UpdateAssessmentDto } from './dto/update-assessment.dto';
import { QueryAssessmentDto } from './dto/query-assessment.dto';
export declare class AssessmentsService {
    private taskRepository;
    constructor(taskRepository: Repository<AssessmentTask>);
    create(dto: CreateAssessmentDto, userId: string): Promise<AssessmentTask>;
    findAll(query: QueryAssessmentDto): Promise<{
        data: AssessmentTask[];
        total: number;
        page: number;
        pageSize: number;
    }>;
    findOne(id: string): Promise<AssessmentTask>;
    update(id: string, dto: UpdateAssessmentDto): Promise<AssessmentTask>;
    remove(id: string): Promise<void>;
    updateStatus(id: string, status: AssessmentStatus): Promise<AssessmentTask>;
    calculateTotalScore(id: string): Promise<AssessmentTask>;
}
