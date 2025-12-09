import { PageContainer, ProCard } from '@ant-design/pro-components';
import { Spin, Button, Tag, Space, Popconfirm } from 'antd';
import { useState } from 'react';
import { useParams, history } from '@umijs/max';
import { SaveOutlined, SendOutlined, ArrowLeftOutlined } from '@ant-design/icons';

import { useTaskData } from './hooks/useTaskData';
import { useScoreActions } from './hooks/useScoreActions';
import { useProgressStats } from './components/ProgressStats';
import TaskSelector from './components/TaskSelector';
import ProgressStats from './components/ProgressStats';
import IndicatorTree from './components/IndicatorTree';
import ScoreForm from './components/ScoreForm';
import type { EvaluationItem } from './types';
import { statusMap } from './types';

const SelfEvaluation: React.FC = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const [selectedItem, setSelectedItem] = useState<EvaluationItem | null>(null);

  const {
    loading,
    taskInfo,
    tasks,
    indicatorTree,
    existingScores,
    scores,
    setScores,
    allEvaluationItems,
    fetchExistingScores,
  } = useTaskData(taskId);

  const { completedCount } = useProgressStats(allEvaluationItems, scores);

  const { saving, onSaveScore, onBatchSave, onSubmit, onStartEvaluation } = useScoreActions({
    taskId,
    scores,
    setScores,
    existingScores,
    fetchExistingScores,
    allEvaluationItems,
    completedCount,
  });

  // 未选择任务时显示任务选择界面
  if (!taskId) {
    return <TaskSelector loading={loading} tasks={tasks} />;
  }

  return (
    <PageContainer
      title={taskInfo?.name || '自评填报'}
      subTitle={
        taskInfo && (
          <Space>
            <Tag>{taskInfo.academicYear}</Tag>
            <Tag>{taskInfo.school?.name}</Tag>
            <Tag color={statusMap[taskInfo.status]?.color}>{statusMap[taskInfo.status]?.text}</Tag>
          </Space>
        )
      }
      extra={[
        <Button key="back" icon={<ArrowLeftOutlined />} onClick={() => history.push('/assessments/tasks')}>
          返回列表
        </Button>,
        taskInfo?.status === 'draft' && (
          <Button key="start" type="primary" onClick={onStartEvaluation}>
            开始自评
          </Button>
        ),
        taskInfo?.status === 'self_evaluation' && (
          <Button key="save" icon={<SaveOutlined />} loading={saving} onClick={onBatchSave}>
            保存全部
          </Button>
        ),
        taskInfo?.status === 'self_evaluation' && (
          <Popconfirm
            key="submit"
            title="确认提交自评？"
            description="提交后将进入督导评估阶段，自评数据将不可修改"
            onConfirm={onSubmit}
            okText="确认提交"
            cancelText="取消"
          >
            <Button type="primary" icon={<SendOutlined />} loading={saving}>
              提交自评
            </Button>
          </Popconfirm>
        ),
      ]}
    >
      <Spin spinning={loading}>
        <ProgressStats allEvaluationItems={allEvaluationItems} scores={scores} />

        <ProCard split="vertical">
          <IndicatorTree
            indicatorTree={indicatorTree}
            scores={scores}
            onSelect={setSelectedItem}
          />

          <ScoreForm
            selectedItem={selectedItem}
            taskInfo={taskInfo}
            scores={scores}
            saving={saving}
            onSave={onSaveScore}
          />
        </ProCard>
      </Spin>
    </PageContainer>
  );
};

export default SelfEvaluation;
