// src/components/interfaces/RetroOS/Window.tsx

import { useState, useRef, useEffect } from 'react';
import { Project } from '../../../config/projects';
import styles from './styles.module.css';

interface WindowProps {
  project: Project;
  isActive: boolean;
  zIndex: number;
  onClose: () => void;
  onFocus: () => void;
  onMinimize: () => void;
}

// Icons for window title bar
const iconEmojis: Record<string, string> = {
  'media-player': '🎵',
  terminal: '💻',
  folder: '📁',
  sticky: '📝',
  screensaver: '🖼️',
  hidden: '🗑️',
};

export default function Window({
  project,
  isActive,
  zIndex,
  onClose,
  onFocus,
  onMinimize,
}: WindowProps) {
  const windowRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 100 + Math.random() * 100, y: 50 + Math.random() * 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest(`.${styles.windowControls}`)) return;
    onFocus();
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({
        x: e.clientX - dragOffset.x,
        y: Math.max(0, e.clientY - dragOffset.y),
      });
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
  }, [isDragging, dragOffset]);

  const handleVisit = () => {
    if (project.status === 'live') {
      window.open(project.url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div
      ref={windowRef}
      className={`${styles.window} ${!isActive ? styles.windowInactive : ''}`}
      style={{
        left: position.x,
        top: position.y,
        zIndex,
        width: 320,
      }}
      onClick={onFocus}
    >
      {/* Title Bar */}
      <div className={styles.windowTitleBar} onMouseDown={handleMouseDown}>
        <span className={styles.windowIcon}>
          {iconEmojis[project.mappings.retroOS.iconType] || '📄'}
        </span>
        <span className={styles.windowTitle}>{project.name}</span>
        <div className={styles.windowControls}>
          <button className={styles.windowButton} onClick={onMinimize} title="Minimize">
            _
          </button>
          <button className={styles.windowButton} onClick={onClose} title="Close">
            ×
          </button>
        </div>
      </div>

      {/* Content */}
      <div className={styles.windowContent}>
        <div className={styles.windowContentPreview}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>
            {iconEmojis[project.mappings.retroOS.iconType] || '📄'}
          </div>
          <h2>{project.name}</h2>
          <p>{project.description}</p>
          {project.status === 'live' ? (
            <button className={styles.windowButton95} onClick={handleVisit}>
              Open Website
            </button>
          ) : (
            <span style={{ color: '#808080', fontSize: 11 }}>Coming Soon</span>
          )}
        </div>
      </div>
    </div>
  );
}
