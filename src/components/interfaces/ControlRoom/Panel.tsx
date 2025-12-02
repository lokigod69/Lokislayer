// src/components/interfaces/ControlRoom/Panel.tsx

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Project } from '../../../config/projects';
import styles from './styles.module.css';

interface PanelProps {
  project: Project;
  index: number;
}

// Panel type specific content
const panelIcons: Record<string, string> = {
  oscilloscope: '📊',
  monitor: '🖥️',
  typewriter: '⌨️',
  clipboard: '📋',
  radar: '📡',
  'tape-recorder': '🎙️',
};

export default function Panel({ project, index }: PanelProps) {
  const [isActive, setIsActive] = useState(false);
  const [vuLevels, setVuLevels] = useState([0, 0, 0, 0, 0]);

  // Animate VU meter when active
  useEffect(() => {
    if (!isActive) {
      setVuLevels([0, 0, 0, 0, 0]);
      return;
    }

    const interval = setInterval(() => {
      setVuLevels(vuLevels.map(() => 20 + Math.random() * 60));
    }, 150);

    return () => clearInterval(interval);
  }, [isActive]);

  const handleClick = () => {
    setIsActive(!isActive);
  };

  const handleLaunch = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (project.status === 'live') {
      window.open(project.url, '_blank', 'noopener,noreferrer');
    }
  };

  const panelType = project.mappings.controlRoom.panelType;

  return (
    <motion.div
      className={`${styles.panel} ${isActive ? styles.panelActive : ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.3 }}
      onClick={handleClick}
    >
      {/* Panel Header */}
      <div className={styles.panelHeader}>
        <span className={styles.panelTitle}>{panelType}</span>
        <div className={`${styles.panelLed} ${isActive ? styles.panelLedOn : ''}`} />
      </div>

      {/* Panel Content */}
      <div className={styles.panelContent}>
        {/* CRT Monitor display */}
        <div className={styles.crtMonitor}>
          <div className={styles.crtScreen}>
            {isActive ? (
              <span>{panelIcons[panelType]} {project.name.toUpperCase()}</span>
            ) : (
              <span style={{ color: '#333' }}>STANDBY</span>
            )}
          </div>
          <div className={styles.crtScanlines} />
        </div>

        {/* VU Meter */}
        <div className={styles.vuMeter}>
          {vuLevels.map((level, i) => (
            <div key={i} className={styles.vuBar}>
              <div
                className={styles.vuFill}
                style={{ height: `${isActive ? level : 10}%` }}
              />
            </div>
          ))}
        </div>

        {/* Project Info */}
        <div className={styles.projectInfo}>
          <div className={styles.projectName}>{project.name}</div>
          <div className={styles.projectDesc}>{project.description}</div>
        </div>
      </div>

      {/* Launch Button */}
      <button
        className={styles.launchButton}
        onClick={handleLaunch}
        disabled={project.status !== 'live' || !isActive}
      >
        {project.status === 'live' ? (isActive ? 'Launch' : 'Activate First') : 'Coming Soon'}
      </button>
    </motion.div>
  );
}
