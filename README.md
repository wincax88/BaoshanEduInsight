# 上海市宝山区小学成熟度测评管理系统

基于《上海市义务教育阶段学校发展性督导评价指标》开发的小学成熟度测评管理系统。

## 技术栈

### 前端
- React 18
- TypeScript
- Ant Design 5
- Ant Design Pro 6
- UmiJS 4

### 后端
- Node.js
- NestJS
- TypeORM
- PostgreSQL
- JWT 认证

### 部署
- Docker
- Docker Compose
- MinIO (S3兼容存储)

## 项目结构

```
BaoshanEduInsight/
├── frontend/          # 前端项目 (Ant Design Pro)
├── backend/           # 后端项目 (NestJS)
├── docker-compose.yml # Docker 编排文件
└── README.md
```

## 快速开始

### 环境要求
- Node.js >= 18
- Docker & Docker Compose
- PostgreSQL 16 (或使用 Docker)

### 1. 启动数据库服务

```bash
# 启动 PostgreSQL 和 MinIO
docker-compose up -d postgres minio redis
```

### 2. 启动后端

```bash
cd backend

# 安装依赖
npm install

# 初始化数据库（首次运行）
npm run seed

# 启动开发服务
npm run start:dev
```

后端服务运行在 http://localhost:3000
API 文档: http://localhost:3000/api/docs

### 3. 启动前端

```bash
cd frontend

# 安装依赖
npm install

# 启动开发服务
npm run dev
```

前端服务运行在 http://localhost:8000

### 4. 默认账号

- 用户名: `admin`
- 密码: `admin123`

## 功能模块

### 已实现
- [x] 用户认证 (JWT)
- [x] 用户管理
- [x] 角色权限 (RBAC)
- [x] 学校管理
- [x] 教育集团管理
- [x] 指标体系管理 (6个一级指标、11个二级指标、25个三级指标、35个评价要素)
- [x] 测评任务管理
- [x] 评分管理

### 待开发
- [ ] 问卷调查
- [ ] 数据可视化图表
- [ ] 督导报告生成
- [ ] Excel 导入导出
- [ ] 文件上传 (MinIO)

## 指标体系

| 一级指标 | 权重 |
|---------|------|
| 学校治理 | 15分 |
| 课程教学 | 25分 |
| 队伍建设 | 15分 |
| 资源保障 | 15分 |
| 学生发展 | 20分 |
| 学校发展 | 10分 |
| **总计** | **100分** |

## API 接口

| 模块 | 路径 |
|------|------|
| 认证 | `/api/auth` |
| 用户 | `/api/users` |
| 角色 | `/api/roles` |
| 学校 | `/api/schools` |
| 指标 | `/api/indicators` |
| 测评 | `/api/assessments` |
| 评分 | `/api/scores` |

## Docker 部署

```bash
# 构建并启动所有服务
docker-compose up -d

# 查看日志
docker-compose logs -f
```

## 开发说明

### 后端开发
```bash
cd backend
npm run start:dev    # 开发模式
npm run build        # 构建
npm run start:prod   # 生产模式
```

### 前端开发
```bash
cd frontend
npm run dev          # 开发模式
npm run build        # 构建
npm run preview      # 预览构建结果
```

## License

MIT
