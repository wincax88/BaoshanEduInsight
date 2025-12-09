import { PageContainer, ProCard, StatisticCard } from '@ant-design/pro-components';
import { Col, Row, List, Tag, Space, Empty } from 'antd';
import { useEffect, useState } from 'react';
import { request, history } from '@umijs/max';
import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';

const { Statistic } = StatisticCard;

interface OverviewData {
  schoolCount: number;
  totalTasks: number;
  yearTasks: number;
  completedTasks: number;
  avgScore: number;
}

interface ProgressItem {
  status: string;
  statusName: string;
  count: number;
}

interface IndicatorScore {
  name: string;
  code: string;
  maxScore: number;
  avgScore: number;
}

interface TodoItem {
  id: string;
  name: string;
  schoolName: string;
  status: string;
  action: string;
  updatedAt: string;
}

const statusColorMap: Record<string, string> = {
  self_evaluation: 'processing',
  supervision: 'warning',
  review: 'orange',
};

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState<OverviewData | null>(null);
  const [progress, setProgress] = useState<ProgressItem[]>([]);
  const [indicatorScores, setIndicatorScores] = useState<IndicatorScore[]>([]);
  const [todoList, setTodoList] = useState<TodoItem[]>([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [overviewRes, progressRes, indicatorRes, todoRes] = await Promise.all([
        request('/api/statistics/overview'),
        request('/api/statistics/assessment-progress'),
        request('/api/statistics/indicator-scores'),
        request('/api/statistics/todo-list'),
      ]);
      setOverview(overviewRes);
      setProgress(progressRes);
      setIndicatorScores(indicatorRes);
      setTodoList(todoRes);
    } catch (error) {
      console.error('获取统计数据失败', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 雷达图配置
  const getRadarOption = (): EChartsOption => {
    if (!indicatorScores.length) {
      return {};
    }

    const indicatorNames = indicatorScores.map((item) => ({
      name: item.name,
      max: item.maxScore,
    }));

    const avgScores = indicatorScores.map((item) => item.avgScore);
    const maxScores = indicatorScores.map((item) => item.maxScore);

    return {
      tooltip: {
        trigger: 'item',
      },
      legend: {
        data: ['平均得分', '满分'],
        bottom: 0,
      },
      radar: {
        indicator: indicatorNames,
        center: ['50%', '50%'],
        radius: '65%',
        axisName: {
          color: '#333',
          fontSize: 12,
        },
        splitArea: {
          areaStyle: {
            color: ['#f5f5f5', '#fff'],
          },
        },
      },
      series: [
        {
          type: 'radar',
          data: [
            {
              value: avgScores,
              name: '平均得分',
              areaStyle: {
                color: 'rgba(24, 144, 255, 0.3)',
              },
              lineStyle: {
                color: '#1890ff',
              },
              itemStyle: {
                color: '#1890ff',
              },
            },
            {
              value: maxScores,
              name: '满分',
              areaStyle: {
                color: 'rgba(82, 196, 26, 0.1)',
              },
              lineStyle: {
                color: '#52c41a',
                type: 'dashed',
              },
              itemStyle: {
                color: '#52c41a',
              },
            },
          ],
        },
      ],
    };
  };

  // 进度柱状图配置
  const getProgressOption = (): EChartsOption => {
    if (!progress.length) {
      return {};
    }

    const statusNames = progress.map((item) => item.statusName);
    const counts = progress.map((item) => item.count);

    const colorMap: Record<string, string> = {
      草稿: '#d9d9d9',
      自评中: '#1890ff',
      督导中: '#faad14',
      审核中: '#fa8c16',
      已完成: '#52c41a',
    };

    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: statusNames,
        axisLabel: {
          interval: 0,
        },
      },
      yAxis: {
        type: 'value',
        minInterval: 1,
      },
      series: [
        {
          type: 'bar',
          data: progress.map((item) => ({
            value: item.count,
            itemStyle: {
              color: colorMap[item.statusName] || '#1890ff',
            },
          })),
          barWidth: '40%',
          label: {
            show: true,
            position: 'top',
            formatter: '{c}',
          },
        },
      ],
    };
  };

  // 跳转到对应任务
  const handleTodoClick = (item: TodoItem) => {
    if (item.status === 'self_evaluation') {
      history.push(`/assessments/self-evaluation/${item.id}`);
    } else if (item.status === 'supervision') {
      history.push(`/assessments/supervision/${item.id}`);
    } else {
      history.push(`/assessments/tasks`);
    }
  };

  return (
    <PageContainer>
      {/* 统计卡片 */}
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <StatisticCard
            loading={loading}
            statistic={{
              title: '学校总数',
              value: overview?.schoolCount || 0,
              suffix: '所',
            }}
          />
        </Col>
        <Col span={6}>
          <StatisticCard
            loading={loading}
            statistic={{
              title: '本年度测评任务',
              value: overview?.yearTasks || 0,
              suffix: '个',
            }}
          />
        </Col>
        <Col span={6}>
          <StatisticCard
            loading={loading}
            statistic={{
              title: '已完成测评',
              value: overview?.completedTasks || 0,
              suffix: '个',
            }}
          />
        </Col>
        <Col span={6}>
          <StatisticCard
            loading={loading}
            statistic={{
              title: '平均得分',
              value: overview?.avgScore || 0,
              suffix: '分',
            }}
          />
        </Col>
      </Row>

      {/* 图表区域 */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col span={12}>
          <ProCard title="一级指标得分分布" headerBordered loading={loading}>
            {indicatorScores.length > 0 ? (
              <ReactECharts option={getRadarOption()} style={{ height: 300 }} />
            ) : (
              <Empty description="暂无数据" style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }} />
            )}
          </ProCard>
        </Col>
        <Col span={12}>
          <ProCard title="测评进度统计" headerBordered loading={loading}>
            {progress.length > 0 ? (
              <ReactECharts option={getProgressOption()} style={{ height: 300 }} />
            ) : (
              <Empty description="暂无数据" style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }} />
            )}
          </ProCard>
        </Col>
      </Row>

      {/* 待办事项 */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col span={24}>
          <ProCard title="待办事项" headerBordered loading={loading}>
            {todoList.length > 0 ? (
              <List
                dataSource={todoList}
                renderItem={(item) => (
                  <List.Item
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleTodoClick(item)}
                  >
                    <List.Item.Meta
                      title={
                        <Space>
                          <span>{item.name}</span>
                          <Tag>{item.schoolName}</Tag>
                        </Space>
                      }
                      description={
                        <Tag color={statusColorMap[item.status]}>{item.action}</Tag>
                      }
                    />
                  </List.Item>
                )}
              />
            ) : (
              <Empty description="暂无待办事项" />
            )}
          </ProCard>
        </Col>
      </Row>
    </PageContainer>
  );
};

export default Dashboard;
