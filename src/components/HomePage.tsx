'use client';

import { useState, useEffect } from 'react';
import { ABOUT_ME, WORKS, FRIENDS } from '@/lib/data';

interface WindowProps {
  idname: string;
  title: string;
  children: React.ReactNode;
  className?: string;
  defaultExpanded?: boolean;
}

function Window({idname, title, children, defaultExpanded = true}: WindowProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div id={idname} className="window" style={{ marginBottom: '16px' }}>
      <div className="title-bar">
        <div className="title-bar-text">{title}</div>
        <div className="title-bar-controls">
          <button aria-label="Minimize" onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? '_' : '□'}
          </button>
        </div>
      </div>
      {isExpanded && <div className="window-body">{children}</div>}
    </div>
  );
}

function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleNavClick = (isModal: boolean | undefined) => {
    if (isModal) {
      window.dispatchEvent(new CustomEvent('showLinks'));
    } else {
      scrollTo('home');
    }
  };

  const handleMoreClick = (item: { id: string; isModal?: boolean }) => {
    if (item.isModal) {
      window.dispatchEvent(new CustomEvent('showLinks'));
    } else {
      scrollTo(item.id);
    }
    setShowMore(false);
  };

  return (
    <nav className={`title-bar ${scrolled ? 'active' : ''}`} style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '6px 12px',
    }}>
      <div className="title-bar-text" style={{ fontWeight: 'bold', fontSize: '16px' }}>LittleAndrew</div>
      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
        <button onClick={() => scrollTo('home')} style={{ padding: '6px 18px', fontSize: '14px' }}>首页</button>
        <button onClick={() => scrollTo('about')} style={{ padding: '6px 18px', fontSize: '14px' }}>关于</button>
        <button onClick={() => scrollTo('works')} style={{ padding: '6px 18px', fontSize: '14px' }}>作品</button>
        
        <button onClick={() => setShowMore(!showMore)} style={{ padding: '6px 14px', fontSize: '14px' }}>
          更多 ▾
        </button>
        
        {showMore && (
          <div style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            marginTop: '4px',
            background: '#c0c0c0',
            border: '2px solid',
            borderColor: '#fff #808080 #808080 #fff',
            minWidth: '130px',
            zIndex: 1001,
          }}>
            {/* <button onClick={() => handleMoreClick({ id: 'guestbook' })} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '8px 14px', border: 'none' }}>留言</button> */}
            <button onClick={() => window.dispatchEvent(new CustomEvent('showLinks'))} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '8px 14px', border: 'none' }}>友链</button>
            <button onClick={() => handleMoreClick({ id: 'secret' })} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '8px 14px', border: 'none' }}>神秘 O_O</button>
          </div>
        )}
      </div>
    </nav>
  );
}

