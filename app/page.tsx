'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { 
  Row, Col, Input, Select, Slider, Radio, Card, 
  Typography, Space, Button, Badge, Spin, message 
} from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import Banner from './component/Banner';
// Import instance Axios (ĐÃ SỬA ĐƯỜNG DẪN theo yêu cầu của bạn)
import { instance } from './service/http/instance'; 

const { Title, Text } = Typography;
const { Option } = Select;

// --- Cấu trúc dữ liệu Product (Đã cập nhật) ---
// Khớp với dữ liệu API (app/api/product/route.ts) trả về
export type Product = {
  id: string;
  name: string;
  type: number;       // API trả về số (1, 2, 3)
  urlLink: string;
  price: string;      // API trả về string ("1.250.000 vnđ...")
  image: string;
  description: string;
  countSale: number;  // API trả về countSale
  countEvaluate: number;
  start: number;      // API trả về start (thay cho rating)
  discount?: number; 
};

// --- Định nghĩa loại sản phẩm (Khớp với Admin và API) ---
const productTypes = [
  { value: 1, label: 'Affiliate' },
  { value: 2, label: 'Khóa học' },
  { value: 3, label: 'Dịch vụ' },
];

const MAX_PRICE = 10000000; // Tăng max price

/**
 * Helper: Phân tích giá từ string ("1.250.000 vnđ") sang number (1250000)
 * để dùng cho bộ lọc và sắp xếp.
 */
const parsePrice = (priceStr: string): number => {
  if (!priceStr) return 0;
  // Lấy phần đầu tiên (1.250.000), loại bỏ dấu chấm, và chuyển sang số
  const numStr = priceStr.split(' ')[0].replace(/\./g, '');
  const priceNum = parseInt(numStr, 10);
  return isNaN(priceNum) ? 0 : priceNum;
};

export default function Home() {
  // --- STATE ---
  const [allProducts, setAllProducts] = useState<Product[]>([]); // State chứa data từ API
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all'); // 'all' hoặc number
  const [priceRange, setPriceRange] = useState<[number, number]>([0, MAX_PRICE]);
  const [sortOrder, setSortOrder] = useState('none');

  // --- EFFECT: GỌI API LẤY DỮ LIỆU ---
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // Sử dụng instance axios để gọi API
        const response = await instance.get('/product');
        setAllProducts(response.data || []);
      } catch (error: any) {
        console.error("Fetch products error:", error);
        const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch products';
        message.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []); // Chạy 1 lần khi component mount

  // --- MEMO: LỌC VÀ SẮP XẾP SẢN PHẨM ---
  const filteredAndSortedProducts = useMemo(() => {
    
    let filtered = allProducts
      // 1. Phân tích giá (parse price)
      .map(p => ({
        ...p,
        // Thêm trường 'numericPrice' để lọc và sắp xếp
        numericPrice: parsePrice(p.price) 
      }));
      
    // 2. Lọc theo tên
    if (searchTerm) {
      filtered = filtered.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    
    // 3. Lọc theo loại (type) - Đã sửa sang dùng số
    if (selectedType !== 'all') {
      filtered = filtered.filter(p => p.type === selectedType);
    }
    
    // 4. Lọc theo khoảng giá (dùng 'numericPrice')
    filtered = filtered.filter(p => p.numericPrice >= priceRange[0] && p.numericPrice <= priceRange[1]);
    
    // 5. Sắp xếp (dùng 'numericPrice')
    if (sortOrder === 'asc') {
      return [...filtered].sort((a, b) => a.numericPrice - b.numericPrice);
    }
    if (sortOrder === 'desc') {
      return [...filtered].sort((a, b) => b.numericPrice - a.numericPrice);
    }
    
    return filtered;
    
  }, [allProducts, searchTerm, selectedType, priceRange, sortOrder]);


  return (
    <main className="max-w-screen-2xl mx-auto">

      <Banner/>
      <Row gutter={[32, 32]} style={{marginTop:20,marginBottom:20}}>
        {/* === CỘT BỘ LỌC === */}
        <Col xs={24} lg={6} xl={4} xxl={4}>
          <Card title="Bộ lọc tìm kiếm">
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              

              <Input.Search
                placeholder="Tên sản phẩm..."
                onSearch={value => setSearchTerm(value)}
                onChange={e => setSearchTerm(e.target.value)}
                allowClear
              />
              {/* Sửa Select để dùng `productTypes` (số) */}
              <Select 
                defaultValue="all" 
                style={{ width: '100%' }} 
                onChange={value => setSelectedType(value)}
              >
                <Option value="all">Tất cả danh mục</Option>
                {productTypes.map(type => (
                  <Option key={type.value} value={type.value}>{type.label}</Option>
                ))}
              </Select>
              
              <div>
                <Text>Khoảng giá</Text>
                <Slider 
                  range 
                  min={0} 
                  max={MAX_PRICE} 
                  defaultValue={[0, MAX_PRICE]} 
                  onChange={(value: [number, number]) => setPriceRange(value)} 
                  step={100000} 
                  tooltip={{ formatter: value => `${value?.toLocaleString()} ₫` }}
                />
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
        <Col xs={24} lg={20} xl={20} xxl={20}>
          {/* Thêm Spin (loading) */}
          <Spin spinning={loading}>
            <Row gutter={[16, 16]}>
              {filteredAndSortedProducts.length > 0 ? (
                filteredAndSortedProducts.map(product => {
                  // --- LOGIC CỦA PRODUCT CARD ĐƯỢC GỘP VÀO ĐÂY ---
                  const cardContent = (
                    <Card
                      hoverable
                      style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                  
                      cover={
                        <div style={{ aspectRatio: '1 / 1', position: 'relative' }}>
                          <Image
                            alt={product.name}
                            src={product.image || 'https://placehold.co/300x300?text=Image'} // Thêm ảnh fallback
                            fill
                            style={{ objectFit: 'contain', padding: '8px' }}
                            // Xử lý lỗi nếu ảnh từ API bị hỏng
                            onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/300x300?text=Error'; }}
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
                            {/* Hiển thị giá (string) trực tiếp từ API */}
                            {product.price}
                          </Text>
                          <Text type="secondary" style={{ fontSize: '0.8rem' }}>
                            {/* Sửa 'sold' thành 'countSale' */}
                            Đã bán {product.countSale > 1000 ? `${(product.countSale/1000).toFixed(1)}k` : product.countSale}
                          </Text>
                        </Row>
                      </div>
                      <Button
                        type="primary"
                        danger
                        icon={<ShoppingCartOutlined />}
                        style={{ width: '100%', marginTop: 'auto' }}
                        // Mở link sản phẩm khi click
                        href={product.urlLink}
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        Mua ngay
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
                // Giữ nguyên thông báo khi không tìm thấy
                !loading && (
                  <Col span={24} style={{ textAlign: 'center', marginTop: '40px' }}>
                    <Title level={4}>Không tìm thấy sản phẩm phù hợp</Title>
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