import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IndicatorsService } from './indicators.service';
import { IndicatorsController } from './indicators.controller';
import { IndicatorL1 } from './entities/indicator-l1.entity';
import { IndicatorL2 } from './entities/indicator-l2.entity';
import { IndicatorL3 } from './entities/indicator-l3.entity';
import { EvaluationItem } from './entities/evaluation-item.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      IndicatorL1,
      IndicatorL2,
      IndicatorL3,
      EvaluationItem,
    ]),
  ],
  controllers: [IndicatorsController],
  providers: [IndicatorsService],
  exports: [IndicatorsService],
})
export class IndicatorsModule {}
