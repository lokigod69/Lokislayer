// src/components/interfaces/AnatomicalMap/BodySVG.tsx

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { projects, Project } from '../../../config/projects';
import styles from './styles.module.css';

// Body part icons
const bodyPartIcons: Record<string, string> = {
  ear: '👂',
  brain: '🧠',
  mouth: '👄',
  hands: '🤲',
  eye: '👁️',
  heart: '❤️',
};

// Body part reveal icons (what's "underneath")
const revealIcons: Record<string, string> = {
  ear: '🎵',
  brain: '⚡',
  mouth: '💬',
  hands: '✋',
  eye: '🔮',
  heart: '💫',
};

// Body part positions (percentage based)
const bodyPartPositions: Record<string, { top: string; left: string }> = {
  ear: { top: '18%', left: '20%' },
  brain: { top: '8%', left: '50%' },
  mouth: { top: '28%', left: '50%' },
  hands: { top: '58%', left: '78%' },
  eye: { top: '18%', left: '68%' },
  heart: { top: '42%', left: '45%' },
};

interface BodySVGProps {
  onSelectProject: (project: Project) => void;
}

export default function BodySVG(_props: BodySVGProps) {
  const [, setHoveredPart] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const getProjectForBodyPart = (bodyPart: string): Project | undefined => {
    return projects.find((p) => p.mappings.anatomicalMap.bodyPart === bodyPart);
  };

  const handleClick = (bodyPart: string) => {
    const project = getProjectForBodyPart(bodyPart);
    if (project) {
      setSelectedProject(selectedProject?.id === project.id ? null : project);
    }
  };

  const handleVisit = () => {
    if (selectedProject && selectedProject.status === 'live') {
      window.open(selectedProject.url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className={styles.bodyContainer}>
      {/* Da Vinci style figure outline */}
      <svg
        className={styles.bodySvg}
        viewBox="0 0 200 340"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Head */}
        <ellipse cx="100" cy="40" rx="30" ry="35" stroke="#8b5a2b" strokeWidth="1.5" fill="none" />

        {/* Neck */}
        <path d="M90 75 L90 95 M110 75 L110 95" stroke="#8b5a2b" strokeWidth="1.5" />

        {/* Shoulders */}
        <path d="M90 95 Q60 100 40 115" stroke="#8b5a2b" strokeWidth="1.5" fill="none" />
        <path d="M110 95 Q140 100 160 115" stroke="#8b5a2b" strokeWidth="1.5" fill="none" />

        {/* Torso */}
        <path d="M70 100 L65 200 M130 100 L135 200" stroke="#8b5a2b" strokeWidth="1.5" />

        {/* Arms */}
        <path d="M40 115 L25 180 L30 220" stroke="#8b5a2b" strokeWidth="1.5" fill="none" />
        <path d="M160 115 L175 180 L170 220" stroke="#8b5a2b" strokeWidth="1.5" fill="none" />

        {/* Hips */}
        <ellipse cx="100" cy="210" rx="40" ry="20" stroke="#8b5a2b" strokeWidth="1.5" fill="none" />

        {/* Legs */}
        <path d="M75 225 L65 320" stroke="#8b5a2b" strokeWidth="1.5" />
        <path d="M125 225 L135 320" stroke="#8b5a2b" strokeWidth="1.5" />

        {/* Heart area indicator */}
        <circle cx="90" cy="140" r="15" stroke="#8b5a2b" strokeWidth="0.5" strokeDasharray="3,3" fill="none" />

        {/* Vitruvian circle hint */}
        <circle cx="100" cy="170" r="90" stroke="#8b5a2b" strokeWidth="0.3" strokeDasharray="5,10" fill="none" opacity="0.3" />
      </svg>

      {/* Interactive hotspots */}
      {Object.entries(bodyPartPositions).map(([bodyPart, position]) => {
        const project = getProjectForBodyPart(bodyPart);
        if (!project) return null;

        const isSelected = selectedProject?.id === project.id;

        return (
          <motion.div
            key={bodyPart}
            className={`${styles.hotspot} ${styles[bodyPart]}`}
            style={{
              top: position.top,
              left: position.left,
              transform: position.left === '50%' ? 'translateX(-50%)' : undefined,
            }}
            onMouseEnter={() => setHoveredPart(bodyPart)}
            onMouseLeave={() => setHoveredPart(null)}
            onClick={() => handleClick(bodyPart)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className={styles.hotspotInner}>
              <span>{bodyPartIcons[bodyPart]}</span>
              <div className={styles.hotspotReveal}>
                <span>{revealIcons[bodyPart]}</span>
              </div>
            </div>

            {/* Tooltip */}
            <AnimatePresence>
              {isSelected && (
                <motion.div
                  className={styles.tooltip}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className={styles.tooltipBodyPart}>
                    {bodyPart} → {project.name}
                  </div>
                  <div className={styles.tooltipTitle}>{project.name}</div>
                  <div className={styles.tooltipDescription}>
                    {project.description}
                  </div>
                  <button
                    className={styles.tooltipButton}
                    onClick={handleVisit}
                    disabled={project.status !== 'live'}
                  >
                    {project.status === 'live' ? 'Enter Portal' : 'Coming Soon'}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}

      {/* Da Vinci style annotations */}
      <div className={`${styles.annotation} ${styles.annotation1}`}>
        "The eye is the window..."
      </div>
      <div className={`${styles.annotation} ${styles.annotation2}`}>
        "...to the soul"
      </div>
      <div className={`${styles.annotation} ${styles.annotation3}`}>
        "Homo Digitalis"
      </div>
    </div>
  );
}
