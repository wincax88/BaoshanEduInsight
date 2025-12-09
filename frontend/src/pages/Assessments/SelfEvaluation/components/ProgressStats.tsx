import { Row, Col, Card, Statistic, Progress } from 'antd';
import { useMemo } from 'react';
import type { EvaluationItem, ScoreData } from '../types';

interface ProgressStatsProps {
  allEvaluationItems: EvaluationItem[];
  scores: Record<string, ScoreData>;
}

export interface ProgressData {
  totalMaxScore: number;
  currentTotalScore: number;
  completedCount: number;
  progress: number;
}

export function useProgressStats(
  allEvaluationItems: EvaluationItem[],
  scores: Record<string, ScoreData>,
): ProgressData {
  return useMemo(() => {
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
}

const ProgressStats: React.FC<ProgressStatsProps> = ({ allEvaluationItems, scores }) => {
  const { totalMaxScore, currentTotalScore, completedCount, progress } = useProgressStats(
    allEvaluationItems,
    scores,
  );

  return (
    <Row gutter={16} style={{ marginBottom: 16 }}>
      <Col span={6}>
        <Card>
          <Statistic title="完成进度" value={progress} suffix="%" />
          <Progress percent={progress} size="small" showInfo={false} />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic title="已评分项" value={completedCount} suffix={`/ ${allEvaluationItems.length}`} />
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
  );
};

export default ProgressStats;
