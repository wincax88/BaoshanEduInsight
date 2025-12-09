import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScoresService } from './scores.service';
import { ScoresController } from './scores.controller';
import { AssessmentScore } from './entities/assessment-score.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AssessmentScore])],
  controllers: [ScoresController],
  providers: [ScoresService],
  exports: [ScoresService],
})
export class ScoresModule {}
