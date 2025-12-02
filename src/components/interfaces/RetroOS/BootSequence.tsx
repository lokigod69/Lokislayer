// src/components/interfaces/RetroOS/BootSequence.tsx

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './styles.module.css';

interface BootSequenceProps {
  onComplete: () => void;
}

const bootLines = [
  'POLY-BIOS (C) 2025 Poly-Interface Systems, Inc.',
  'BIOS Date: 12/02/25  Ver: 95.0',
  '',
  'Checking RAM... 640K OK',
  'Checking Extended Memory... 4096K OK',
  '',
  'Detecting Primary IDE Master... POLY_CREATIVE_HDD',
  'Detecting Primary IDE Slave... None',
  '',
  'Loading POLY-DOS...',
  '',
  'Starting Poly-Interface Portal 95...',
];

export default function BootSequence({ onComplete }: BootSequenceProps) {
  const [phase, setPhase] = useState<'bios' | 'logo' | 'done'>('bios');
  const [visibleLines, setVisibleLines] = useState<string[]>([]);
  const showCursor = true; // Always show cursor during boot

  useEffect(() => {
    if (phase === 'bios') {
      let lineIndex = 0;
      const interval = setInterval(() => {
        if (lineIndex < bootLines.length) {
          setVisibleLines((prev) => [...prev, bootLines[lineIndex]]);
          lineIndex++;
        } else {
          clearInterval(interval);
          setTimeout(() => setPhase('logo'), 500);
        }
      }, 150);
      return () => clearInterval(interval);
    }
  }, [phase]);

  useEffect(() => {
    if (phase === 'logo') {
      const timer = setTimeout(() => {
        setPhase('done');
        onComplete();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [phase, onComplete]);

  return (
    <AnimatePresence>
      {phase !== 'done' && (
        <motion.div
          className={styles.bootScreen}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {phase === 'bios' && (
            <div className={styles.bootText}>
              {visibleLines.map((line, i) => (
                <div key={i}>{line}</div>
              ))}
              {showCursor && <span className={styles.cursor} />}
            </div>
          )}

          {phase === 'logo' && (
            <motion.div
              className={styles.bootLogo}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className={styles.bootLogoText}>
                🪟 Poly-Interface 95
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
