'use client'

import React, { useState } from 'react';
// Thêm import cho router và pathname
import { useRouter, usePathname } from 'next/navigation'; 
import {
  Layout,
  Menu,
  Avatar,
  Dropdown,
  Space,
  theme,
  Button,
} from 'antd';
import {
  UserOutlined,
  LogoutOutlined,
  ShopOutlined,
  TagsOutlined,
  RobotOutlined,
  MailOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from '@ant-design/icons';
import Link from 'next/link';

const { Header, Sider, Content } = Layout;

// 1. Cập nhật các mục menu với key là đường dẫn (path)
const siderMenuItems = [
  {
    key: '/admin/products', // Cập nhật key thành path
    icon: <ShopOutlined />,
    label: 'Quản lý sản phẩm',
  },
  {
    key: '/admin/products_new', // Cập nhật key thành path
    icon: <ShopOutlined />,
    label: 'Quản lý sản phẩm CRAW',
  },
  {
    key: '/admin/categories', // Cập nhật key (tôi đoán đường dẫn này)
    icon: <TagsOutlined />,
    label: 'Quản lý loại sản phẩm',
  },
  {
    key: '/admin/gemini', // Cập nhật key thành path
    icon: <RobotOutlined />,
    label: 'Chức năng AI',
  },
  {
    key: '/admin/contacts', // Cập nhật key (tôi đoán đường dẫn này)
    icon: <MailOutlined />,
    label: 'Quản lý liên hệ',
  },
];

// Component Layout chính
const AdminLayout = ({ children } : any) => {
  const [collapsed, setCollapsed] = useState(false);
  
  // 2. Khởi tạo router và lấy pathname
  const router = useRouter();
  const pathname = usePathname();

  // Sử dụng hook theme của AntD để lấy màu nền chuẩn
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // 2. Xử lý sự kiện khi click vào menu dropdown của user
  const handleUserMenuClick = ({ key } : any) => {
    if (key === 'logout') {
      console.log('Thực hiện đăng xuất...');
      // TODO: Thêm logic đăng xuất ở đây
    } else if (key === 'account') {
      console.log('Đi đến trang tài khoản...');
      // TODO: Thêm logic điều hướng đến trang tài khoản
    }
  };

  // 3. Định nghĩa các mục menu cho Dropdown của Avatar
  const userMenuItems = [
    {
      key: 'account',
      icon: <UserOutlined />,
      label: 'Tài khoản',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Đăng xuất',
      danger: true, // Hiển thị màu đỏ
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* 4. Sidebar (Sider) */}
      <Sider trigger={null} collapsible collapsed={collapsed}>
        {/* Logo (Bạn có thể thay thế bằng logo của mình) */}
        <div 
          style={{ 
            height: 32, 
            margin: 16, 
            background: 'rgba(255, 255, 255, 0.2)', 
            borderRadius: 6,
            textAlign: 'center',
            lineHeight: '32px',
            color: 'white',
            fontWeight: 'bold'
          }}
        >
          <Link href="/admin">{collapsed ? 'AD' : 'ADMIN'}</Link> 
        </div>
        
        {/* Menu của Sidebar */}
        <Menu
          theme="dark"
          mode="inline"
          // 4. Sử dụng pathname để tự động chọn đúng mục menu
          selectedKeys={[pathname]} 
          items={siderMenuItems}
          // 5. Cập nhật onClick để điều hướng
          onClick={({ key }) => {
            // key bây giờ chính là đường dẫn
            router.push(key); 
          }}
        />
      </Sider>
      
      {/* 5. Layout chính (Header + Content) */}
      <Layout>
        {/* Header */}
        <Header 
          style={{ 
            padding: 0, 
            background: colorBgContainer,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          {/* Nút thu gọn/mở rộng Sidebar */}
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
          
          {/* Menu Avatar bên phải */}
          <div style={{ paddingRight: 24 }}>
            <Dropdown menu={{ items: userMenuItems, onClick: handleUserMenuClick }} trigger={['click']}>
              <a onClick={(e) => e.preventDefault()} style={{ cursor: 'pointer' }}>
                <Space>
                  <Avatar size="large" icon={<UserOutlined />} />
                  <span style={{color: '#333'}}>Xin chào, Admin</span>
                </Space>
              </a>
            </Dropdown>
          </div>
        </Header>
        
        {/* 6. Nội dung chính của trang (Content) */}
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          {/* children là nơi nội dung của từng trang con (ví dụ: Dashboard) sẽ được render */}
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;