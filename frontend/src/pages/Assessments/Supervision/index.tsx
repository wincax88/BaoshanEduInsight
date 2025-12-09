import { PageContainer, ProCard } from '@ant-design/pro-components';
import { Alert, Empty } from 'antd';

const Supervision: React.FC = () => {
  return (
    <PageContainer>
      <Alert
        message="督导评估说明"
        description="督导人员可在此进行现场督导评估，对学校自评结果进行复核打分，并填写督导意见。"
        type="info"
        showIcon
        style={{ marginBottom: 16 }}
      />
      <ProCard>
        <Empty description="请从测评任务列表选择任务进行督导评估" />
      </ProCard>
    </PageContainer>
  );
};

export default Supervision;
