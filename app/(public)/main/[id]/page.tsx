'use client';

import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import { 
  Row, Col, Card, Typography, Space, Rate, Button, 
  Spin, message, Breadcrumb, Divider, Tag , Badge
} from 'antd';
import { ShoppingCartOutlined, HomeOutlined, TagOutlined } from '@ant-design/icons';
// Import instance Axios (Đảm bảo đường dẫn này chính xác)
// Đường dẫn này được điều chỉnh dựa trên cấu trúc `app/product/[id]/page.tsx`
import { instance } from '../../../service/http/instance'; 
const { Title, Text, Paragraph } = Typography;



// --- Cấu trúc dữ liệu Product (Lấy từ file app/page.tsx) ---
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
  image: {url:string}[];
};

// --- Định nghĩa loại sản phẩm (Khớp với file app/page.tsx) ---
const productTypes = [
  { value: 1, label: 'Affiliate' },
  { value: 2, label: 'Khóa học' },
  { value: 3, label: 'Dịch vụ' },
];

// --- Component Card Sản phẩm Liên quan ---
// (Tái sử dụng một phần logic từ trang Home)
const RelatedProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const router = useRouter();
  const cardContent = (
    <Card
      hoverable
      style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
      bodyStyle={{ flex: 1, padding: '16px' }}
      cover={
        <div style={{ aspectRatio: '1 / 1', position: 'relative' }}>
          <Image
            alt={product.name}
            src={product.image[0].url || 'https://placehold.co/300x300?text=Image'}
            fill
            style={{ objectFit: 'contain', padding: '8px' }}
            onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/300x300?text=Error'; }}
          />
        </div>
      }
      // Chuyển đến trang chi tiết mới khi click
      onClick={() => router.push(`/product/${product.id}`)} 
    >
      <Title level={5} ellipsis={{ rows: 2, tooltip: product.name }}>
        {product.name}
      </Title>
      <Text strong style={{ color: '#d70018', fontSize: '1rem' }}>
        {product.price}
      </Text>
      <Text type="secondary" style={{ fontSize: '0.8rem', display: 'block' }}>
        Đã bán {product.countSale > 1000 ? `${(product.countSale/1000).toFixed(1)}k` : product.countSale}
      </Text>
    </Card>
  );
  
  return product.discount ? (
    <Badge.Ribbon text={`${product.discount}% Giảm`} color="red">
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
  
  // Lấy 'id' từ params
  // API của bạn dùng ID dạng string (vd: -N_q...) chứ không phải số
  const id = params.id as string; 

  // 1. Lấy chi tiết sản phẩm
  useEffect(() => {
    if (id) {
      const fetchProductDetails = async () => {
        setLoading(true);
        try {
          // Gọi API để lấy 1 sản phẩm
          const response = await instance.get(`/product/${id}`);
          setProduct(response.data);
        } catch (error: any) {
          console.error("Fetch detail error:", error);
          message.error(error.response?.data?.message || 'Không thể tải chi tiết sản phẩm.');
        } finally {
          setLoading(false);
        }
      };
      fetchProductDetails();
    }
  }, [id]); // Chạy lại mỗi khi 'id' trên URL thay đổi

  // 2. Lấy tất cả sản phẩm (để lọc sản phẩm liên quan)
  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        // Gọi API lấy tất cả sản phẩm
        const response = await instance.get('/product');
        setAllProducts(response.data || []);
      } catch (error) {
        console.error("Fetch all products error:", error);
        // Không cần báo lỗi ở đây vì đây là phần phụ
      }
    };
    fetchAllProducts();
  }, []); // Chỉ chạy 1 lần

  // 3. Lọc sản phẩm liên quan
  const relatedProducts = useMemo(() => {
    if (!product || allProducts.length === 0) return [];
    // Lọc: cùng loại (type), khác ID (id), và lấy 5 sản phẩm đầu
    return allProducts
      .filter(p => p.type === product.type && p.id !== product.id)
      .slice(0, 5); 
  }, [product, allProducts]);

  // Lấy tên loại sản phẩm (vd: 'Affiliate')
  const productTypeName = productTypes.find(t => t.value === product?.type)?.label || 'Sản phẩm';

  if (loading) {
    return <Spin size="large" fullscreen />;
  }

  if (!product) {
    return (
      <Row justify="center" align="middle" style={{ minHeight: '80vh' }}>
        <Col>
          <Title level={3}>Không tìm thấy sản phẩm</Title>
          <Button type="primary" onClick={() => router.push('/')}>Về Trang chủ</Button>
        </Col>
      </Row>
    );
  }

  return (
    <main className="max-w-screen-xl mx-auto p-4 md:p-8">
      <Breadcrumb
        style={{ marginBottom: 16 }}
        items={[
          { href: '/', title: <HomeOutlined /> },
          { title: productTypeName },
          { title: product.name },
        ]}
      />

      {/* === PHẦN 1: CHI TIẾT SẢN PHẨM === */}
      <Card>
        <Row gutter={[32, 32]}>
          {/* Cột ảnh */}
          <Col xs={24} md={10}>
            <div style={{ aspectRatio: '1 / 1', position: 'relative', border: '1px solid #f0f0f0', borderRadius: '8px', overflow: 'hidden' }}>
              <Image
                alt={product.name}
                src={product.image[0].url || 'https://placehold.co/600x600?text=Image'}
                fill
                style={{ objectFit: 'contain', padding: '16px' }}
                onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/600x600?text=Error'; }}
              />
            </div>
          </Col>
          
          {/* Cột thông tin */}
          <Col xs={24} md={14}>
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <Tag icon={<TagOutlined />} color="blue">{productTypeName}</Tag>
              
              <Title level={2} style={{ margin: 0 }}>{product.name}</Title>
              
              <Space wrap split={<Divider type="vertical" />}>
                <Space>
                  <Text strong style={{ color: '#faad14', fontSize: '1.2rem' }}>{product.start}</Text>
                  <Rate allowHalf disabled defaultValue={product.start} />
                </Space>
                <Text type="secondary">{product.countEvaluate} Đánh giá</Text>
                <Text type="secondary">{product.countSale > 1000 ? `${(product.countSale/1000).toFixed(1)}k` : product.countSale} Đã bán</Text>
              </Space>
              
              <div style={{ backgroundColor: '#fafafa', padding: '16px', borderRadius: '8px' }}>
                <Title level={3} style={{ color: '#d70018', margin: 0 }}>
                  {product.price}
                </Title>
                {product.discount && (
                  <Text>Giảm giá {product.discount}%</Text>
                )}
              </div>
              
              <Button
                type="primary"
                danger
                size="large"
                icon={<ShoppingCartOutlined />}
                style={{ width: '100%' }}
                href={product.urlLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                Đến nơi bán
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      <Divider />

      {/* === PHẦN 2: MÔ TẢ SẢN PHẨM === */}
      <Card>
        <Title level={3}>MÔ TẢ SẢN PHẨM</Title>
        <Paragraph style={{ whiteSpace: 'pre-wrap' }}>
          {product.description || 'Chưa có mô tả cho sản phẩm này.'}
        </Paragraph>
      </Card>

      <Divider />

      {/* === PHẦN 3: SẢN PHẨM LIÊN QUAN === */}
      {relatedProducts.length > 0 && (
        <Card>
          <Title level={3}>SẢN PHẨM LIÊN QUAN</Title>
          <Row gutter={[16, 16]}>
            {relatedProducts.map(relProduct => { 
              return(
              <Col key={relProduct.id} xs={24} sm={12} md={8} lg={6} xl={4}>
                <RelatedProductCard product={relProduct} />
              </Col>
            )})}
          </Row>
        </Card>
      )}
    </main>
  );
}

export default ProductDetailPage;