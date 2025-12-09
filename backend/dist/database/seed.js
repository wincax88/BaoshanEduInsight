"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const bcrypt = __importStar(require("bcrypt"));
const user_entity_1 = require("../modules/users/entities/user.entity");
const role_entity_1 = require("../modules/roles/entities/role.entity");
const indicator_l1_entity_1 = require("../modules/indicators/entities/indicator-l1.entity");
const indicator_l2_entity_1 = require("../modules/indicators/entities/indicator-l2.entity");
const indicator_l3_entity_1 = require("../modules/indicators/entities/indicator-l3.entity");
const evaluation_item_entity_1 = require("../modules/indicators/entities/evaluation-item.entity");
const school_entity_1 = require("../modules/schools/entities/school.entity");
const education_group_entity_1 = require("../modules/schools/entities/education-group.entity");
const assessment_task_entity_1 = require("../modules/assessments/entities/assessment-task.entity");
const assessment_score_entity_1 = require("../modules/scores/entities/assessment-score.entity");
const AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT || '5432'),
    database: process.env.DATABASE_NAME || 'baoshan_edu',
    username: process.env.DATABASE_USER || 'postgres',
    password: process.env.DATABASE_PASSWORD || 'postgres123',
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
    synchronize: true,
});
async function seed() {
    await AppDataSource.initialize();
    console.log('Database connected');
    const roleRepo = AppDataSource.getRepository(role_entity_1.Role);
    const userRepo = AppDataSource.getRepository(user_entity_1.User);
    const l1Repo = AppDataSource.getRepository(indicator_l1_entity_1.IndicatorL1);
    const l2Repo = AppDataSource.getRepository(indicator_l2_entity_1.IndicatorL2);
    const l3Repo = AppDataSource.getRepository(indicator_l3_entity_1.IndicatorL3);
    const itemRepo = AppDataSource.getRepository(evaluation_item_entity_1.EvaluationItem);
    console.log('Creating roles...');
    const roles = [
        { name: '系统管理员', code: 'admin', description: '系统管理员，拥有全部权限', isSystem: true },
        { name: '教育局管理员', code: 'edu_admin', description: '教育局管理员', isSystem: true },
        { name: '督导员', code: 'supervisor', description: '督导评估人员', isSystem: false },
        { name: '学校管理员', code: 'school_admin', description: '学校管理员', isSystem: false },
        { name: '教师', code: 'teacher', description: '普通教师', isSystem: false },
    ];
    const savedRoles = [];
    for (const roleData of roles) {
        let role = await roleRepo.findOne({ where: { code: roleData.code } });
        if (!role) {
            role = roleRepo.create(roleData);
            role = await roleRepo.save(role);
        }
        savedRoles.push(role);
    }
    console.log('Roles created');
    console.log('Creating admin user...');
    let adminUser = await userRepo.findOne({ where: { username: 'admin' } });
    if (!adminUser) {
        const hashedPassword = await bcrypt.hash('admin123', 10);
        adminUser = userRepo.create({
            username: 'admin',
            password: hashedPassword,
            realName: '系统管理员',
            email: 'admin@baoshan.edu.cn',
            roles: [savedRoles[0]],
        });
        await userRepo.save(adminUser);
    }
    console.log('Admin user created');
    console.log('Creating indicator system...');
    const indicatorData = [
        {
            name: '学校治理',
            code: 'L1-01',
            description: '规范管理、民主参与',
            weight: 15,
            sortOrder: 1,
            children: [
                {
                    name: '依法治校',
                    code: 'L2-01',
                    sortOrder: 1,
                    children: [
                        {
                            name: '学校章程与制度',
                            code: 'L3-01',
                            sortOrder: 1,
                            items: [
                                { name: '章程制定与执行', code: 'EI-01', maxScore: 5, baoshanFeature: '党支部领导校长负责制落实' },
                                { name: '学校民主管理机制', code: 'EI-02', maxScore: 5, baoshanFeature: '教代会、家委会参与率≥90%' },
                            ],
                        },
                    ],
                },
                {
                    name: '规划与实施',
                    code: 'L2-02',
                    sortOrder: 2,
                    children: [
                        {
                            name: '发展规划',
                            code: 'L3-02',
                            sortOrder: 1,
                            items: [
                                { name: '规划目标', code: 'EI-03', maxScore: 3, baoshanFeature: '"十四五"规划中融入集团化办学目标' },
                                { name: '措施与自我评估', code: 'EI-04', maxScore: 2, baoshanFeature: '年度调整率≥80%' },
                            ],
                        },
                    ],
                },
            ],
        },
        {
            name: '课程教学',
            code: 'L1-02',
            description: '开齐开足、素质教育',
            weight: 25,
            sortOrder: 2,
            children: [
                {
                    name: '课程实施',
                    code: 'L2-03',
                    sortOrder: 1,
                    children: [
                        {
                            name: '国家课程与地方课程',
                            code: 'L3-03',
                            sortOrder: 1,
                            items: [
                                { name: '课程开设率', code: 'EI-05', maxScore: 8, baoshanFeature: '问题化学习覆盖率100%' },
                                { name: '课时落实', code: 'EI-06', maxScore: 5, baoshanFeature: '"欣"课程体系借鉴' },
                            ],
                        },
                    ],
                },
                {
                    name: '教学质量',
                    code: 'L2-04',
                    sortOrder: 2,
                    children: [
                        {
                            name: '教学设计与评价',
                            code: 'L3-04',
                            sortOrder: 1,
                            items: [
                                { name: '课堂教学', code: 'EI-07', maxScore: 4, baoshanFeature: '绿色指标测试（语文/数学/英语水平指数）' },
                                { name: '作业管理', code: 'EI-08', maxScore: 4, baoshanFeature: '作业总量不超过国家标准' },
                                { name: '学业评价', code: 'EI-09', maxScore: 4, baoshanFeature: '减负增效' },
                            ],
                        },
                    ],
                },
            ],
        },
        {
            name: '队伍建设',
            code: 'L1-03',
            description: '师资专业化',
            weight: 15,
            sortOrder: 3,
            children: [
                {
                    name: '教师发展',
                    code: 'L2-05',
                    sortOrder: 1,
                    children: [
                        {
                            name: '专业培训与成长',
                            code: 'L3-05',
                            sortOrder: 1,
                            items: [
                                { name: '培训覆盖率', code: 'EI-10', maxScore: 5, baoshanFeature: '本科学历占比≥85%' },
                                { name: '骨干比例', code: 'EI-11', maxScore: 5, baoshanFeature: '青年教师研修计划（AI辅助专业发展）' },
                            ],
                        },
                    ],
                },
                {
                    name: '管理机制',
                    code: 'L2-06',
                    sortOrder: 2,
                    children: [
                        {
                            name: '绩效与激励',
                            code: 'L3-06',
                            sortOrder: 1,
                            items: [
                                { name: '考核评价体系', code: 'EI-12', maxScore: 5, baoshanFeature: '首席教师/骨干教师比例≥20%' },
                            ],
                        },
                    ],
                },
            ],
        },
        {
            name: '资源保障',
            code: 'L1-04',
            description: '设施完备、数字化',
            weight: 15,
            sortOrder: 4,
            children: [
                {
                    name: '设施设备',
                    code: 'L2-07',
                    sortOrder: 1,
                    children: [
                        {
                            name: '校舍与装备',
                            code: 'L3-07',
                            sortOrder: 1,
                            items: [
                                { name: '使用率', code: 'EI-13', maxScore: 5, baoshanFeature: '专用教室使用率100%' },
                                { name: '维护机制', code: 'EI-14', maxScore: 5, baoshanFeature: '信息技术融合（如线上线下教学）' },
                            ],
                        },
                    ],
                },
                {
                    name: '经费使用',
                    code: 'L2-08',
                    sortOrder: 2,
                    children: [
                        {
                            name: '预算与审计',
                            code: 'L3-08',
                            sortOrder: 1,
                            items: [
                                { name: '规范使用', code: 'EI-15', maxScore: 3, baoshanFeature: '集团化资源共享' },
                                { name: '效能评估', code: 'EI-16', maxScore: 2, baoshanFeature: '托育资源新增（2025年目标85%托幼一体）' },
                            ],
                        },
                    ],
                },
            ],
        },
        {
            name: '学生发展',
            code: 'L1-05',
            description: '德智体美劳全面',
            weight: 20,
            sortOrder: 5,
            children: [
                {
                    name: '综合素质',
                    code: 'L2-09',
                    sortOrder: 1,
                    children: [
                        {
                            name: '品德与身心健康',
                            code: 'L3-09',
                            sortOrder: 1,
                            items: [
                                { name: '行为规范', code: 'EI-17', maxScore: 5, baoshanFeature: '心理健康达标校标准' },
                                { name: '心理教育', code: 'EI-18', maxScore: 5, baoshanFeature: '近视防控示范（活动月覆盖100%）' },
                            ],
                        },
                    ],
                },
                {
                    name: '个性成长',
                    code: 'L2-10',
                    sortOrder: 2,
                    children: [
                        {
                            name: '兴趣与实践',
                            code: 'L3-10',
                            sortOrder: 1,
                            items: [
                                { name: '社团活动', code: 'EI-19', maxScore: 5, baoshanFeature: '综合素质评价数字化（数字画像）' },
                                { name: '生涯规划', code: 'EI-20', maxScore: 5, baoshanFeature: '体育/艺术兴趣化改革' },
                            ],
                        },
                    ],
                },
            ],
        },
        {
            name: '学校发展',
            code: 'L1-06',
            description: '创新改革、特色',
            weight: 10,
            sortOrder: 6,
            children: [
                {
                    name: '文化建设',
                    code: 'L2-11',
                    sortOrder: 1,
                    children: [
                        {
                            name: '校风与内涵',
                            code: 'L3-11',
                            sortOrder: 1,
                            items: [
                                { name: '文化浸润', code: 'EI-21', maxScore: 3, baoshanFeature: '"一训三风"体系构建' },
                                { name: '品牌塑造', code: 'EI-22', maxScore: 2, baoshanFeature: '科研课题获奖（如国家级3+1项）' },
                            ],
                        },
                    ],
                },
                {
                    name: '合作与辐射',
                    code: 'L2-12',
                    sortOrder: 2,
                    children: [
                        {
                            name: '开放办学',
                            code: 'L3-12',
                            sortOrder: 1,
                            items: [
                                { name: '集团/学区合作', code: 'EI-23', maxScore: 3, baoshanFeature: '紧密型集团覆盖28所一贯制校' },
                                { name: '社区联动', code: 'EI-24', maxScore: 2, baoshanFeature: '城乡携手共进计划' },
                            ],
                        },
                    ],
                },
            ],
        },
    ];
    for (const l1Data of indicatorData) {
        let l1 = await l1Repo.findOne({ where: { code: l1Data.code } });
        if (!l1) {
            l1 = l1Repo.create({
                name: l1Data.name,
                code: l1Data.code,
                description: l1Data.description,
                weight: l1Data.weight,
                sortOrder: l1Data.sortOrder,
            });
            l1 = await l1Repo.save(l1);
        }
        for (const l2Data of l1Data.children || []) {
            let l2 = await l2Repo.findOne({ where: { code: l2Data.code } });
            if (!l2) {
                l2 = l2Repo.create({
                    name: l2Data.name,
                    code: l2Data.code,
                    sortOrder: l2Data.sortOrder,
                    parentId: l1.id,
                });
                l2 = await l2Repo.save(l2);
            }
            for (const l3Data of l2Data.children || []) {
                let l3 = await l3Repo.findOne({ where: { code: l3Data.code } });
                if (!l3) {
                    l3 = l3Repo.create({
                        name: l3Data.name,
                        code: l3Data.code,
                        sortOrder: l3Data.sortOrder,
                        parentId: l2.id,
                    });
                    l3 = await l3Repo.save(l3);
                }
                for (const itemData of l3Data.items || []) {
                    let item = await itemRepo.findOne({ where: { code: itemData.code } });
                    if (!item) {
                        item = itemRepo.create({
                            name: itemData.name,
                            code: itemData.code,
                            maxScore: itemData.maxScore,
                            baoshanFeature: itemData.baoshanFeature,
                            indicatorId: l3.id,
                        });
                        await itemRepo.save(item);
                    }
                }
            }
        }
    }
    console.log('Indicator system created');
    console.log('Seed completed!');
    await AppDataSource.destroy();
}
seed().catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
});
//# sourceMappingURL=seed.js.map