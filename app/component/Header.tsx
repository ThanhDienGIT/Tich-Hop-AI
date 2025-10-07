'use client';

import React from "react";
import { DriverDarkMode } from "./DriverDarkMode";
import { Col, Flex, Image, Input, Row } from "antd";
import logo from "../asset/image/logo.png";
import SearchBox from "./hearderComponent/SearchBox";
import { TopBar } from "./hearderComponent/TopBar";

function Header() {
  return (
    <header
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          width: "100%",
          padding: "10px 0",
          marginBottom: "20px",
          border: "1px solid #ccc"
        }}
      >
        <Flex vertical gap="small" style={{width: '100%'}}>
          <TopBar/>
          <SearchBox/>


        </Flex>

        
        
        
      </div>
    </header>
  );
}

export default Header;
