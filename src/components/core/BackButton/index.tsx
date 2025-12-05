// src/components/core/BackButton/index.tsx
// Themed close button that appears in top-right corner
// Styling varies based on the active interface

import { motion } from 'framer-motion';
import { useStore } from '../../../store/useStore';
import styles from './styles.module.css';

interface BackButtonProps {
  interfaceId?: number;
}

// Theme configurations for each interface
const interfaceThemes: Record<number, { className: string; label: string }> = {
  1: { className: styles.neuralMap, label: 'Neural Map' },       // Neural Map - purple/cyan glow
  2: { className: styles.anatomicalMap, label: 'Anatomical Map' }, // Anatomical Map - sepia/brown
  3: { className: styles.retroOS, label: 'Retro OS' },           // RetroOS - skip (has its own close)
  4: { className: styles.broadcast, label: 'Broadcast' },        // Broadcast - green terminal
  5: { className: styles.controlRoom, label: 'Control Room' },   // Control Room - orange sci-fi
  6: { className: styles.vendingMachine, label: 'Vending Machine' }, // Vending Machine - neon pink/cyan
};

export default function BackButton({ interfaceId }: BackButtonProps) {
  const { goToLobby, currentInterface } = useStore();

  const activeInterface = interfaceId ?? currentInterface;

  // Don't render for RetroOS (id: 3) - it has its own close mechanism
  if (activeInterface === 3) {
    return null;
  }

  const theme = activeInterface ? interfaceThemes[activeInterface] : null;
  const themeClass = theme?.className || '';

  return (
    <motion.button
      className={`${styles.closeButton} ${themeClass}`}
      onClick={goToLobby}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3, duration: 0.3 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      title="Close"
      aria-label="Close and return to portal"
    >
      <span className={styles.closeIcon}>×</span>
      <span className={styles.closeGlow} />
    </motion.button>
  );
}
