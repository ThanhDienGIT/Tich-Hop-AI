'use client';
import React from 'react'; // Thêm import React
import {
  Button,
  Form,
  Input,
  Typography,
  Card,
  Row,
  Col,
  Space,
  Divider,
} from 'antd';
import {
  MailOutlined, // Đổi sang icon Mail
  LockOutlined,
  GoogleOutlined,
  FacebookOutlined,
} from '@ant-design/icons';
import Link from 'next/link';

const { Title, Text, Link: AntLink } = Typography;

export default function RegisterPage() {
  const onFinish = (values : any) => {
    console.log('Received values of form: ', values);
    // Xử lý logic đăng ký ở đây
  };

  return (
    <>
      <div className="register-container">
        <Row justify="center" align="middle" style={{ minHeight: '100vh' }}>
          <Col>
            <Card className="register-card">
              {/* 1. Logo */}
              <div className="logo-container">
                <Link href="/" className="logo-link">
                  <Title level={1} className="logo-text">
                    NEXTGENTECH
                  </Title>
                  <Text className="logo-tagline">Tổng Hợp & Xác Thực</Text>
                </Link>
              </div>

              <Divider style={{ margin: '16px 0' }} />

              {/* 2. Form Đăng Ký */}
              <Title level={4} style={{ textAlign: 'center', marginBottom: '24px' }}>
                Tạo tài khoản
              </Title>
              <Form
                name="normal_register"
                onFinish={onFinish}
                size="large"
                scrollToFirstError
              >
                <Form.Item
                  name="email"
                  rules={[
                    {
                      type: 'email',
                      message: 'Email bạn nhập không hợp lệ!',
                    },
                    {
                      required: true,
                      message: 'Vui lòng nhập Email!',
                    },
                  ]}
                >
                  <Input
                    prefix={<MailOutlined />}
                    placeholder="Email"
                  />
                </Form.Item>
                <Form.Item
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng nhập Mật khẩu!',
                    },
                  ]}
                  hasFeedback // Thêm icon feedback
                >
                  <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="Mật khẩu"
                  />
                </Form.Item>
                <Form.Item
                  name="confirm"
                  dependencies={['password']} // Phụ thuộc vào trường password
                  hasFeedback
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng xác nhận Mật khẩu!',
                    },
                    // Hàm validator để so sánh 2 mật khẩu
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('password') === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('Hai mật khẩu bạn nhập không khớp!'));
                      },
                    }),
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="Xác nhận Mật khẩu"
                  />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="register-form-button"
                  >
                    Đăng ký
                  </Button>
                </Form.Item>
              </Form>

              {/* 3. Đăng ký với Social */}
              <Divider>Hoặc đăng ký với</Divider>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Button
                  icon={<GoogleOutlined />}
                  size="large"
                  style={{ width: '100%' }}
                >
                  Đăng ký với Google
                </Button>
                <Button
                  icon={<FacebookOutlined />}
                  size="large"
                  style={{ width: '100%', background: '#1877F2', color: 'white' }}
                >
                  Đăng ký với Facebook
                </Button>
              </Space>

              <Text style={{ display: 'block', textAlign: 'center', marginTop: '24px' }}>
                Đã có tài khoản? <AntLink href="/login">Đăng nhập ngay</AntLink>
              </Text>
            </Card>
          </Col>
        </Row>
      </div>

      {/* CSS cho trang này (Giữ nguyên như trang login) */}
      <style jsx global>{`
        body {
          background-color: #f0f2f5 !important;
        }
      `}</style>

      <style jsx>{`
        .register-container {
          min-height: 100vh;
          background-color: #f0f2f5;
        }
        
        :global(.register-card) {
          width: 450px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          padding: 24px;
        }

        .logo-container {
          text-align: center;
          margin-bottom: 16px;
        }
        .logo-link {
          text-decoration: none;
          display: inline-block;
        }
        :global(.logo-text) {
          color: #0a68ff !important;
          font-weight: 700 !important;
          font-size: 48px !important;
          line-height: 1 !important;
          margin-bottom: 4px !important;
        }
        :global(.logo-tagline) {
          color: #555;
          font-size: 16px;
          font-weight: 500;
        }

        :global(.register-form-button) {
          width: 100%;
          background-color: #0a68ff !important;
        }

        @media (max-width: 576px) {
          :global(.register-card) {
            width: 90vw;
            padding: 16px;
          }
          :global(.logo-text) {
             font-size: 40px !important;
          }
        }
      `}</style>
    </>
  );
}