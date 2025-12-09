"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const config_2 = __importDefault(require("./config"));
const user_entity_1 = require("./modules/users/entities/user.entity");
const role_entity_1 = require("./modules/roles/entities/role.entity");
const school_entity_1 = require("./modules/schools/entities/school.entity");
const education_group_entity_1 = require("./modules/schools/entities/education-group.entity");
const indicator_l1_entity_1 = require("./modules/indicators/entities/indicator-l1.entity");
const indicator_l2_entity_1 = require("./modules/indicators/entities/indicator-l2.entity");
const indicator_l3_entity_1 = require("./modules/indicators/entities/indicator-l3.entity");
const evaluation_item_entity_1 = require("./modules/indicators/entities/evaluation-item.entity");
const assessment_task_entity_1 = require("./modules/assessments/entities/assessment-task.entity");
const assessment_score_entity_1 = require("./modules/scores/entities/assessment-score.entity");
const auth_module_1 = require("./modules/auth/auth.module");
const users_module_1 = require("./modules/users/users.module");
const roles_module_1 = require("./modules/roles/roles.module");
const schools_module_1 = require("./modules/schools/schools.module");
const indicators_module_1 = require("./modules/indicators/indicators.module");
const assessments_module_1 = require("./modules/assessments/assessments.module");
const scores_module_1 = require("./modules/scores/scores.module");
const statistics_module_1 = require("./modules/statistics/statistics.module");
const files_module_1 = require("./modules/files/files.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                load: config_2.default,
                envFilePath: ['.env.local', '.env'],
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (configService) => ({
                    type: 'postgres',
                    host: configService.get('database.host'),
                    port: configService.get('database.port'),
                    database: configService.get('database.database'),
                    username: configService.get('database.username'),
                    password: configService.get('database.password'),
                    entities: [
                        user_entity_1.User,
                        role_entity_1.Role,
                        school_entity_1.School,
                        education_group_entity_1.EducationGroup,
                        indicator_l1_entity_1.IndicatorL1,
                        indicator_l2_entity_1.IndicatorL2,
                        indicator_l3_entity_1.IndicatorL3,
                        evaluation_item_entity_1.EvaluationItem,
                        assessment_task_entity_1.AssessmentTask,
                        assessment_score_entity_1.AssessmentScore,
                    ],
                    synchronize: configService.get('database.synchronize'),
                    logging: configService.get('database.logging'),
                }),
            }),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            roles_module_1.RolesModule,
            schools_module_1.SchoolsModule,
            indicators_module_1.IndicatorsModule,
            assessments_module_1.AssessmentsModule,
            scores_module_1.ScoresModule,
            statistics_module_1.StatisticsModule,
            files_module_1.FilesModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map