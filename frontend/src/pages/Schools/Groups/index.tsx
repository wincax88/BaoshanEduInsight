import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable, ModalForm, ProFormText, ProFormTextArea } from '@ant-design/pro-components';
import { Button, message, Popconfirm, Tag } from 'antd';
import { useRef, useState } from 'react';
import { request } from '@umijs/max';

type GroupItem = {
  id: string;
  name: string;
  code: string;
  description: string;
  leadSchool: string;
  schools: any[];
  isActive: boolean;
  createdAt: string;
};

const EducationGroups: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [modalVisible, setModalVisible] = useState(false);
  const [currentRow, setCurrentRow] = useState<GroupItem>();

  const columns: ProColumns<GroupItem>[] = [
    { title: '集团名称', dataIndex: 'name', ellipsis: true },
    { title: '集团编码', dataIndex: 'code', width: 120 },
    { title: '领衔学校', dataIndex: 'leadSchool', width: 150 },
    { title: '描述', dataIndex: 'description', ellipsis: true },
    {
      title: '成员学校数',
      dataIndex: 'schools',
      width: 100,
      render: (_, record) => record.schools?.length || 0,
    },
    {
      title: '状态',
      dataIndex: 'isActive',
      width: 80,
      render: (_, record) => (
        <Tag color={record.isActive ? 'green' : 'red'}>
          {record.isActive ? '启用' : '禁用'}
        </Tag>
      ),
    },
    {
      title: '操作',
      valueType: 'option',
      width: 150,
      render: (_, record) => [
        <a key="edit" onClick={() => { setCurrentRow(record); setModalVisible(true); }}>
          编辑
        </a>,
        <a key="members">成员学校</a>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<GroupItem>
        headerTitle="教育集团"
        actionRef={actionRef}
        rowKey="id"
        toolBarRender={() => [
          <Button
            type="primary"
            key="add"
            onClick={() => { setCurrentRow(undefined); setModalVisible(true); }}
          >
            <PlusOutlined /> 新建集团
          </Button>,
        ]}
        request={async () => {
          const res = await request('/api/schools/groups/list');
          return { data: res, total: res.length, success: true };
        }}
        columns={columns}
        pagination={false}
      />

      <ModalForm
        title={currentRow ? '编辑集团' : '新建集团'}
        open={modalVisible}
        onOpenChange={setModalVisible}
        initialValues={currentRow}
        onFinish={async (values) => {
          await request('/api/schools/groups', { method: 'POST', data: values });
          message.success('保存成功');
          setModalVisible(false);
          actionRef.current?.reload();
          return true;
        }}
      >
        <ProFormText name="name" label="集团名称" rules={[{ required: true }]} />
        <ProFormText name="code" label="集团编码" rules={[{ required: true }]} />
        <ProFormText name="leadSchool" label="领衔学校" />
        <ProFormTextArea name="description" label="集团描述" />
      </ModalForm>
    </PageContainer>
  );
};

export default EducationGroups;
