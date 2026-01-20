'use client'
import Link from 'next/link';
import {
  Layout,
  Row,
  Col,
  Input,
  Typography,
  Space,
  Button,
  Badge,
} from 'antd';
import {
  SearchOutlined,
  HomeOutlined,
  UserOutlined,
  HeartOutlined,
  CheckCircleOutlined,
  DatabaseOutlined,
  BarChartOutlined,
  FileSearchOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons';
import { isToken } from '../service/token/checkToken';
import { DriverDarkMode } from './DriverDarkMode';

const { Header } = Layout;
const { Title, Text, Link: AntLink } = Typography;
const { Search } = Input;

const affiliateCommitments = [
  { icon: <CheckCircleOutlined />, text: 'Thông tin đã xác thực' },
  { icon: <BarChartOutlined />, text: 'Tìm deal có giá hời nhất' },
  { icon: <FileSearchOutlined />, text: 'Nhập mã hoặc tên sản phẩm để tìm kiếm' },
  { icon: <SafetyCertificateOutlined />, text: 'Giảm rủi ro lừa đảo' },
];

const categories = [
  { name: 'Điện gia dụng', href: '/dien-gia-dung' },
  { name: 'xe cộ', href: '/xe-co' },
  { name: 'mẹ & bé', href: '/me-be' },
  //... các categories khác
];

const AffiliateHeader = () => {
  return (
    <Layout>
      <Header className="affiliate-header">
        {/* 1. Thanh thông báo */}
        <div className="promo-bar">
          <div className="container">
            Giúp bạn tìm deal tốt nhất và tránh rủi ro lừa đảo.s
          </div>
        </div>

        {/* 2. Header chính */}
        <div className="main-header">
          <div className="container">
            <Row gutter={[16, 16]} align="middle">

              {/* Cột trái: Logo (Responsive 6 breakpoint) */}
              <Col xs={24} sm={24} md={8} lg={8} xl={6} xxl={5}>
                <Link href="/" className="logo-link">
                  <Title level={1} className="logo-text">
                    NEXTGENTECH
                  </Title>
                  <Text className="logo-tagline">Tổng Hợp & Xác Thực</Text>
                </Link>
              </Col>

              {/* Cột giữa: Search (Responsive 6 breakpoint) */}
              <Col xs={24} sm={24} md={10} lg={10} xl={12} xxl={13}>
                <Space.Compact className="categories" style={{ width: '100%'}}>
                <div style={{width:'100%'}}>
                    <Input
                      placeholder="Nhập tên, mô tả, hoặc mã sản phẩm..."
                      size="large"
                      prefix={<SearchOutlined className="search-icon-prefix" />}
                      className="search-bar"
                      style={{width:'100%'}}
                    />

                    {categories.map((cat) => (
                      <Link key={cat.name} href={cat.href}>
                     &nbsp;  {cat.name},
                      </Link>
                    ))}
                </div>

              </Space.Compact>
            </Col>

            {/* Cột phải: User Actions (Responsive 6 breakpoint) */}
            <Col xs={24} sm={24} md={6} lg={6} xl={6} xxl={6}>
              <Space
                direction="vertical"
                align="end" // Sẽ căn phải trên desktop
                style={{ width: '100%' }}
                className="user-actions-container" // Thêm class để CSS
              >
                <Space size="middle" align="start">
                  <Button
                    type="text"
                    className="action-button"
                    icon={<HomeOutlined />}
                  >
                    Trang chủ
                  </Button>
                    {isToken() ? "Tên người dùng" : (<Button
                    type="text"
                    className="action-button"
                    icon={<UserOutlined />}
                    href='/login'
                  >
                    Tài khoản
                  </Button>)}

                  <Link href="/saved">
                    <Badge count={3} className="cart-badge">
                      <Button
                        type="text"
                        className="action-button"
                        icon={<HeartOutlined />}
                      >
                        Đã lưu
                      </Button>
                    </Badge>
                  </Link>
                </Space>
              </Space>
            </Col>
          </Row>
        </div>
      </div>

      {/* 3. Thanh Cam kết */}
      <div className="commitment-bar">
        <div className="container">
          <Space wrap size="large" className="commitment-items">
            {affiliateCommitments.map((item, index) => (
              <Space key={index} className="commit-item">
                {item.icon}
                <Text>{item.text}</Text>
              </Space>
            ))}
          </Space>
        </div>
      </div>
    </Header>

      {/* CSS cho component này (Styled-JSX) */ }
  <style jsx>{`
        :global(.affiliate-header) {
          background: #fff;
          height: auto;
          padding: 0;
          line-height: 1.5;
          box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.05);
        }
        .container {
          max-width: 1500px;
          margin: 0 auto;
          padding: 0 15px;
        }
        .promo-bar {
          background-color: #f0f8ff;
          color: #0a68ff;
          font-weight: 500;
          text-align: center;
          padding: 8px 0;
          font-size: 13px;
        }
        .main-header { padding: 16px 0; }
        .logo-link { text-decoration: none; }
        :global(.logo-text) {
          color: #0a68ff !important;
          font-weight: 700 !important;
          font-size: 40px !important;
          line-height: 0.9 !important;
          margin-bottom: 0 !important;
        }
        :global(.logo-tagline) {
          color: #555;
          font-size: 14px;
          font-weight: 500;
        }
        :global(.search-bar .ant-input-search-button) {
          background-color: #0a68ff !important;
          border-color: #0a68ff !important;
        }
        .categories { margin-top: 10px; }
        :global(.category-link) { color: #808089; font-size: 13px; }
        :global(.action-button) {
          display: flex;
          flex-direction: column;
          align-items: center;
          height: auto;
          padding: 0 5px;
          color: #808089 !important;
        }
        :global(.action-button .anticon) {
          font-size: 24px;
          margin-bottom: 4px;
        }
        :global(.action-button span:not(.anticon)) {
          font-size: 12px;
          white-space: normal;
          line-height: 1.2;
        }
        :global(.cart-badge .ant-badge-count) {
          background: #ff424e;
        }
        .commitment-bar {
          background: #f8faff;
          border-top: 1px solid #dee9f8;
          padding: 10px 0;
        }
        .commitment-items {
          width: 100%;
          justify-content: center;
        }
        :global(.commit-item) {
          font-size: 13px;
          color: #333;
          font-weight: 500;
        }
        :global(.commit-item .anticon) {
          font-size: 18px;
          color: #0a68ff;
        }

        /* ===== CSS Responsive ===== */
        
        /* Target 'xs' và 'sm' (mọi thứ dưới 768px) */
        @media (max-width: 767px) { 
          
          /* 1. Ẩn các link category khi màn hình nhỏ */
          :global(.categories) {
            display: none !important;
          }

          /* 2. Căn giữa Logo khi xếp chồng */
          .logo-link {
            display: flex;
            flex-direction: column;
            align-items: center; /* Căn giữa logo */
          }
          
          /* 3. Căn giữa các nút User Actions khi xếp chồng */
          :global(.user-actions-container) {
             align-items: center !important; /* Ghi đè align="end" */
          }
        }

        /* Target 'md' (tablet) - Ẩn categories nếu không đủ chỗ */
        @media (min-width: 768px) and (max-width: 991px) {
           :global(.categories) {
            /* Bạn có thể chọn ẩn hoặc giảm số lượng ở đây */
            /* display: none !important; */
           }
        }

      `}</style>
    </Layout >
  );
};

export default AffiliateHeader;