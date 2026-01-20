'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import {
  Row, Col, Input, Select, Slider, Radio, Card,
  Typography, Space, Button, Badge, Spin, message
} from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import Banner from '../component/Banner';
import { instance } from '../service/http/instance';
import Link from 'next/link';

const { Title, Text } = Typography;
const { Option } = Select;

// --- 1. CẬP NHẬT TYPE PRODUCT (Theo JSON mới) ---
export type Product = {
  id: string;
  code?: string;        // Mới thêm (có thể có hoặc không)
  name: string;
  type: number;
  urlLink: string;
  price: string;        // "125.000.000 VNĐ"
  image: string;        // ĐÃ SỬA: String thay vì array object
  description: string;
  countSale: number;
  countEvaluate: number;
  start: number;
  createdAt?: number;
  discount?: number;
};

// --- Định nghĩa loại sản phẩm ---
const productTypes = [
  { value: 1, label: 'Affiliate' },
  { value: 2, label: 'Khóa học' },
  { value: 3, label: 'Dịch vụ' },
];

// ĐÃ SỬA: Tăng Max Price lên 500 triệu để bao quát được sản phẩm giá cao
const MAX_PRICE = 500000000; 

/**
 * Helper: Phân tích giá từ string ("125.000.000 VNĐ") sang number
 * Dùng Regex \D để loại bỏ mọi ký tự không phải số
 */
const parsePrice = (priceStr: string): number => {
  if (!priceStr) return 0;
  // Loại bỏ tất cả ký tự không phải số (dấu chấm, chữ VNĐ, khoảng trắng...)
  const numStr = priceStr.replace(/\D/g, ''); 
  const priceNum = parseInt(numStr, 10);
  return isNaN(priceNum) ? 0 : priceNum;
};

