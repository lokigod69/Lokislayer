// src/components/interfaces/RetroOS/Desktop.tsx

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { projects } from '../../../config/projects';
import Icon from './Icon';
import Window from './Window';
import StartMenu from './StartMenu';
import styles from './styles.module.css';

interface OpenWindow {
  projectId: string;
  isMinimized: boolean;
  zIndex: number;
}

export default function Desktop() {
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const [openWindows, setOpenWindows] = useState<OpenWindow[]>([]);
  const [showStartMenu, setShowStartMenu] = useState(false);
  const [maxZIndex, setMaxZIndex] = useState(10);
  const [currentTime, setCurrentTime] = useState('');

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

  const openWindow = (projectId: string) => {
    const existing = openWindows.find((w) => w.projectId === projectId);
    if (existing) {
      // Bring to front and restore if minimized
      focusWindow(projectId);
      if (existing.isMinimized) {
        setOpenWindows((prev) =>
          prev.map((w) =>
            w.projectId === projectId ? { ...w, isMinimized: false } : w
          )
        );
      }
    } else {
      // Open new window
      setMaxZIndex((prev) => prev + 1);
      setOpenWindows((prev) => [
        ...prev,
        { projectId, isMinimized: false, zIndex: maxZIndex + 1 },
      ]);
    }
  };

  const closeWindow = (projectId: string) => {
    setOpenWindows((prev) => prev.filter((w) => w.projectId !== projectId));
  };

  const minimizeWindow = (projectId: string) => {
    setOpenWindows((prev) =>
      prev.map((w) =>
        w.projectId === projectId ? { ...w, isMinimized: true } : w
      )
    );
  };

  const focusWindow = (projectId: string) => {
    setMaxZIndex((prev) => prev + 1);
    setOpenWindows((prev) =>
      prev.map((w) =>
        w.projectId === projectId
          ? { ...w, zIndex: maxZIndex + 1, isMinimized: false }
          : w
      )
    );
  };

  const handleDesktopClick = () => {
    setSelectedIcon(null);
    setShowStartMenu(false);
  };

  return (
    <div className={styles.desktop} onClick={handleDesktopClick}>
      {/* Desktop Icons */}
      <div className={styles.desktopIcons}>
        {projects.map((project) => (
          <Icon
            key={project.id}
            project={project}
            isSelected={selectedIcon === project.id}
            onSelect={() => setSelectedIcon(project.id)}
            onDoubleClick={() => openWindow(project.id)}
          />
        ))}
      </div>

      {/* Open Windows */}
      <AnimatePresence>
        {openWindows
          .filter((w) => !w.isMinimized)
          .map((window) => {
            const project = projects.find((p) => p.id === window.projectId);
            if (!project) return null;
            const isActive =
              window.zIndex ===
              Math.max(...openWindows.map((w) => w.zIndex));

            return (
              <motion.div
                key={window.projectId}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.15 }}
              >
                <Window
                  project={project}
                  isActive={isActive}
                  zIndex={window.zIndex}
                  onClose={() => closeWindow(window.projectId)}
                  onFocus={() => focusWindow(window.projectId)}
                  onMinimize={() => minimizeWindow(window.projectId)}
                />
              </motion.div>
            );
          })}
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
              onSelectProject={openWindow}
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
          <span className={styles.startLogo}>🪟</span>
          Start
        </button>

        <div className={styles.taskbarDivider} />

        <div className={styles.openWindows}>
          {openWindows.map((window) => {
            const project = projects.find((p) => p.id === window.projectId);
            if (!project) return null;
            const isActive =
              !window.isMinimized &&
              window.zIndex === Math.max(...openWindows.map((w) => w.zIndex));

            return (
              <button
                key={window.projectId}
                className={`${styles.taskbarWindow} ${isActive ? styles.taskbarWindowActive : ''}`}
                onClick={() => focusWindow(window.projectId)}
              >
                {project.name}
              </button>
            );
          })}
        </div>

        <div className={styles.clock}>{currentTime}</div>
      </div>
    </div>
  );
}
