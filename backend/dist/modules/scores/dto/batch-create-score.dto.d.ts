import { ScoreType } from '../entities/assessment-score.entity';
declare class ScoreItem {
    evaluationItemId: string;
    score: number;
    evidence?: string;
    comment?: string;
}
export declare class BatchCreateScoreDto {
    taskId: string;
    scoreType: ScoreType;
    scores: ScoreItem[];
}
export {};
