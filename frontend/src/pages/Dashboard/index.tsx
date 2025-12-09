import { PageContainer, ProCard, StatisticCard } from '@ant-design/pro-components';
import { Col, Row } from 'antd';
import { useEffect, useState } from 'react';

const { Statistic } = StatisticCard;

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 500);
  }, []);

  return (
    <PageContainer>
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <StatisticCard
            loading={loading}
            statistic={{
              title: '学校总数',
              value: 128,
              suffix: '所',
            }}
          />
        </Col>
        <Col span={6}>
          <StatisticCard
            loading={loading}
            statistic={{
              title: '本年度测评任务',
              value: 45,
              suffix: '个',
            }}
          />
        </Col>
        <Col span={6}>
          <StatisticCard
            loading={loading}
            statistic={{
              title: '已完成测评',
              value: 32,
              suffix: '个',
            }}
          />
        </Col>
        <Col span={6}>
          <StatisticCard
            loading={loading}
            statistic={{
              title: '平均得分',
              value: 88.5,
              suffix: '分',
            }}
          />
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col span={12}>
          <ProCard title="一级指标得分分布" headerBordered loading={loading}>
            <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              图表区域 - 指标得分雷达图
            </div>
          </ProCard>
        </Col>
        <Col span={12}>
          <ProCard title="测评进度" headerBordered loading={loading}>
            <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              图表区域 - 测评进度统计
            </div>
          </ProCard>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col span={24}>
          <ProCard title="待办事项" headerBordered loading={loading}>
            <div style={{ padding: 20 }}>
              <p>- 月浦实验学校 自评待审核</p>
              <p>- 世外顾村实验学校 督导评估进行中</p>
              <p>- 宝山区第一中心小学 待开始自评</p>
            </div>
          </ProCard>
        </Col>
      </Row>
    </PageContainer>
  );
};

export default Dashboard;
