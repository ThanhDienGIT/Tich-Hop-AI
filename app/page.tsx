'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { Row, Col, Input, Select, Slider, Radio, Card, Typography, Space, Rate, Button, Badge } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';

// Bỏ các import không cần thiết, di chuyển type vào đây
// import './styles/ProductPage.css'; // Bỏ, không cần file CSS nữa
// import { Product } from './types'; // Bỏ, định nghĩa type trực tiếp
// import ProductCard from './components/ProductCard'; // Bỏ, đã gộp vào

const { Title, Text } = Typography;
const { Option } = Select;

// Định nghĩa kiểu dữ liệu Product trực tiếp trong file
// Thêm trường 'discount' để hiển thị badge giảm giá
export type Product = {
  id: number;
  name: string;
  type: string;
  price: number;
  sold: number;
  rating: number;
  image: string;
  platform: 'shopee' | 'tiktok' | 'generic';
  discount?: number; // discount là optional
};

// --- Dữ liệu giả lập (thêm trường discount) ---
const mockProducts: Product[] = [
  { id: 1, name: 'Tai nghe Bluetooth Pro chống ồn', type: 'electronics', price: 1250000, sold: 1200, rating: 4.5, image: 'https://down-vn.img.susercontent.com/file/vn-11134207-7ra0g-m7e1mjy07sc3da.webp', platform: 'shopee', discount: 45 },
  { id: 2, name: 'Áo thun Cotton 100% thoáng mát', type: 'fashion', price: 250000, sold: 5000, rating: 5, image: '/images/tshirt.jpg', platform: 'tiktok' },
  { id: 3, name: 'Bàn phím cơ RGB Kailh Switch', type: 'electronics', price: 2100000, sold: 800, rating: 4.8, image: '/images/keyboard.jpg', platform: 'shopee', discount: 20 },
  { id: 4, name: 'Nồi chiên không dầu 5L Lock&Lock', type: 'appliances', price: 1800000, sold: 2500, rating: 4.7, image: '/images/airfryer.jpg', platform: 'generic' },
  { id: 5, name: 'Quần Jeans Nam co giãn Slimfit', type: 'fashion', price: 450000, sold: 8000, rating: 4.9, image: '/images/jeans.jpg', platform: 'tiktok', discount: 15 },
];

const MAX_PRICE = 5000000;

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, MAX_PRICE]);
  const [sortOrder, setSortOrder] = useState('none');

  const filteredAndSortedProducts = useMemo(() => {
    // ... logic lọc không đổi ...
    let filtered = mockProducts;
    if (searchTerm) {
      filtered = filtered.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    if (selectedType !== 'all') {
      filtered = filtered.filter(p => p.type === selectedType);
    }
    filtered = filtered.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);
    if (sortOrder === 'asc') {
      return [...filtered].sort((a, b) => a.price - b.price);
    }
    if (sortOrder === 'desc') {
      return [...filtered].sort((a, b) => b.price - a.price);
    }
    return filtered;
  }, [searchTerm, selectedType, priceRange, sortOrder]);

  return (
    <main className="max-w-screen-2xl mx-auto p-4 md:p-8">
      <Row gutter={[32, 32]}>
        {/* === CỘT BỘ LỌC === */}
        <Col xs={24} lg={6} xl={5} xxl={4}>
          <Card title="Bộ lọc tìm kiếm">
            {/* ... Nội dung bộ lọc không đổi ... */}
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              <Input.Search
                placeholder="Tên sản phẩm..."
                onSearch={value => setSearchTerm(value)}
                onChange={e => setSearchTerm(e.target.value)}
                allowClear
              />
              <Select defaultValue="all" style={{ width: '100%' }} onChange={value => setSelectedType(value)}>
                <Option value="all">Tất cả danh mục</Option>
                <Option value="electronics">Đồ điện tử</Option>
                <Option value="fashion">Thời trang</Option>
                <Option value="appliances">Gia dụng</Option>
              </Select>
              <div>
                <Text>Khoảng giá</Text>
                <Slider range min={0} max={MAX_PRICE} defaultValue={[0, MAX_PRICE]} onChange={value => setPriceRange(value)} step={50000} tooltip={{ formatter: value => `${value?.toLocaleString()} ₫` }}/>
              </div>
              <div>
                <Text>Sắp xếp theo</Text>
                <Radio.Group onChange={e => setSortOrder(e.target.value)} value={sortOrder}>
                  <Space direction="vertical">
                    <Radio value="none">Mặc định</Radio>
                    <Radio value="asc">Giá: Thấp đến Cao</Radio>
                    <Radio value="desc">Giá: Cao đến Thấp</Radio>
                  </Space>
                </Radio.Group>
              </div>
            </Space>
          </Card>
        </Col>

        {/* === CỘT DANH SÁCH SẢN PHẨM === */}
        <Col xs={24} lg={18} xl={19} xxl={20}>
          <Row gutter={[16, 16]}>
            {filteredAndSortedProducts.length > 0 ? (
              filteredAndSortedProducts.map(product => {
                // --- LOGIC CỦA PRODUCT CARD ĐƯỢC GỘP VÀO ĐÂY ---
                const cardContent = (
                  <Card
                    hoverable
                    style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                    bodyStyle={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '16px' }}
                    cover={
                      <div style={{ aspectRatio: '1 / 1', position: 'relative' }}>
                        <Image
                          alt={product.name}
                          src={product.image}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          style={{ objectFit: 'contain', padding: '8px' }}
                        />
                      </div>
                    }
                  >
                    <div>
                      <Title level={5} ellipsis={{ rows: 2, tooltip: product.name }}>
                        {product.name}
                      </Title>
                      <Row justify="space-between" align="middle" style={{ margin: '8px 0' }}>
                        <Text strong style={{ color: '#d70018', fontSize: '1rem' }}>
                            {product.price.toLocaleString()} ₫
                        </Text>
                        <Text type="secondary" style={{ fontSize: '0.8rem' }}>Đã bán {product.sold > 1000 ? `${(product.sold/1000).toFixed(1)}k` : product.sold}</Text>
                      </Row>
                    </div>
                    <Button
                      type="primary"
                      danger
                      icon={<ShoppingCartOutlined />}
                      style={{ width: '100%', marginTop: 'auto' }}
                    >
                      Mua
                    </Button>
                  </Card>
                );

                return (
                  <Col key={product.id} xs={24} sm={12} md={8} xl={8} xxl={5}>
                    {/* Sử dụng Badge.Ribbon cho tag giảm giá */}
                    {product.discount ? (
                      <Badge.Ribbon text={`${product.discount}% Giảm`} color="red">
                        {cardContent}
                      </Badge.Ribbon>
                    ) : (
                      cardContent
                    )}
                  </Col>
                );
                // --- KẾT THÚC LOGIC PRODUCT CARD ---
              })
            ) : (
              <Col span={24} style={{ textAlign: 'center', marginTop: '40px' }}>
                <Title level={4}>Không tìm thấy sản phẩm phù hợp</Title>
              </Col>
            )}
          </Row>
        </Col>
      </Row>
    </main>
  );
}