'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { WindowComponent } from './Window';
import { Taskbar } from './Taskbar';
import { DesktopIcons } from './DesktopIcons';
import { AboutContent, WorksContent, LinksContent, HistoryContent, CommentContent, ArticlesContent } from './WindowContent';
import type { WindowState } from '@/lib/data';

const DEFAULT_WINDOW_CONFIG = {
  x: 50,
  y: 30,
  width: 350,
  height: 280,
  isMinimized: false,
  isMaximized: false,
  isActive: true,
};

const createWindowState = (id: string, title: string, x: number, y: number, w: number, h: number): WindowState => ({
  ...DEFAULT_WINDOW_CONFIG,
  id,
  title,
  x,
  y,
  width: w,
  height: h,
});

export function Desktop() {
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [currentTime, setCurrentTime] = useState('');
  const [todayDate, setTodayDate] = useState('');

  // 初始化时间
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', hour12: false }));
      setTodayDate(`${now.getMonth() + 1}月${now.getDate()}日 星期${['日','一','二','三','四','五','六'][now.getDay()]}`);
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // 初始化时打开主要窗口
  useEffect(() => {
    setWindows([
      createWindowState('about', '关于我', 30, 40, 360, 300),
      createWindowState('works', '作品集', 410, 50, 360, 280),
      createWindowState('links', '友链', 30, 360, 380, 260),
    ]);
  }, []);

  const openWindow = useCallback((id: string, title: string, x?: number, y?: number, w?: number, h?: number) => {
    const existing = windows.find(w => w.id === id);
    if (existing) {
      if (existing.isMinimized) {
        setWindows(prev => prev.map(w => 
          w.id === id ? { ...w, isMinimized: false, isActive: true } : { ...w, isActive: false }
        ));
      } else {
        setWindows(prev => prev.map(w => 
          w.id === id ? { ...w, isActive: true } : { ...w, isActive: false }
        ));
      }
      return;
    }

    const offset = windows.length * 25;
    const newWindow = createWindowState(
      id, 
      title, 
      x ?? 50 + offset, 
      y ?? 30 + offset, 
      w ?? 350, 
      h ?? 280
    );
    
    setWindows(prev => [
      ...prev.map(w => ({ ...w, isActive: false })),
      newWindow
    ]);
  }, [windows]);

  const handleIconClick = useCallback((action: string) => {
    switch (action) {
      case 'openAbout':
        openWindow('about', '关于我', 30, 40, 360, 300);
        break;
      case 'openWorks':
        openWindow('works', '作品集', 410, 50, 360, 280);
        break;
      case 'openLinks':
        openWindow('links', '友链', 30, 360, 380, 260);
        break;
      case 'openHistory':
        openWindow('history', '变迁史', 420, 350, 340, 300);
        break;
      case 'openGuestbook':
        openWindow('guestbook', '留言板', 100, 100, 400, 350);
        break;
      case 'openArticles':
        openWindow('articles', '文章', 150, 80, 380, 320);
        break;
    }
  }, [openWindow]);

  const handleCloseWindow = useCallback((id: string) => {
    setWindows(prev => prev.filter(w => w.id !== id));
  }, []);

  const handleMinimizeWindow = useCallback((id: string) => {
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, isMinimized: true } : w
    ));
  }, []);

  const handleMaximizeWindow = useCallback((id: string) => {
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, isMaximized: !w.isMaximized } : w
    ));
  }, []);

  const handleFocusWindow = useCallback((id: string) => {
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, isActive: true } : { ...w, isActive: false }
    ));
  }, []);

  const handleDragWindow = useCallback((id: string, x: number, y: number) => {
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, x, y } : w
    ));
  }, []);

  const handleTaskbarWindowClick = useCallback((id: string) => {
    const window = windows.find(w => w.id === id);
    if (window?.isMinimized) {
      setWindows(prev => prev.map(w => 
        w.id === id ? { ...w, isMinimized: false, isActive: true } : { ...w, isActive: false }
      ));
    } else if (window) {
      setWindows(prev => prev.map(w => 
        w.id === id ? { ...w, isActive: true } : { ...w, isActive: false }
      ));
    }
  }, [windows]);

  const icons = [
    { id: 'about', label: '关于我', icon: '/icons/user.png', action: 'openAbout' },
    { id: 'works', label: '作品集', icon: '/icons/folder.png', action: 'openWorks' },
    { id: 'articles', label: '文章', icon: '/icons/document.png', action: 'openArticles' },
    { id: 'links', label: '友链', icon: '/icons/favorites.png', action: 'openLinks' },
    { id: 'guestbook', label: '留言板', icon: '/icons/mail.png', action: 'openGuestbook' },
    { id: 'history', label: '变迁史', icon: '/icons/history.png', action: 'openHistory' },
  ];

  const getWindowContent = (id: string) => {
    switch (id) {
      case 'about': return <AboutContent />;
      case 'works': return <WorksContent />;
      case 'links': return <LinksContent />;
      case 'history': return <HistoryContent />;
      case 'guestbook': return <CommentContent articleKey="guestbook" />;
      case 'articles': return <ArticlesContent />;
      default: return null;
    }
  };

  return (
    <div className="desktop">
      {/* 时钟部件 */}
      <div style={{
        position: 'absolute',
        top: 8,
        right: 8,
        background: '#c0c0c0',
        border: '2px solid',
        borderColor: '#fff #808080 #808080 #fff',
        padding: '4px 8px',
        fontSize: '12px',
        zIndex: 100,
      }}>
        <div style={{ fontWeight: 'bold', color: '#000' }}>{currentTime}</div>
        <div style={{ fontSize: '10px', color: '#666' }}>{todayDate}</div>
      </div>

      {/* 我的电脑/网上邻居 - 桌面图标形式 */}
      <div style={{
        position: 'absolute',
        top: 40,
        left: 8,
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        zIndex: 50,
      }}>
        <div className="desktop-icon" onClick={() => {}}>
          <img src="/icons/folder.png" alt="我的电脑" style={{ width: 28, height: 28 }} />
          <span>我的电脑</span>
        </div>
        <div className="desktop-icon" onClick={() => {}}>
          <img src="/icons/favorites.png" alt="网上邻居" style={{ width: 28, height: 28 }} />
          <span>网上邻居</span>
        </div>
      </div>
      
      <DesktopIcons icons={icons} onIconClick={handleIconClick} />
      
      <div className="windows-container" style={{ marginTop: 40 }}>
        {windows.map(win => (
          !win.isMinimized && (
            <WindowComponent
              key={win.id}
              window={win}
              onClose={handleCloseWindow}
              onMinimize={handleMinimizeWindow}
              onMaximize={handleMaximizeWindow}
              onFocus={handleFocusWindow}
              onDrag={handleDragWindow}
            >
              {getWindowContent(win.id)}
            </WindowComponent>
          )
        ))}
      </div>
      
      <Taskbar 
        windows={windows.map(w => ({ id: w.id, title: w.title, isActive: w.isActive, isMinimized: w.isMinimized }))}
        onWindowClick={handleTaskbarWindowClick}
      />
    </div>
  );
}