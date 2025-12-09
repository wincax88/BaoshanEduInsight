import { Form, InputNumber, Input, Button, Empty, Collapse, Tag, Upload } from 'antd';
import { ProCard } from '@ant-design/pro-components';
import { SaveOutlined, UploadOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import type { UploadFile } from 'antd/es/upload/interface';
import { tokenService } from '@/utils/tokenService';
import type { EvaluationItem, ScoreData, TaskInfo, ScoreFormValues } from '../types';

interface ScoreFormProps {
  selectedItem: EvaluationItem | null;
  taskInfo: TaskInfo | null;
  scores: Record<string, ScoreData>;
  saving: boolean;
  onSave: (selectedItem: EvaluationItem, values: ScoreFormValues, fileList: UploadFile[]) => Promise<void>;
}

const ScoreForm: React.FC<ScoreFormProps> = ({
  selectedItem,
  taskInfo,
  scores,
  saving,
  onSave,
}) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  // 当选中项变化时，更新表单
  useEffect(() => {
    if (selectedItem) {
      const scoreData = scores[selectedItem.id];
      form.setFieldsValue({
        score: scoreData?.score,
        evidence: scoreData?.evidence || '',
        comment: scoreData?.comment || '',
      });
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
  }, [selectedItem, scores, form]);

  const handleSave = async () => {
    if (!selectedItem) return;
    try {
      const values = await form.validateFields();
      await onSave(selectedItem, values, fileList);
    } catch {
      // validation failed
    }
  };

  const isEditable = taskInfo?.status === 'self_evaluation';

  if (!selectedItem) {
    return (
      <ProCard title="评分详情" headerBordered>
        <Empty description="请从左侧选择评价要素进行评分" />
      </ProCard>
    );
  }

  return (
    <ProCard title="评分详情" headerBordered>
      <Collapse
        defaultActiveKey={['info']}
        style={{ marginBottom: 16 }}
        items={[
          {
            key: 'info',
            label: '评价要素信息',
            children: (
              <div>
                <p><strong>名称：</strong>{selectedItem.name}</p>
                <p><strong>编码：</strong>{selectedItem.code}</p>
                <p><strong>满分：</strong>{selectedItem.maxScore} 分</p>
                {selectedItem.description && (
                  <p><strong>描述：</strong>{selectedItem.description}</p>
                )}
                {selectedItem.baoshanFeature && (
                  <p>
                    <strong>宝山区特色检测点：</strong>
                    <Tag color="blue">{selectedItem.baoshanFeature}</Tag>
                  </p>
                )}
                {selectedItem.scoringCriteria && (
                  <p><strong>评分标准：</strong>{selectedItem.scoringCriteria}</p>
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
            { type: 'number', max: selectedItem.maxScore, message: `评分不能超过 ${selectedItem.maxScore} 分` },
            { type: 'number', min: 0, message: '评分不能为负数' },
          ]}
        >
          <InputNumber
            min={0}
            max={selectedItem.maxScore}
            step={0.5}
            style={{ width: '100%' }}
            placeholder={`请输入0-${selectedItem.maxScore}之间的分数`}
            disabled={!isEditable}
          />
        </Form.Item>

        <Form.Item name="evidence" label="佐证材料说明">
          <Input.TextArea
            rows={4}
            placeholder="请描述支撑该评分的佐证材料（如相关文档、数据、活动记录等）"
            disabled={!isEditable}
          />
        </Form.Item>

        <Form.Item name="comment" label="备注">
          <Input.TextArea rows={2} placeholder="其他需要说明的内容" disabled={!isEditable} />
        </Form.Item>

        <Form.Item label="附件材料">
          <Upload
            fileList={fileList}
            action="/api/files/upload?folder=assessments"
            headers={{ Authorization: tokenService.getAuthHeader() || '' }}
            onChange={({ file, fileList: newFileList }) => {
              setFileList(newFileList);
              if (file.status === 'done' && file.response) {
                const updatedList = newFileList.map((f) => {
                  if (f.uid === file.uid) {
                    return { ...f, url: file.response.url };
                  }
                  return f;
                });
                setFileList(updatedList);
              }
            }}
            onRemove={(file) => {
              setFileList(fileList.filter((f) => f.uid !== file.uid));
            }}
            disabled={!isEditable}
          >
            {isEditable && (
              <Button icon={<UploadOutlined />}>上传附件</Button>
            )}
          </Upload>
          <div style={{ marginTop: 8, color: '#999', fontSize: 12 }}>
            支持上传图片、PDF、Word等文件，单个文件不超过10MB
          </div>
        </Form.Item>

        {isEditable && (
          <Form.Item>
            <Button type="primary" onClick={handleSave} loading={saving}>
              <SaveOutlined /> 保存此项评分
            </Button>
          </Form.Item>
        )}
      </Form>
    </ProCard>
  );
};

export default ScoreForm;
