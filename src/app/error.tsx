'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error500() {
  useEffect(() => {
    let count = 6;
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
      <h1 style={{ fontSize: '72px', marginBottom: '20px', color: '#ff4b5c' }}>500</h1>
      <p style={{ fontSize: '24px', marginBottom: '20px' }}>那个....啊这....服务器出错了哈！！！</p>
      <p style={{ fontSize: '18px' }}>报一丝，报一丝！！</p>
      <p style={{ fontSize: '18px' }}>
        <span id="countdown">6</span> 秒后返回主页...
      </p>
      <Link href="/" style={{ marginTop: '20px', color: '#fff', textDecoration: 'underline' }}>
        点击立即返回
      </Link>
    </div>
  );
}