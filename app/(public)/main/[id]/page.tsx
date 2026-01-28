'use client';

import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import { 
  Row, Col, Card, Typography, Space, Rate, Button, 
  Spin, message, Breadcrumb, Divider, Tag , Badge
} from 'antd';
import { ShoppingCartOutlined, HomeOutlined, TagOutlined } from '@ant-design/icons';
import { instance } from '../../../service/http/instance'; 

const { Title, Text, Paragraph } = Typography;

// --- 1. ĐỒNG BỘ TYPE PRODUCT (Quan trọng: image là string) ---
export type Product = {
  id: string;
  name: string;
  type: number;       
  urlLink: string;
  price: string;      
  description: string;
  countSale: number;  
  countEvaluate: number;
  start: number;      
  discount?: number; 
  image: string; // Đã đổi từ array sang string để khớp với API và trang Home
};

const productTypes = [
  { value: 1, label: 'Affiliate' },
  { value: 2, label: 'Khóa học' },
  { value: 3, label: 'Dịch vụ' },
];

// --- Helper fix lỗi Mixed Content và Link ảnh ---
const getHttpsUrl = (url: string) => {
  if (!url) return 'https://placehold.co/600x600?text=No+Image';
  return url.replace('http://', 'https://');
};

// --- Component Card Sản phẩm Liên quan ---
const RelatedProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const router = useRouter();
  
  const cardContent = (
    <Card
      hoverable
      styles={{ body: { padding: '12px', flex: 1, display: 'flex', flexDirection: 'column' } }}
      style={{ height: '100%' }}
      cover={
        <div style={{ aspectRatio: '1 / 1', position: 'relative', overflow: 'hidden' }}>
          <Image
            alt={product.name}
            src={getHttpsUrl(product.image)}
            fill
            sizes="200px"
            style={{ objectFit: 'cover' }}
          />
        </div>
      }
      onClick={() => router.push(`/product/${product.id}`)} 
    >
      <Title level={5} ellipsis={{ rows: 2 }} style={{ fontSize: '0.9rem', marginBottom: 4 }}>
        {product.name}
      </Title>
      <Text strong style={{ color: '#d70018' }}>
        {product.price}
      </Text>
    </Card>
  );
  
  return product.discount ? (
    <Badge.Ribbon text={`-${product.discount}%`} color="red">
      {cardContent}
    </Badge.Ribbon>
  ) : (
    cardContent
  );
};

// --- Trang Chi Tiết Sản Phẩm ---
function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  const id = params.id as string; 

  // 1. Lấy chi tiết sản phẩm và danh sách liên quan
  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      setLoading(true);
      try {
        // Gọi song song cả 2 API để tối ưu tốc độ
        const [detailRes, allRes] = await Promise.all([
          instance.get(`/product/${id}`),
          instance.get('/product')
        ]);

        // Xử lý dữ liệu detail
        const detailData = detailRes.data;
        if (detailData) {
            setProduct({
                ...detailData,
                image: typeof detailData.image === 'string' ? detailData.image : (detailData.image?.[0]?.url || '')
            });
        }

        // Xử lý danh sách sản phẩm liên quan
        const listData = Array.isArray(allRes.data) ? allRes.data : (allRes.data?.data || []);
        setAllProducts(listData);

      } catch (error: any) {
        console.error("Fetch error:", error);
        message.error('Không thể tải thông tin sản phẩm.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const relatedProducts = useMemo(() => {
    if (!product || !allProducts.length) return [];
    return allProducts
      .filter(p => p.type === product.type && p.id !== product.id)
      .slice(0, 6); 
  }, [product, allProducts]);

  const productTypeName = productTypes.find(t => t.value === product?.type)?.label || 'Sản phẩm';

  if (loading) return <Spin size="large" fullscreen tip="Đang tải chi tiết..." />;

  if (!product) {
    return (
      <div style={{ textAlign: 'center', padding: '100px' }}>
        <Title level={3}>Sản phẩm không tồn tại</Title>
        <Button type="primary" onClick={() => router.push('/')}>Quay lại trang chủ</Button>
      </div>
    );
  }

  return (
    <main className="max-w-screen-xl mx-auto p-4 md:p-8">
      <Breadcrumb
        style={{ marginBottom: 24 }}
        items={[
          { href: '/', title: <><HomeOutlined /> Trang chủ</> },
          { title: productTypeName },
          { title: product.name },
        ]}
      />

      <Row gutter={[32, 32]}>
        {/* Cột ảnh */}
        <Col xs={24} md={10}>
          <Card styles={{ body: { padding: 8 } }}>
            <div style={{ aspectRatio: '1 / 1', position: 'relative', borderRadius: '8px', overflow: 'hidden' }}>
              <Image
                alt={product.name}
                src={getHttpsUrl(product.image)}
                fill
                priority // Ưu tiên load ảnh này trước
                style={{ objectFit: 'contain' }}
              />
            </div>
          </Card>
        </Col>
        
        {/* Cột thông tin */}
        <Col xs={24} md={14}>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div>
              <Tag color="blue" style={{ marginBottom: 8 }}>{productTypeName}</Tag>
              <Title level={2} style={{ marginTop: 0 }}>{product.name}</Title>
              <Space split={<Divider type="vertical" />}>
                <Space>
                  <Text strong style={{ color: '#faad14', fontSize: '1.2rem' }}>{product.start}</Text>
                  <Rate allowHalf disabled defaultValue={product.start} />
                </Space>
                <Text type="secondary">{product.countEvaluate} Đánh giá</Text>
                <Text type="secondary">{product.countSale.toLocaleString()} Đã bán</Text>
              </Space>
            </div>
            
            <div style={{ backgroundColor: '#f5f5f5', padding: '20px', borderRadius: '12px' }}>
              <Title level={2} style={{ color: '#d70018', margin: 0 }}>
                {product.price}
              </Title>
              {product.discount && <Tag color="red" style={{ marginTop: 8 }}>Giảm {product.discount}%</Tag>}
            </div>
            
            <Button
              type="primary"
              danger
              size="large"
              block
              icon={<ShoppingCartOutlined />}
              style={{ height: '50px', fontSize: '1.1rem', fontWeight: 'bold' }}
              href={product.urlLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              MUA NGAY TẠI NGUỒN
            </Button>
          </Space>
        </Col>
      </Row>

      <Divider style={{ margin: '40px 0' }} />

      <Row gutter={[32, 32]}>
        <Col xs={24} lg={16}>
          <Card title="MÔ TẢ SẢN PHẨM" bordered={false} className="shadow-sm">
            <Paragraph style={{ whiteSpace: 'pre-wrap', fontSize: '1rem', lineHeight: '1.8' }}>
              {product.description || 'Thông tin đang được cập nhật...'}
            </Paragraph>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Title level={4} style={{ marginBottom: 20 }}>SẢN PHẨM LIÊN QUAN</Title>
          <Row gutter={[16, 16]}>
            {relatedProducts.map(relProduct => (
              <Col key={relProduct.id} span={12}>
                <RelatedProductCard product={relProduct} />
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </main>
  );
}

export default ProductDetailPage;