'use client';

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
// Import instance Axios
import { instance } from '../../../service/http/instance';
import axios from 'axios';

const { Option } = Select;
const { TextArea } = Input;

// 1. Cập nhật Interface thêm trường code
interface Product {
  id: string;
  code: string; // Mới thêm: Mã sản phẩm
  name: string;
  type: number;
  urlLink: string;
  price: string;
  image: string;
  description: string;
  countSale: number;
  countEvaluate: number; // Đã kiểm tra: Có trường này
  start: number;
}

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

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await instance.get('/product');
      const data: Product[] = response.data;
      setProducts(data);
    } catch (error: any) {
      console.error("Fetch products error:", error);
      message.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const showModal = (product: Product | null) => {
    setEditingProduct(product);
    if (product) {
      form.setFieldsValue({
        ...product,
        image: product.image ? [{ uid: '-1', name: 'image', status: 'done', url: Array.isArray(product.image) ? product.image[0] : product.image }] : []
      });
    } else {
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    form.resetFields();
  };

  const handleFormSubmit = async (values: any) => {
    setLoading(true);
    const productData = { ...values };

    try {
      let imageUrl = values.image;
      // Giả lập logic upload ảnh (giữ nguyên logic của bạn)
      if (Array.isArray(values.image) && values.image.length > 0 && values.image[0].originFileObj) {
        const formData = new FormData();
        formData.append('file', values.image[0].originFileObj);
        formData.append("cloud_name", 'dwlkzg4fr');
        formData.append('api_key', '156551575813272');
        formData.append("upload_preset", 'ml_upload');
        
        const url = `https://api.cloudinary.com/v1_1/dwlkzg4fr/auto/upload`;
        const resCloud = await axios.post(url, formData);
        if (resCloud.status === 200) {
          productData.image = resCloud.data.url;
          productData['url'] = values.image[0].url;
        }
      } else if (Array.isArray(values.image) && values.image.length > 0) {
        productData.image = values.image[0].url;
        productData['url'] = values.image[0].url;
      }

      if (editingProduct) {
        await instance.put(`/product/${editingProduct.id}`, productData);
      } else {
        await instance.post('/product', productData);
      }

      message.success(editingProduct ? 'Cập nhật thành công!' : 'Thêm mới thành công!');
      handleCancel();
      fetchProducts();
    } catch (error: any) {
      console.error("Submit error:", error);
      message.error('Có lỗi xảy ra khi lưu sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      await instance.delete(`/product/${id}`);
      message.success('Xóa thành công!');
      fetchProducts();
    } catch (error: any) {
      message.error('Lỗi khi xóa sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    // 2. Thêm cột Mã SP vào bảng
    {
      title: 'Mã SP',
      dataIndex: 'code',
      key: 'code',
      width: 100,
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Loại',
      dataIndex: 'type',
      key: 'type',
      render: (type: number) => productTypes.find(t => t.value === type)?.label || 'Other',
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
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: Product) => (
        <Space size="middle">
          <Button type="link" onClick={() => showModal(record)}>Sửa</Button>
          <Popconfirm
            title="Xóa sản phẩm?"
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
        <Table columns={columns} dataSource={products} rowKey="id" bordered />
      </Spin>

      <Modal
        title={editingProduct ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm mới'}
        open={isModalOpen}
        onCancel={handleCancel}
        onOk={() => form.submit()}
        confirmLoading={loading}
        width={800}
        destroyOnClose
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
          {/* 3. Input nhập Mã Sản Phẩm */}
          <Form.Item
            name="code"
            label="Mã sản phẩm"
            rules={[{ required: true, message: 'Vui lòng nhập mã sản phẩm!' }]}
          >
            <Input placeholder="VD: SP001" />
          </Form.Item>

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
            rules={[{ required: true, message: 'Chọn loại sản phẩm!' }]}
          >
            <Select placeholder="Chọn loại">
              {productTypes.map(type => (
                <Option key={type.value} value={type.value}>{type.label}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="urlLink"
            label="Đường dẫn liên kết (URL)"
            rules={[{ required: true, message: 'Vui lòng nhập URL!' }, { type: 'url', message: 'URL không hợp lệ!' }]}
          >
            <Input placeholder="https://..." />
          </Form.Item>

          <Form.Item
            name="price"
            label="Giá tiền (hiển thị)"
            rules={[{ required: true, message: 'Vui lòng nhập giá!' }]}
          >
            <Input placeholder="1.250.000 vnđ" />
          </Form.Item>

          <Form.Item
            name="image"
            label="Ảnh"
            valuePropName="fileList"
            getValueFromEvent={(e) => Array.isArray(e) ? e : e && e.fileList}
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

          {/* 4. Dùng lại TextArea như cũ */}
          <Form.Item
            name="description"
            label="Mô tả sản phẩm"
          >
            <TextArea rows={6} placeholder="Mô tả chi tiết sản phẩm..." />
          </Form.Item>

          <Space wrap>
            <Form.Item
              name="countSale"
              label="Số lượng đã bán"
              rules={[{ type: 'number', min: 0 }]}
            >
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>

            {/* 5. Đã thêm lại trường countEvaluate */}
            <Form.Item
              name="countEvaluate"
              label="Số lượng đánh giá"
              rules={[{ type: 'number', min: 0 }]}
            >
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              name="start"
              label="Số sao (0-5)"
              rules={[{ type: 'number', min: 0, max: 5 }]}
            >
              <InputNumber step={0.1} style={{ width: '100%' }} />
            </Form.Item>
          </Space>

        </Form>
      </Modal>
    </div>
  );
};

export default ProductManager;