'use client'; // Bắt buộc vì đây là component tương tác

import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  message,
  Popconfirm,
  Spin,
  Space,
  Upload
} from 'antd';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
// Import instance Axios của bạn
// Đảm bảo đường dẫn này chính xác
import { instance } from '../../../service/http/instance'; 

const { Option } = Select;
const { TextArea } = Input;

// Định nghĩa kiểu dữ liệu cho sản phẩm
interface Product {
  id: string;
  name: string;
  type: number;
  urlLink: string;
  price: string;
  image: string;
  description: string;
  countSale: number;
  countEvaluate: number;
  start: number;
}

// Định nghĩa các loại sản phẩm (ví dụ)
const productTypes = [
  { value: 1, label: 'Affiliate' },
  { value: 2, label: 'Khóa học' },
  { value: 3, label: 'Dịch vụ' },
];

const ProductManager: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form] = Form.useForm();

  // Hàm fetch tất cả sản phẩm (đã dùng instance)
  const fetchProducts = async () => {
    setLoading(true);
    try {
      // ĐÃ THAY THẾ: .get('/product') thay vì fetch('/api/product')
      const response = await instance.get('/product');
      // Axios trả dữ liệu trong `response.data`
      const data: Product[] = response.data;
      setProducts(data);
    } catch (error: any) {
      console.error("Fetch products error:", error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch products';
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Fetch dữ liệu khi component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Xử lý mở modal (thêm mới hoặc sửa)
  const showModal = (product: Product | null) => {
    setEditingProduct(product);
    if (product) {
      form.setFieldsValue({
        ...product,
        image: product.image ? [{ uid: '-1', name: product.image, status: 'done', url: product.image }] : []
      });
    } else {
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  // Xử lý đóng modal
  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    form.resetFields();
  };

  // Xử lý submit form (đã dùng instance)
  const handleFormSubmit = async (values: any) => {
    setLoading(true);
    
    let imageUrl = values.image;
    if (Array.isArray(values.image) && values.image.length > 0) {
      imageUrl = values.image[0].url || values.image[0].name;
    }

    const productData = { ...values, image: imageUrl };

    try {
      let response;
      if (editingProduct) {
        // ĐÃ THAY THẾ: .put() thay vì fetch()
        response = await instance.put(`/product/${editingProduct.id}`, productData);
      } else {
        // ĐÃ THAY THẾ: .post() thay vì fetch()
        response = await instance.post('/product', productData);
      }

      message.success(editingProduct ? 'Cập nhật sản phẩm thành công!' : 'Thêm sản phẩm thành công!');
      handleCancel();
      fetchProducts(); // Tải lại danh sách
    } catch (error: any) {
      console.error("Submit product error:", error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to save product';
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Xử lý xóa sản phẩm (đã dùng instance)
  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      // ĐÃ THAY THẾ: .delete() thay vì fetch()
      await instance.delete(`/product/${id}`);
      
      message.success('Xóa sản phẩm thành công!');
      fetchProducts(); // Tải lại danh sách
    } catch (error: any) {
      console.error("Delete product error:", error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to delete product';
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Cấu hình các cột cho Table
  const columns = [
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Loại',
      dataIndex: 'type',
      key: 'type',
      render: (type: number) => productTypes.find(t => t.value === type)?.label || 'Không xác định',
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: 'Đã bán',
      dataIndex: 'countSale',
      key: 'countSale',
      sorter: (a: Product, b: Product) => a.countSale - b.countSale,
    },
    {
      title: 'Đánh giá',
      dataIndex: 'start',
      key: 'start',
      render: (start: number, record: Product) => `${start} sao (${record.countEvaluate} đánh giá)`,
      sorter: (a: Product, b: Product) => a.start - b.start,
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: Product) => (
        <Space size="middle">
          <Button type="link" onClick={() => showModal(record)}>Sửa</Button>
          <Popconfirm
            title="Xóa sản phẩm?"
            description="Bạn có chắc muốn xóa sản phẩm này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button type="link" danger>Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Phần JSX return
  return (
    <div style={{ padding: 24 }}>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => showModal(null)}
        style={{ marginBottom: 16 }}
      >
        Thêm sản phẩm mới
      </Button>
      
      <Spin spinning={loading}>
        <Table
          columns={columns}
          dataSource={products}
          rowKey="id"
          bordered
        />
      </Spin>

      <Modal
        title={editingProduct ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm mới'}
        open={isModalOpen}
        onCancel={handleCancel}
        onOk={() => form.submit()}
        confirmLoading={loading}
        width={800}
        destroyOnClose // Hủy form khi đóng để reset validation
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFormSubmit}
          initialValues={{
            countSale: 0,
            countEvaluate: 0,
            start: 0,
          }}
        >
          <Form.Item
            name="name"
            label="Tên sản phẩm"
            rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="type"
            label="Loại sản phẩm"
            rules={[{ required: true, message: 'Vui lòng chọn loại sản phẩm!' }]}
          >
            <Select placeholder="Chọn loại sản phẩm">
              {productTypes.map(type => (
                <Option key={type.value} value={type.value}>{type.label}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="urlLink"
            label="Đường dẫn liên kết (URL)"
            rules={[{ required: true, message: 'Vui lòng nhập URL!' }, { type: 'url', message: 'Đây không phải là URL hợp lệ!' }]}
          >
            <Input placeholder="https://..." />
          </Form.Item>

          <Form.Item
            name="price"
            label="Giá tiền (hiển thị)"
            rules={[{ required: true, message: 'Vui lòng nhập giá!' }]}
          >
            <Input placeholder="1.250.000 vnđ - 2.500.000 vnđ" />
          </Form.Item>
          
          <Form.Item
            name="image"
            label="Ảnh"
            valuePropName="fileList"
            getValueFromEvent={(e) => {
              if (Array.isArray(e)) return e;
              return e && e.fileList;
            }}
            extra="Tải lên 1 ảnh. Thực tế: bạn cần upload lên Storage."
          >
            <Upload
              name="image"
              listType="picture"
              maxCount={1}
              beforeUpload={() => false}
            >
              <Button icon={<UploadOutlined />}>Tải ảnh lên</Button>
            </Upload>
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả sản phẩm"
          >
            <TextArea rows={10} placeholder="Mô tả chi tiết sản phẩm..." />
          </Form.Item>

          <Space>
             <Form.Item
              name="countSale"
              label="Số lượng đã bán"
              rules={[{ type: 'number', min: 0 }]}
            >
              <InputNumber />
            </Form.Item>
            
             <Form.Item
              name="countEvaluate"
              label="Số lượng đánh giá"
              rules={[{ type: 'number', min: 0 }]}
            >
              <InputNumber />
            </Form.Item>
            
             <Form.Item
              name="start"
              label="Số sao (0-5)"
              rules={[{ type: 'number', min: 0, max: 5 }]}
            >
              <InputNumber step={0.1} />
            </Form.Item>
          </Space>

        </Form>
      </Modal>
    </div>
  );
};

export default ProductManager;