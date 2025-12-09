import { useState, useCallback } from 'react';
import { request, history } from '@umijs/max';
import { message } from 'antd';
import type { UploadFile } from 'antd/es/upload/interface';
import type { EvaluationItem, ScoreData, ExistingScore, ScoreFormValues } from '../types';

interface UseScoreActionsProps {
  taskId?: string;
  scores: Record<string, ScoreData>;
  setScores: React.Dispatch<React.SetStateAction<Record<string, ScoreData>>>;
  existingScores: ExistingScore[];
  fetchExistingScores: (id: string) => Promise<void>;
  allEvaluationItems: EvaluationItem[];
  completedCount: number;
}

interface UseScoreActionsReturn {
  saving: boolean;
  onSaveScore: (selectedItem: EvaluationItem, values: ScoreFormValues, fileList: UploadFile[]) => Promise<void>;
  onBatchSave: () => Promise<void>;
  onSubmit: () => Promise<void>;
  onStartEvaluation: () => Promise<void>;
}

export function useScoreActions({
  taskId,
  scores,
  setScores,
  existingScores,
  fetchExistingScores,
  allEvaluationItems,
  completedCount,
}: UseScoreActionsProps): UseScoreActionsReturn {
  const [saving, setSaving] = useState(false);

  // 保存单个评分
  const onSaveScore = useCallback(
    async (selectedItem: EvaluationItem, values: ScoreFormValues, fileList: UploadFile[]) => {
      if (!selectedItem || !taskId) return;

      try {
        setSaving(true);
        const attachments = fileList
          .filter((f) => f.status === 'done' && f.url)
          .map((f) => f.url as string);

        const existing = existingScores.find((s) => s.evaluationItemId === selectedItem.id);

        if (existing) {
          await request(`/api/scores/${existing.id}`, {
            method: 'PATCH',
            data: {
              score: values.score,
              evidence: values.evidence,
              comment: values.comment,
              attachments,
            },
          });
        } else {
          await request('/api/scores', {
            method: 'POST',
            data: {
              taskId,
              evaluationItemId: selectedItem.id,
              scoreType: 'self',
              score: values.score,
              evidence: values.evidence,
              comment: values.comment,
              attachments,
            },
          });
        }

        setScores((prev) => ({
          ...prev,
          [selectedItem.id]: {
            evaluationItemId: selectedItem.id,
            score: values.score,
            evidence: values.evidence || '',
            comment: values.comment || '',
            attachments,
          },
        }));

        await fetchExistingScores(taskId);
        message.success('保存成功');
      } catch (error) {
        message.error('保存失败');
      } finally {
        setSaving(false);
      }
    },
    [taskId, existingScores, setScores, fetchExistingScores],
  );

  // 批量保存所有评分
  const onBatchSave = useCallback(async () => {
    if (!taskId) return;

    const scoresToSave = Object.values(scores).filter(
      (s) => s.score !== undefined && s.score !== null,
    );

    if (scoresToSave.length === 0) {
      message.warning('没有需要保存的评分');
      return;
    }

    setSaving(true);
    try {
      await request('/api/scores/batch', {
        method: 'POST',
        data: {
          taskId,
          scoreType: 'self',
          scores: scoresToSave.map((s) => ({
            evaluationItemId: s.evaluationItemId,
            score: s.score,
            evidence: s.evidence,
            comment: s.comment,
          })),
        },
      });
      await fetchExistingScores(taskId);
      message.success('批量保存成功');
    } catch (error) {
      message.error('保存失败');
    } finally {
      setSaving(false);
    }
  }, [taskId, scores, fetchExistingScores]);

  // 提交自评
  const onSubmit = useCallback(async () => {
    if (!taskId) return;

    if (completedCount < allEvaluationItems.length) {
      message.warning(
        `还有 ${allEvaluationItems.length - completedCount} 项未评分，请完成所有评分后再提交`,
      );
      return;
    }

    setSaving(true);
    try {
      await onBatchSave();
      await request(`/api/assessments/${taskId}/status`, {
        method: 'PATCH',
        data: { status: 'supervision' },
      });
      await request(`/api/assessments/${taskId}/calculate-score`, {
        method: 'POST',
      });
      message.success('自评提交成功，任务已进入督导阶段');
      history.push('/assessments/tasks');
    } catch (error) {
      message.error('提交失败');
    } finally {
      setSaving(false);
    }
  }, [taskId, completedCount, allEvaluationItems.length, onBatchSave]);

  // 开始自评
  const onStartEvaluation = useCallback(async () => {
    if (!taskId) return;

    try {
      await request(`/api/assessments/${taskId}/status`, {
        method: 'PATCH',
        data: { status: 'self_evaluation' },
      });
      message.success('已开始自评');
      window.location.reload();
    } catch (error) {
      message.error('操作失败');
    }
  }, [taskId]);

  return {
    saving,
    onSaveScore,
    onBatchSave,
    onSubmit,
    onStartEvaluation,
  };
}
