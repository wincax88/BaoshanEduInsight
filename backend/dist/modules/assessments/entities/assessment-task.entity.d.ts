import { School } from '../../schools/entities/school.entity';
import { AssessmentScore } from '../../scores/entities/assessment-score.entity';
export declare enum AssessmentStatus {
    DRAFT = "draft",
    SELF_EVALUATION = "self_evaluation",
    SUPERVISION = "supervision",
    REVIEW = "review",
    COMPLETED = "completed"
}
export declare class AssessmentTask {
    id: string;
    name: string;
    academicYear: string;
    description: string;
    school: School;
    schoolId: string;
    status: AssessmentStatus;
    selfEvaluationStartDate: Date;
    selfEvaluationEndDate: Date;
    supervisionStartDate: Date;
    supervisionEndDate: Date;
    totalScore: number;
    supervisionOpinion: string;
    scores: AssessmentScore[];
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
}
