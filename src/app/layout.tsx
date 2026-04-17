import type { Metadata } from "next";
import "./globals.css";
import "98.css";

export const metadata: Metadata = {
  title: "LittleAndrew | Home",
  description: "小和的个人主页 - 静水深流",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}