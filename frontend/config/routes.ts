/**
 * @name umi 的路由配置
 * @description 宝山区小学成熟度测评管理系统路由配置
 */
export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        name: 'login',
        path: '/user/login',
        component: './user/login',
      },
    ],
  },
  {
    path: '/dashboard',
    name: '工作台',
    icon: 'dashboard',
    component: './Dashboard',
  },
  {
    path: '/schools',
    name: '学校管理',
    icon: 'bank',
    routes: [
      {
        path: '/schools',
        redirect: '/schools/list',
      },
      {
        path: '/schools/list',
        name: '学校列表',
        component: './Schools/List',
      },
      {
        path: '/schools/groups',
        name: '教育集团',
        component: './Schools/Groups',
      },
    ],
  },
  {
    path: '/indicators',
    name: '指标管理',
    icon: 'apartment',
    component: './Indicators',
  },
  {
    path: '/assessments',
    name: '测评管理',
    icon: 'audit',
    routes: [
      {
        path: '/assessments',
        redirect: '/assessments/tasks',
      },
      {
        path: '/assessments/tasks',
        name: '测评任务',
        component: './Assessments/Tasks',
      },
      {
        path: '/assessments/self-evaluation',
        name: '自评填报',
        component: './Assessments/SelfEvaluation',
      },
      {
        path: '/assessments/supervision',
        name: '督导评估',
        component: './Assessments/Supervision',
      },
    ],
  },
  {
    path: '/statistics',
    name: '统计分析',
    icon: 'barChart',
    component: './Statistics',
  },
  {
    path: '/system',
    name: '系统管理',
    icon: 'setting',
    access: 'canAdmin',
    routes: [
      {
        path: '/system',
        redirect: '/system/users',
      },
      {
        path: '/system/users',
        name: '用户管理',
        component: './System/Users',
      },
      {
        path: '/system/roles',
        name: '角色管理',
        component: './System/Roles',
      },
    ],
  },
  {
    path: '/',
    redirect: '/dashboard',
  },
  {
    component: '404',
    layout: false,
    path: './*',
  },
];
