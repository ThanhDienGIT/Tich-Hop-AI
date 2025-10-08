// File: app/component/header/TopBar.tsx
'use client'
import React from 'react';
import { Space, Typography } from 'antd';
import { BellOutlined, GlobalOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { DriverDarkMode } from "../DriverDarkMode";

const { Link, Text } = Typography;

export const TopBar = () => {
  return (
    <div style={{ padding: '8px 0', borderBottom: '1px solid var(--color-border)' }}>
      {/* - Mặc định là 1 cột (mobile), từ breakpoint md (768px) trở lên sẽ là 2 cột.
        - gap-2: tạo khoảng trống giữa 2 row khi ở chế độ mobile.
        - items-center: căn giữa theo chiều dọc.
      */}
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-2 items-center">
        
        {/* === Cột Trái === */}
        {/* - Căn giữa ở mobile (justify-center).
          - Căn về bên trái từ breakpoint md trở lên (md:justify-start).
        */}
        <div className="flex justify-center md:justify-start">
          <Space split={<Text style={{ color: 'var(--color-header)' }}>|</Text>}>
            <Link href="#" target="_blank" style={{ color: 'var(--color-header)' }}>Kênh Người Bán</Link>
            <Link href="#" target="_blank" style={{ color: 'var(--color-header)' }}>Tải ứng dụng</Link>
          </Space>
        </div>

        {/* === Cột Phải === */}
        {/* - Dùng flex và cho phép xuống dòng (flex-wrap).
          - Căn giữa ở mobile (justify-center).
          - Căn về bên phải từ breakpoint md trở lên (md:justify-end).
          - gap-x-6: khoảng cách ngang, gap-y-2: khoảng cách dọc khi bị xuống dòng.
        */}
        <div className="flex flex-wrap items-center justify-center md:justify-end gap-x-6 gap-y-2">
          <Link href="#" style={{ color: 'var(--color-header)' }}><BellOutlined /> Thông báo</Link>
          <Link href="#" style={{ color: 'var(--color-header)' }}><QuestionCircleOutlined /> Hỗ trợ</Link>
          <Link href="#" style={{ color: 'var(--color-header)' }}><GlobalOutlined /> Tiếng Việt</Link>
          <DriverDarkMode />
          <Space>
            <Link href="#" style={{ color: 'var(--color-header)' }}>Đăng Ký</Link>
            <Text style={{ color: 'var(--color-header)' }}>|</Text>
            <Link href="#" style={{ color: 'var(--color-header)' }}>Đăng Nhập</Link>
          </Space>
        </div>

      </div>
    </div>
  );
};