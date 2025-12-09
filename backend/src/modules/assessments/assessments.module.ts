import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssessmentsService } from './assessments.service';
import { AssessmentsController } from './assessments.controller';
import { AssessmentTask } from './entities/assessment-task.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AssessmentTask])],
  controllers: [AssessmentsController],
  providers: [AssessmentsService],
  exports: [AssessmentsService],
})
export class AssessmentsModule {}
