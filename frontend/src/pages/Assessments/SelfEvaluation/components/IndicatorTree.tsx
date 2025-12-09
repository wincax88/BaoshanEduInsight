import { Tree, Empty } from 'antd';
import { ProCard } from '@ant-design/pro-components';
import { useMemo } from 'react';
import type { DataNode } from 'antd/es/tree';
import type { EvaluationItem, ScoreData, L1Indicator, L2Indicator, L3Indicator } from '../types';

// 扩展 DataNode 以支持评价要素数据
interface EvaluationDataNode extends DataNode {
  data?: EvaluationItem;
  children?: EvaluationDataNode[];
}

interface IndicatorTreeProps {
  indicatorTree: L1Indicator[];
  scores: Record<string, ScoreData>;
  onSelect: (item: EvaluationItem) => void;
}

const IndicatorTree: React.FC<IndicatorTreeProps> = ({ indicatorTree, scores, onSelect }) => {
  // 转换为树形数据
  const treeData = useMemo((): EvaluationDataNode[] => {
    return indicatorTree.map((l1: L1Indicator) => ({
      key: `l1-${l1.id}`,
      title: `${l1.code} ${l1.name} (${l1.weight}分)`,
      selectable: false,
      children: l1.children?.map((l2: L2Indicator) => ({
        key: `l2-${l2.id}`,
        title: `${l2.code} ${l2.name}`,
        selectable: false,
        children: l2.children?.map((l3: L3Indicator) => ({
          key: `l3-${l3.id}`,
          title: `${l3.code} ${l3.name}`,
          selectable: false,
          children: l3.evaluationItems?.map((item: EvaluationItem) => ({
            key: `item-${item.id}`,
            title: `${item.code} ${item.name} (${item.maxScore}分)`,
            data: item,
            isLeaf: true,
          })),
        })),
      })),
    }));
  }, [indicatorTree]);

  const onSelectNode = (_: React.Key[], info: { node: EvaluationDataNode }) => {
    const nodeData = info.node?.data;
    if (nodeData) {
      onSelect(nodeData);
    }
  };

  return (
    <ProCard title="指标体系" colSpan="40%" headerBordered>
      {treeData.length > 0 ? (
        <Tree
          showLine
          defaultExpandAll
          treeData={treeData}
          onSelect={onSelectNode}
          style={{ maxHeight: 500, overflow: 'auto' }}
          titleRender={(node: EvaluationDataNode) => {
            const itemId = node.key?.toString().replace('item-', '');
            const hasScore = scores[itemId]?.score !== undefined;
            return (
              <span style={{ color: node.isLeaf && hasScore ? '#52c41a' : undefined }}>
                {node.title as React.ReactNode}
                {node.isLeaf && hasScore && ' ✓'}
              </span>
            );
          }}
        />
      ) : (
        <Empty description="暂无指标数据" />
      )}
    </ProCard>
  );
};

export default IndicatorTree;