function HeroSection() {
  const [poem, setPoem] = useState({ sentence: '', info: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://v2.jinrishici.com/sentence')
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          setPoem({
            sentence: data.data.content,
            info: `【${data.data.origin.dynasty}】${data.data.origin.author} · ${data.data.origin.title}`
          });
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <section id="home" style={{
      minHeight: '50vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      padding: '100px 20px 60px',
    }}>
      <h1 style={{ fontSize: '72px', color: '#000080', marginBottom: '10px', fontFamily: '"VT323", "Noto Sans SC", monospace', letterSpacing: '2px' }}>
        静水深流
      </h1>
      <p style={{ fontSize: '28px', color: '#666', fontStyle: 'italic', fontFamily: '"VT323", "Noto Sans SC", monospace' }}>
        Still water always runs deep...
      </p>
      
      <div style={{ marginTop: '36px', padding: '18px 36px', fontFamily: '"VT323", "Noto Sans SC", monospace' }}>
        {loading ? (
          <p style={{ color: '#fff', fontSize: '18px' }}>加载古诗中...</p>
        ) : (
          <>
            <p style={{ color: '#fff', fontSize: '20px', textShadow: '1px 1px 2px #000', lineHeight: 1.8 }}>{poem.sentence}</p>
            <p style={{ color: '#ccc', fontSize: '14px', marginTop: '10px' }}>{poem.info}</p>
          </>
        )}
      </div>
      
      <p style={{ marginTop: '36px', color: '#fff', textShadow: '1px 1px 2px #000', fontSize: '22px', fontFamily: '"VT323", "Noto Sans SC", monospace' }}>嗨！你好！欢迎来到小和的个人主页</p>
    </section>
  );
}

function AboutSection() {
  return (
    <section>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '18px' }}>
        {ABOUT_ME.tags.map((tag, i) => (
          <span key={i} className="field" style={{ padding: '6px 14px', fontSize: '15px' }}>{tag}</span>
        ))}
      </div>
      <div style={{ lineHeight: 1.9, fontSize: '16px' }}>
        {ABOUT_ME.description.map((line, i) => (
          <p key={i} style={{ margin: '8px 0' }}>{line || '\u00A0'}</p>
        ))}
      </div>
      <div style={{ marginTop: '22px', borderTop: '1px solid #808080', paddingTop: '18px' }}>
        <strong style={{ fontSize: '16px' }}>联系方式:</strong>
        <div style={{ marginTop: '14px', fontSize: '15px', lineHeight: 1.9 }}>
          <div>📧 {ABOUT_ME.contact.email}</div>
          <div>🐙 <a href={ABOUT_ME.contact.github} target="_blank" rel="noopener">GitHub</a></div>
          <div>📝 <a href={ABOUT_ME.contact.blog} target="_blank" rel="noopener">博客</a></div>
          <div>📚 <a href={ABOUT_ME.contact.csdn} target="_blank" rel="noopener">CSDN</a></div>
        </div>
      </div>
    </section>
  );
}

function WorksSection() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px' }}>
      {WORKS.map((work, i) => (
        <a key={i} href={work.url} target="_blank" rel="noopener noreferrer" style={{ padding: '20px', display: 'block', textDecoration: 'none', color: 'inherit', border: '2px solid', borderColor: '#fff #808080 #808080 #fff' }}>
          <strong style={{ fontSize: '17px' }}>{work.name}</strong>
          <p style={{ margin: '10px 0 0', fontSize: '15px', color: '#666' }}>{work.description}</p>
        </a>
      ))}
    </div>
  );
}

