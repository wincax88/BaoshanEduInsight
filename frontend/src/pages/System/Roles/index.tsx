import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  PageContainer,
  ProTable,
  ModalForm,
  ProFormText,
  ProFormTextArea,
  ProFormCheckbox,
} from '@ant-design/pro-components';
import { Button, message, Popconfirm, Tag } from 'antd';
import { useRef, useState } from 'react';
import { request } from '@umijs/max';

type RoleItem = {
  id: string;
  name: string;
  code: string;
  description: string;
  permissions: string[];
  isSystem: boolean;
  isActive: boolean;
  createdAt: string;
};

const permissionOptions = [
  { label: '用户管理', value: 'user:manage' },
  { label: '角色管理', value: 'role:manage' },
  { label: '学校管理', value: 'school:manage' },
  { label: '指标管理', value: 'indicator:manage' },
  { label: '测评管理', value: 'assessment:manage' },
  { label: '自评填报', value: 'self-evaluation:submit' },
  { label: '督导评估', value: 'supervision:submit' },
  { label: '统计分析', value: 'statistics:view' },
  { label: '报告管理', value: 'report:manage' },
];

const RoleList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [modalVisible, setModalVisible] = useState(false);
  const [currentRow, setCurrentRow] = useState<RoleItem>();

  const columns: ProColumns<RoleItem>[] = [
    { title: '角色名称', dataIndex: 'name', width: 150 },
    { title: '角色编码', dataIndex: 'code', width: 120 },
    { title: '描述', dataIndex: 'description', ellipsis: true },
    {
      title: '系统角色',
      dataIndex: 'isSystem',
      width: 100,
      render: (_, record) => (
        <Tag color={record.isSystem ? 'purple' : 'default'}>
          {record.isSystem ? '是' : '否'}
        </Tag>
      ),
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
      title: '创建时间',
      dataIndex: 'createdAt',
      width: 120,
      valueType: 'date',
    },
    {
      title: '操作',
      valueType: 'option',
      width: 120,
      render: (_, record) => [
        <a key="edit" onClick={() => { setCurrentRow(record); setModalVisible(true); }}>
          编辑
        </a>,
        !record.isSystem && (
          <Popconfirm
            key="delete"
            title="确定删除？"
            onConfirm={async () => {
              await request(`/api/roles/${record.id}`, { method: 'DELETE' });
              message.success('删除成功');
              actionRef.current?.reload();
            }}
          >
            <a>删除</a>
          </Popconfirm>
        ),
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<RoleItem>
        headerTitle="角色管理"
        actionRef={actionRef}
        rowKey="id"
        toolBarRender={() => [
          <Button
            type="primary"
            key="add"
            onClick={() => { setCurrentRow(undefined); setModalVisible(true); }}
          >
            <PlusOutlined /> 新建角色
          </Button>,
        ]}
        request={async () => {
          const res = await request('/api/roles');
          return { data: res, total: res.length, success: true };
        }}
        columns={columns}
        pagination={false}
      />

      <ModalForm
        title={currentRow ? '编辑角色' : '新建角色'}
        open={modalVisible}
        onOpenChange={setModalVisible}
        initialValues={currentRow}
        onFinish={async (values) => {
          if (currentRow) {
            await request(`/api/roles/${currentRow.id}`, { method: 'PATCH', data: values });
          } else {
            await request('/api/roles', { method: 'POST', data: values });
          }
          message.success('保存成功');
          setModalVisible(false);
          actionRef.current?.reload();
          return true;
        }}
      >
        <ProFormText name="name" label="角色名称" rules={[{ required: true }]} />
        <ProFormText
          name="code"
          label="角色编码"
          rules={[{ required: true }]}
          disabled={!!currentRow}
        />
        <ProFormTextArea name="description" label="描述" />
        <ProFormCheckbox.Group
          name="permissions"
          label="权限"
          options={permissionOptions}
        />
      </ModalForm>
    </PageContainer>
  );
};

export default RoleList;
