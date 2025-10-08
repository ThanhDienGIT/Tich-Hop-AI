'use client'; // <--- THÊM DÒNG NÀY VÀO ĐẦU TIÊN

import React from 'react';
import { Layout, Row, Col, Typography, Form, Input, Button } from 'antd';

const { Footer: AntFooter } = Layout;
const { Title, Text, Paragraph, Link } = Typography;

function Footer() {
  // 1. Ant Design Form cung cấp hook để quản lý form
  const [form] = Form.useForm();

  // 2. Hàm onFinish sẽ được gọi khi form hợp lệ và được submit
  // Nó tự động nhận các giá trị của form
  const onFinish = (values : any) => {
    console.log('Success:', values);
    alert(`Cảm ơn ${values.name}! Chúng tôi đã nhận được câu hỏi của bạn.`);
    form.resetFields(); // Reset các trường của form
  };

  const onFinishFailed = (errorInfo : any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <AntFooter style={{ backgroundColor: 'var(--background-header)', color: 'var(--color-header)', paddingTop: '40px', paddingBottom: '40px' }}>
      {/* Dùng Row và Col để tạo layout. gutter là khoảng cách giữa các cột */}
      <Row gutter={[32, 32]} justify="center" align="top">
        
        {/* === Cột Thông Tin === */}
        {/* xs={24}: Trên màn hình siêu nhỏ, cột chiếm 24/24 (full width) */}
        {/* lg={10}: Trên màn hình lớn, cột chiếm 10/24 */}
        <Col xs={24} md={12} lg={10}>
          <Title level={4} style={{ color: 'white' }}>Về Chúng Tôi</Title>
          <Paragraph style={{  color: 'var(--color-header)' }}>
            &copy; {new Date().getFullYear()} CyberTrust. All Rights Reserved.
          </Paragraph>
          <Paragraph style={{  color: 'var(--color-header)' }}>
            Chúng tôi cung cấp các giải pháp công nghệ tiên tiến, bảo mật và đáng tin cậy.
          </Paragraph>
          <Button 
            type="primary" 
            href="mailto:theshy.snow0612@gmail.com"
            size="large"
            style={{ backgroundColor: 'var(--color-header)', color: 'var(--background-header)' }}
          >
            Liên Hệ Qua Email
          </Button>
        </Col>

        {/* === Cột Form Liên Hệ === */}
        <Col xs={24} md={12} lg={10}>
          <Title level={4} style={{ color: 'white' }}>Gửi Câu Hỏi Cho Chúng Tôi</Title>
          <Form
            form={form}
            name="contact"
            layout="vertical"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            initialValues={{ remember: true }}
            autoComplete="off"
          >
            <Form.Item
              label={<Text style={{ color: 'white' }}>Họ và Tên</Text>}
              name="name"
              rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
            >
              <Input placeholder="Nguyễn Văn A" />
            </Form.Item>

            <Form.Item
              label={<Text style={{ color: 'white' }}>Email</Text>}
              name="email"
              rules={[
                { required: true, message: 'Vui lòng nhập email!' },
                { type: 'email', message: 'Email không hợp lệ!' }
              ]}
            >
              <Input placeholder="email@example.com" />
            </Form.Item>
            
            <Form.Item
              label={<Text style={{ color: 'white' }}>Số điện thoại (không bắt buộc)</Text>}
              name="phone"
            >
              <Input />
            </Form.Item>

            <Form.Item
              label={<Text style={{ color: 'white' }}>Câu hỏi của bạn</Text>}
              name="question"
              rules={[{ required: true, message: 'Vui lòng nhập câu hỏi của bạn!' }]}
            >
              <Input.TextArea rows={4} placeholder="Nội dung câu hỏi..." />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" style={{ backgroundColor: 'var(--color-header)', color: 'var(--background-header)' }}>
                Gửi đi
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </AntFooter>
  );
}

export default Footer;