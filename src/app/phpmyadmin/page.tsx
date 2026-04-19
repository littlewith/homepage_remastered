'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function PhpMyAdmin() {
  useEffect(() => {
    let count = 2;
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
      background: '#fff',
      fontFamily: 'sans-serif',
    }}>
      <h1 style={{ fontSize: '140%', fontWeight: 'bold', marginBottom: '1em' }}>phpMyAdmin</h1>
      <p>正在重定向到首页...</p>
      <p style={{ fontSize: '18px', marginTop: '20px' }}>
        <span id="countdown">2</span> 秒后返回主页...
      </p>
      <Link href="/" style={{ marginTop: '20px', color: '#235a81', textDecoration: 'none' }}>
        点击立即返回
      </Link>
    </div>
  );
}