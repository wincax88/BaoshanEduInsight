import { StatisticsService } from './statistics.service';
export declare class StatisticsController {
    private readonly statisticsService;
    constructor(statisticsService: StatisticsService);
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
        status: import("../assessments/entities/assessment-task.entity").AssessmentStatus;
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
