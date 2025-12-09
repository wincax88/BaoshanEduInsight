import { Repository, DataSource } from 'typeorm';
import { AssessmentScore, ScoreType } from './entities/assessment-score.entity';
import { CreateScoreDto } from './dto/create-score.dto';
import { UpdateScoreDto } from './dto/update-score.dto';
import { BatchCreateScoreDto } from './dto/batch-create-score.dto';
export declare class ScoresService {
    private scoreRepository;
    private dataSource;
    private readonly logger;
    constructor(scoreRepository: Repository<AssessmentScore>, dataSource: DataSource);
    create(dto: CreateScoreDto, userId: string): Promise<AssessmentScore>;
    batchCreate(dto: BatchCreateScoreDto, userId: string): Promise<AssessmentScore[]>;
    findByTask(taskId: string, scoreType?: ScoreType): Promise<AssessmentScore[]>;
    findOne(id: string): Promise<AssessmentScore>;
    update(id: string, dto: UpdateScoreDto, userId: string): Promise<AssessmentScore>;
    remove(id: string): Promise<void>;
    getStatisticsByTask(taskId: string): Promise<{
        selfScoreCount: number;
        supervisionScoreCount: number;
        selfTotal: number;
        supervisionTotal: number;
        scores: AssessmentScore[];
    }>;
}
