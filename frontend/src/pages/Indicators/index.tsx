import { PlusOutlined } from '@ant-design/icons';
import { PageContainer, ProCard } from '@ant-design/pro-components';
import { Button, Tree, Descriptions, Empty, Spin, message, Modal, Form, Input, InputNumber } from 'antd';
import { useEffect, useState } from 'react';
import { request } from '@umijs/max';
import type { DataNode } from 'antd/es/tree';

// 评价要素接口
interface EvaluationItem {
  id: string;
  name: string;
  code: string;
  maxScore: number;
  description?: string;
  baoshanFeature?: string;
  scoringCriteria?: string;
}

// 三级指标接口
interface L3Indicator {
  id: string;
  name: string;
  code: string;
  description?: string;
  evaluationItems?: EvaluationItem[];
}

// 二级指标接口
interface L2Indicator {
  id: string;
  name: string;
  code: string;
  description?: string;
  children?: L3Indicator[];
}

// 一级指标接口
interface L1Indicator {
  id: string;
  name: string;
  code: string;
  weight: number;
  description?: string;
  children?: L2Indicator[];
}

// 选中节点数据接口
interface SelectedNodeData {
  id: string;
  name: string;
  code: string;
  level: number;
  weight?: number;
  maxScore?: number;
  description?: string;
  baoshanFeature?: string;
  scoringCriteria?: string;
}

// 扩展 DataNode 以支持自定义数据
interface IndicatorDataNode extends DataNode {
  data?: SelectedNodeData;
  children?: IndicatorDataNode[];
}

const Indicators: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [treeData, setTreeData] = useState<IndicatorDataNode[]>([]);
  const [selectedNode, setSelectedNode] = useState<SelectedNodeData | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  const fetchIndicators = async () => {
    setLoading(true);
    try {
      const res = await request<L1Indicator[]>('/api/indicators/tree');
      const data = transformToTreeData(res);
      setTreeData(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const transformToTreeData = (data: L1Indicator[]): IndicatorDataNode[] => {
    return data.map((l1) => ({
      key: `l1-${l1.id}`,
      title: `${l1.name} (${l1.weight}分)`,
      data: { ...l1, level: 1 } as SelectedNodeData,
      children: l1.children?.map((l2) => ({
        key: `l2-${l2.id}`,
        title: l2.name,
        data: { ...l2, level: 2 } as SelectedNodeData,
        children: l2.children?.map((l3) => ({
          key: `l3-${l3.id}`,
          title: l3.name,
          data: { ...l3, level: 3 } as SelectedNodeData,
          children: l3.evaluationItems?.map((item) => ({
            key: `item-${item.id}`,
            title: `${item.name} (${item.maxScore}分)`,
            data: { ...item, level: 4 } as SelectedNodeData,
            isLeaf: true,
          })),
        })),
      })),
    }));
  };

  useEffect(() => {
    fetchIndicators();
  }, []);

  const onSelect = (_selectedKeys: React.Key[], info: { node: IndicatorDataNode }) => {
    setSelectedNode(info.node?.data ?? null);
  };

  const renderDetail = () => {
    if (!selectedNode) {
      return <Empty description="请选择指标查看详情" />;
    }

    const levelNames = ['', '一级指标', '二级指标', '三级指标', '评价要素'];

    return (
      <Descriptions column={1} bordered size="small">
        <Descriptions.Item label="类型">{levelNames[selectedNode.level]}</Descriptions.Item>
        <Descriptions.Item label="名称">{selectedNode.name}</Descriptions.Item>
        <Descriptions.Item label="编码">{selectedNode.code}</Descriptions.Item>
        {selectedNode.weight !== undefined && (
          <Descriptions.Item label="权重/分值">{selectedNode.weight || selectedNode.maxScore} 分</Descriptions.Item>
        )}
        {selectedNode.description && (
          <Descriptions.Item label="描述">{selectedNode.description}</Descriptions.Item>
        )}
        {selectedNode.baoshanFeature && (
          <Descriptions.Item label="宝山区特色检测点">{selectedNode.baoshanFeature}</Descriptions.Item>
        )}
        {selectedNode.scoringCriteria && (
          <Descriptions.Item label="评分标准">{selectedNode.scoringCriteria}</Descriptions.Item>
        )}
      </Descriptions>
    );
  };

  return (
    <PageContainer>
      <ProCard split="vertical">
        <ProCard
          title="指标体系"
          colSpan="40%"
          headerBordered
          extra={
            <Button type="primary" size="small" onClick={() => setModalVisible(true)}>
              <PlusOutlined /> 新增
            </Button>
          }
        >
          <Spin spinning={loading}>
            {treeData.length > 0 ? (
              <Tree
                showLine
                defaultExpandAll
                treeData={treeData}
                onSelect={onSelect}
                style={{ maxHeight: 600, overflow: 'auto' }}
              />
            ) : (
              <Empty description="暂无数据" />
            )}
          </Spin>
        </ProCard>
        <ProCard title="指标详情" headerBordered>
          {renderDetail()}
        </ProCard>
      </ProCard>

      <Modal
        title="新增指标"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={async (values) => {
            await request('/api/indicators/l1', { method: 'POST', data: values });
            message.success('创建成功');
            setModalVisible(false);
            fetchIndicators();
          }}
        >
          <Form.Item name="name" label="指标名称" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="code" label="指标编码" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="weight" label="权重(分)">
            <InputNumber min={0} max={100} />
          </Form.Item>
          <Form.Item name="description" label="描述">
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default Indicators;
