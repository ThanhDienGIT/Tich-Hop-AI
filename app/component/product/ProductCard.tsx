// app/components/ProductCard.tsx
import React from 'react';
import Image from 'next/image';
import { Card, Typography, Rate, Row, Space, Divider } from 'antd';
import { Product } from '../types';

const { Title, Text } = Typography;

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const getPlatformUI = () => {
    switch (product.platform) {
      case 'shopee':
        return { wrapperClass: 'product-frame shopee-frame', label: 'Shopee' };
      case 'tiktok':
        return { wrapperClass: 'product-frame tiktok-frame', label: 'Tiktok' };
      default:
        return { wrapperClass: '', label: null };
    }
  };

  const platformUI = getPlatformUI();

  return (
    <div className={platformUI.wrapperClass}>
      {platformUI.label && <div className="platform-label">{platformUI.label}</div>}
      <Card
        hoverable
        style={{ height: '100%' }}
        // Bọc Image trong một div để tạo khung vuông
        cover={
          <div style={{ 
            aspectRatio: '1 / 1', // Đảm bảo khung luôn là hình vuông
            position: 'relative', 
            backgroundColor: '#fff', // Thêm màu nền để ảnh không vuông trông đẹp hơn
            borderRadius: '8px 8px 0 0'
          }}>
            <Image
              alt={product.name}
              src={product.image}
              fill // Cho ảnh lấp đầy thẻ div cha
              style={{ 
                objectFit: 'contain', // Thay đổi từ 'cover' sang 'contain'
                padding: '8px', // Thêm chút đệm để ảnh không bị dính sát viền
                width: '100%',
                height: '100%',
                borderBottom:'1px solid #dbdbdbff',
              }}
            />
          </div>
        }
      >
 
        <Title level={5} ellipsis={{ rows: 2, tooltip: product.name }}>
          {product.name}
        </Title>
        <Space direction="vertical" style={{ width: '100%', marginTop: '12px' }}>
            <Rate disabled allowHalf defaultValue={product.rating} style={{ fontSize: 14 }} />
            <Row justify="space-between" align="middle">
                <Text strong style={{ color: '#ff4d4f', fontSize: '1.1rem' }}>
                    {product.price.toLocaleString()} ₫
                </Text>
                <Text type="secondary">Đã bán {product.sold > 1000 ? `${(product.sold/1000).toFixed(1)}k` : product.sold}</Text>
            </Row>
        </Space>
      </Card>
    </div>
  );
};

export default ProductCard;