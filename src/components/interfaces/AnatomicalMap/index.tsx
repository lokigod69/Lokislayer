// src/components/interfaces/AnatomicalMap/index.tsx
// Da Vinci Vitruvian Man style interface - Dark Mode
// Redesigned: Body at top, fixed detail panel at bottom

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BodySVG from './BodySVG';
import { projects, Project } from '../../../config/projects';
import styles from './styles.module.css';

export default function AnatomicalMap() {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [selectedBodyPart, setSelectedBodyPart] = useState<string | null>(null);

  // Get project data for the selected project
  const getSelectedProjectData = (): Project | null => {
    if (!selectedProject) return null;
    return projects.find((p) => p.id === selectedProject) || null;
  };

  // Close panel when clicking anywhere on the background
  const handleBackgroundClick = useCallback(() => {
    if (selectedProject) {
      setSelectedProject(null);
      setSelectedBodyPart(null);
    }
  }, [selectedProject]);

  // Handle hotspot selection from BodySVG
  const handleSelectProject = useCallback((projectId: string | null, bodyPart: string | null) => {
    setSelectedProject(projectId);
    setSelectedBodyPart(bodyPart);
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedProject) {
        setSelectedProject(null);
        setSelectedBodyPart(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedProject]);

  // Visit the project URL
  const handleVisit = (e: React.MouseEvent) => {
    e.stopPropagation();
    const project = getSelectedProjectData();
    if (project && project.status === 'live') {
      window.open(project.url, '_blank', 'noopener,noreferrer');
    }
  };

  // Close panel
  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedProject(null);
    setSelectedBodyPart(null);
  };

  const projectData = getSelectedProjectData();

  return (
    <div className={styles.container} onClick={handleBackgroundClick}>
      {/* Texture overlay */}
      <div className={styles.textureOverlay} />

      {/* Vignette */}
      <div className={styles.vignette} />

      {/* Body Figure - positioned in upper area */}
      <motion.div
        className={styles.figureWrapper}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <BodySVG
          selectedProject={selectedProject}
          onSelectProject={handleSelectProject}
        />
      </motion.div>

      {/* Instructions - show when no selection */}
      <AnimatePresence>
        {!selectedProject && (
          <motion.div
            className={styles.instructions}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.5 }}
          >
            Tap on a body part to explore
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fixed Bottom Detail Panel */}
      <AnimatePresence>
        {selectedProject && projectData && (
          <motion.div
            className={styles.detailPanel}
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button className={styles.closeButton} onClick={handleClose}>
              ✕
            </button>

            {/* Content */}
            <div className={styles.panelContent}>
              <div className={styles.panelBodyPart}>
                {selectedBodyPart}
              </div>
              <div className={styles.panelTitle}>{projectData.name}</div>
              <div className={styles.panelDescription}>
                {projectData.description}
              </div>
              <button
                className={styles.panelButton}
                onClick={handleVisit}
                disabled={projectData.status !== 'live'}
              >
                {projectData.status === 'live' ? 'Enter Portal' : 'Coming Soon'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
