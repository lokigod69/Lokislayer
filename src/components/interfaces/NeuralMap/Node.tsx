// src/components/interfaces/NeuralMap/Node.tsx

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Project } from '../../../config/projects';
import styles from './styles.module.css';

interface NodeProps {
  project: Project;
  position: { x: number; y: number };
  index: number;
}

// Icons for each project
const projectIcons: Record<string, string> = {
  lokitunes: '🎵',
  matrixarena: '💊',
  vocapp: '📚',
  bountyhunter: '🏴‍☠️',
  crym: '🔮',
  podcast: '🎧',
};

export default function Node({ project, position, index }: NodeProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const handleClick = () => {
    if (project.status === 'coming-soon') return;
    window.open(project.url, '_blank', 'noopener,noreferrer');
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    setShowPreview(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setShowPreview(false);
  };

  return (
    <motion.div
      className={styles.node}
      style={{
        left: `calc(50% + ${position.x}px)`,
        top: `calc(50% + ${position.y}px)`,
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        delay: index * 0.15,
        duration: 0.5,
        type: 'spring',
        stiffness: 200,
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {/* Glow effect */}
      <motion.div
        className={styles.nodeGlow}
        style={{
          background: `radial-gradient(circle, ${project.theme.primaryColor}40 0%, transparent 70%)`,
        }}
        animate={{
          scale: isHovered ? 1.5 : [1, 1.3, 1],
          opacity: isHovered ? 0.7 : [0.5, 0.3, 0.5],
        }}
        transition={{
          duration: isHovered ? 0.3 : 3,
          repeat: isHovered ? 0 : Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Node core */}
      <motion.div
        className={styles.nodeCore}
        style={{
          background: `linear-gradient(135deg, ${project.theme.primaryColor}30 0%, ${project.theme.primaryColor}10 100%)`,
          border: `2px solid ${project.theme.primaryColor}60`,
          boxShadow: `
            0 0 20px ${project.theme.primaryColor}30,
            inset 0 0 20px ${project.theme.primaryColor}20
          `,
        }}
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.95 }}
      >
        <span className={styles.nodeIcon}>
          {projectIcons[project.id] || '⚡'}
        </span>
      </motion.div>

      {/* Label */}
      <div className={styles.nodeLabel}>{project.name}</div>

      {/* Preview tooltip */}
      <AnimatePresence>
        {showPreview && (
          <motion.div
            className={styles.preview}
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            <div
              className={styles.previewTitle}
              style={{ color: project.theme.primaryColor }}
            >
              {project.name}
            </div>
            <div className={styles.previewDescription}>
              {project.description}
            </div>
            <span
              className={`${styles.previewStatus} ${
                project.status === 'live' ? styles.statusLive : styles.statusComingSoon
              }`}
            >
              {project.status === 'live' ? '● Live' : '◐ Coming Soon'}
            </span>
            {project.status === 'live' && (
              <div className={styles.previewHint}>Click to visit →</div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
