// src/components/core/EntryLobby/index.tsx

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../../../store/useStore';
import InterfaceGrid from './InterfaceGrid';
import Dice from './Dice';
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
          Six interfaces. One universe. Roll the dice to discover your gateway,
          or choose your own path through the digital realm.
        </motion.p>

        {/* Main Actions */}
        <motion.div
          className={styles.actions}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <Dice />
          <button
            onClick={() => setInterface(1)}
            className={styles.quickEnter}
          >
            <span>🧠</span>
            <span>Enter Neural Map</span>
          </button>
        </motion.div>

        {/* Interface Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className={styles.sectionTitle}>Choose Your Reality</h2>
          <InterfaceGrid />
        </motion.div>
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
