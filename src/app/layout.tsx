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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;700&family=VT323&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}