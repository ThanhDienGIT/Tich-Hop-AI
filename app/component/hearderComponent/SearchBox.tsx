'use client'; // Thêm 'use client' vì nó là component tương tác (Input)

import React from "react";
// Import thêm Button, Space và SearchOutlined
import { Col, Flex, Image, Input, Button, Space } from "antd"; 
import { SearchOutlined } from '@ant-design/icons'; // Icon cho nút tìm kiếm
import logo from "../../asset/image/logo.png"; // Giữ nguyên đường dẫn logo của bạn

function SearchBox() {
  // State để lưu giá trị tìm kiếm
  const [searchTerm, setSearchTerm] = React.useState("");

  const handleSearch = (value: string) => {
    console.log("Searching for:", value);
    // Logic tìm kiếm của bạn sẽ ở đây
  };

  return (
    // Thêm padding cho SearchBox
    <Flex gap="middle" align="center" justify="space-between" style={{width: '100%', padding: '24px'}}>
      <Col>
        <Image src={logo.src} alt="logo" width={150} preview={false} />
      </Col>

      <Col flex={1}>
        {/* === ĐÃ SỬA: Dùng Space.Compact thay cho Input.Search === */}
        <Space.Compact style={{ width: '100%' }}>
          <Input
            placeholder="Tìm kiếm..."
            size="large"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onPressEnter={() => handleSearch(searchTerm)} // Cho phép tìm bằng Enter
          />
          <Button 
            type="primary" 
            size="large" 
            icon={<SearchOutlined />}
            onClick={() => handleSearch(searchTerm)} // Tìm khi click nút
          />
        </Space.Compact>
        {/* === Kết thúc phần sửa === */}
      </Col>
    </Flex>
  )
}

export default SearchBox;