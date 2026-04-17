import type { Metadata } from "next";
import "./globals.css";
import "98.css";
import HomePage from "@/components/HomePage";

export const metadata: Metadata = {
  title: "LittleAndrew | Home",
  description: "小和的个人主页 - 静水深流",
};

export default function Home() {
  return <HomePage />;
}