function LinksModal({ onClose }: { onClose: () => void }) {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000 }} onClick={onClose}>
      <div style={{ width: '600px', maxWidth: '90vw', background: '#c0c0c0', border: '2px solid', borderColor: '#fff #808080 #808080 #fff' }} onClick={e => e.stopPropagation()}>
        <div className="title-bar">
          <div className="title-bar-text">友链</div>
          <div className="title-bar-controls">
            <button aria-label="Close" onClick={onClose} style={{ width: 16, height: 14 }}>×</button>
          </div>
        </div>
        <div className="window-body" style={{ padding: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '12px' }}>
            {FRIENDS.map((friend, i) => (
              <a key={i} href={friend.url} target="_blank" rel="noopener noreferrer" style={{ padding: '12px', textAlign: 'center', textDecoration: 'none', color: 'inherit', border: '2px solid', borderColor: '#fff #808080 #808080 #fff' }}>
                <img src={friend.avatar} alt={friend.name} style={{ width: 56, height: 56, borderRadius: '50%', marginBottom: '8px', objectFit: 'cover' }} />
                <div style={{ fontWeight: 'bold', fontSize: '13px' }}>{friend.name}</div>
                <div style={{ fontSize: '11px', color: '#666', marginTop: '4px' }}>{friend.slogan}</div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function GuestbookSection() {
  const [comments, setComments] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [form, setForm] = useState({ name: '', email: '', content: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const pageSize = 10;

  useEffect(() => {
    setComments([
      { id: 1, user_name: '访客A', content: '网站做的很棒！', created_at: '2025-04-15' },
      { id: 2, user_name: '访客B', content: '支持下！', created_at: '2025-04-14' },
    ]);
    setTotal(2);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.content) {
      setMessage('请填写所有字段');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setMessage('评论已提交，等待审核');
      setForm({ name: '', email: '', content: '' });
      setLoading(false);
    }, 1000);
  };

  const totalPages = Math.ceil(total / pageSize);
  const paginatedComments = comments.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div style={{ fontSize: '15px' }}>
      <form onSubmit={handleSubmit} style={{ marginBottom: '28px' }}>
        <div style={{ border: '2px solid', borderColor: '#fff #808080 #808080 #fff', padding: '20px', background: '#fff' }}>
          <h4 style={{ margin: '0 0 16px', fontSize: '16px' }}>发表评论</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', color: '#666' }}>昵称 *</label>
              <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} disabled={loading} placeholder="昵称" style={{ width: '100%', fontSize: '15px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', color: '#666' }}>邮箱 *</label>
              <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} disabled={loading} placeholder="邮箱" style={{ width: '100%', fontSize: '15px' }} />
            </div>
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', color: '#666' }}>留言内�� *</label>
            <textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} disabled={loading} placeholder="写下你的留言..." rows={4} style={{ width: '100%', fontSize: '15px', resize: 'vertical' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button type="submit" disabled={loading} style={{ padding: '8px 28px', fontSize: '15px' }}>{loading ? '提交中...' : '提交评论'}</button>
            {message && <span style={{ color: '#000080', fontSize: '14px' }}>{message}</span>}
          </div>
        </div>
      </form>

      <div style={{ border: '2px solid', borderColor: '#808080 #fff #fff #808080', padding: '16px' }}>
        <h4 style={{ margin: '0 0 18px', fontSize: '16px' }}>留言 ({total})</h4>
        {comments.length === 0 ? (
          <p style={{ color: '#666', textAlign: 'center', padding: '24px' }}>暂无留言，快来抢沙发吧！</p>
        ) : (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {paginatedComments.map((comment) => (
                <div key={comment.id} style={{ border: '1px solid #808080', padding: '16px', background: '#fff' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <strong style={{ color: '#000080' }}>{comment.user_name}</strong>
                    <span style={{ fontSize: '13px', color: '#888' }}>{comment.created_at}</span>
                  </div>
                  <div style={{ lineHeight: 1.7 }}>{comment.content}</div>
                </div>
              ))}
            </div>
            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '18px', paddingTop: '16px', borderTop: '1px solid #808080' }}>
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ padding: '8px 16px' }}>上一页</button>
                <span style={{ padding: '8px 16px' }}>第 {page} / {totalPages} 页</span>
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={{ padding: '8px 16px' }}>下一页</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function SecretSection() {
  return (
    <div id="secret" style={{ textAlign: 'center', padding: '50px' }}>
      <h2 style={{ fontSize: '28px', marginBottom: '24px' }}>🎁 神秘礼物</h2>
      <p style={{ fontSize: '18px', color: '#666' }}>这里是为特殊节日准备的小惊喜~<br/>敬请期待！</p>
    </div>
  );
}

function Footer() {
  return (
    <footer style={{ background: '#c0c0c0', border: '2px solid', borderColor: '#fff #808080 #808080 #fff', padding: '24px', marginTop: '36px', textAlign: 'center' }}>
      <div style={{ fontSize: '15px' }}>
        © {new Date().getFullYear()} LittleAndrew | <a href="mailto:andyw2002@foxmail.com" style={{ marginLeft: '10px' }}>联系</a> | <a href="https://github.com/littlewith/" target="_blank" style={{ marginLeft: '10px' }}>GitHub</a>
      </div>
      <div style={{ fontSize: '13px', color: '#666', marginTop: '8px' }}>皖ICP备2025079812号 | 萌ICP备20253838号</div>
    </footer>
  );
}

export default function HomePage() {
  const [showLinksModal, setShowLinksModal] = useState(false);

  useEffect(() => {
    const handleShowLinks = () => setShowLinksModal(true);
    window.addEventListener('showLinks', handleShowLinks);
    return () => window.removeEventListener('showLinks', handleShowLinks);
  }, []);

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '52px', background: '#008080' }}>
      <Navigation />
      <HeroSection />
      <main style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 18px' }}>
        <Window title="关于我" defaultExpanded={true} idname={'about'}><AboutSection /></Window>
        <Window title="作品集" defaultExpanded={true} idname={'works'}><WorksSection /></Window>
        <Window title="留言板" defaultExpanded={true} idname={'guestbook'}><GuestbookSection /></Window>
        <Footer />
      </main>
      {showLinksModal && <LinksModal onClose={() => setShowLinksModal(false)} />}
    </div>
  );
}