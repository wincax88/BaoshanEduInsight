import { useState, useEffect, useCallback } from 'react';
import { request } from '@umijs/max';
import { message } from 'antd';
import type { TaskInfo, EvaluationItem, ExistingScore, ScoreData, L1Indicator, L2Indicator, L3Indicator } from '../types';

interface UseTaskDataReturn {
  loading: boolean;
  taskInfo: TaskInfo | null;
  tasks: TaskInfo[];
  indicatorTree: L1Indicator[];
  existingScores: ExistingScore[];
  scores: Record<string, ScoreData>;
  setScores: React.Dispatch<React.SetStateAction<Record<string, ScoreData>>>;
  allEvaluationItems: EvaluationItem[];
  fetchTasks: () => Promise<void>;
  fetchTaskInfo: (id: string) => Promise<void>;
  fetchIndicatorTree: () => Promise<void>;
  fetchExistingScores: (id: string) => Promise<void>;
  refreshData: (taskId: string) => Promise<void>;
}

export function useTaskData(taskId?: string): UseTaskDataReturn {
  const [loading, setLoading] = useState(false);
  const [taskInfo, setTaskInfo] = useState<TaskInfo | null>(null);
  const [tasks, setTasks] = useState<TaskInfo[]>([]);
  const [indicatorTree, setIndicatorTree] = useState<L1Indicator[]>([]);
  const [existingScores, setExistingScores] = useState<ExistingScore[]>([]);
  const [scores, setScores] = useState<Record<string, ScoreData>>({});

  // 获取可自评的任务列表
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const res = await request('/api/assessments', {
        params: { pageSize: 100 },
      });
      const availableTasks = (res.data || []).filter(
        (t: TaskInfo) => t.status === 'draft' || t.status === 'self_evaluation',
      );
      setTasks(availableTasks);
    } catch (error) {
      message.error('获取任务列表失败');
    } finally {
      setLoading(false);
    }
  }, []);

  // 获取任务详情
  const fetchTaskInfo = useCallback(async (id: string) => {
    try {
      const res = await request(`/api/assessments/${id}`);
      setTaskInfo(res);
    } catch (error) {
      message.error('获取任务信息失败');
    }
  }, []);

  // 获取指标树
  const fetchIndicatorTree = useCallback(async () => {
    try {
      const res = await request('/api/indicators/tree');
      setIndicatorTree(res);
    } catch (error) {
      message.error('获取指标体系失败');
    }
  }, []);

  // 获取已有评分
  const fetchExistingScores = useCallback(async (id: string) => {
    try {
      const res = await request(`/api/scores/task/${id}`, {
        params: { scoreType: 'self' },
      });
      setExistingScores(res || []);
      const scoresMap: Record<string, ScoreData> = {};
      (res || []).forEach((s: ExistingScore) => {
        scoresMap[s.evaluationItemId] = {
          evaluationItemId: s.evaluationItemId,
          score: s.score,
          evidence: s.evidence || '',
          comment: s.comment || '',
          attachments: s.attachments || [],
        };
      });
      setScores(scoresMap);
    } catch (error) {
      message.error('获取评分失败');
    }
  }, []);

  // 刷新所有数据
  const refreshData = useCallback(async (id: string) => {
    setLoading(true);
    try {
      await Promise.all([fetchTaskInfo(id), fetchIndicatorTree(), fetchExistingScores(id)]);
    } finally {
      setLoading(false);
    }
  }, [fetchTaskInfo, fetchIndicatorTree, fetchExistingScores]);

  // 收集所有评价要素
  const allEvaluationItems: EvaluationItem[] = [];
  indicatorTree.forEach((l1: L1Indicator) => {
    l1.children?.forEach((l2: L2Indicator) => {
      l2.children?.forEach((l3: L3Indicator) => {
        l3.evaluationItems?.forEach((item: EvaluationItem) => {
          allEvaluationItems.push(item);
        });
      });
    });
  });

  // 初始化加载
  useEffect(() => {
    if (taskId) {
      refreshData(taskId);
    } else {
      fetchTasks();
    }
  }, [taskId]);

  return {
    loading,
    taskInfo,
    tasks,
    indicatorTree,
    existingScores,
    scores,
    setScores,
    allEvaluationItems,
    fetchTasks,
    fetchTaskInfo,
    fetchIndicatorTree,
    fetchExistingScores,
    refreshData,
  };
}
