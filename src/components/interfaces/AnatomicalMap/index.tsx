// src/components/interfaces/AnatomicalMap/index.tsx
// Da Vinci Vitruvian Man style interface - Dark Mode

import { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import BodySVG from './BodySVG';
import styles from './styles.module.css';

export default function AnatomicalMap() {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  // Close modal when clicking anywhere on the background
  const handleBackgroundClick = useCallback(() => {
    if (selectedProject) {
      setSelectedProject(null);
    }
  }, [selectedProject]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedProject) {
        setSelectedProject(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedProject]);

  return (
    <div className={styles.container} onClick={handleBackgroundClick}>
      {/* Texture overlay */}
      <div className={styles.textureOverlay} />

      {/* Vignette */}
      <div className={styles.vignette} />

      {/* Body Figure */}
      <motion.div
        className={styles.figureWrapper}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <BodySVG
          selectedProject={selectedProject}
          setSelectedProject={setSelectedProject}
        />
      </motion.div>

      {/* Instructions */}
      <motion.div
        className={styles.instructions}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        Click on the body to explore projects
      </motion.div>
    </div>
  );
}
