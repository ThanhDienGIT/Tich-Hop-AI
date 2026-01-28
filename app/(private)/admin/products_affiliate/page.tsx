'use client';

import React, { useState } from 'react';
import {
  Table,
  Button,
  Upload,
  message,
  Card,
  Space,
  Typography,
  Tag,
  Progress
} from 'antd';
import { UploadOutlined, ImportOutlined, DeleteOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx'; // Cần cài đặt: npm install xlsx
import { instance } from '../../../service/http/instance'; // Đường dẫn instance của bạn

const { Title, Text } = Typography;

// --- CẤU HÌNH ---
const API_ENDPOINT = '/product-affiliate'; // Tên bảng/endpoint API của bạn

// Interface cho dữ liệu hiển thị trên bảng Preview
interface PreviewProduct {
  key: string;
  code: string;
  name: string;
  price: string;
  originalPriceStr: string; // Giá gốc từ Excel để đối chiếu
  countSale: number;
  urlLink: string;
  type: number;
  isGet: number; // Trường mới bạn yêu cầu
}

export default function ImportProductPage() {
  const [fileList, setFileList] = useState<any[]>([]);
  const [previewData, setPreviewData] = useState<PreviewProduct[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  // --- HÀM XỬ LÝ DỮ LIỆU (HELPER) ---

  // 1. Chuyển đổi giá từ "39,0k" -> "39.000 VNĐ"
  const formatPrice = (rawPrice: any): string => {
    if (!rawPrice) return "0 VNĐ";
    const str = String(rawPrice).toLowerCase().trim();
    
    // Xử lý dạng "39,0k" hoặc "96,2k"
    if (str.includes('k')) {
      // Thay dấu phẩy thành chấm để parse float (39,0 -> 39.0)
      const numberPart = parseFloat(str.replace('k', '').replace(',', '.'));
      if (!isNaN(numberPart)) {
        const finalPrice = numberPart * 1000;
        return finalPrice.toLocaleString('vi-VN') + " VNĐ";
      }
    }
    
    // Trường hợp giá thường hoặc định dạng khác, giữ nguyên hoặc xử lý thêm
    return str;
  };

  // 2. Chuyển đổi doanh thu từ "20k+" -> 20000
  const parseCountSale = (rawSale: any): number => {
    if (!rawSale) return 0;
    const str = String(rawSale).toLowerCase();
    let multiplier = 1;
    
    if (str.includes('tr')) multiplier = 1000000;
    else if (str.includes('k')) multiplier = 1000;

    // Lấy số đầu tiên tìm thấy
    const match = str.match(/[\d,.]+/); 
    if (match) {
      // Đổi 1,5 thành 1.5
      const numberVal = parseFloat(match[0].replace(',', '.'));
      return Math.floor(numberVal * multiplier);
    }
    return 0;
  };

  // --- XỬ LÝ FILE EXCEL ---
  const handleFileRead = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        // Đọc dữ liệu dạng JSON
        const jsonData = XLSX.utils.sheet_to_json(sheet);

        console.log("Dữ liệu gốc từ Excel:", jsonData);

        // Map dữ liệu từ Excel sang cấu trúc DB
        const mappedData: PreviewProduct[] = jsonData.map((item: any, index) => {
          // Mapping cột từ file CSV của bạn
          // 'Mã sản phẩm', 'Tên sản phẩm', 'Giá', 'Doanh thu', 'Link ưu đãi', 'Link sản phẩm'
          
          return {
            key: `row-${index}`,
            code: String(item['Mã sản phẩm'] || ''),
            name: item['Tên sản phẩm'] || 'Chưa có tên',
            // Ưu tiên Link ưu đãi (link ngắn), nếu không có thì lấy Link sản phẩm
            urlLink: item['Link ưu đãi'] || item['Link sản phẩm'] || '',
            price: formatPrice(item['Giá']),
            originalPriceStr: item['Giá'], // Giữ lại để debug nếu cần
            countSale: parseCountSale(item['Doanh thu']),
            
            // Các trường mặc định
            image: '', // CSV không có ảnh -> để rỗng
            description: `Shop: ${item['Tên cửa hàng'] || ''}`,
            countEvaluate: 0,
            start: 5, // Mặc định 5 sao
            type: 1,  // 1: Affiliate (Mặc định)
            isGet: 0, // Yêu cầu của bạn
          };
        });

        setPreviewData(mappedData);
        message.success(`Đã đọc được ${mappedData.length} sản phẩm từ file!`);
      } catch (error) {
        console.error(error);
        message.error('Lỗi khi đọc file Excel. Vui lòng kiểm tra định dạng.');
      }
    };
    reader.readAsBinaryString(file);
  };

  // --- IMPORT VÀO DATABASE ---
  const handleImportToDB = async () => {
    if (previewData.length === 0) {
      message.warning('Chưa có dữ liệu để import!');
      return;
    }

    setUploading(true);
    setProgress(0);
    let successCount = 0;
    let errorCount = 0;

    // Chia nhỏ batch để gửi hoặc gửi từng cái (ở đây gửi từng cái để dễ track lỗi)
    for (let i = 0; i < previewData.length; i++) {
      const item = previewData[i];
      try {
        // Chuẩn bị payload gửi lên API
        const payload = {
          code: item.code,
          name: item.name,
          type: item.type,
          urlLink: item.urlLink,
          price: item.price,
          image: '', // Rỗng
          description: (item as any).description,
          countSale: item.countSale,
          countEvaluate: 0,
          start: 0,
          isGet: item.isGet // Trường mới
        };

        // Gọi API
        await instance.post(API_ENDPOINT, payload);
        successCount++;
      } catch (error) {
        console.error(`Lỗi import dòng ${i + 1}:`, error);
        errorCount++;
      }

      // Cập nhật tiến trình
      const currentProgress = Math.round(((i + 1) / previewData.length) * 100);
      setProgress(currentProgress);
    }

    setUploading(false);
    if (errorCount === 0) {
      message.success(`Import thành công tất cả ${successCount} sản phẩm!`);
      setPreviewData([]); // Clear bảng sau khi xong
      setFileList([]);
    } else {
      message.warning(`Hoàn tất: ${successCount} thành công, ${errorCount} lỗi.`);
    }
  };

  // --- CẤU HÌNH BẢNG HIỂN THỊ ---
  const columns = [
    {
      title: 'Mã SP',
      dataIndex: 'code',
      key: 'code',
      width: 120,
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
    },
    {
      title: 'Giá gốc (Excel)',
      dataIndex: 'originalPriceStr',
      key: 'originalPriceStr',
      width: 120,
      render: (text: string) => <Tag color="blue">{text}</Tag>
    },
    {
      title: 'Giá (Vào DB)',
      dataIndex: 'price',
      key: 'price',
      width: 150,
      render: (text: string) => <Text strong type="success">{text}</Text>
    },
    {
      title: 'Đã bán',
      dataIndex: 'countSale',
      key: 'countSale',
      width: 100,
    },
    {
      title: 'isGet',
      dataIndex: 'isGet',
      key: 'isGet',
      width: 80,
      render: (val: number) => <Tag color="purple">{val}</Tag>
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 80,
      render: (_: any, record: any) => (
        <Button 
          danger 
          icon={<DeleteOutlined />} 
          size="small"
          onClick={() => {
            setPreviewData(prev => prev.filter(item => item.key !== record.key));
          }}
        />
      )
    }
  ];

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>
      <Card title="Import Sản phẩm Affiliate từ Excel" bordered={false} className="shadow-md">
        
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          
          {/* Khu vực Upload */}
          <div style={{ background: '#fafafa', padding: 20, borderRadius: 8, textAlign: 'center', border: '1px dashed #d9d9d9' }}>
            <Upload
              beforeUpload={(file) => {
                setFileList([file]);
                handleFileRead(file); // Đọc file ngay khi chọn
                return false; // Ngăn auto upload
              }}
              fileList={fileList}
              onRemove={() => {
                setFileList([]);
                setPreviewData([]);
              }}
              maxCount={1}
              accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            >
              <Button icon={<UploadOutlined />} size="large">Chọn file Excel/CSV</Button>
            </Upload>
            <div style={{ marginTop: 8, color: '#888' }}>
              Hỗ trợ file: .csv, .xlsx. Cấu trúc cột: Mã sản phẩm, Tên sản phẩm, Giá, Doanh thu...
            </div>
          </div>

          {/* Thanh tiến trình */}
          {uploading && (
            <div>
              <Text>Đang import vào Database...</Text>
              <Progress percent={progress} status="active" />
            </div>
          )}

          {/* Bảng Preview */}
          {previewData.length > 0 && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Title level={4}>Xem trước dữ liệu ({previewData.length} dòng)</Title>
                <Button 
                  type="primary" 
                  size="large" 
                  icon={<ImportOutlined />}
                  onClick={handleImportToDB}
                  loading={uploading}
                >
                  Tiến hành Import
                </Button>
              </div>

              <Table 
                dataSource={previewData} 
                columns={columns} 
                pagination={{ pageSize: 5 }}
                size="middle"
                bordered
                scroll={{ x: 800 }}
              />
            </>
          )}

        </Space>
      </Card>
    </div>
  );
}