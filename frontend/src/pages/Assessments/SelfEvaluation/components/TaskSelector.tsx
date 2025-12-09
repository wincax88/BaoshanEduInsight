import { Alert, Empty, Spin, Space, Select, Button, Tag } from 'antd';
import { PageContainer, ProCard } from '@ant-design/pro-components';
import { history } from '@umijs/max';
import { useState } from 'react';
import type { TaskInfo } from '../types';
import { statusMap } from '../types';

interface TaskSelectorProps {
  loading: boolean;
  tasks: TaskInfo[];
}

const TaskSelector: React.FC<TaskSelectorProps> = ({ loading, tasks }) => {
  const [selectedTaskId, setSelectedTaskId] = useState<string>('');

  const onSelectTask = () => {
    if (selectedTaskId) {
      history.push(`/assessments/self-evaluation/${selectedTaskId}`);
    }
  };

  return (
    <PageContainer>
      <Alert
        message="自评填报说明"
        description="选择测评任务后，按照指标体系逐项填写自评分数和佐证材料。自评完成后提交审核。"
        type="info"
        showIcon
        style={{ marginBottom: 16 }}
      />
      <ProCard title="选择测评任务">
        <Spin spinning={loading}>
          {tasks.length > 0 ? (
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              <Select
                placeholder="请选择要进行自评的任务"
                style={{ width: '100%' }}
                size="large"
                value={selectedTaskId || undefined}
                onChange={setSelectedTaskId}
                options={tasks.map((t) => ({
                  label: (
                    <Space>
                      <span>{t.name}</span>
                      <Tag>{t.academicYear}</Tag>
                      <Tag>{t.school?.name}</Tag>
                      <Tag color={statusMap[t.status]?.color}>{statusMap[t.status]?.text}</Tag>
                    </Space>
                  ),
                  value: t.id,
                }))}
              />
              <Button type="primary" size="large" disabled={!selectedTaskId} onClick={onSelectTask}>
                开始自评
              </Button>
            </Space>
          ) : (
            <Empty description="暂无可自评的任务（仅草稿和自评中状态的任务可进行自评）" />
          )}
        </Spin>
      </ProCard>
    </PageContainer>
  );
};

export default TaskSelector;
