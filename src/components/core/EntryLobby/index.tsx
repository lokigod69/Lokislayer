// src/components/core/EntryLobby/index.tsx
// Interface Selection Screen (after skipping dice)

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../../../store/useStore';
import InterfaceGrid from './InterfaceGrid';
import styles from './styles.module.css';

// Generate random particles
function Particles() {
  const particles = useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: Math.random() * 15,
      duration: 15 + Math.random() * 10,
      size: 2 + Math.random() * 3,
    }));
  }, []);

  return (
    <div className={styles.particles}>
      {particles.map((p) => (
        <div
          key={p.id}
          className={styles.particle}
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  );
}

export default function EntryLobby() {
  const { setInterface } = useStore();

  const handleBackToDice = () => {
    setInterface(null);
  };

  return (
    <div className={styles.lobby}>
      {/* Background layers */}
      <div className={styles.backgroundGradient} />
      <div className={`${styles.orb} ${styles.orb1}`} />
      <div className={`${styles.orb} ${styles.orb2}`} />
      <div className={`${styles.orb} ${styles.orb3}`} />
      <div className={styles.gridPattern} />
      <div className={styles.noise} />
      <Particles />

      {/* Main content */}
      <div className={styles.content}>
        {/* Title */}
        <motion.h1
          className={styles.title}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          Poly-Interface Portal
        </motion.h1>

        <motion.p
          className={styles.subtitle}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          Six unique interfaces. Choose your reality.
        </motion.p>

        {/* Interface Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className={styles.sectionTitle}>Choose Your Reality</h2>
          <InterfaceGrid />
        </motion.div>

        {/* Back to dice button */}
        <motion.button
          className={styles.backToDice}
          onClick={handleBackToDice}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Back to Dice Roll
        </motion.button>
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        <span>Built with obsession</span>
        <div className={styles.footerDot} />
        <span>2024</span>
      </div>
    </div>
  );
}
