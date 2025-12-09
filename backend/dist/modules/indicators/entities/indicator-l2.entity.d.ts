import { IndicatorL1 } from './indicator-l1.entity';
import { IndicatorL3 } from './indicator-l3.entity';
export declare class IndicatorL2 {
    id: string;
    name: string;
    code: string;
    description: string;
    weight: number;
    sortOrder: number;
    parent: IndicatorL1;
    parentId: string;
    children: IndicatorL3[];
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
