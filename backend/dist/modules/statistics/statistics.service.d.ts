import { Repository } from 'typeorm';
import { School } from '../schools/entities/school.entity';
import { AssessmentTask, AssessmentStatus } from '../assessments/entities/assessment-task.entity';
import { AssessmentScore } from '../scores/entities/assessment-score.entity';
import { IndicatorL1 } from '../indicators/entities/indicator-l1.entity';
import { EvaluationItem } from '../indicators/entities/evaluation-item.entity';
export declare class StatisticsService {
    private schoolRepository;
    private taskRepository;
    private scoreRepository;
    private indicatorL1Repository;
    private evaluationItemRepository;
    constructor(schoolRepository: Repository<School>, taskRepository: Repository<AssessmentTask>, scoreRepository: Repository<AssessmentScore>, indicatorL1Repository: Repository<IndicatorL1>, evaluationItemRepository: Repository<EvaluationItem>);
    getOverview(): Promise<{
        schoolCount: number;
        totalTasks: number;
        yearTasks: number;
        completedTasks: number;
        avgScore: number;
    }>;
    getAssessmentProgress(): Promise<{
        status: any;
        statusName: any;
        count: number;
    }[]>;
    getIndicatorScoreDistribution(taskId?: string): Promise<{
        name: string;
        code: string;
        maxScore: number;
        avgScore: number;
    }[] | {
        name: string;
        code: string;
        maxScore: number;
        selfScore: number;
        supervisionScore: number;
    }[]>;
    getTodoList(): Promise<{
        id: string;
        name: string;
        schoolName: string;
        status: AssessmentStatus;
        action: string;
        updatedAt: Date;
    }[]>;
    getSchoolRanking(limit?: number): Promise<{
        rank: number;
        schoolName: string;
        academicYear: string;
        totalScore: number;
        taskName: string;
    }[]>;
    getScoreTrend(): Promise<{
        academicYear: any;
        avgScore: number;
        count: number;
    }[]>;
}
