'use client';

import React from "react";
import { DriverDarkMode } from "../DriverDarkMode";
import { Col, Flex, Image, Input, Row } from "antd";
import logo from "../../asset/image/logo.png";



function SearchBox() {
  return (
    <Flex gap="middle" align="center" justify="space-between" style={{width: '100%'}}>
          <Col>
            <Image src={logo.src} alt="logo" width={150} height={150} />
          </Col>

          <Col flex={1}>
            <Input.Search
              placeholder="Tìm kiếm..."
              onSearch={(value) => console.log(value)}
              size="large"
            />
          </Col>

        </Flex>
  )
}

export default SearchBox
