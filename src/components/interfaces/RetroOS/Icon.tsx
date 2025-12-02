// src/components/interfaces/RetroOS/Icon.tsx

import { useState } from 'react';
import { Project } from '../../../config/projects';
import styles from './styles.module.css';

interface IconProps {
  project: Project;
  isSelected: boolean;
  onSelect: () => void;
  onDoubleClick: () => void;
}

// Win95-style emoji icons for each project type
const iconEmojis: Record<string, string> = {
  'media-player': '🎵',
  terminal: '💻',
  folder: '📁',
  sticky: '📝',
  screensaver: '🖼️',
  hidden: '🗑️',
};

export default function Icon({ project, isSelected, onSelect, onDoubleClick }: IconProps) {
  const [clickCount, setClickCount] = useState(0);
  const [clickTimer, setClickTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  const handleClick = () => {
    if (clickCount === 0) {
      // First click - select and start timer
      onSelect();
      setClickCount(1);
      const timer = setTimeout(() => {
        setClickCount(0);
      }, 400);
      setClickTimer(timer);
    } else {
      // Second click within time - double click
      if (clickTimer) clearTimeout(clickTimer);
      setClickCount(0);
      onDoubleClick();
    }
  };

  return (
    <div
      className={`${styles.icon} ${isSelected ? styles.iconSelected : ''}`}
      onClick={handleClick}
    >
      <div className={styles.iconImage}>
        {iconEmojis[project.mappings.retroOS.iconType] || '📄'}
      </div>
      <div className={styles.iconLabel}>
        {project.mappings.retroOS.filename}
      </div>
    </div>
  );
}
