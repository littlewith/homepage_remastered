'use client';

import { useState, useEffect } from 'react';
import { ABOUT_ME } from '@/lib/data';

interface HistoryEvent {
  date: string;
  event: string;
}

interface Friend {
  name: string;
  avatar: string;
  slogan: string;
  url: string;
}

interface Work {
  name: string;
  description: string;
  url: string;
}

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

  useEffect(() => {
    if (!showMore) return;
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.more-dropdown')) {
        setShowMore(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showMore]);

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
          <div className="more-dropdown" style={{
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
  const [typedText, setTypedText] = useState('');
  const [cursorOn, setCursorOn] = useState(true);
  const [poemLoading, setPoemLoading] = useState(true);

  const titleText = "静水深流";
  const subtitleText = "Still water always runs deep...";
  const mainText = "嗨！你好！欢迎来到小和的个人主页。\n\n";
  const fullText = titleText + "\n" + subtitleText + "\n\n" + mainText + (poem.sentence ? `> ${poem.sentence}\n> ${poem.info}` : "> 正在加载诗词...");

  useEffect(() => {
    fetch('https://v1.jinrishici.com/all.json')
      .then(res => res.json())
      .then(data => {
        setPoem({
          sentence: data.content,
          info: data.origin ? `【${data.origin}】${data.author}` : ''
        });
        setPoemLoading(false);
      })
      .catch(() => setPoemLoading(false));
  }, []);

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      if (i <= fullText.length) {
        setTypedText(fullText.slice(0, i));
        i++;
      } else {
        clearInterval(timer);
      }
    }, 60);
    return () => clearInterval(timer);
  }, [poemLoading, poem.sentence]);

  useEffect(() => {
    const interval = setInterval(() => setCursorOn(v => !v), 530);
    return () => clearInterval(interval);
  }, []);

  const cursorStyle: React.CSSProperties = {
    display: 'inline-block',
    width: '0.6em',
    height: '1em',
    background: '#888',
    boxShadow: '1px 1px 2px rgba(0,0,0,0.5)',
    marginLeft: '1px',
    verticalAlign: 'middle',
    opacity: cursorOn ? 1 : 0,
  };

  const lines = typedText.split('\n');

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
      <div style={{
        fontFamily: '"VT323", "Noto Sans SC", monospace',
        padding: '24px 40px',
      }}>
        {lines.map((line, idx) => (
          <div key={idx} style={{
            fontSize: idx === 0 ? '64px' : idx === 1 ? '26px' : line.startsWith('> ') && idx === lines.length - 1 ? '14px' : line.startsWith('> ') ? '18px' : '20px',
            color: '#e0e0e0',
            textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
            lineHeight: 1.6,
            marginBottom: idx === 0 ? '12px' : idx === 1 ? '20px' : '12px',
          }}>
            {line}
            {idx === lines.length - 1 && <span style={cursorStyle} />}
          </div>
        ))}
      </div>
    </section>
  );
}

function AboutSection() {
  return (
    <section>
      <div style={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        justifyContent: 'center', 
        gap: '8px', 
        marginBottom: '18px' 
      }}>
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
  const [works, setWorks] = useState<Work[]>([]);

  useEffect(() => {
    fetch('/api/works')
      .then(res => res.json())
      .then(data => setWorks(data))
      .catch(console.error);
  }, []);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px' }}>
      {works.map((work, i) => (
        <a key={i} href={work.url} target="_blank" rel="noopener noreferrer" style={{ padding: '20px', display: 'block', textDecoration: 'none', color: 'inherit', border: '2px solid', borderColor: '#fff #808080 #808080 #fff' }}>
          <strong style={{ fontSize: '17px' }}>{work.name}</strong>
          <p style={{ margin: '10px 0 0', fontSize: '15px', color: '#666' }}>{work.description}</p>
        </a>
      ))}
    </div>
  );
}

