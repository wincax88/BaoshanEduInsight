import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import configs from './config';

// Entities
import { User } from './modules/users/entities/user.entity';
import { Role } from './modules/roles/entities/role.entity';
import { School } from './modules/schools/entities/school.entity';
import { EducationGroup } from './modules/schools/entities/education-group.entity';
import { IndicatorL1 } from './modules/indicators/entities/indicator-l1.entity';
import { IndicatorL2 } from './modules/indicators/entities/indicator-l2.entity';
import { IndicatorL3 } from './modules/indicators/entities/indicator-l3.entity';
import { EvaluationItem } from './modules/indicators/entities/evaluation-item.entity';
import { AssessmentTask } from './modules/assessments/entities/assessment-task.entity';
import { AssessmentScore } from './modules/scores/entities/assessment-score.entity';

// Modules
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { RolesModule } from './modules/roles/roles.module';
import { SchoolsModule } from './modules/schools/schools.module';
import { IndicatorsModule } from './modules/indicators/indicators.module';
import { AssessmentsModule } from './modules/assessments/assessments.module';
import { ScoresModule } from './modules/scores/scores.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: configs,
      envFilePath: ['.env.local', '.env'],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('database.host'),
        port: configService.get('database.port'),
        database: configService.get('database.database'),
        username: configService.get('database.username'),
        password: configService.get('database.password'),
        entities: [
          User,
          Role,
          School,
          EducationGroup,
          IndicatorL1,
          IndicatorL2,
          IndicatorL3,
          EvaluationItem,
          AssessmentTask,
          AssessmentScore,
        ],
        synchronize: configService.get('database.synchronize'),
        logging: configService.get('database.logging'),
      }),
    }),
    AuthModule,
    UsersModule,
    RolesModule,
    SchoolsModule,
    IndicatorsModule,
    AssessmentsModule,
    ScoresModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
