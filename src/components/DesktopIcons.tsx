'use client';

import { useCallback, useState } from 'react';
import type { DesktopIcon } from '@/lib/data';

interface DesktopIconsProps {
  icons: DesktopIcon[];
  onIconClick: (action: string) => void;
}

export function DesktopIcons({ icons, onIconClick }: DesktopIconsProps) {
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);

  const handleIconClick = useCallback((icon: DesktopIcon) => {
    setSelectedIcon(icon.id);
    onIconClick(icon.action);
  }, [onIconClick]);

  return (
    <div className="desktop-icons">
      {icons.map(icon => (
        <div
          key={icon.id}
          className={`desktop-icon ${selectedIcon === icon.id ? 'selected' : ''}`}
          onClick={() => handleIconClick(icon)}
          onDoubleClick={() => onIconClick(icon.action)}
        >
          <img src={icon.icon} alt={icon.label} />
          <span>{icon.label}</span>
        </div>
      ))}
    </div>
  );
}