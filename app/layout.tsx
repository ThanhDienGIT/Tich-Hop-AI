import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./component/Header";
import Footer from "./component/Footer";
import { ThemeProvider } from "next-themes";
import { Providers } from "./Provider";
import { AntdRegistry } from "@ant-design/nextjs-registry"; // <-- 1. Import AntdRegistry

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Trang chủ",
  description: "Main page",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AntdRegistry>
          <Providers>
            <Header />
            <main>{children}</main>
            <Footer />
            <div>hehe</div>
          </Providers>
        </AntdRegistry>
      </body>
    </html>
  );
}
