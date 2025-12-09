import { IndicatorL2 } from './indicator-l2.entity';
import { EvaluationItem } from './evaluation-item.entity';
export declare class IndicatorL3 {
    id: string;
    name: string;
    code: string;
    description: string;
    weight: number;
    sortOrder: number;
    parent: IndicatorL2;
    parentId: string;
    evaluationItems: EvaluationItem[];
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
