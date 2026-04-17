'use client';

import { useState, useRef, useEffect, useCallback, ReactNode } from 'react';
import type { WindowState } from '@/lib/data';

interface WindowProps {
  window: WindowState;
  onClose: (id: string) => void;
  onMinimize: (id: string) => void;
  onMaximize: (id: string) => void;
  onFocus: (id: string) => void;
  onDrag: (id: string, x: number, y: number) => void;
  children: ReactNode;
}

export function WindowComponent({ 
  window, 
  onClose, 
  onMinimize, 
  onMaximize, 
  onFocus,
  onDrag,
  children 
}: WindowProps) {
  const windowRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (window.isMaximized) return;
    const rect = windowRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
    setIsDragging(true);
    onFocus(window.id);
  }, [window.id, window.isMaximized, onFocus]);

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;
      onDrag(window.id, newX, newY);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, window.id, onDrag]);

  return (
    <div
      ref={windowRef}
      className={`window-container ${window.isMaximized ? 'maximized' : ''}`}
      style={{
        left: window.x,
        top: window.y,
        width: window.width,
        height: window.height,
        zIndex: window.isActive ? 1000 : 100,
      }}
      onMouseDown={() => onFocus(window.id)}
    >
      <div className="window">
        <div
          className={`title-bar ${window.isActive ? 'active' : 'inactive'}`}
          onMouseDown={handleMouseDown}
          onMouseMove={isDragging ? undefined : undefined}
          style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
        >
          <div className="title-bar-text">{window.title}</div>
          <div className="title-bar-controls">
            <button aria-label="Minimize" onClick={() => onMinimize(window.id)}>_</button>
            <button aria-label="Maximize" onClick={() => onMaximize(window.id)}>□</button>
            <button aria-label="Close" onClick={() => onClose(window.id)}>×</button>
          </div>
        </div>
        <div className="window-body">
          {children}
        </div>
      </div>
    </div>
  );
}