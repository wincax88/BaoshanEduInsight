import { PageContainer, ProCard, StatisticCard } from '@ant-design/pro-components';
import { Col, Row, Table } from 'antd';

const { Statistic } = StatisticCard;

const Statistics: React.FC = () => {
  const schoolRankData = [
    { rank: 1, name: '世外顾村实验学校', score: 95.5 },
    { rank: 2, name: '华二宝山实验学校', score: 94.2 },
    { rank: 3, name: '月浦实验学校', score: 92.8 },
    { rank: 4, name: '宝山区第一中心小学', score: 91.5 },
    { rank: 5, name: '罗店中心校', score: 90.3 },
  ];

  const indicatorData = [
    { name: '学校治理', avgScore: 13.2, maxScore: 15, rate: '88%' },
    { name: '课程教学', avgScore: 22.1, maxScore: 25, rate: '88.4%' },
    { name: '队伍建设', avgScore: 13.5, maxScore: 15, rate: '90%' },
    { name: '资源保障', avgScore: 13.8, maxScore: 15, rate: '92%' },
    { name: '学生发展', avgScore: 17.6, maxScore: 20, rate: '88%' },
    { name: '学校发展', avgScore: 8.3, maxScore: 10, rate: '83%' },
  ];

  return (
    <PageContainer>
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <StatisticCard
            statistic={{
              title: '参评学校',
              value: 45,
              suffix: '所',
            }}
          />
        </Col>
        <Col span={6}>
          <StatisticCard
            statistic={{
              title: '区平均分',
              value: 88.5,
              suffix: '分',
            }}
          />
        </Col>
        <Col span={6}>
          <StatisticCard
            statistic={{
              title: '优秀率(≥90分)',
              value: 35.6,
              suffix: '%',
            }}
          />
        </Col>
        <Col span={6}>
          <StatisticCard
            statistic={{
              title: '达标率(≥80分)',
              value: 95.2,
              suffix: '%',
            }}
          />
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col span={12}>
          <ProCard title="学校得分排名 (Top 5)" headerBordered>
            <Table
              dataSource={schoolRankData}
              columns={[
                { title: '排名', dataIndex: 'rank', width: 60 },
                { title: '学校', dataIndex: 'name' },
                { title: '得分', dataIndex: 'score', width: 80 },
              ]}
              pagination={false}
              size="small"
              rowKey="rank"
            />
          </ProCard>
        </Col>
        <Col span={12}>
          <ProCard title="一级指标平均得分" headerBordered>
            <Table
              dataSource={indicatorData}
              columns={[
                { title: '指标', dataIndex: 'name' },
                { title: '平均分', dataIndex: 'avgScore', width: 80 },
                { title: '满分', dataIndex: 'maxScore', width: 60 },
                { title: '达标率', dataIndex: 'rate', width: 80 },
              ]}
              pagination={false}
              size="small"
              rowKey="name"
            />
          </ProCard>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col span={24}>
          <ProCard title="得分趋势分析" headerBordered>
            <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              图表区域 - 年度得分趋势折线图
            </div>
          </ProCard>
        </Col>
      </Row>
    </PageContainer>
  );
};

export default Statistics;
