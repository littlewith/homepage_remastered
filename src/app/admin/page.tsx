'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Comment {
  id: number;
  articleKey: string;
  userName: string;
  userEmail: string;
  content: string;
  status: string;
  createdAt: string;
}

export default function AdminPage() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const router = useRouter();

  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;

  useEffect(() => {
    if (!token) {
      router.push('/admin/login');
      return;
    }
    fetchComments();
  }, [token, page, filter]);

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/admin/comments?page=${page}&size=20&status=${filter}`, {
        headers: { 'x-admin-token': token || '' },
      });
      if (res.status === 401) {
        localStorage.removeItem('admin_token');
        router.push('/admin/login');
        return;
      }
      const data = await res.json();
      setComments(data.comments || []);
      setTotal(data.total || 0);
    } catch (e) {
      console.error('获取评论失败', e);
    }
    setLoading(false);
  };

  const handleAction = async (id: number, action: 'approved' | 'rejected' | 'delete') => {
    if (action === 'delete') {
      if (!confirm('确定删除？')) return;
    }
    try {
      if (action === 'delete') {
        await fetch(`/api/admin/comments?id=${id}`, {
          method: 'DELETE',
          headers: { 'x-admin-token': token || '' },
        });
      } else {
        await fetch('/api/admin/comments', {
          method: 'PATCH',
          headers: { 
            'Content-Type': 'application/json',
            'x-admin-token': token || '',
          },
          body: JSON.stringify({ id, status: action }),
        });
      }
      fetchComments();
    } catch (e) {
      console.error('操作失败', e);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    router.push('/');
  };

  const totalPages = Math.ceil(total / 20);

  return (
    <div style={{ minHeight: '100vh', background: '#008080', padding: '20px' }}>
      <div style={{ 
        background: '#c0c0c0', 
        border: '2px solid', 
        borderColor: '#fff #808080 #808080 #fff',
        maxWidth: '900px',
        margin: '0 auto',
      }}>
        <div className="title-bar">
          <div className="title-bar-text">评论管理</div>
          <div className="title-bar-controls">
            <button onClick={handleLogout} style={{ width: 16, height: 14, fontSize: '12px' }}>×</button>
          </div>
        </div>
        <div className="window-body" style={{ padding: '16px' }}>
          <div style={{ marginBottom: '16px', display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button onClick={() => setFilter('all')} style={{ padding: '6px 12px', background: filter === 'all' ? '#808080' : '#c0c0c0' }}>全部</button>
            <button onClick={() => setFilter('pending')} style={{ padding: '6px 12px', background: filter === 'pending' ? '#808080' : '#c0c0c0' }}>待审核</button>
            <button onClick={() => setFilter('approved')} style={{ padding: '6px 12px', background: filter === 'approved' ? '#808080' : '#c0c0c0' }}>已通过</button>
            <button onClick={() => setFilter('rejected')} style={{ padding: '6px 12px', background: filter === 'rejected' ? '#808080' : '#c0c0c0' }}>已拒绝</button>
          </div>

          {loading ? (
            <p>加载中...</p>
          ) : comments.length === 0 ? (
            <p>暂无评论</p>
          ) : (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {comments.map(comment => {
                  const statusColors: Record<string, { bg: string; text: string }> = {
                    pending: { bg: '#fffde7', text: '#f57f17' },
                    approved: { bg: '#e8f5e9', text: '#2e7d32' },
                    rejected: { bg: '#ffebee', text: '#c62828' },
                  };
                  const colors = statusColors[comment.status] || { bg: '#fff', text: '#666' };
                  return (
                  <div key={comment.id} style={{ border: '1px solid #808080', padding: '12px', background: colors.bg }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <strong>{comment.userName}</strong>
                      <span style={{ fontSize: '12px', color: colors.text, fontWeight: 'bold' }}>
                        [{comment.status === 'pending' ? '待审核' : comment.status === 'approved' ? '已通过' : '已拒绝'}] {comment.articleKey} | {new Date(comment.createdAt).toLocaleString('zh-CN')}
                      </span>
                    </div>
                    <div style={{ marginBottom: '8px', fontSize: '14px' }}>{comment.content}</div>
                    <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>{comment.userEmail}</div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {comment.status === 'pending' && (
                        <>
                          <button onClick={() => handleAction(comment.id, 'approved')} style={{ padding: '4px 12px' }}>通过</button>
                          <button onClick={() => handleAction(comment.id, 'rejected')} style={{ padding: '4px 12px' }}>拒绝</button>
                        </>
                      )}
                      <button onClick={() => handleAction(comment.id, 'delete')} style={{ padding: '4px 12px' }}>删除</button>
                    </div>
                  </div>
                  );
                })}
              </div>

              {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '16px' }}>
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>上一页</button>
                  <span>{page} / {totalPages}</span>
                  <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>下一页</button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}