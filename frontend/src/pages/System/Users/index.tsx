import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  PageContainer,
  ProTable,
  ModalForm,
  ProFormText,
  ProFormSelect,
} from '@ant-design/pro-components';
import { Button, message, Popconfirm, Tag, Space } from 'antd';
import { useRef, useState } from 'react';
import { request } from '@umijs/max';

type UserItem = {
  id: string;
  username: string;
  realName: string;
  email: string;
  phone: string;
  roles: { id: string; name: string; code: string }[];
  school: { id: string; name: string };
  isActive: boolean;
  lastLoginAt: string;
  createdAt: string;
};

const UserList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [modalVisible, setModalVisible] = useState(false);
  const [currentRow, setCurrentRow] = useState<UserItem>();

  const columns: ProColumns<UserItem>[] = [
    { title: '用户名', dataIndex: 'username', width: 120 },
    { title: '姓名', dataIndex: 'realName', width: 100 },
    { title: '邮箱', dataIndex: 'email', ellipsis: true },
    { title: '手机', dataIndex: 'phone', width: 120 },
    {
      title: '角色',
      dataIndex: 'roles',
      width: 150,
      render: (_, record) => (
        <Space wrap>
          {record.roles?.map((role) => (
            <Tag key={role.id} color="blue">{role.name}</Tag>
          ))}
        </Space>
      ),
    },
    {
      title: '所属学校',
      dataIndex: ['school', 'name'],
      width: 150,
      render: (val) => val || '-',
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
      title: '最后登录',
      dataIndex: 'lastLoginAt',
      width: 120,
      valueType: 'dateTime',
    },
    {
      title: '操作',
      valueType: 'option',
      width: 150,
      render: (_, record) => [
        <a key="edit" onClick={() => { setCurrentRow(record); setModalVisible(true); }}>
          编辑
        </a>,
        <a key="roles">分配角色</a>,
        <Popconfirm
          key="delete"
          title="确定删除？"
          onConfirm={async () => {
            await request(`/api/users/${record.id}`, { method: 'DELETE' });
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
      <ProTable<UserItem>
        headerTitle="用户管理"
        actionRef={actionRef}
        rowKey="id"
        toolBarRender={() => [
          <Button
            type="primary"
            key="add"
            onClick={() => { setCurrentRow(undefined); setModalVisible(true); }}
          >
            <PlusOutlined /> 新建用户
          </Button>,
        ]}
        request={async (params) => {
          const { current, pageSize, ...rest } = params;
          const res = await request('/api/users', {
            params: { page: current, pageSize, ...rest },
          });
          return { data: res.data, total: res.total, success: true };
        }}
        columns={columns}
        pagination={{ defaultPageSize: 10 }}
      />

      <ModalForm
        title={currentRow ? '编辑用户' : '新建用户'}
        open={modalVisible}
        onOpenChange={setModalVisible}
        initialValues={currentRow}
        onFinish={async (values) => {
          if (currentRow) {
            await request(`/api/users/${currentRow.id}`, { method: 'PATCH', data: values });
          } else {
            await request('/api/users', { method: 'POST', data: values });
          }
          message.success('保存成功');
          setModalVisible(false);
          actionRef.current?.reload();
          return true;
        }}
      >
        <ProFormText
          name="username"
          label="用户名"
          rules={[{ required: true }]}
          disabled={!!currentRow}
        />
        {!currentRow && (
          <ProFormText.Password
            name="password"
            label="密码"
            rules={[{ required: true, min: 6 }]}
          />
        )}
        <ProFormText name="realName" label="姓名" rules={[{ required: true }]} />
        <ProFormText name="email" label="邮箱" rules={[{ type: 'email' }]} />
        <ProFormText name="phone" label="手机号" />
        <ProFormSelect
          name="schoolId"
          label="所属学校"
          request={async () => {
            const res = await request('/api/schools', { params: { pageSize: 1000 } });
            return res.data?.map((s: any) => ({ label: s.name, value: s.id })) || [];
          }}
        />
      </ModalForm>
    </PageContainer>
  );
};

export default UserList;
