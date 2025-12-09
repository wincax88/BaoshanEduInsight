import { PageContainer, ProCard } from '@ant-design/pro-components';
import { Alert, Empty } from 'antd';

const SelfEvaluation: React.FC = () => {
  return (
    <PageContainer>
      <Alert
        message="自评填报说明"
        description="选择测评任务后，按照指标体系逐项填写自评分数和佐证材料。自评完成后提交审核。"
        type="info"
        showIcon
        style={{ marginBottom: 16 }}
      />
      <ProCard>
        <Empty description="请从测评任务列表选择任务进行自评填报" />
      </ProCard>
    </PageContainer>
  );
};

export default SelfEvaluation;
