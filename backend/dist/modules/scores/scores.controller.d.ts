import { ScoresService } from './scores.service';
import { CreateScoreDto } from './dto/create-score.dto';
import { UpdateScoreDto } from './dto/update-score.dto';
import { BatchCreateScoreDto } from './dto/batch-create-score.dto';
import { ScoreType } from './entities/assessment-score.entity';
export declare class ScoresController {
    private readonly scoresService;
    constructor(scoresService: ScoresService);
    create(dto: CreateScoreDto, req: {
        user: {
            sub: string;
        };
    }): Promise<import("./entities/assessment-score.entity").AssessmentScore>;
    batchCreate(dto: BatchCreateScoreDto, req: {
        user: {
            sub: string;
        };
    }): Promise<import("./entities/assessment-score.entity").AssessmentScore[]>;
    findByTask(taskId: string, scoreType?: ScoreType): Promise<import("./entities/assessment-score.entity").AssessmentScore[]>;
    getStatistics(taskId: string): Promise<{
        selfScoreCount: number;
        supervisionScoreCount: number;
        selfTotal: number;
        supervisionTotal: number;
        scores: import("./entities/assessment-score.entity").AssessmentScore[];
    }>;
    findOne(id: string): Promise<import("./entities/assessment-score.entity").AssessmentScore>;
    update(id: string, dto: UpdateScoreDto, req: {
        user: {
            sub: string;
        };
    }): Promise<import("./entities/assessment-score.entity").AssessmentScore>;
    remove(id: string): Promise<void>;
}
