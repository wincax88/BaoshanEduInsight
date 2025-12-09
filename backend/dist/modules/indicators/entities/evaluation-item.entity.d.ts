import { IndicatorL3 } from './indicator-l3.entity';
export declare class EvaluationItem {
    id: string;
    name: string;
    code: string;
    description: string;
    baoshanFeature: string;
    maxScore: number;
    scoringCriteria: string;
    sortOrder: number;
    indicator: IndicatorL3;
    indicatorId: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
