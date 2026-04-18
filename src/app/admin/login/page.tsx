'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setError('请输入口令');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();

      if (res.ok && data.token) {
        localStorage.setItem('admin_token', data.token);
        router.push('/admin');
      } else {
        setError(data.error || '登录失败');
      }
    } catch (e) {
      setError('登录失败');
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: '#008080',
    }}>
      <div style={{
        background: '#c0c0c0',
        border: '2px solid',
        borderColor: '#fff #808080 #808080 #fff',
        padding: '30px',
        width: '320px',
      }}>
        <div className="title-bar">
          <div className="title-bar-text">管理员登录</div>
        </div>
        <div className="window-body" style={{ marginTop: '16px' }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px' }}>管理口令</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="请输入口令"
                style={{ width: '100%', fontSize: '15px' }}
              />
            </div>
            {error && <p style={{ color: '#c00', fontSize: '13px', marginBottom: '12px' }}>{error}</p>}
            <button type="submit" disabled={loading} style={{ width: '100%', padding: '8px' }}>
              {loading ? '登录中...' : '登录'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}