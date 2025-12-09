import { PageContainer, ProCard } from '@ant-design/pro-components';
import {
  Alert,
  Empty,
  Spin,
  Table,
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
  Space,
  Popconfirm,
  Select,
  Divider,
  Descriptions,
} from 'antd';
import { useEffect, useState, useMemo } from 'react';
import { useParams, history, request } from '@umijs/max';
import { SaveOutlined, SendOutlined, ArrowLeftOutlined, CheckCircleOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

interface TaskInfo {
  id: string;
  name: string;
  academicYear: string;
  school: { id: string; name: string };
  status: string;
  totalScore: number;
  selfEvaluationStartDate: string;
  selfEvaluationEndDate: string;
  supervisionOpinion: string;
}

interface EvaluationItem {
  id: string;
  name: string;
  code: string;
  description: string;
  baoshanFeature: string;
  maxScore: number;
  scoringCriteria: string;
  l1Name?: string;
  l2Name?: string;
  l3Name?: string;
}

interface ScoreRecord {
  evaluationItemId: string;
  selfScore: number | null;
  supervisionScore: number | null;
  selfEvidence: string;
  supervisionEvidence: string;
  supervisionComment: string;
}

interface ExistingScore {
  id: string;
  evaluationItemId: string;
  scoreType: 'self' | 'supervision';
  score: number;
  evidence: string;
  comment: string;
}

const statusMap: Record<string, { text: string; color: string }> = {
  draft: { text: '草稿', color: 'default' },
  self_evaluation: { text: '自评中', color: 'processing' },
  supervision: { text: '督导中', color: 'warning' },
  review: { text: '审核中', color: 'orange' },
  completed: { text: '已完成', color: 'success' },
};

const Supervision: React.FC = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [taskInfo, setTaskInfo] = useState<TaskInfo | null>(null);
  const [indicatorTree, setIndicatorTree] = useState<any[]>([]);
  const [allItems, setAllItems] = useState<EvaluationItem[]>([]);
  const [scores, setScores] = useState<Record<string, ScoreRecord>>({});
  const [existingScores, setExistingScores] = useState<ExistingScore[]>([]);
  const [tasks, setTasks] = useState<TaskInfo[]>([]);
  const [selectedTaskId, setSelectedTaskId] = useState<string>('');
  const [supervisionOpinion, setSupervisionOpinion] = useState<string>('');
  const [editingKey, setEditingKey] = useState<string>('');
  const [form] = Form.useForm();

  // 获取可督导的任务列表
  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await request('/api/assessments', {
        params: { pageSize: 100 },
      });
      // 只显示督导中状态的任务
      const availableTasks = (res.data || []).filter((t: TaskInfo) => t.status === 'supervision');
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
      setSupervisionOpinion(res.supervisionOpinion || '');
    } catch (error) {
      message.error('获取任务信息失败');
    }
  };

  // 获取指标树并展开为列表
  const fetchIndicatorTree = async () => {
    try {
      const res = await request('/api/indicators/tree');
      setIndicatorTree(res);

      // 展开为评价要素列表
      const items: EvaluationItem[] = [];
      res.forEach((l1: any) => {
        l1.children?.forEach((l2: any) => {
          l2.children?.forEach((l3: any) => {
            l3.evaluationItems?.forEach((item: any) => {
              items.push({
                ...item,
                l1Name: l1.name,
                l2Name: l2.name,
                l3Name: l3.name,
              });
            });
          });
        });
      });
      setAllItems(items);
    } catch (error) {
      message.error('获取指标体系失败');
    }
  };

  // 获取已有评分
  const fetchExistingScores = async (id: string) => {
    try {
      const res = await request(`/api/scores/task/${id}`);
      setExistingScores(res || []);

      // 组织评分数据
      const scoresMap: Record<string, ScoreRecord> = {};
      (res || []).forEach((s: ExistingScore) => {
        if (!scoresMap[s.evaluationItemId]) {
          scoresMap[s.evaluationItemId] = {
            evaluationItemId: s.evaluationItemId,
            selfScore: null,
            supervisionScore: null,
            selfEvidence: '',
            supervisionEvidence: '',
            supervisionComment: '',
          };
        }
        if (s.scoreType === 'self') {
          scoresMap[s.evaluationItemId].selfScore = s.score;
          scoresMap[s.evaluationItemId].selfEvidence = s.evidence || '';
        } else if (s.scoreType === 'supervision') {
          scoresMap[s.evaluationItemId].supervisionScore = s.score;
          scoresMap[s.evaluationItemId].supervisionEvidence = s.evidence || '';
          scoresMap[s.evaluationItemId].supervisionComment = s.comment || '';
        }
      });
      setScores(scoresMap);
    } catch (error) {
      console.error('获取评分失败', error);
    }
  };

  // 计算统计数据
  const statistics = useMemo(() => {
    const totalMaxScore = allItems.reduce((sum, item) => sum + Number(item.maxScore), 0);
    let selfTotalScore = 0;
    let supervisionTotalScore = 0;
    let completedCount = 0;

    allItems.forEach((item) => {
      const scoreData = scores[item.id];
      if (scoreData?.selfScore !== null && scoreData?.selfScore !== undefined) {
        selfTotalScore += Number(scoreData.selfScore);
      }
      if (scoreData?.supervisionScore !== null && scoreData?.supervisionScore !== undefined) {
        supervisionTotalScore += Number(scoreData.supervisionScore);
        completedCount++;
      }
    });

    return {
      totalMaxScore,
      selfTotalScore,
      supervisionTotalScore,
      completedCount,
      progress: allItems.length > 0 ? Math.round((completedCount / allItems.length) * 100) : 0,
    };
  }, [allItems, scores]);

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

  // 保存单项督导评分
  const onSaveScore = async (item: EvaluationItem, values: any) => {
    if (!taskId) return;

    try {
      setSaving(true);
      // 检查是否已存在督导评分
      const existing = existingScores.find(
        (s) => s.evaluationItemId === item.id && s.scoreType === 'supervision',
      );

      if (existing) {
        await request(`/api/scores/${existing.id}`, {
          method: 'PATCH',
          data: {
            score: values.supervisionScore,
            evidence: values.supervisionEvidence,
            comment: values.supervisionComment,
          },
        });
      } else {
        await request('/api/scores', {
          method: 'POST',
          data: {
            taskId,
            evaluationItemId: item.id,
            scoreType: 'supervision',
            score: values.supervisionScore,
            evidence: values.supervisionEvidence,
            comment: values.supervisionComment,
          },
        });
      }

      // 更新本地状态
      setScores((prev) => ({
        ...prev,
        [item.id]: {
          ...prev[item.id],
          supervisionScore: values.supervisionScore,
          supervisionEvidence: values.supervisionEvidence || '',
          supervisionComment: values.supervisionComment || '',
        },
      }));

      await fetchExistingScores(taskId);
      message.success('保存成功');
      setEditingKey('');
    } catch (error) {
      message.error('保存失败');
    } finally {
      setSaving(false);
    }
  };

  // 采用自评分数
  const onAdoptSelfScore = async (item: EvaluationItem) => {
    const scoreData = scores[item.id];
    if (scoreData?.selfScore === null || scoreData?.selfScore === undefined) {
      message.warning('该项无自评分数');
      return;
    }

    await onSaveScore(item, {
      supervisionScore: scoreData.selfScore,
      supervisionEvidence: scoreData.selfEvidence,
      supervisionComment: '采用自评分数',
    });
  };

  // 批量采用自评分数
  const onBatchAdoptSelfScore = async () => {
    if (!taskId) return;

    const scoresToCreate = allItems
      .filter((item) => {
        const scoreData = scores[item.id];
        return (
          scoreData?.selfScore !== null &&
          scoreData?.selfScore !== undefined &&
          (scoreData?.supervisionScore === null || scoreData?.supervisionScore === undefined)
        );
      })
      .map((item) => ({
        evaluationItemId: item.id,
        score: scores[item.id].selfScore,
        evidence: scores[item.id].selfEvidence,
        comment: '采用自评分数',
      }));

    if (scoresToCreate.length === 0) {
      message.info('没有需要采用的自评分数');
      return;
    }

    setSaving(true);
    try {
      await request('/api/scores/batch', {
        method: 'POST',
        data: {
          taskId,
          scoreType: 'supervision',
          scores: scoresToCreate,
        },
      });
      await fetchExistingScores(taskId);
      message.success(`已采用 ${scoresToCreate.length} 项自评分数`);
    } catch (error) {
      message.error('操作失败');
    } finally {
      setSaving(false);
    }
  };

  // 保存督导意见
  const onSaveOpinion = async () => {
    if (!taskId) return;

    try {
      await request(`/api/assessments/${taskId}`, {
        method: 'PATCH',
        data: { supervisionOpinion },
      });
      message.success('督导意见保存成功');
    } catch (error) {
      message.error('保存失败');
    }
  };

  // 提交督导评估
  const onSubmit = async () => {
    if (!taskId) return;

    if (statistics.completedCount < allItems.length) {
      message.warning(
        `还有 ${allItems.length - statistics.completedCount} 项未评分，请完成所有评分后再提交`,
      );
      return;
    }

    setSaving(true);
    try {
      // 保存督导意见
      await request(`/api/assessments/${taskId}`, {
        method: 'PATCH',
        data: { supervisionOpinion },
      });
      // 更新任务状态为已完成
      await request(`/api/assessments/${taskId}/status`, {
        method: 'PATCH',
        data: { status: 'completed' },
      });
      // 计算总分
      await request(`/api/assessments/${taskId}/calculate-score`, {
        method: 'POST',
      });
      message.success('督导评估提交成功');
      history.push('/assessments/tasks');
    } catch (error) {
      message.error('提交失败');
    } finally {
      setSaving(false);
    }
  };

  // 选择任务并跳转
  const onSelectTask = () => {
    if (selectedTaskId) {
      history.push(`/assessments/supervision/${selectedTaskId}`);
    }
  };

  // 表格列定义
  const columns: ColumnsType<EvaluationItem> = [
    {
      title: '指标',
      key: 'indicator',
      width: 200,
      fixed: 'left',
      render: (_, record) => (
        <div>
          <div style={{ fontSize: 12, color: '#999' }}>
            {record.l1Name} / {record.l2Name}
          </div>
          <div>{record.l3Name}</div>
        </div>
      ),
    },
    {
      title: '评价要素',
      dataIndex: 'name',
      key: 'name',
      width: 180,
      render: (text, record) => (
        <div>
          <div>{text}</div>
          <div style={{ fontSize: 12, color: '#999' }}>{record.code}</div>
        </div>
      ),
    },
    {
      title: '满分',
      dataIndex: 'maxScore',
      key: 'maxScore',
      width: 70,
      align: 'center',
    },
    {
      title: '自评分',
      key: 'selfScore',
      width: 80,
      align: 'center',
      render: (_, record) => {
        const scoreData = scores[record.id];
        return scoreData?.selfScore !== null && scoreData?.selfScore !== undefined ? (
          <Tag color="blue">{scoreData.selfScore}</Tag>
        ) : (
          '-'
        );
      },
    },
    {
      title: '督导分',
      key: 'supervisionScore',
      width: 100,
      align: 'center',
      render: (_, record) => {
        const scoreData = scores[record.id];
        const isEditing = editingKey === record.id;

        if (isEditing) {
          return (
            <Form.Item
              name="supervisionScore"
              style={{ margin: 0 }}
              rules={[{ required: true, message: '请输入分数' }]}
            >
              <InputNumber min={0} max={record.maxScore} step={0.5} size="small" style={{ width: 70 }} />
            </Form.Item>
          );
        }

        return scoreData?.supervisionScore !== null && scoreData?.supervisionScore !== undefined ? (
          <Tag color="green">{scoreData.supervisionScore}</Tag>
        ) : (
          <Tag>待评</Tag>
        );
      },
    },
    {
      title: '差异',
      key: 'diff',
      width: 80,
      align: 'center',
      render: (_, record) => {
        const scoreData = scores[record.id];
        if (
          scoreData?.selfScore !== null &&
          scoreData?.selfScore !== undefined &&
          scoreData?.supervisionScore !== null &&
          scoreData?.supervisionScore !== undefined
        ) {
          const diff = Number(scoreData.supervisionScore) - Number(scoreData.selfScore);
          if (diff === 0) return <span style={{ color: '#52c41a' }}>0</span>;
          return (
            <span style={{ color: diff > 0 ? '#52c41a' : '#ff4d4f' }}>
              {diff > 0 ? '+' : ''}
              {diff.toFixed(1)}
            </span>
          );
        }
        return '-';
      },
    },
    {
      title: '督导意见',
      key: 'comment',
      width: 150,
      render: (_, record) => {
        const scoreData = scores[record.id];
        const isEditing = editingKey === record.id;

        if (isEditing) {
          return (
            <Form.Item name="supervisionComment" style={{ margin: 0 }}>
              <Input.TextArea rows={1} placeholder="评语" style={{ width: 140 }} />
            </Form.Item>
          );
        }

        return scoreData?.supervisionComment || '-';
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      fixed: 'right',
      render: (_, record) => {
        const isEditing = editingKey === record.id;
        const scoreData = scores[record.id];

        if (isEditing) {
          return (
            <Space>
              <Button
                type="primary"
                size="small"
                loading={saving}
                onClick={async () => {
                  try {
                    const values = await form.validateFields();
                    await onSaveScore(record, values);
                  } catch (e) {
                    // validation failed
                  }
                }}
              >
                保存
              </Button>
              <Button size="small" onClick={() => setEditingKey('')}>
                取消
              </Button>
            </Space>
          );
        }

        return (
          <Space>
            <Button
              type="link"
              size="small"
              onClick={() => {
                setEditingKey(record.id);
                form.setFieldsValue({
                  supervisionScore: scoreData?.supervisionScore,
                  supervisionEvidence: scoreData?.supervisionEvidence || '',
                  supervisionComment: scoreData?.supervisionComment || '',
                });
              }}
              disabled={taskInfo?.status !== 'supervision'}
            >
              评分
            </Button>
            {scoreData?.selfScore !== null && scoreData?.selfScore !== undefined && (
              <Button
                type="link"
                size="small"
                onClick={() => onAdoptSelfScore(record)}
                disabled={taskInfo?.status !== 'supervision'}
              >
                采用自评
              </Button>
            )}
          </Space>
        );
      },
    },
  ];

  // 未选择任务时显示任务选择界面
  if (!taskId) {
    return (
      <PageContainer>
        <Alert
          message="督导评估说明"
          description="督导人员可在此进行现场督导评估，对学校自评结果进行复核打分，并填写督导意见。"
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
        />
        <ProCard title="选择测评任务">
          <Spin spinning={loading}>
            {tasks.length > 0 ? (
              <Space direction="vertical" style={{ width: '100%' }} size="large">
                <Select
                  placeholder="请选择要进行督导评估的任务"
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
                  开始督导评估
                </Button>
              </Space>
            ) : (
              <Empty description="暂无待督导的任务（仅督导中状态的任务可进行督导评估）" />
            )}
          </Spin>
        </ProCard>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title={taskInfo?.name || '督导评估'}
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
        taskInfo?.status === 'supervision' && (
          <Button key="adopt" onClick={onBatchAdoptSelfScore} loading={saving}>
            批量采用自评分数
          </Button>
        ),
        taskInfo?.status === 'supervision' && (
          <Popconfirm
            key="submit"
            title="确认提交督导评估？"
            description="提交后该任务将标记为已完成"
            onConfirm={onSubmit}
            okText="确认提交"
            cancelText="取消"
          >
            <Button type="primary" icon={<SendOutlined />} loading={saving}>
              提交督导评估
            </Button>
          </Popconfirm>
        ),
      ]}
    >
      <Spin spinning={loading}>
        {/* 统计卡片 */}
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={5}>
            <Card>
              <Statistic title="评估进度" value={statistics.progress} suffix="%" />
              <Progress percent={statistics.progress} size="small" showInfo={false} />
            </Card>
          </Col>
          <Col span={5}>
            <Card>
              <Statistic
                title="已评项"
                value={statistics.completedCount}
                suffix={`/ ${allItems.length}`}
              />
            </Card>
          </Col>
          <Col span={5}>
            <Card>
              <Statistic
                title="自评总分"
                value={statistics.selfTotalScore.toFixed(2)}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col span={5}>
            <Card>
              <Statistic
                title="督导总分"
                value={statistics.supervisionTotalScore.toFixed(2)}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col span={4}>
            <Card>
              <Statistic title="满分" value={statistics.totalMaxScore} suffix="分" />
            </Card>
          </Col>
        </Row>

        {/* 评分表格 */}
        <ProCard title="评分详情" headerBordered style={{ marginBottom: 16 }}>
          <Form form={form} component={false}>
            <Table
              rowKey="id"
              columns={columns}
              dataSource={allItems}
              pagination={false}
              scroll={{ x: 1100 }}
              size="small"
              rowClassName={(record) => {
                const scoreData = scores[record.id];
                if (scoreData?.supervisionScore !== null && scoreData?.supervisionScore !== undefined) {
                  return 'row-completed';
                }
                return '';
              }}
            />
          </Form>
        </ProCard>

        {/* 督导意见 */}
        <ProCard title="督导总体意见" headerBordered>
          <Input.TextArea
            rows={4}
            value={supervisionOpinion}
            onChange={(e) => setSupervisionOpinion(e.target.value)}
            placeholder="请填写督导总体意见、改进建议等"
            disabled={taskInfo?.status !== 'supervision'}
          />
          {taskInfo?.status === 'supervision' && (
            <Button type="primary" style={{ marginTop: 16 }} onClick={onSaveOpinion}>
              <SaveOutlined /> 保存意见
            </Button>
          )}
        </ProCard>
      </Spin>

      <style>{`
        .row-completed {
          background-color: #f6ffed;
        }
      `}</style>
    </PageContainer>
  );
};

export default Supervision;
