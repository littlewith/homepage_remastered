'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function NotFound() {
  useEffect(() => {
    let count = 3;
    const timer = setInterval(() => {
      const el = document.getElementById('countdown');
      if (el && count > 0) {
        el.textContent = String(count);
        count--;
      } else if (count === 0) {
        clearInterval(timer);
        window.location.href = '/';
      }
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#008080',
      color: '#fff',
      fontFamily: '"Pixelated MS Sans Serif", Arial, sans-serif',
    }}>
      <h1 style={{ fontSize: '72px', marginBottom: '20px', color: '#ff4b5c' }}>404</h1>
      <p style={{ fontSize: '24px', marginBottom: '20px' }}>抱歉，您请求的页面未找到。</p>
      <p style={{ fontSize: '18px' }}>
        <span id="countdown">3</span> 秒后返回主页...
      </p>
      <Link href="/" style={{ marginTop: '20px', color: '#fff', textDecoration: 'underline' }}>
        点击立即返回
      </Link>
    </div>
  );
}