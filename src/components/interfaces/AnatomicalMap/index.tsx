// src/components/interfaces/AnatomicalMap/index.tsx
// Da Vinci Vitruvian Man style interface

import { motion } from 'framer-motion';
import BodySVG from './BodySVG';
import styles from './styles.module.css';

export default function AnatomicalMap() {
  return (
    <div className={styles.container}>
      {/* Parchment texture overlay */}
      <div className={styles.parchmentOverlay} />

      {/* Ink splatters decoration */}
      <div className={styles.inkSplatters} />

      {/* Body Figure */}
      <motion.div
        className={styles.figureWrapper}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <BodySVG onSelectProject={() => {}} />
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
