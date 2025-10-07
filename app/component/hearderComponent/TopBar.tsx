// File: app/component/header/TopBar.tsx
'use client'
import React from 'react';
import { Flex, Space, Typography } from 'antd';
import { BellOutlined, GlobalOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { DriverDarkMode } from "../DriverDarkMode";

const { Link, Text } = Typography;

export const TopBar = () => {
  return (
    <div style={{ padding: '4px 0', borderBottom: '1px solid var(--foreground-secondary)' }}>
      <Flex justify="space-between" align="center" className="container mx-auto px-4">
        {/* Left side */}
        <Space split={<Text style={{ color: 'var(--foreground-secondary)' }}>|</Text>}>
          <Link href="#" target="_blank" style={{ color: 'var(--foreground)' }}>Kênh Người Bán</Link>
          <Link href="#" target="_blank" style={{ color: 'var(--foreground)' }}>Tải ứng dụng</Link>
        </Space>

        {/* Right side */}
        <Space size="large">
          <Link href="#" style={{ color: 'var(--foreground)' }}><BellOutlined /> Thông báo</Link>
          <Link href="#" style={{ color: 'var(--foreground)' }}><QuestionCircleOutlined /> Hỗ trợ</Link>
          <Link href="#" style={{ color: 'var(--foreground)' }}><GlobalOutlined /> Tiếng Việt</Link>
          <DriverDarkMode />
          <Space>
            <Link href="#" style={{ color: 'var(--foreground)' }}>Đăng Ký</Link>
            <Text style={{ color: 'var(--foreground-secondary)' }}>|</Text>
            <Link href="#" style={{ color: 'var(--foreground)' }}>Đăng Nhập</Link>
          </Space>
        </Space>
      </Flex>
    </div>
  );
};