import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, DataSource, QueryRunner } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { ScoresService } from './scores.service';
import { AssessmentScore, ScoreType } from './entities/assessment-score.entity';

describe('ScoresService', () => {
  let service: ScoresService;
  let repository: jest.Mocked<Repository<AssessmentScore>>;
  let dataSource: jest.Mocked<DataSource>;
  let queryRunner: jest.Mocked<QueryRunner>;

  const mockScore: Partial<AssessmentScore> = {
    id: 'score-123',
    taskId: 'task-123',
    evaluationItemId: 'item-123',
    scoreType: ScoreType.SELF,
    score: 85,
    evidence: '测试证据',
    comment: '测试评论',
    scoredBy: 'user-123',
    scoredAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    // Mock QueryRunner
    queryRunner = {
      connect: jest.fn(),
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      rollbackTransaction: jest.fn(),
      release: jest.fn(),
      manager: {
        findOne: jest.fn(),
        create: jest.fn(),
        save: jest.fn(),
      },
    } as unknown as jest.Mocked<QueryRunner>;

    // Mock DataSource
    const mockDataSource = {
      createQueryRunner: jest.fn().mockReturnValue(queryRunner),
    };

    // Mock Repository
    const mockRepository = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ScoresService,
        { provide: getRepositoryToken(AssessmentScore), useValue: mockRepository },
        { provide: DataSource, useValue: mockDataSource },
      ],
    }).compile();

    service = module.get<ScoresService>(ScoresService);
    repository = module.get(getRepositoryToken(AssessmentScore));
    dataSource = module.get(DataSource);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new score', async () => {
      const dto = {
        taskId: 'task-123',
        evaluationItemId: 'item-123',
        scoreType: ScoreType.SELF,
        score: 85,
        evidence: '测试证据',
        comment: '测试评论',
      };

      repository.create.mockReturnValue(mockScore as AssessmentScore);
      repository.save.mockResolvedValue(mockScore as AssessmentScore);

      const result = await service.create(dto, 'user-123');

      expect(result).toEqual(mockScore);
      expect(repository.create).toHaveBeenCalledWith({
        ...dto,
        scoredBy: 'user-123',
        scoredAt: expect.any(Date),
      });
      expect(repository.save).toHaveBeenCalled();
    });
  });

  describe('findByTask', () => {
    it('should find scores by task ID', async () => {
      const scores = [mockScore as AssessmentScore];
      repository.find.mockResolvedValue(scores);

      const result = await service.findByTask('task-123');

      expect(result).toEqual(scores);
      expect(repository.find).toHaveBeenCalledWith({
        where: { taskId: 'task-123' },
        relations: ['evaluationItem', 'evaluationItem.indicator'],
        order: { createdAt: 'ASC' },
      });
    });

    it('should filter by score type when provided', async () => {
      const scores = [mockScore as AssessmentScore];
      repository.find.mockResolvedValue(scores);

      const result = await service.findByTask('task-123', ScoreType.SELF);

      expect(result).toEqual(scores);
      expect(repository.find).toHaveBeenCalledWith({
        where: { taskId: 'task-123', scoreType: ScoreType.SELF },
        relations: ['evaluationItem', 'evaluationItem.indicator'],
        order: { createdAt: 'ASC' },
      });
    });
  });

  describe('findOne', () => {
    it('should find a score by ID', async () => {
      repository.findOne.mockResolvedValue(mockScore as AssessmentScore);

      const result = await service.findOne('score-123');

      expect(result).toEqual(mockScore);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 'score-123' },
        relations: ['evaluationItem', 'task'],
      });
    });

    it('should throw NotFoundException when score not found', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.findOne('nonexistent')).rejects.toThrow(NotFoundException);
      await expect(service.findOne('nonexistent')).rejects.toThrow('评分记录不存在');
    });
  });

  describe('update', () => {
    it('should update an existing score', async () => {
      const updateDto = { score: 90, comment: '更新评论' };
      const updatedScore = { ...mockScore, ...updateDto };

      repository.findOne.mockResolvedValue(mockScore as AssessmentScore);
      repository.save.mockResolvedValue(updatedScore as AssessmentScore);

      const result = await service.update('score-123', updateDto, 'user-123');

      expect(result.score).toBe(90);
      expect(repository.save).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should remove a score', async () => {
      repository.findOne.mockResolvedValue(mockScore as AssessmentScore);
      repository.remove.mockResolvedValue(mockScore as AssessmentScore);

      await service.remove('score-123');

      expect(repository.remove).toHaveBeenCalledWith(mockScore);
    });
  });

  describe('batchCreate', () => {
    it('should batch create scores with transaction', async () => {
      const batchDto = {
        taskId: 'task-123',
        scoreType: ScoreType.SELF,
        scores: [
          { evaluationItemId: 'item-1', score: 80, evidence: '证据1' },
          { evaluationItemId: 'item-2', score: 90, evidence: '证据2' },
        ],
      };

      (queryRunner.manager.findOne as jest.Mock).mockResolvedValue(null);
      (queryRunner.manager.create as jest.Mock).mockImplementation((_, data) => data);
      (queryRunner.manager.save as jest.Mock).mockImplementation((data) => ({ ...data, id: 'new-id' }));

      const result = await service.batchCreate(batchDto, 'user-123');

      expect(result).toHaveLength(2);
      expect(queryRunner.startTransaction).toHaveBeenCalled();
      expect(queryRunner.commitTransaction).toHaveBeenCalled();
      expect(queryRunner.release).toHaveBeenCalled();
    });

    it('should rollback transaction on error', async () => {
      const batchDto = {
        taskId: 'task-123',
        scoreType: ScoreType.SELF,
        scores: [{ evaluationItemId: 'item-1', score: 80 }],
      };

      (queryRunner.manager.findOne as jest.Mock).mockRejectedValue(new Error('Database error'));

      await expect(service.batchCreate(batchDto, 'user-123')).rejects.toThrow('Database error');
      expect(queryRunner.rollbackTransaction).toHaveBeenCalled();
      expect(queryRunner.release).toHaveBeenCalled();
    });

    it('should update existing scores instead of creating new ones', async () => {
      const existingScore = { ...mockScore, score: 70 };
      const batchDto = {
        taskId: 'task-123',
        scoreType: ScoreType.SELF,
        scores: [{ evaluationItemId: 'item-123', score: 85 }],
      };

      (queryRunner.manager.findOne as jest.Mock).mockResolvedValue(existingScore);
      (queryRunner.manager.save as jest.Mock).mockImplementation((data) => data);

      const result = await service.batchCreate(batchDto, 'user-123');

      expect(result).toHaveLength(1);
      expect(result[0].score).toBe(85);
    });
  });

  describe('getStatisticsByTask', () => {
    it('should return statistics for a task', async () => {
      const selfScores = [
        { ...mockScore, scoreType: ScoreType.SELF, score: 80 },
        { ...mockScore, id: 'score-2', scoreType: ScoreType.SELF, score: 90 },
      ] as AssessmentScore[];
      const supervisionScores = [
        { ...mockScore, id: 'score-3', scoreType: ScoreType.SUPERVISION, score: 85 },
      ] as AssessmentScore[];

      repository.find.mockResolvedValue([...selfScores, ...supervisionScores]);

      const result = await service.getStatisticsByTask('task-123');

      expect(result.selfScoreCount).toBe(2);
      expect(result.supervisionScoreCount).toBe(1);
      expect(result.selfTotal).toBe(170);
      expect(result.supervisionTotal).toBe(85);
    });
  });
});
