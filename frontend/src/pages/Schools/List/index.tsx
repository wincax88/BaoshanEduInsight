import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable, ModalForm, ProFormText, ProFormSelect } from '@ant-design/pro-components';
import { Button, message, Popconfirm, Tag } from 'antd';
import { useRef, useState } from 'react';
import { request } from '@umijs/max';

type SchoolItem = {
  id: string;
  name: string;
  code: string;
  type: string;
  category: string;
  district: string;
  principal: string;
  phone: string;
  studentCount: number;
  teacherCount: number;
  isActive: boolean;
  createdAt: string;
};

const SchoolList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [modalVisible, setModalVisible] = useState(false);
  const [currentRow, setCurrentRow] = useState<SchoolItem>();

  const columns: ProColumns<SchoolItem>[] = [
    { title: '学校名称', dataIndex: 'name', ellipsis: true },
    { title: '学校编码', dataIndex: 'code', width: 120 },
    {
      title: '学校类型',
      dataIndex: 'type',
      width: 100,
      valueEnum: {
        public: { text: '公办', status: 'Success' },
        private: { text: '民办', status: 'Warning' },
      },
    },
    {
      title: '学校类别',
      dataIndex: 'category',
      width: 100,
      valueEnum: {
        primary: { text: '小学' },
        junior: { text: '初中' },
        nine_year: { text: '九年一贯制' },
      },
    },
    { title: '校长', dataIndex: 'principal', width: 100 },
    { title: '学生数', dataIndex: 'studentCount', width: 80 },
    { title: '教师数', dataIndex: 'teacherCount', width: 80 },
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
        <Popconfirm
          key="delete"
          title="确定删除？"
          onConfirm={async () => {
            await request(`/api/schools/${record.id}`, { method: 'DELETE' });
            message.success('删除成功');
            actionRef.current?.reload();
          }}
        >
          <a>删除</a>
        </Popconfirm>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<SchoolItem>
        headerTitle="学校列表"
        actionRef={actionRef}
        rowKey="id"
        toolBarRender={() => [
          <Button
            type="primary"
            key="add"
            onClick={() => { setCurrentRow(undefined); setModalVisible(true); }}
          >
            <PlusOutlined /> 新建学校
          </Button>,
        ]}
        request={async (params) => {
          const { current, pageSize, ...rest } = params;
          const res = await request('/api/schools', {
            params: { page: current, pageSize, ...rest },
          });
          return { data: res.data, total: res.total, success: true };
        }}
        columns={columns}
        pagination={{ defaultPageSize: 10 }}
      />

      <ModalForm
        title={currentRow ? '编辑学校' : '新建学校'}
        open={modalVisible}
        onOpenChange={setModalVisible}
        initialValues={currentRow}
        onFinish={async (values) => {
          if (currentRow) {
            await request(`/api/schools/${currentRow.id}`, { method: 'PATCH', data: values });
          } else {
            await request('/api/schools', { method: 'POST', data: values });
          }
          message.success('保存成功');
          setModalVisible(false);
          actionRef.current?.reload();
          return true;
        }}
      >
        <ProFormText name="name" label="学校名称" rules={[{ required: true }]} />
        <ProFormText name="code" label="学校编码" rules={[{ required: true }]} />
        <ProFormSelect
          name="type"
          label="学校类型"
          options={[
            { label: '公办', value: 'public' },
            { label: '民办', value: 'private' },
          ]}
        />
        <ProFormSelect
          name="category"
          label="学校类别"
          options={[
            { label: '小学', value: 'primary' },
            { label: '初中', value: 'junior' },
            { label: '九年一贯制', value: 'nine_year' },
          ]}
        />
        <ProFormText name="principal" label="校长" />
        <ProFormText name="phone" label="联系电话" />
        <ProFormText name="address" label="学校地址" />
      </ModalForm>
    </PageContainer>
  );
};

export default SchoolList;
