import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  PageContainer,
  ProTable,
  ModalForm,
  ProFormText,
  ProFormSelect,
  ProFormDateRangePicker,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { Button, message, Tag, Space } from 'antd';
import { useRef, useState } from 'react';
import { request } from '@umijs/max';

type TaskItem = {
  id: string;
  name: string;
  academicYear: string;
  school: { id: string; name: string };
  status: string;
  totalScore: number;
  selfEvaluationStartDate: string;
  selfEvaluationEndDate: string;
  createdAt: string;
};

const statusMap: Record<string, { text: string; color: string }> = {
  draft: { text: '草稿', color: 'default' },
  self_evaluation: { text: '自评中', color: 'processing' },
  supervision: { text: '督导中', color: 'warning' },
  review: { text: '审核中', color: 'orange' },
  completed: { text: '已完成', color: 'success' },
};

const AssessmentTasks: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [modalVisible, setModalVisible] = useState(false);

  const columns: ProColumns<TaskItem>[] = [
    { title: '任务名称', dataIndex: 'name', ellipsis: true },
    { title: '学年', dataIndex: 'academicYear', width: 100 },
    {
      title: '学校',
      dataIndex: ['school', 'name'],
      width: 150,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (_, record) => {
        const s = statusMap[record.status] || { text: record.status, color: 'default' };
        return <Tag color={s.color}>{s.text}</Tag>;
      },
    },
    {
      title: '总得分',
      dataIndex: 'totalScore',
      width: 80,
      render: (val) => (val ? `${val}分` : '-'),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      width: 120,
      valueType: 'date',
    },
    {
      title: '操作',
      valueType: 'option',
      width: 200,
      render: (_, record) => (
        <Space>
          <a>查看</a>
          {record.status === 'draft' && <a>开始自评</a>}
          {record.status === 'self_evaluation' && <a>填报自评</a>}
          {record.status === 'supervision' && <a>督导评估</a>}
        </Space>
      ),
    },
  ];

  return (
    <PageContainer>
      <ProTable<TaskItem>
        headerTitle="测评任务"
        actionRef={actionRef}
        rowKey="id"
        toolBarRender={() => [
          <Button type="primary" key="add" onClick={() => setModalVisible(true)}>
            <PlusOutlined /> 新建任务
          </Button>,
        ]}
        request={async (params) => {
          const { current, pageSize, ...rest } = params;
          const res = await request('/api/assessments', {
            params: { page: current, pageSize, ...rest },
          });
          return { data: res.data, total: res.total, success: true };
        }}
        columns={columns}
        pagination={{ defaultPageSize: 10 }}
      />

      <ModalForm
        title="新建测评任务"
        open={modalVisible}
        onOpenChange={setModalVisible}
        onFinish={async (values) => {
          const { dateRange, ...rest } = values;
          await request('/api/assessments', {
            method: 'POST',
            data: {
              ...rest,
              selfEvaluationStartDate: dateRange?.[0],
              selfEvaluationEndDate: dateRange?.[1],
            },
          });
          message.success('创建成功');
          setModalVisible(false);
          actionRef.current?.reload();
          return true;
        }}
      >
        <ProFormText name="name" label="任务名称" rules={[{ required: true }]} />
        <ProFormText name="academicYear" label="学年" rules={[{ required: true }]} placeholder="如：2024-2025" />
        <ProFormSelect
          name="schoolId"
          label="学校"
          rules={[{ required: true }]}
          request={async () => {
            const res = await request('/api/schools', { params: { pageSize: 1000 } });
            return res.data?.map((s: any) => ({ label: s.name, value: s.id })) || [];
          }}
        />
        <ProFormDateRangePicker name="dateRange" label="自评时间" />
        <ProFormTextArea name="description" label="任务描述" />
      </ModalForm>
    </PageContainer>
  );
};

export default AssessmentTasks;