function LinksModal({ onClose }: { onClose: () => void }) {
  const [friends, setFriends] = useState<Friend[]>([]);

  useEffect(() => {
    fetch('/api/friends')
      .then(res => res.json())
      .then(data => setFriends(data))
      .catch(console.error);
  }, []);

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
            {friends.map((friend, i) => (
              <a key={i} href={friend.url} target="_blank" rel="noopener noreferrer" style={{ padding: '12px', textAlign: 'center', textDecoration: 'none', color: 'inherit', border: '2px solid', borderColor: '#fff #808080 #808080 #fff' }}>
                <img src={friend.avatar} alt={friend.name} style={{ width: 56, height: 56, borderRadius: '50%', marginBottom: '8px', objectFit: 'cover' }} />
                <div style={{ fontWeight: 'bold', fontSize: '13px' }}>{friend.name}</div>
                <div style={{ fontSize: '11px', color: '#666', marginTop: '4px' }} dangerouslySetInnerHTML={{ __html: friend.slogan }} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const EMOJI_LIST = ['😊', '😃', '😄', '😁', '😅', '😂', '🤣', '🤔', '🤨', '😶', '🙂', '🙃', '😉', '😍', '🥰', '😘', '😗', '😙', '😋', '😛', '😜', '🤪', '😝', '🤗', '🤭', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥', '😌', '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕', '🤢', '🤮', '🤧', '🥵', '🥶', '🥴', '😵', '🤯', '🤠', '🥳', '😎', '🤓', '🧐', '😕', '😟', '🙁', '😮', '😯', '😲', '😳', '🥺', '😦', '😧', '😨', '😰', '😥', '😢', '😭', '😱', '😖', '😣', '😞', '😓', '😩', '😫', '🥱', '😤', '😡', '😠', '🤬', '😈', '👿', '💀', '☠️', '💩', '👻', '���', '����'];

const KAOMOJI_LIST = ['(๑•̀ㅁ•́ฅ)', '|´・ω・)ノ', 'ヾ(≧∇≦*)ゝ', '(☆ω☆)', '（╯‵□′）╯︵┴─┴', '￣﹃￣', '(/ω＼)', '∠( ᐛ 」∠)＿', '→_→', '୧(๑•̀⌄•́๑)૭', '٩(ˊᗜˋ*)و', '(ノ°ο°)ノ', '(´இ皿இ｀)', '⌇●﹏●⌇', '(ฅ´ω`ฅ)', '(╯°A°)╯︵○○○', 'φ(￣∇￣o)', 'ヾ(´･ ･｀｡)ノ', '( ᇼ ᵒ̌皿ᵒ̌)ง⁼³₌₃', '(ó﹏ò｡)', 'Σ(っ °Д °;)っ', '( ,,´･ω･)ﾉ"(´っω･｀｡)', '╮(╯▽╰)╭', 'o(*////▽////*)q', '＞﹏＜', '( ๑´•ω•) "(ㆆᴗㆆ)', 'OωO', 'ヽ(･ω･´)ゞ', '(*・ω・)ﾉ', '(｡･ω･｡)', '(*´ω`*)', '(灬♥ω♥灬)', '(⁄ ⁄•⁄ω⁄•⁄ ⁄)', '٩(◕‿◕｡)۶', '(´∇‘)ノ', '(*￣︶￣)', '(◕‿◕✿)', '(ฅ´ω`ฅ)', 'ヽ(o･ω･o)ノ', '(｡^‿^｡)'];

interface GuestbookSectionProps {
  articleKey?: string;
}

function GuestbookSection({ articleKey = 'guestbook' }: GuestbookSectionProps) {
  const [comments, setComments] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [form, setForm] = useState({ name: '', email: '', content: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [emojiTab, setEmojiTab] = useState<'emoji' | 'kaomoji'>('emoji');
  const pageSize = 10;

  const fetchComments = async (pageNum: number) => {
    try {
      const res = await fetch(`/api/comments?articleKey=${articleKey}&page=${pageNum}&size=${pageSize}`);
      const data = await res.json();
      setComments(data.comments || []);
      setTotal(data.total || 0);
    } catch (e) {
      console.error('获取评论失败', e);
    }
  };

  useEffect(() => {
    fetchComments(page);
  }, [page]);

  useEffect(() => {
    if (!showEmoji) return;
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.emoji-dropdown')) {
        setShowEmoji(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showEmoji]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.content) {
      setMessage('请填写所有字段');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articleKey, userName: form.name, userEmail: form.email, content: form.content }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(data.message);
        setForm({ name: '', email: '', content: '' });
      } else {
        setMessage(data.error || '提交失败');
      }
    } catch (e) {
      setMessage('提交失败');
    }
    setLoading(false);
  };

  const insertEmoji = (emoji: string) => {
    setForm({ ...form, content: form.content + emoji });
    setShowEmoji(false);
  };

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div style={{ fontSize: '15px' }}>
      <form onSubmit={handleSubmit} style={{ marginBottom: '28px' }}>
        <div style={{ border: '2px solid', borderColor: '#fff #808080 #808080 #fff', padding: '20px', background: '#fff' }}>
          <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
            <div style={{ flex: 1 }}>
              <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} disabled={loading} placeholder="昵称（必填）" style={{ width: '100%', fontSize: '15px' }} />
            </div>
            <div style={{ flex: 1 }}>
              <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} disabled={loading} placeholder="邮箱（必填）" style={{ width: '100%', fontSize: '15px' }} />
            </div>
          </div>
          <div style={{ marginBottom: '16px' }}>
            <textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} disabled={loading} placeholder="写下你的留言..." rows={4} style={{ width: '100%', fontSize: '15px', resize: 'vertical' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
            <span onClick={() => setShowEmoji(!showEmoji)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '4px' }}>
              <svg width="22" height="22" viewBox="0 0 496 512" fill="#666" xmlns="http://www.w3.org/2000/svg">
                <path d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm141.4 389.4c-37.8 37.8-88 58.6-141.4 58.6s-103.6-20.8-141.4-58.6S48 309.4 48 256s20.8-103.6 58.6-141.4S194.6 56 248 56s103.6 20.8 141.4 58.6S448 202.6 448 256s-20.8 103.6-58.6 141.4zM328 224c17.7 0 32-14.3 32-32s-14.3-32-32-32-32 14.3-32 32 14.3 32 32 32zm-160 0c17.7 0 32-14.3 32-32s-14.3-32-32-32-32 14.3-32 32 14.3 32 32 32zm194.4 64H133.6c-8.2 0-14.5 7-13.5 15 7.5 59.2 58.9 105 121.1 105h13.6c62.2 0 113.6-45.8 121.1-105 1-8-5.3-15-13.5-15z"/>
              </svg>
            </span>
            {showEmoji && (
              <div className="emoji-dropdown" style={{
                position: 'absolute',
                bottom: '100%',
                left: 0,
                marginBottom: '8px',
                background: '#fff',
                borderRadius: '12px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                padding: '12px',
                zIndex: 100,
                width: '300px',
                maxWidth: '65vw',
              }}>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', borderBottom: '1px solid #eee', paddingBottom: '8px' }}>
                  <span onClick={() => setEmojiTab('emoji')} style={{ padding: '6px 16px', cursor: 'pointer', fontSize: '13px', fontWeight: emojiTab === 'emoji' ? 600 : 400, color: emojiTab === 'emoji' ? '#000' : '#888' }}>Emoji</span>
                  <span onClick={() => setEmojiTab('kaomoji')} style={{ padding: '6px 16px', cursor: 'pointer', fontSize: '13px', fontWeight: emojiTab === 'kaomoji' ? 600 : 400, color: emojiTab === 'kaomoji' ? '#000' : '#888' }}>颜文字</span>
                </div>
                <div className="hide-scrollbar" style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', maxHeight: '200px', overflowY: 'auto' }}>
                  {(emojiTab === 'emoji' ? EMOJI_LIST : KAOMOJI_LIST).map((item, i) => (
                    <span key={i} onClick={() => insertEmoji(item)} style={{ fontSize: '20px', padding: '4px', cursor: 'pointer', borderRadius: '6px' }}>{item}</span>
                  ))}
                </div>
              </div>
            )}
            {message && <span style={{ color: '#000080', fontSize: '14px' }}>{message}</span>}
            <button type="submit" disabled={loading} style={{ padding: '8px 28px', fontSize: '15px' }}>{loading ? '提交中...' : '提交评论'}</button>
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
              {comments.map((comment) => (
                <div key={comment.id} style={{ border: '1px solid #808080', padding: '16px', background: '#fff' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <strong style={{ color: '#000080' }}>{comment.userName}</strong>
                    <span style={{ fontSize: '13px', color: '#888' }}>{new Date(comment.createdAt).toLocaleDateString('zh-CN')}</span>
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

function HistorySection() {
  const [history, setHistory] = useState<HistoryEvent[]>([]);

  useEffect(() => {
    fetch('/api/history')
      .then(res => res.json())
      .then(data => setHistory(data))
      .catch(console.error);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {history.map((item, i) => (
        <div key={i} style={{ display: 'flex', gap: '12px', fontSize: '15px' }}>
          <span style={{ color: '#000080', minWidth: '80px' }}>{item.date}</span>
          <span>{item.event}</span>
        </div>
      ))}
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
        <Window title="留言板" defaultExpanded={true} idname={'guestbook'}><GuestbookSection articleKey="guestbook" /></Window>
        <Window title="小破站编年史" defaultExpanded={true} idname={'history'}><HistorySection /></Window>
        <Footer />
      </main>
      {showLinksModal && <LinksModal onClose={() => setShowLinksModal(false)} />}
    </div>
  );
}