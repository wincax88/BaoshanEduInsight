import { PageContainer, ProCard } from '@ant-design/pro-components';
import {
  Alert,
  Empty,
  Spin,
  Tree,
  Form,
  InputNumber,
  Input,
  Button,
  message,
  Progress,
  Statistic,
  Row,
  Col,
  Card,
  Tag,
  Collapse,
  Space,
  Popconfirm,
  Select,
  Upload,
} from 'antd';
import { useEffect, useState, useMemo } from 'react';
import { useParams, history, request } from '@umijs/max';
import { SaveOutlined, SendOutlined, ArrowLeftOutlined, UploadOutlined, DeleteOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';
import type { DataNode } from 'antd/es/tree';

interface TaskInfo {
  id: string;
  name: string;
  academicYear: string;
  school: { id: string; name: string };
  status: string;
  totalScore: number;
  selfEvaluationStartDate: string;
  selfEvaluationEndDate: string;
}

interface EvaluationItem {
  id: string;
  name: string;
  code: string;
  description: string;
  baoshanFeature: string;
  maxScore: number;
  scoringCriteria: string;
}

interface ScoreData {
  evaluationItemId: string;
  score: number;
  evidence: string;
  comment: string;
  attachments?: string[];
}

interface FileInfo {
  fileId: string;
  fileName: string;
  originalName: string;
  url: string;
}

interface ExistingScore {
  id: string;
  evaluationItemId: string;
  score: number;
  evidence: string;
  comment: string;
  attachments?: string[];
}

const statusMap: Record<string, { text: string; color: string }> = {
  draft: { text: '草稿', color: 'default' },
  self_evaluation: { text: '自评中', color: 'processing' },
  supervision: { text: '督导中', color: 'warning' },
  review: { text: '审核中', color: 'orange' },
  completed: { text: '已完成', color: 'success' },
};

const SelfEvaluation: React.FC = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [taskInfo, setTaskInfo] = useState<TaskInfo | null>(null);
  const [indicatorTree, setIndicatorTree] = useState<any[]>([]);
  const [treeData, setTreeData] = useState<DataNode[]>([]);
  const [selectedItem, setSelectedItem] = useState<EvaluationItem | null>(null);
  const [scores, setScores] = useState<Record<string, ScoreData>>({});
  const [existingScores, setExistingScores] = useState<ExistingScore[]>([]);
  const [tasks, setTasks] = useState<TaskInfo[]>([]);
  const [selectedTaskId, setSelectedTaskId] = useState<string>('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [form] = Form.useForm();

  // 获取可自评的任务列表
  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await request('/api/assessments', {
        params: { pageSize: 100 },
      });
      // 只显示草稿和自评中状态的任务
      const availableTasks = (res.data || []).filter(
        (t: TaskInfo) => t.status === 'draft' || t.status === 'self_evaluation',
      );
      setTasks(availableTasks);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // 获取任务详情
  const fetchTaskInfo = async (id: string) => {
    try {
      const res = await request(`/api/assessments/${id}`);
      setTaskInfo(res);
    } catch (error) {
      message.error('获取任务信息失败');
    }
  };

  // 获取指标树
  const fetchIndicatorTree = async () => {
    try {
      const res = await request('/api/indicators/tree');
      setIndicatorTree(res);
      setTreeData(transformToTreeData(res));
    } catch (error) {
      message.error('获取指标体系失败');
    }
  };

  // 获取已有评分
  const fetchExistingScores = async (id: string) => {
    try {
      const res = await request(`/api/scores/task/${id}`, {
        params: { scoreType: 'self' },
      });
      setExistingScores(res || []);
      // 将已有评分转换为 scores 状态
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
      console.error('获取评分失败', error);
    }
  };

  // 转换为树形数据
  const transformToTreeData = (data: any[]): DataNode[] => {
    return data.map((l1: any) => ({
      key: `l1-${l1.id}`,
      title: `${l1.code} ${l1.name} (${l1.weight}分)`,
      selectable: false,
      children: l1.children?.map((l2: any) => ({
        key: `l2-${l2.id}`,
        title: `${l2.code} ${l2.name}`,
        selectable: false,
        children: l2.children?.map((l3: any) => ({
          key: `l3-${l3.id}`,
          title: `${l3.code} ${l3.name}`,
          selectable: false,
          children: l3.evaluationItems?.map((item: any) => ({
            key: `item-${item.id}`,
            title: `${item.code} ${item.name} (${item.maxScore}分)`,
            data: item,
            isLeaf: true,
          })),
        })),
      })),
    }));
  };

  // 收集所有评价要素
  const allEvaluationItems = useMemo(() => {
    const items: EvaluationItem[] = [];
    indicatorTree.forEach((l1) => {
      l1.children?.forEach((l2: any) => {
        l2.children?.forEach((l3: any) => {
          l3.evaluationItems?.forEach((item: any) => {
            items.push(item);
          });
        });
      });
    });
    return items;
  }, [indicatorTree]);

  // 计算总分和完成进度
  const { totalMaxScore, currentTotalScore, completedCount, progress } = useMemo(() => {
    const total = allEvaluationItems.reduce((sum, item) => sum + Number(item.maxScore), 0);
    let current = 0;
    let completed = 0;
    allEvaluationItems.forEach((item) => {
      const scoreData = scores[item.id];
      if (scoreData && scoreData.score !== undefined && scoreData.score !== null) {
        current += Number(scoreData.score);
        completed++;
      }
    });
    return {
      totalMaxScore: total,
      currentTotalScore: current,
      completedCount: completed,
      progress: allEvaluationItems.length > 0 ? Math.round((completed / allEvaluationItems.length) * 100) : 0,
    };
  }, [allEvaluationItems, scores]);

  useEffect(() => {
    if (taskId) {
      setLoading(true);
      Promise.all([fetchTaskInfo(taskId), fetchIndicatorTree(), fetchExistingScores(taskId)]).finally(() =>
        setLoading(false),
      );
    } else {
      fetchTasks();
    }
  }, [taskId]);

  // 选择指标项
  const onSelectNode = (selectedKeys: React.Key[], info: any) => {
    const nodeData = info.node?.data;
    if (nodeData) {
      setSelectedItem(nodeData);
      const scoreData = scores[nodeData.id];
      form.setFieldsValue({
        score: scoreData?.score,
        evidence: scoreData?.evidence || '',
        comment: scoreData?.comment || '',
      });
      // 设置已上传的文件列表
      const attachments = scoreData?.attachments || [];
      setFileList(
        attachments.map((url: string, index: number) => ({
          uid: `-${index}`,
          name: url.split('/').pop() || `附件${index + 1}`,
          status: 'done' as const,
          url: url,
        })),
      );
    }
  };

  // 保存单个评分
  const onSaveScore = async () => {
    if (!selectedItem || !taskId) return;

    try {
      const values = await form.validateFields();
      setSaving(true);

      // 收集附件URL
      const attachments = fileList
        .filter((f) => f.status === 'done' && f.url)
        .map((f) => f.url as string);

      // 检查是否已存在评分
      const existing = existingScores.find((s) => s.evaluationItemId === selectedItem.id);

      if (existing) {
        // 更新评分
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
        // 创建新评分
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

      // 更新本地状态
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

      // 刷新已有评分
      await fetchExistingScores(taskId);
      message.success('保存成功');
    } catch (error) {
      message.error('保存失败');
    } finally {
      setSaving(false);
    }
  };

  // 批量保存所有评分
  const onBatchSave = async () => {
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
  };

  // 提交自评
  const onSubmit = async () => {
    if (!taskId) return;

    if (completedCount < allEvaluationItems.length) {
      message.warning(`还有 ${allEvaluationItems.length - completedCount} 项未评分，请完成所有评分后再提交`);
      return;
    }

    setSaving(true);
    try {
      // 先保存所有评分
      await onBatchSave();
      // 更新任务状态为督导中
      await request(`/api/assessments/${taskId}/status`, {
        method: 'PATCH',
        data: { status: 'supervision' },
      });
      // 计算总分
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
  };

  // 开始自评（草稿 -> 自评中）
  const onStartEvaluation = async () => {
    if (!taskId) return;

    try {
      await request(`/api/assessments/${taskId}/status`, {
        method: 'PATCH',
        data: { status: 'self_evaluation' },
      });
      await fetchTaskInfo(taskId);
      message.success('已开始自评');
    } catch (error) {
      message.error('操作失败');
    }
  };

  // 选择任务并跳转
  const onSelectTask = () => {
    if (selectedTaskId) {
      history.push(`/assessments/self-evaluation/${selectedTaskId}`);
    }
  };

  // 未选择任务时显示任务选择界面
  if (!taskId) {
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
        {/* 统计卡片 */}
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={6}>
            <Card>
              <Statistic title="完成进度" value={progress} suffix="%" />
              <Progress percent={progress} size="small" showInfo={false} />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="已评分项"
                value={completedCount}
                suffix={`/ ${allEvaluationItems.length}`}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic title="当前得分" value={currentTotalScore.toFixed(2)} precision={2} />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic title="满分" value={totalMaxScore} suffix="分" />
            </Card>
          </Col>
        </Row>

        {/* 主体内容 */}
        <ProCard split="vertical">
          {/* 左侧指标树 */}
          <ProCard title="指标体系" colSpan="40%" headerBordered>
            {treeData.length > 0 ? (
              <Tree
                showLine
                defaultExpandAll
                treeData={treeData}
                onSelect={onSelectNode}
                style={{ maxHeight: 500, overflow: 'auto' }}
                titleRender={(node: any) => {
                  const itemId = node.key?.toString().replace('item-', '');
                  const hasScore = scores[itemId]?.score !== undefined;
                  return (
                    <span style={{ color: node.isLeaf && hasScore ? '#52c41a' : undefined }}>
                      {node.title}
                      {node.isLeaf && hasScore && ' ✓'}
                    </span>
                  );
                }}
              />
            ) : (
              <Empty description="暂无指标数据" />
            )}
          </ProCard>

          {/* 右侧评分表单 */}
          <ProCard title="评分详情" headerBordered>
            {selectedItem ? (
              <div>
                <Collapse
                  defaultActiveKey={['info']}
                  style={{ marginBottom: 16 }}
                  items={[
                    {
                      key: 'info',
                      label: '评价要素信息',
                      children: (
                        <div>
                          <p>
                            <strong>名称：</strong>
                            {selectedItem.name}
                          </p>
                          <p>
                            <strong>编码：</strong>
                            {selectedItem.code}
                          </p>
                          <p>
                            <strong>满分：</strong>
                            {selectedItem.maxScore} 分
                          </p>
                          {selectedItem.description && (
                            <p>
                              <strong>描述：</strong>
                              {selectedItem.description}
                            </p>
                          )}
                          {selectedItem.baoshanFeature && (
                            <p>
                              <strong>宝山区特色检测点：</strong>
                              <Tag color="blue">{selectedItem.baoshanFeature}</Tag>
                            </p>
                          )}
                          {selectedItem.scoringCriteria && (
                            <p>
                              <strong>评分标准：</strong>
                              {selectedItem.scoringCriteria}
                            </p>
                          )}
                        </div>
                      ),
                    },
                  ]}
                />

                <Form form={form} layout="vertical">
                  <Form.Item
                    name="score"
                    label={`评分（满分 ${selectedItem.maxScore} 分）`}
                    rules={[
                      { required: true, message: '请输入评分' },
                      {
                        type: 'number',
                        max: selectedItem.maxScore,
                        message: `评分不能超过 ${selectedItem.maxScore} 分`,
                      },
                      { type: 'number', min: 0, message: '评分不能为负数' },
                    ]}
                  >
                    <InputNumber
                      min={0}
                      max={selectedItem.maxScore}
                      step={0.5}
                      style={{ width: '100%' }}
                      placeholder={`请输入0-${selectedItem.maxScore}之间的分数`}
                      disabled={taskInfo?.status !== 'self_evaluation'}
                    />
                  </Form.Item>

                  <Form.Item name="evidence" label="佐证材料说明">
                    <Input.TextArea
                      rows={4}
                      placeholder="请描述支撑该评分的佐证材料（如相关文档、数据、活动记录等）"
                      disabled={taskInfo?.status !== 'self_evaluation'}
                    />
                  </Form.Item>

                  <Form.Item name="comment" label="备注">
                    <Input.TextArea
                      rows={2}
                      placeholder="其他需要说明的内容"
                      disabled={taskInfo?.status !== 'self_evaluation'}
                    />
                  </Form.Item>

                  <Form.Item label="附件材料">
                    <Upload
                      fileList={fileList}
                      action="/api/files/upload?folder=assessments"
                      headers={{
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                      }}
                      onChange={({ file, fileList: newFileList }) => {
                        setFileList(newFileList);
                        if (file.status === 'done' && file.response) {
                          const updatedList = newFileList.map((f) => {
                            if (f.uid === file.uid) {
                              return {
                                ...f,
                                url: file.response.url,
                              };
                            }
                            return f;
                          });
                          setFileList(updatedList);
                        }
                      }}
                      onRemove={(file) => {
                        setFileList(fileList.filter((f) => f.uid !== file.uid));
                      }}
                      disabled={taskInfo?.status !== 'self_evaluation'}
                    >
                      {taskInfo?.status === 'self_evaluation' && (
                        <Button icon={<UploadOutlined />} loading={uploading}>
                          上传附件
                        </Button>
                      )}
                    </Upload>
                    <div style={{ marginTop: 8, color: '#999', fontSize: 12 }}>
                      支持上传图片、PDF、Word等文件，单个文件不超过10MB
                    </div>
                  </Form.Item>

                  {taskInfo?.status === 'self_evaluation' && (
                    <Form.Item>
                      <Button type="primary" onClick={onSaveScore} loading={saving}>
                        <SaveOutlined /> 保存此项评分
                      </Button>
                    </Form.Item>
                  )}
                </Form>
              </div>
            ) : (
              <Empty description="请从左侧选择评价要素进行评分" />
            )}
          </ProCard>
        </ProCard>
      </Spin>
    </PageContainer>
  );
};

export default SelfEvaluation;
