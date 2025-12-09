import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatisticsController } from './statistics.controller';
import { StatisticsService } from './statistics.service';
import { School } from '../schools/entities/school.entity';
import { AssessmentTask } from '../assessments/entities/assessment-task.entity';
import { AssessmentScore } from '../scores/entities/assessment-score.entity';
import { IndicatorL1 } from '../indicators/entities/indicator-l1.entity';
import { EvaluationItem } from '../indicators/entities/evaluation-item.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      School,
      AssessmentTask,
      AssessmentScore,
      IndicatorL1,
      EvaluationItem,
    ]),
  ],
  controllers: [StatisticsController],
  providers: [StatisticsService],
  exports: [StatisticsService],
})
export class StatisticsModule {}
