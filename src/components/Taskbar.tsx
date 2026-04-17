'use client';

import { useState, useEffect, useCallback } from 'react';
import { getCurrentTime } from '@/lib/data';

interface TaskbarProps {
  windows: { id: string; title: string; isActive: boolean; isMinimized: boolean }[];
  onWindowClick: (id: string) => void;
}

export function Taskbar({ windows, onWindowClick }: TaskbarProps) {
  const [time, setTime] = useState(getCurrentTime());
  const [showStartMenu, setShowStartMenu] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(getCurrentTime());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleStartClick = useCallback(() => {
    setShowStartMenu(!showStartMenu);
  }, [showStartMenu]);

  const handleOutsideClick = useCallback(() => {
    if (showStartMenu) {
      setShowStartMenu(false);
    }
  }, [showStartMenu]);

  return (
    <>
      <div className="taskbar" onClick={handleOutsideClick}>
        <button 
          className={`start-button ${'field'}`}
          onClick={(e) => {
            e.stopPropagation();
            handleStartClick();
          }}
          style={showStartMenu ? { background: '#fff' } : undefined}
        >
          <img src="/icons/windows.png" alt="Windows" />
          <span>开始</span>
        </button>
        
        <div className="taskbar-separator" />
        
        <div className="taskbar-items">
          {windows.map(win => (
            <button
              key={win.id}
              className={`taskbar-item ${win.isActive ? 'active' : 'field'}`}
              onClick={() => onWindowClick(win.id)}
              style={win.isMinimized ? { fontStyle: 'italic' } : undefined}
            >
              {win.title}
            </button>
          ))}
        </div>
        
        <div className="taskbar-separator" />
        
        <div className="taskbar-clock field">
          {time}
        </div>
      </div>

      <div className={`start-menu ${showStartMenu ? 'show' : ''}`}>
        <div className="window">
          <div className="title-bar active">
            <div className="title-bar-text">Welcome</div>
          </div>
          <div className="window-body start-menu-items">
            <button className="menu-item">
              <img src="/icons/user.png" alt="" width={16} height={16} />
              关于我
            </button>
            <button className="menu-item">
              <img src="/icons/folder.png" alt="" width={16} height={16} />
              作品集
            </button>
            <button className="menu-item">
              <img src="/icons/mail.png" alt="" width={16} height={16} />
              留言板
            </button>
            <button className="menu-item">
              <img src="/icons/favorites.png" alt="" width={16} height={16} />
              友链
            </button>
            <button className="menu-item">
              <img src="/icons/settings.png" alt="" width={16} height={16} />
              设置
            </button>
            <button className="menu-item">
              <img src="/icons/shutdown.png" alt="" width={16} height={16} />
              关闭
            </button>
          </div>
        </div>
      </div>
    </>
  );
}