export default function Home() {
  // --- STATE ---
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, MAX_PRICE]);
  const [sortOrder, setSortOrder] = useState('none');

  // --- EFFECT: GỌI API ---
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await instance.get('/product');
        console.log("API Response:", response);
        // Đảm bảo lấy đúng mảng dữ liệu (tùy thuộc vào backend trả về data hay data.data)
        setAllProducts(Array.isArray(response.data) ? response.data : []); 
      } catch (error: any) {
        console.error("Fetch products error:", error);
        message.error('Không thể tải danh sách sản phẩm');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // --- MEMO: LỌC VÀ SẮP XẾP ---
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = allProducts.map(p => ({
      ...p,
      numericPrice: parsePrice(p.price) // Tạo giá trị số để sort/filter
    }));

    // 1. Lọc theo tên (Search)
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchTerm.trim().toLowerCase())
      );
    }

    // 2. Lọc theo loại (Type)
    if (selectedType !== 'all') {
      filtered = filtered.filter(p => p.type === Number(selectedType));
    }

    // 3. Lọc theo khoảng giá
    filtered = filtered.filter(p => p.numericPrice >= priceRange[0] && p.numericPrice <= priceRange[1]);

    // 4. Sắp xếp
    if (sortOrder === 'asc') {
      return [...filtered].sort((a, b) => a.numericPrice - b.numericPrice);
    }
    if (sortOrder === 'desc') {
      return [...filtered].sort((a, b) => b.numericPrice - a.numericPrice);
    }

    return filtered;
  }, [allProducts, searchTerm, selectedType, priceRange, sortOrder]);

  return (
    <main className="max-w-screen-2xl mx-auto p-4">
      <Banner />
      
      <Row gutter={[32, 32]} style={{ marginTop: 20, marginBottom: 20 }}>
        {/* === CỘT BỘ LỌC === */}
        <Col xs={24} lg={6} xl={5} xxl={4}>
          <Card title="Bộ lọc tìm kiếm" bordered={false} className="shadow-sm">
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              
              {/* Input tìm kiếm */}
              <div>
                <Text strong>Tìm tên sản phẩm</Text>
                <Input
                  placeholder="Nhập tên..."
                  onChange={e => setSearchTerm(e.target.value)}
                  allowClear
                  style={{ marginTop: 8 }}
                />
              </div>

              {/* Select danh mục */}
              <div>
                <Text strong>Danh mục</Text>
                <Select
                  defaultValue="all"
                  style={{ width: '100%', marginTop: 8 }}
                  onChange={value => setSelectedType(value)}
                >
                  <Option value="all">Tất cả</Option>
                  {productTypes.map(type => (
                    <Option key={type.value} value={type.value}>{type.label}</Option>
                  ))}
                </Select>
              </div>

              {/* Slider giá */}
              <div>
                <Text strong>Khoảng giá</Text>
                <Slider
                  range
                  min={0}
                  max={MAX_PRICE}
                  defaultValue={[0, MAX_PRICE]}
                  onChange={(value: number | number[]) => setPriceRange(value as [number, number])}
                  step={50000}
                  tooltip={{ formatter: value => `${value?.toLocaleString('vi-VN')} ₫` }}
                  style={{ marginTop: 8 }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#888' }}>
                    <span>0đ</span>
                    <span>{MAX_PRICE.toLocaleString('vi-VN')}đ</span>
                </div>
              </div>

              {/* Radio Sắp xếp */}
              <div>
                <Text strong>Sắp xếp giá</Text>
                <Radio.Group 
                  onChange={e => setSortOrder(e.target.value)} 
                  value={sortOrder}
                  style={{ display: 'flex', flexDirection: 'column', marginTop: 8 }}
                >
                  <Radio value="none">Mặc định</Radio>
                  <Radio value="asc">Thấp đến Cao</Radio>
                  <Radio value="desc">Cao đến Thấp</Radio>
                </Radio.Group>
              </div>
            </Space>
          </Card>
        </Col>

        {/* === CỘT DANH SÁCH SẢN PHẨM === */}
        <Col xs={24} lg={18} xl={19} xxl={20}>
          <Spin spinning={loading} tip="Đang tải sản phẩm...">
            <Row gutter={[16, 16]}>
              {filteredAndSortedProducts.length > 0 ? (
                filteredAndSortedProducts.map(product => {
                  
                  // --- RENDER CARD ---
                  const cardContent = (
                    <Link href={`/main/${product.id}`} style={{ textDecoration: 'none' }}>
                      <Card
                        hoverable
                        bordered={false}
                        className="shadow-sm h-full flex flex-col"
                        bodyStyle={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '12px' }}
                        cover={
                          <div style={{ aspectRatio: '1/1', position: 'relative', overflow: 'hidden' }}>
                            {/* ĐÃ SỬA: Dùng product.image trực tiếp (vì là string) */}
                            <Image
                              alt={product.name}
                              src={product.image || ''} 
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              style={{ objectFit: 'cover' }}
                              onError={(e) => { 
                                (e.target as HTMLImageElement).srcset = 'https://placehold.co/400x400?text=No+Image';
                              }}
                            />
                          </div>
                        }
                      >
                        <div style={{ flex: 1 }}>
                          <Title level={5} ellipsis={{ rows: 2, tooltip: product.name }} style={{ marginBottom: 4, fontSize: '1rem' }}>
                            {product.name}
                          </Title>
                          
                          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 8 }}>
                            <Text strong style={{ color: '#d70018', fontSize: '1.1rem' }}>
                              {product.price}
                            </Text>
                          </div>
                          
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#888', marginBottom: 12 }}>
                             <span>Đã bán: {product.countSale}</span>
                             {/* Nếu muốn hiển thị đánh giá sao */}
                             {/* <span>⭐ {product.start}</span> */}
                          </div>
                        </div>

                        <Button
                          type="primary"
                          danger
                          block
                          icon={<ShoppingCartOutlined />}
                          href={product.urlLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()} // Ngăn chặn click vào Card khi bấm nút mua
                        >
                          Mua ngay
                        </Button>
                      </Card>
                    </Link>
                  );

                  return (
                    <Col key={product.id} xs={24} sm={12} md={8} xl={6} xxl={6}>
                      {product.discount ? (
                        <Badge.Ribbon text={`-${product.discount}%`} color="red">
                          {cardContent}
                        </Badge.Ribbon>
                      ) : (
                        cardContent
                      )}
                    </Col>
                  );
                })
              ) : (
                !loading && (
                  <Col span={24} style={{ textAlign: 'center', padding: '40px' }}>
                    <Image 
                        src="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                        alt="empty"
                        width={200}
                        height={200}
                        style={{ opacity: 0.5 }}
                    />
                    <Title level={4} type="secondary" style={{ marginTop: 20 }}>
                        Không tìm thấy sản phẩm nào
                    </Title>
                  </Col>
                )
              )}
            </Row>
          </Spin>
        </Col>
      </Row>
    </main>
  );
}