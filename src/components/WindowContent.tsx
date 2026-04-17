import { useState, useEffect } from 'react';
import { ABOUT_ME, WORKS, FRIENDS, HISTORY } from '@/lib/data';

export function AboutContent() {
  return (
    <div className="about-content">
      <div className="about-tags">
        {ABOUT_ME.tags.map((tag, index) => (
          <span key={index} className="field">{tag}</span>
        ))}
      </div>
      <div className="about-text">
        {ABOUT_ME.description.map((line, index) => (
          <p key={index}>{line || <br />}</p>
        ))}
      </div>
    </div>
  );
}

export function WorksContent() {
  return (
    <div className="works-grid">
      {WORKS.map((work, index) => (
        <a 
          key={index} 
          href={work.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="work-item"
        >
          <strong>{work.name}</strong>
          <p style={{ margin: '4px 0 0 0', fontSize: '10px' }}>{work.description}</p>
        </a>
      ))}
    </div>
  );
}

export function LinksContent() {
  return (
    <div className="links-grid">
      {FRIENDS.map((friend, index) => (
        <a 
          key={index}
          href={friend.url}
          target="_blank"
          rel="noopener noreferrer"
          className="link-item"
        >
          <img src={friend.avatar} alt={friend.name} />
          <strong>{friend.name}</strong>
          <span style={{ fontSize: '10px' }}>{friend.slogan}</span>
        </a>
      ))}
    </div>
  );
}

export function HistoryContent() {
  return (
    <div className="timeline">
      {HISTORY.map((item, index) => (
        <div key={index} className="timeline-item">
          <span className="timeline-date">{item.date}</span>
          <span>{item.event}</span>
        </div>
      ))}
    </div>
  );
}

interface CommentContentProps {
  articleKey: string;
}

export function CommentContent({ articleKey }: CommentContentProps) {
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', content: '' });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadComments();
  }, [articleKey]);

  async function loadComments() {
    setLoading(true);
    try {
      const res = await fetch(`/api/comments/${articleKey}`);
      const data = await res.json();
      if (data.success) {
        setComments(data.comments || []);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.content) {
      setMessage('请填写所有字段');
      return;
    }
    setSubmitting(true);
    setMessage('');
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          article_key: articleKey,
          user_name: form.name,
          user_email: form.email,
          content: form.content,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage('评论已提交，等待审核');
        setForm({ name: '', email: '', content: '' });
        loadComments();
      } else {
        setMessage(data.message || '提交失败');
      }
    } catch (e) {
      setMessage('提交失败，请稍后重试');
    }
    setSubmitting(false);
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="comment-form">
        <label>
          昵称:
          <input
            type="text"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            disabled={submitting}
          />
        </label>
        <label>
          邮箱:
          <input
            type="email"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            disabled={submitting}
          />
        </label>
        <label>
          留言:
          <textarea
            value={form.content}
            onChange={e => setForm({ ...form, content: e.target.value })}
            disabled={submitting}
            rows={3}
          />
        </label>
        <button type="submit" disabled={submitting}>
          {submitting ? '提交中...' : '提交'}
        </button>
        {message && <p>{message}</p>}
      </form>

      <div className="comments-list">
        <h4>留言 ({comments.length})</h4>
        {loading ? (
          <p>加载中...</p>
        ) : comments.length === 0 ? (
          <p style={{ color: '#666' }}>暂无留言，快来抢沙发吧！</p>
        ) : (
          comments.map((comment, index) => (
            <div key={index} className="comment-item">
              <div className="comment-header">
                <strong>{comment.user_name}</strong>
                <span>{new Date(comment.created_at).toLocaleDateString()}</span>
              </div>
              <div>{comment.content}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export function ArticlesContent() {
  return (
    <div>
      <p>文章功能开发中...</p>
      <p style={{ fontSize: '10px', color: '#666' }}>旧版本的文章数据可以迁移到新系统</p>
    </div>
  );
}