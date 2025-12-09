import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SchoolsService } from './schools.service';
import { SchoolsController } from './schools.controller';
import { School } from './entities/school.entity';
import { EducationGroup } from './entities/education-group.entity';

@Module({
  imports: [TypeOrmModule.forFeature([School, EducationGroup])],
  controllers: [SchoolsController],
  providers: [SchoolsService],
  exports: [SchoolsService],
})
export class SchoolsModule {}
