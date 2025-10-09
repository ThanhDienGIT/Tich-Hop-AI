// ví dụ: app/components/Banner.tsx
'use client';

import React from 'react';
import { Carousel, Typography, Button } from 'antd';

const { Title, Paragraph } = Typography;

// Style chung cho các slide, bạn có thể tùy chỉnh
const contentStyle: React.CSSProperties = {

  height: '450px', // Chiều cao của banner
  color: '#fff',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  position: 'relative',
};

// Lớp phủ màu tối để làm nổi bật chữ
const overlayStyle: React.CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  zIndex: 1,
};

// Style cho nội dung text nằm trên lớp phủ
const textContentStyle: React.CSSProperties = {
  position: 'relative',
  zIndex: 2,
  textAlign: 'center',
  maxWidth: '800px',
};


function Banner() {
  return (
    <Carousel autoplay effect="fade">
      {/* --- Slide 1 --- */}
      <div>
        <div style={{
          ...contentStyle,
          backgroundImage: `url('https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop')`, // Thay bằng link ảnh của bạn
        }}>
          <div style={overlayStyle}></div>
          <div style={textContentStyle}>
            <Title level={2} style={{ color: 'white' }}>Sản Phẩm Công Nghệ Mới Nhất</Title>
            <Paragraph style={{ color: 'white', fontSize: '1.2rem' }}>
              Khám phá những thiết bị công nghệ đỉnh cao, thay đổi cuộc sống của bạn.
            </Paragraph>
            <Button type="primary" size="large">Khám Phá Ngay</Button>
          </div>
        </div>
      </div>

      {/* --- Slide 2 --- */}
      <div>
        <div style={{
          ...contentStyle,
          backgroundImage: `url('https://images.unsplash.com/photo-1496171367470-9ed9a91ea931?q=80&w=2070&auto=format&fit=crop')`, // Thay bằng link ảnh của bạn
        }}>
          <div style={overlayStyle}></div>
          <div style={textContentStyle}>
            <Title level={2} style={{ color: 'white' }}>Ưu Đãi Thời Trang Mùa Hè</Title>
            <Paragraph style={{ color: 'white', fontSize: '1.2rem' }}>
              Giảm giá lên đến 50% cho các bộ sưu tập hàng đầu.
            </Paragraph>
            <Button type="primary" size="large">Mua Sắm</Button>
          </div>
        </div>
      </div>

      {/* --- Slide 3 --- */}
      <div>
        <div style={{
          ...contentStyle,
          backgroundImage: `url('https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1974&auto=format&fit=crop')`, // Thay bằng link ảnh của bạn
        }}>
          <div style={overlayStyle}></div>
          <div style={textContentStyle}>
            <Title level={2} style={{ color: 'white' }}>Đồ Gia Dụng Thông Minh</Title>
            <Paragraph style={{ color: 'white', fontSize: '1.2rem' }}>
              Nâng tầm không gian sống của bạn với các thiết bị hiện đại.
            </Paragraph>
            <Button type="primary" size="large">Xem Chi Tiết</Button>
          </div>
        </div>
      </div>
    </Carousel>
  );
}

export default Banner;