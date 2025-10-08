import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cf.shopee.vn',
      },
      {
        protocol: 'https',
        hostname: 'salt.tikicdn.com',
      },
      {
        protocol: 'https',
        hostname: 'lzd-img-global.slatic.net',
      },
      {
        // THÊM OBJECT MỚI NÀY VÀO
        protocol: 'https',
        hostname: 'down-vn.img.susercontent.com',
      },
      // Thêm các domain khác bạn muốn cho phép ở đây
    ],
  },
};


export default nextConfig;
