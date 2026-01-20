"use client";

import React, { useState } from 'react';
import { 
  Table, 
  Button, 
  Modal, 
  Form, 
  Input, 
  Space, 
  Popconfirm, 
  Typography, 
  Card, 
  Tag, 
  message 
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  SearchOutlined, 
  UserOutlined, 
  MailOutlined, 
  LockOutlined 
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { instance } from '@/app/service/http/instance';

const { Title, Text } = Typography;

// --- Giả lập hàm MD5 (Trong thực tế hãy dùng thư viện 'crypto-js' hoặc 'md5') ---
const mockMd5Hash = (str: string): string => {
  if (!str) return "";
  return "MD5_" + btoa(str).substring(0, 16).toLowerCase(); 
};

// --- Định nghĩa kiểu dữ liệu User ---
interface UserType {
  id: number;
  fullName: string;
  email: string;
  passwordHash: string;
}

// --- Định nghĩa kiểu dữ liệu Form (Input values) ---
interface UserFormValues {
  fullName: string;
  email: string;
  password?: string; // Optional vì khi edit không bắt buộc nhập
}

export default function UserManagementPage() {
  // Sử dụng Generics cho Form instance
  const [form] = Form.useForm<UserFormValues>();
  
  // --- State quản lý dữ liệu ---
  const [users, setUsers] = useState<UserType[]>([
    { id: 1, fullName: "Nguyễn Văn A", email: "nguyenvana@example.com", passwordHash: "e10adc3949ba59ab" },
    { id: 2, fullName: "Trần Thị B", email: "tranthib@example.com", passwordHash: "fcea920f7412b5da" },
    { id: 3, fullName: "Lê Văn C", email: "levanc@example.com", passwordHash: "4297f44b13955235" },
  ]);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingUser, setEditingUser] = useState<UserType | null>(null);
  const [searchText, setSearchText] = useState<string>("");

  // --- Handlers ---

  const handleAddNew = () => {
    setEditingUser(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (user: UserType) => {
    setEditingUser(user);
    form.setFieldsValue({
      fullName: user.fullName,
      email: user.email,
      password: "" // Reset password field
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    setUsers(users.filter(u => u.id !== id));
    message.success('Đã xóa người dùng thành công');
  };

  // Thay thế 'any' bằng interface UserFormValues
  const handleFinish = (values: UserFormValues) => {
    if (editingUser) {
      // Logic Cập nhật
      setUsers(prevUsers => prevUsers.map(u => {
        if (u.id === editingUser.id) {
          return {
            ...u,
            fullName: values.fullName,
            email: values.email,
            // Chỉ cập nhật passwordHash nếu người dùng nhập password mới
            passwordHash: values.password ? mockMd5Hash(values.password) : u.passwordHash
          };
        }
        return u;
      }));
      message.success('Cập nhật thông tin thành công');
    } else {

      instance.post(`/user`, {name: values.fullName, email: values.email, password: values.password}).then(res=>{console.log(res.data);}).catch(err=>{console.log(err);});

      message.success('Thêm người dùng mới thành công');
    }

    setIsModalOpen(false);
  };

  // --- Cấu hình cột cho bảng (Ant Design Table) ---
  const columns: ColumnsType<UserType> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      render: (text: number) => <Text type="secondary" code>#{text}</Text>,
    },
    {
      title: 'Họ và Tên',
      dataIndex: 'fullName',
      key: 'fullName',
      render: (text: string) => (
        <Space>
          <div style={{ width: 32, height: 32, backgroundColor: '#e6f7ff', color: '#1890ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
            {text.charAt(0).toUpperCase()}
          </div>
          <Text strong>{text}</Text>
        </Space>
      ),
      sorter: (a, b) => a.fullName.localeCompare(b.fullName),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Mật Khẩu (MD5)',
      dataIndex: 'passwordHash',
      key: 'passwordHash',
      render: (hash: string) => (
        <Tag icon={<LockOutlined />} color="default">
          {hash}
        </Tag>
      ),
      responsive: ['md'], // Ẩn trên mobile nếu cần
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 150,
      align: 'center',
      render: (_, record) => (
        <Space size="small">
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            className="text-blue-600 hover:bg-blue-50"
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="Xóa người dùng"
            description="Bạn có chắc chắn muốn xóa user này không?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button 
              type="text" 
              danger 
              icon={<DeleteOutlined />} 
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Lọc dữ liệu cho bảng
  const filteredData = users.filter(user => 
    user.fullName.toLowerCase().includes(searchText.toLowerCase()) ||
    user.email.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Header & Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <Title level={2} style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
              <UserOutlined style={{ color: '#1677ff' }} /> Quản Lý Người Dùng
            </Title>
            <Text type="secondary">Quản lý danh sách email, họ tên và bảo mật với Ant Design & TypeScript.</Text>
          </div>
          
          <Button 
            type="primary" 
            size="large" 
            icon={<PlusOutlined />} 
            onClick={handleAddNew}
          >
            Thêm Người Dùng
          </Button>
        </div>

        {/* Search & Stats */}
        <Card bordered={false} className="shadow-sm rounded-lg mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <Input 
              size="large" 
              placeholder="Tìm kiếm theo tên hoặc email..." 
              prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />} 
              allowClear
              onChange={(e) => setSearchText(e.target.value)}
              style={{ maxWidth: 400 }}
            />
            <Text strong>Tổng số: <span style={{ color: '#1677ff' }}>{users.length}</span> users</Text>
          </div>
        </Card>

        {/* Table */}
        <Card bordered={false} className="shadow-md rounded-lg" bodyStyle={{ padding: 0 }}>
          <Table<UserType> 
            columns={columns} 
            dataSource={filteredData} 
            rowKey="id"
            pagination={{ pageSize: 5 }}
          />
        </Card>

        {/* Modal Form */}
        <Modal
          title={
            <div className="flex items-center gap-2 text-lg">
              {editingUser ? <EditOutlined className="text-blue-600" /> : <PlusOutlined className="text-blue-600" />}
              {editingUser ? "Cập nhật thông tin" : "Thêm người dùng mới"}
            </div>
          }
          open={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          footer={null} // Tự custom footer trong Form
          destroyOnClose
        >
          <Form<UserFormValues>
            form={form}
            layout="vertical"
            onFinish={handleFinish}
            className="mt-4"
          >
            <Form.Item
              name="fullName"
              label="Họ và Tên"
              rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
            >
              <Input prefix={<UserOutlined />} placeholder="Nhập họ tên..." size="large" />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Vui lòng nhập email!' },
                { type: 'email', message: 'Email không hợp lệ!' }
              ]}
            >
              <Input prefix={<MailOutlined />} placeholder="example@gmail.com" size="large" />
            </Form.Item>

            <Form.Item
              name="password"
              label={editingUser ? "Mật khẩu mới (Để trống nếu không đổi)" : "Mật khẩu"}
              rules={[
                { 
                  required: !editingUser, 
                  message: 'Vui lòng nhập mật khẩu cho người dùng mới!' 
                }
              ]}
              extra={editingUser ? "Mật khẩu sẽ được cập nhật lại mã hash MD5 mới nếu bạn nhập vào đây." : "Mật khẩu sẽ được lưu dưới dạng mã hash MD5."}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="Nhập mật khẩu..." size="large" />
            </Form.Item>

            <Form.Item className="mb-0 flex justify-end">
              <Space className="w-full justify-end mt-4">
                <Button onClick={() => setIsModalOpen(false)}>
                  Hủy bỏ
                </Button>
                <Button type="primary" htmlType="submit">
                  {editingUser ? "Lưu thay đổi" : "Thêm mới"}
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>

      </div>
    </div>
  );
}