// src/components/interfaces/AnatomicalMap/index.tsx

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

      {/* Title */}
      <motion.div
        className={styles.title}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        Anatomical Map — Homo Digitalis
      </motion.div>

      {/* Body Figure */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <BodySVG onSelectProject={() => {}} />
      </motion.div>

      {/* Instructions */}
      <motion.div
        className={styles.instructions}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        Click on body parts to explore projects • Each organ represents a creation
      </motion.div>
    </div>
  );
}
