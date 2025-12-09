import { IndicatorL2 } from './indicator-l2.entity';
export declare class IndicatorL1 {
    id: string;
    name: string;
    code: string;
    description: string;
    weight: number;
    sortOrder: number;
    children: IndicatorL2[];
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
