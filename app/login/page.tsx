'use client';
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
  UserOutlined,
  LockOutlined,
  GoogleOutlined,
  FacebookOutlined,
} from '@ant-design/icons';
import Link from 'next/link';
import { instance } from '../service/http/instance';
// ⭐ IMPORT useROUTER TỪ NEXT/NAVIGATION
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { isToken } from '../service/token/checkToken';
const { Title, Text, Link: AntLink } = Typography;

export default function LoginPage() {

  const router = useRouter();
  const onFinish = (values : any) => {
    
    instance.post('/auth/login', {
      email: values.username,
      password: values.password,  
      // Xử lý logic đăng nhập ở đây
    }).then(res=>{

      if(res.status === 200){
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('uid', res.data.uid);
        localStorage.setItem('role', res.data.email);
        router.push('/'); // Chuyển hướng sau khi đăng nhập thành công
      }

    }).catch(err=>{
      console.error(err);
    })
  }

  useEffect(()=>{

    console.log('isToken()',isToken());

    if(isToken()){
      router.push('/');
    }else{

    }
    
  })

  return (
    <>
      <div className="login-container">
        <Row justify="center" align="middle" style={{ minHeight: '100vh' }}>
          <Col>
            <Card className="login-card">
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

              {/* 2. Form Đăng Nhập */}
              <Title level={4} style={{ textAlign: 'center', marginBottom: '24px' }}>
                Đăng nhập
              </Title>
              <Form
                name="normal_login"
                onFinish={onFinish}
                size="large"
              >
                <Form.Item
                  name="username"
                  rules={[
                    { required: true, message: 'Vui lòng nhập email!' },
                    { type: 'email', message: 'Email không đúng định dạng!' },
                  ]}
                >
                  <Input
                    prefix={<UserOutlined />}
                    placeholder="Nhập email"
                  />
                </Form.Item>
                <Form.Item
                  name="password"
                  rules={[{ required: true, message: 'Vui lòng nhập Mật khẩu!' }]}
                >
                  <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="Mật khẩu"
                  />
                </Form.Item>
                <Form.Item>
                  {/* ===== SỬA LỖI Ở ĐÂY ===== */}
                  <AntLink href="/forgot-password" style={{ float: 'right' }}>
                    Quên mật khẩu?
                  </AntLink>
                  {/* Thẻ đóng bị sai chữ hoa/thường, đã sửa từ </ANTLink> thành </AntLink> */}
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="login-form-button"
                  >
                    Đăng nhập
                  </Button>
                </Form.Item>
              </Form>

              {/* 3. Đăng nhập với Social */}
              <Divider>Hoặc đăng nhập với</Divider>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Button
                  icon={<GoogleOutlined />}
                  size="large"
                  style={{ width: '100%' }}
                >
                  Đăng nhập với Google
                </Button>
                <Button
                  icon={<FacebookOutlined />}
                  size="large"
                  style={{ width: '100%', background: '#1877F2', color: 'white' }}
                >
                  Đăng nhập với Facebook
                </Button>
              </Space>

              <Text style={{ display: 'block', textAlign: 'center', marginTop: '24px' }}>
                Chưa có tài khoản? <AntLink href="/register">Đăng ký ngay</AntLink>
              </Text>
            </Card>
          </Col>
        </Row>
      </div>

      {/* CSS cho trang này */}
      <style jsx global>{`
        /* Dùng global để style body */
        body {
          background-color: #f0f2f5 !important;
        }
      `}</style>

      <style jsx>{`
        .login-container {
          min-height: 100vh;
          background-color: #f0f2f5;
        }
        
        :global(.login-card) {
          width: 450px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          padding: 24px;
        }

        /* 1. Logo (Style y hệt header) */
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

        /* 2. Nút Đăng nhập */
        :global(.login-form-button) {
          width: 100%;
          background-color: #0a68ff !important;
        }

        /* Responsive cho Card */
        @media (max-width: 576px) {
          :global(.login-card) {
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