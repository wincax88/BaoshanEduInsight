export interface TaskInfo {
  id: string;
  name: string;
  academicYear: string;
  school: { id: string; name: string };
  status: string;
  totalScore: number;
  selfEvaluationStartDate: string;
  selfEvaluationEndDate: string;
}

export interface EvaluationItem {
  id: string;
  name: string;
  code: string;
  description: string;
  baoshanFeature: string;
  maxScore: number;
  scoringCriteria: string;
}

// 三级指标接口
export interface L3Indicator {
  id: string;
  name: string;
  code: string;
  description?: string;
  evaluationItems?: EvaluationItem[];
}

// 二级指标接口
export interface L2Indicator {
  id: string;
  name: string;
  code: string;
  description?: string;
  children?: L3Indicator[];
}

// 一级指标接口
export interface L1Indicator {
  id: string;
  name: string;
  code: string;
  weight: number;
  description?: string;
  children?: L2Indicator[];
}

export interface ScoreData {
  evaluationItemId: string;
  score: number;
  evidence: string;
  comment: string;
  attachments?: string[];
}

export interface ExistingScore {
  id: string;
  evaluationItemId: string;
  score: number;
  evidence: string;
  comment: string;
  attachments?: string[];
}

// 表单值接口
export interface ScoreFormValues {
  score: number;
  evidence?: string;
  comment?: string;
}

export const statusMap: Record<string, { text: string; color: string }> = {
  draft: { text: '草稿', color: 'default' },
  self_evaluation: { text: '自评中', color: 'processing' },
  supervision: { text: '督导中', color: 'warning' },
  review: { text: '审核中', color: 'orange' },
  completed: { text: '已完成', color: 'success' },
};
