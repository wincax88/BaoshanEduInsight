import { ScoreType } from '../entities/assessment-score.entity';
export declare class CreateScoreDto {
    taskId: string;
    evaluationItemId: string;
    scoreType: ScoreType;
    score: number;
    evidence?: string;
    comment?: string;
    attachments?: string[];
}
