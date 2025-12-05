// src/components/interfaces/RetroOS/Desktop.tsx
// Windows XP Style Desktop with draggable icons and modal

import { useState, useEffect, useCallback, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { projects, Project } from '../../../config/projects';
import { useStore } from '../../../store/useStore';
import StartMenu from './StartMenu';
import styles from './styles.module.css';

// XP-style emoji icons for each project type
const iconEmojis: Record<string, string> = {
  'media-player': '🎵',
  terminal: '💻',
  folder: '📁',
  sticky: '📝',
  screensaver: '🖼️',
  hidden: '🗑️',
  speech: '🗣️',
};

interface IconPosition {
  x: number;
  y: number;
}

interface DraggableIconProps {
  project: Project;
  position: IconPosition;
  iconSize: number;
  isSelected: boolean;
  onSelect: () => void;
  onDoubleClick: () => void;
  onPositionChange: (id: string, pos: IconPosition) => void;
}

// Draggable Icon Component
function DraggableIcon({
  project,
  position,
  iconSize,
  isSelected,
  onSelect,
  onDoubleClick,
  onPositionChange,
}: DraggableIconProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [clickTime, setClickTime] = useState(0);
  const lastClickTimeRef = useRef(0);
  const iconRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    onSelect();
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
    setClickTime(Date.now());
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const newX = Math.max(0, e.clientX - dragStart.x);
      const newY = Math.max(0, e.clientY - dragStart.y);
      onPositionChange(project.id, { x: newX, y: newY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      const now = Date.now();
      // If it was a quick click (not a drag)
      if (now - clickTime < 200) {
        // Check for double-click (two clicks within 400ms)
        if (now - lastClickTimeRef.current < 400) {
          onDoubleClick();
          lastClickTimeRef.current = 0; // Reset to prevent triple-click
        } else {
          // Single click - just select (already done in mouseDown)
          lastClickTimeRef.current = now;
        }
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStart, project.id, onPositionChange, onDoubleClick, clickTime]);

  // Touch support
  const handleTouchStart = (e: React.TouchEvent) => {
    onSelect();
    const touch = e.touches[0];
    setDragStart({
      x: touch.clientX - position.x,
      y: touch.clientY - position.y,
    });
    setClickTime(Date.now());
    setIsDragging(true);
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      const newX = Math.max(0, touch.clientX - dragStart.x);
      const newY = Math.max(0, touch.clientY - dragStart.y);
      onPositionChange(project.id, { x: newX, y: newY });
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
      const now = Date.now();
      if (now - clickTime < 200) {
        // Check for double-tap
        if (now - lastClickTimeRef.current < 400) {
          onDoubleClick();
          lastClickTimeRef.current = 0;
        } else {
          lastClickTimeRef.current = now;
        }
      }
    };

    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, dragStart, project.id, onPositionChange, onDoubleClick, clickTime]);

  const sizeMultiplier = iconSize / 48;

  return (
    <div
      ref={iconRef}
      className={`${styles.icon} ${isSelected ? styles.iconSelected : ''} ${isDragging ? styles.iconDragging : ''}`}
      style={{
        left: position.x,
        top: position.y,
        width: 75 * sizeMultiplier,
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      <div
        className={styles.iconImage}
        style={{
          width: iconSize,
          height: iconSize,
          fontSize: iconSize * 0.83,
        }}
      >
        {iconEmojis[project.mappings.retroOS.iconType] || '📄'}
      </div>
      <div className={styles.iconLabel}>
        {project.mappings.retroOS.filename}
      </div>
    </div>
  );
}

// Project Modal Component
function ProjectModal({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  const handleVisit = () => {
    if (project.status === 'live') {
      window.open(project.url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <motion.div
      className={styles.modalOverlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className={styles.modal}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.modalTitleBar}>
          <span className={styles.modalIcon}>
            {iconEmojis[project.mappings.retroOS.iconType] || '📄'}
          </span>
          <span className={styles.modalTitle}>{project.name}</span>
          <div className={styles.modalControls}>
            <button
              className={`${styles.modalButton} ${styles.modalButtonClose}`}
              onClick={onClose}
            >
              ✕
            </button>
          </div>
        </div>
        <div className={styles.modalContent}>
          <div className={styles.modalProjectIcon}>
            {iconEmojis[project.mappings.retroOS.iconType] || '📄'}
          </div>
          <h2 className={styles.modalProjectName}>{project.name}</h2>
          <p className={styles.modalProjectDescription}>{project.description}</p>
          <div
            className={`${styles.modalStatus} ${
              project.status === 'live' ? styles.statusLive : styles.statusComingSoon
            }`}
          >
            {project.status === 'live' ? '● Online' : '○ Coming Soon'}
          </div>
          <div className={styles.modalActions}>
            <button className={styles.xpButton} onClick={onClose}>
              Cancel
            </button>
            <button
              className={`${styles.xpButton} ${styles.xpButtonPrimary}`}
              onClick={handleVisit}
              disabled={project.status !== 'live'}
            >
              {project.status === 'live' ? 'Open Website' : 'Not Available'}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Settings Modal Component
function SettingsModal({
  iconSize,
  onIconSizeChange,
  onClose,
}: {
  iconSize: number;
  onIconSizeChange: (size: number) => void;
  onClose: () => void;
}) {
  const [tempSize, setTempSize] = useState(iconSize);

  const handleApply = () => {
    onIconSizeChange(tempSize);
    onClose();
  };

  return (
    <motion.div
      className={styles.modalOverlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className={styles.modal}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.modalTitleBar}>
          <span className={styles.modalIcon}>⚙️</span>
          <span className={styles.modalTitle}>Display Properties</span>
          <div className={styles.modalControls}>
            <button
              className={`${styles.modalButton} ${styles.modalButtonClose}`}
              onClick={onClose}
            >
              ✕
            </button>
          </div>
        </div>
        <div className={styles.settingsContent}>
          <div className={styles.settingsTitle}>
            <span>🖥️</span> Appearance Settings
          </div>
          <div className={styles.settingsGroup}>
            <label className={styles.settingsLabel}>
              Icon Size: {tempSize}px
            </label>
            <input
              type="range"
              min="48"
              max="128"
              value={tempSize}
              onChange={(e) => setTempSize(Number(e.target.value))}
              className={styles.iconSizeSlider}
            />
            <div className={styles.iconSizePreview}>
              <span style={{ fontSize: tempSize * 0.83 }}>🎵</span>
              <span style={{ fontSize: 11 }}>Preview</span>
            </div>
          </div>
          <div className={styles.settingsActions}>
            <button className={styles.xpButton} onClick={onClose}>
              Cancel
            </button>
            <button
              className={`${styles.xpButton} ${styles.xpButtonPrimary}`}
              onClick={handleApply}
            >
              Apply
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Help Modal Component
function HelpModal({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      className={styles.modalOverlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className={styles.modal}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.modalTitleBar}>
          <span className={styles.modalIcon}>❓</span>
          <span className={styles.modalTitle}>Windows XP Help</span>
          <div className={styles.modalControls}>
            <button
              className={`${styles.modalButton} ${styles.modalButtonClose}`}
              onClick={onClose}
            >
              ✕
            </button>
          </div>
        </div>
        <div className={styles.helpContent}>
          <div className={styles.helpTitle}>
            <span>📖</span> How to Use
          </div>
          <div className={styles.helpText}>
            <p>Welcome to the Poly-Interface Portal!</p>
            <ul className={styles.helpList}>
              <li><strong>Click an icon</strong> to open a program and visit the website</li>
              <li><strong>Drag icons</strong> anywhere on the desktop to rearrange them</li>
              <li><strong>Start Menu → Settings</strong> to change icon size</li>
              <li><strong>Start Menu → Shut Down</strong> to return to the interface selector</li>
            </ul>
            <p>Each icon represents a different project. Click to learn more and visit the live website!</p>
          </div>
          <div className={styles.settingsActions}>
            <button
              className={`${styles.xpButton} ${styles.xpButtonPrimary}`}
              onClick={onClose}
            >
              OK
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Calculate icon positions based on icon size
function calculateIconPositions(size: number): Record<string, IconPosition> {
  const positions: Record<string, IconPosition> = {};
  // Icon cell size scales with icon size
  const cellWidth = size * 1.8;  // Width of each icon cell
  const cellHeight = size * 1.6; // Height of each icon cell (icon + label)
  const padding = 20;
  const maxRowsBeforeWrap = 4; // Max icons per column before wrapping

  projects.forEach((project, index) => {
    const col = Math.floor(index / maxRowsBeforeWrap);
    const row = index % maxRowsBeforeWrap;
    positions[project.id] = {
      x: padding + col * cellWidth,
      y: padding + row * cellHeight,
    };
  });
  return positions;
}

export default function Desktop() {
  const { setInterface } = useStore();
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const [showStartMenu, setShowStartMenu] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [iconSize, setIconSize] = useState(72);

  // Modal states
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  // Icon positions - stored per project, recalculated when size changes
  const [iconPositions, setIconPositions] = useState<Record<string, IconPosition>>(() =>
    calculateIconPositions(72)
  );

  // Recalculate positions when icon size changes
  const handleIconSizeChange = useCallback((newSize: number) => {
    setIconSize(newSize);
    setIconPositions(calculateIconPositions(newSize));
  }, []);

  // Update clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleDesktopClick = () => {
    setSelectedIcon(null);
    setShowStartMenu(false);
  };

  // Double-click opens the page directly
  const handleIconDoubleClick = useCallback((project: Project) => {
    if (project.status === 'live') {
      window.open(project.url, '_blank', 'noopener,noreferrer');
    } else {
      // For coming soon projects, show the modal instead
      setActiveProject(project);
    }
  }, []);

  const handlePositionChange = useCallback((id: string, pos: IconPosition) => {
    setIconPositions((prev) => ({
      ...prev,
      [id]: pos,
    }));
  }, []);

  const handleShutDown = useCallback(() => {
    setInterface(-1);
  }, [setInterface]);

  return (
    <div className={styles.desktop} onClick={handleDesktopClick}>
      {/* Desktop Icons Area */}
      <div className={styles.desktopArea}>
        {projects.map((project) => (
          <DraggableIcon
            key={project.id}
            project={project}
            position={iconPositions[project.id]}
            iconSize={iconSize}
            isSelected={selectedIcon === project.id}
            onSelect={() => setSelectedIcon(project.id)}
            onDoubleClick={() => handleIconDoubleClick(project)}
            onPositionChange={handlePositionChange}
          />
        ))}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {activeProject && (
          <ProjectModal
            project={activeProject}
            onClose={() => setActiveProject(null)}
          />
        )}
        {showSettings && (
          <SettingsModal
            iconSize={iconSize}
            onIconSizeChange={handleIconSizeChange}
            onClose={() => setShowSettings(false)}
          />
        )}
        {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
      </AnimatePresence>

      {/* Start Menu */}
      <AnimatePresence>
        {showStartMenu && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.15 }}
          >
            <StartMenu
              onSettings={() => {
                setShowStartMenu(false);
                setShowSettings(true);
              }}
              onHelp={() => {
                setShowStartMenu(false);
                setShowHelp(true);
              }}
              onShutDown={() => {
                setShowStartMenu(false);
                handleShutDown();
              }}
              onProgramClick={(project) => {
                setShowStartMenu(false);
                handleIconDoubleClick(project);
              }}
              onClose={() => setShowStartMenu(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Taskbar */}
      <div className={styles.taskbar} onClick={(e) => e.stopPropagation()}>
        <button
          className={`${styles.startButton} ${showStartMenu ? styles.startButtonActive : ''}`}
          onClick={() => setShowStartMenu((prev) => !prev)}
        >
          <svg className={styles.windowsLogo} viewBox="0 0 88 88" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 12.4L35.7 7.6V42.1H0V12.4Z" fill="#F25022"/>
            <path d="M40.2 6.9L87.8 0V42.1H40.2V6.9Z" fill="#7FBA00"/>
            <path d="M0 45.9H35.7V80.4L0 75.6V45.9Z" fill="#00A4EF"/>
            <path d="M40.2 45.9H87.8V88L40.2 81.1V45.9Z" fill="#FFB900"/>
          </svg>
          Start
        </button>

        <div className={styles.taskbarDivider} />

        <div className={styles.openWindows}>
          {/* Active window in taskbar */}
          {activeProject && (
            <button
              className={`${styles.taskbarWindow} ${styles.taskbarWindowActive}`}
              onClick={() => setActiveProject(activeProject)}
            >
              {iconEmojis[activeProject.mappings.retroOS.iconType]} {activeProject.name}
            </button>
          )}
        </div>

        <div className={styles.systemTray}>
          <span className={styles.clock}>{currentTime}</span>
        </div>
      </div>
    </div>
  );
}
