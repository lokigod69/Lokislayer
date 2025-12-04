// src/components/core/EntryLobby/index.tsx
// Portal - Elegant Black & White Interface Selection

import { useMemo, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../../../store/useStore';
import { interfaces } from '../../../config/interfaces';
import styles from './styles.module.css';

// Generate subtle particles
function Particles() {
  const particles = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: Math.random() * 20,
      duration: 20 + Math.random() * 15,
      size: 1.5 + Math.random() * 2,
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

// Elegant connecting lines in monochrome
function ConnectingLines() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhase((p) => (p + 0.015) % (Math.PI * 2));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const cardPositions = [
    { x: 16.67, y: 35 },
    { x: 50, y: 35 },
    { x: 83.33, y: 35 },
    { x: 16.67, y: 70 },
    { x: 50, y: 70 },
    { x: 83.33, y: 70 },
  ];

  const connections = [
    [0, 1], [1, 2],
    [3, 4], [4, 5],
    [0, 3], [1, 4], [2, 5],
    [0, 4], [1, 5],
  ];

  return (
    <svg className={styles.connectingLines} viewBox="0 0 100 100" preserveAspectRatio="none">
      <defs>
        <linearGradient id="monoLineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.15)" />
          <stop offset="50%" stopColor="rgba(255,255,255,0.05)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.15)" />
        </linearGradient>
      </defs>
      {connections.map(([from, to], index) => {
        const fromPos = cardPositions[from];
        const toPos = cardPositions[to];
        const midY = (fromPos.y + toPos.y) / 2 + Math.sin(phase + index) * 2;

        return (
          <path
            key={index}
            d={`M ${fromPos.x} ${fromPos.y} Q ${(fromPos.x + toPos.x) / 2} ${midY} ${toPos.x} ${toPos.y}`}
            stroke="url(#monoLineGradient)"
            strokeWidth="0.1"
            fill="none"
            opacity={0.3 + Math.sin(phase + index * 0.5) * 0.15}
          />
        );
      })}
    </svg>
  );
}

// B&W thumbnail styles for each interface
const thumbnailStyles: Record<string, React.CSSProperties> = {
  'neural-map': {
    background: `
      radial-gradient(circle at 30% 40%, rgba(255,255,255,0.15) 0%, transparent 20%),
      radial-gradient(circle at 70% 30%, rgba(255,255,255,0.1) 0%, transparent 20%),
      radial-gradient(circle at 50% 70%, rgba(255,255,255,0.12) 0%, transparent 20%),
      radial-gradient(circle at 50% 50%, rgba(255,255,255,0.05) 0%, transparent 40%),
      linear-gradient(135deg, #0d0d0d 0%, #1a1a1a 100%)
    `,
  },
  'anatomical-map': {
    background: `
      radial-gradient(ellipse 30% 50% at 50% 45%, rgba(255,255,255,0.08) 0%, transparent 100%),
      linear-gradient(180deg, rgba(255,255,255,0.02) 0%, transparent 50%),
      linear-gradient(135deg, #141414 0%, #0a0a0a 100%)
    `,
  },
  'retro-os': {
    background: `
      linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.08) 12%, transparent 12%, transparent 100%),
      repeating-linear-gradient(0deg, transparent 0px, transparent 8px, rgba(255,255,255,0.02) 8px, rgba(255,255,255,0.02) 9px),
      linear-gradient(135deg, #121212 0%, #0d0d0d 100%)
    `,
  },
  'broadcast': {
    background: `
      radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 0%, transparent 30%),
      repeating-linear-gradient(0deg, rgba(255,255,255,0.02) 0px, rgba(255,255,255,0.02) 2px, transparent 2px, transparent 4px),
      linear-gradient(135deg, #0f0f0f 0%, #181818 100%)
    `,
  },
  'control-room': {
    background: `
      radial-gradient(circle at 25% 35%, rgba(255,255,255,0.06) 0%, transparent 25%),
      radial-gradient(circle at 75% 65%, rgba(255,255,255,0.04) 0%, transparent 25%),
      radial-gradient(circle at 50% 50%, rgba(255,255,255,0.03) 0%, transparent 40%),
      linear-gradient(135deg, #101010 0%, #1a1a1a 100%)
    `,
  },
  'vending-machine': {
    background: `
      linear-gradient(180deg, rgba(255,255,255,0.04) 0%, transparent 20%),
      repeating-linear-gradient(90deg, transparent 0px, transparent 30px, rgba(255,255,255,0.02) 30px, rgba(255,255,255,0.02) 31px),
      repeating-linear-gradient(0deg, transparent 0px, transparent 25px, rgba(255,255,255,0.015) 25px, rgba(255,255,255,0.015) 26px),
      linear-gradient(135deg, #0d0d0d 0%, #151515 100%)
    `,
  },
};

// Interface icons in monochrome style
const interfaceIcons: Record<string, string> = {
  'neural-map': '◉',
  'anatomical-map': '⬡',
  'retro-os': '▢',
  'broadcast': '◎',
  'control-room': '▣',
  'vending-machine': '▤',
};

export default function EntryLobby() {
  const { setInterface, visitedInterfaces } = useStore();

  const handleBackToDice = () => {
    setInterface(null);
  };

  return (
    <div className={styles.portal}>
      {/* Background layers */}
      <div className={styles.backgroundGradient} />
      <div className={`${styles.orb} ${styles.orb1}`} />
      <div className={`${styles.orb} ${styles.orb2}`} />
      <div className={styles.gridPattern} />
      <Particles />

      {/* Connecting lines */}
      <ConnectingLines />

      {/* Main content */}
      <div className={styles.content}>
        {/* Title */}
        <motion.h1
          className={styles.title}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          The Portal
        </motion.h1>

        <motion.p
          className={styles.subtitle}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          Select Your Reality
        </motion.p>

        {/* Interface Grid */}
        <motion.div
          className={styles.grid}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {interfaces.map((iface, index) => {
            const isVisited = visitedInterfaces.includes(iface.id);

            return (
              <motion.button
                key={iface.id}
                className={`${styles.card} ${isVisited ? styles.cardVisited : ''}`}
                onClick={() => setInterface(iface.id)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: 0.4 + index * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Thumbnail preview - B&W */}
                <div className={styles.cardThumbnail} style={thumbnailStyles[iface.slug]}>
                  {/* Centered icon */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '2rem',
                      color: 'rgba(255,255,255,0.15)',
                      fontFamily: 'system-ui',
                    }}
                  >
                    {interfaceIcons[iface.slug] || '○'}
                  </div>
                </div>

                {/* Content */}
                <div className={styles.cardContent}>
                  <div className={styles.cardName}>{iface.name}</div>
                </div>

                {/* Visited indicator */}
                {isVisited && <div className={styles.visitedMark}>✓</div>}
              </motion.button>
            );
          })}
        </motion.div>

        {/* Back to dice */}
        <motion.button
          className={styles.backToDice}
          onClick={handleBackToDice}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          whileHover={{ scale: 1.02 }}
        >
          ← Roll Again
        </motion.button>
      </div>
    </div>
  );
}
