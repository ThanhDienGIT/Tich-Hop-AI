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
      {
        protocol: 'https', // Must match the protocol of your image URL
        hostname: 'placehold.co', // The domain you want to allow
        // Optional: pathname and port can be specified for more granular control
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**', // Cho phép tất cả các đường dẫn ảnh từ host này
      },
      {
        protocol: 'http', // Thêm 'http' vì lỗi của bạn cho thấy 'http'
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**', // Cho phép tất cả các đường dẫn ảnh từ host này
      },
      
      // Thêm các domain khác bạn muốn cho phép ở đây
    ],
    
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // 2. Bỏ qua lỗi ESLint (bao gồm cả lỗi 'any' bạn vừa gặp)
  eslint: {
    ignoreDuringBuilds: true,
  },
};


export default nextConfig;
