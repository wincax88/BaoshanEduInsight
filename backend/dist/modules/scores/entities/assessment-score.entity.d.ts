import { AssessmentTask } from '../../assessments/entities/assessment-task.entity';
import { EvaluationItem } from '../../indicators/entities/evaluation-item.entity';
export declare enum ScoreType {
    SELF = "self",
    SUPERVISION = "supervision"
}
export declare class AssessmentScore {
    id: string;
    task: AssessmentTask;
    taskId: string;
    evaluationItem: EvaluationItem;
    evaluationItemId: string;
    scoreType: ScoreType;
    score: number;
    evidence: string;
    comment: string;
    attachments: string[];
    scoredBy: string;
    scoredAt: Date;
    createdAt: Date;
    updatedAt: Date;
}
