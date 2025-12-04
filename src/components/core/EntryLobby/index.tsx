// src/components/core/EntryLobby/index.tsx
// Portal - Interface Selection with floating cards and connecting lines

import { useMemo, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../../../store/useStore';
import { interfaces } from '../../../config/interfaces';
import styles from './styles.module.css';

// Generate random particles
function Particles() {
  const particles = useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => ({
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

// SVG Connecting Lines between cards
function ConnectingLines() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhase((p) => (p + 0.02) % (Math.PI * 2));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Card positions (approximate center points based on 3x2 grid)
  // Row 1: cards at positions 0, 1, 2
  // Row 2: cards at positions 3, 4, 5
  const cardPositions = [
    { x: 16.67, y: 35 },  // Card 0 (top-left)
    { x: 50, y: 35 },     // Card 1 (top-center)
    { x: 83.33, y: 35 },  // Card 2 (top-right)
    { x: 16.67, y: 70 },  // Card 3 (bottom-left)
    { x: 50, y: 70 },     // Card 4 (bottom-center)
    { x: 83.33, y: 70 },  // Card 5 (bottom-right)
  ];

  // Define connections between cards
  const connections = [
    [0, 1], [1, 2],         // Top row horizontal
    [3, 4], [4, 5],         // Bottom row horizontal
    [0, 3], [1, 4], [2, 5], // Vertical connections
    [0, 4], [1, 3],         // Diagonal left
    [1, 5], [2, 4],         // Diagonal right
  ];

  // Calculate oscillating offset
  const oscillate = (index: number) => {
    return Math.sin(phase + index * 0.5) * 3;
  };

  return (
    <svg className={styles.connectingLines} viewBox="0 0 100 100" preserveAspectRatio="none">
      <defs>
        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8b5cf6">
            <animate attributeName="stop-color" values="#8b5cf6;#3b82f6;#ec4899;#8b5cf6" dur="4s" repeatCount="indefinite" />
          </stop>
          <stop offset="50%" stopColor="#3b82f6">
            <animate attributeName="stop-color" values="#3b82f6;#ec4899;#8b5cf6;#3b82f6" dur="4s" repeatCount="indefinite" />
          </stop>
          <stop offset="100%" stopColor="#ec4899">
            <animate attributeName="stop-color" values="#ec4899;#8b5cf6;#3b82f6;#ec4899" dur="4s" repeatCount="indefinite" />
          </stop>
        </linearGradient>
        <filter id="lineGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="0.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {connections.map(([from, to], index) => {
        const fromPos = cardPositions[from];
        const toPos = cardPositions[to];
        const midX = (fromPos.x + toPos.x) / 2;
        const midY = (fromPos.y + toPos.y) / 2 + oscillate(index);

        return (
          <path
            key={index}
            d={`M ${fromPos.x} ${fromPos.y} Q ${midX} ${midY} ${toPos.x} ${toPos.y}`}
            stroke="url(#lineGradient)"
            strokeWidth="0.15"
            fill="none"
            opacity={0.4 + Math.sin(phase + index) * 0.2}
            filter="url(#lineGlow)"
          />
        );
      })}
    </svg>
  );
}

// Thumbnail backgrounds
const thumbnailStyles: Record<string, React.CSSProperties> = {
  'neural-map': {
    background: `
      radial-gradient(circle at 30% 40%, rgba(139, 92, 246, 0.8) 0%, transparent 25%),
      radial-gradient(circle at 70% 30%, rgba(34, 197, 94, 0.8) 0%, transparent 25%),
      radial-gradient(circle at 50% 70%, rgba(59, 130, 246, 0.8) 0%, transparent 25%),
      linear-gradient(135deg, #0c0118 0%, #1a0a2e 100%)
    `,
  },
  'anatomical-map': {
    background: `
      radial-gradient(ellipse at 50% 30%, rgba(139, 90, 43, 0.3) 0%, transparent 50%),
      linear-gradient(135deg, #f4e4c8 0%, #d4c4a8 50%, #c4b498 100%)
    `,
  },
  'retro-os': {
    background: `linear-gradient(180deg, #000080 0%, #000080 8%, #008080 8%, #008080 100%)`,
  },
  'broadcast': {
    background: `
      repeating-linear-gradient(0deg, rgba(0,0,0,0.3) 0px, rgba(0,0,0,0.3) 2px, transparent 2px, transparent 4px),
      radial-gradient(circle at 50% 50%, rgba(34, 197, 94, 0.2) 0%, transparent 50%),
      linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)
    `,
  },
  'control-room': {
    background: `
      radial-gradient(circle at 30% 30%, rgba(59, 130, 246, 0.2) 0%, transparent 30%),
      radial-gradient(circle at 70% 70%, rgba(239, 68, 68, 0.15) 0%, transparent 30%),
      linear-gradient(135deg, #0a1628 0%, #162033 100%)
    `,
  },
  'vending-machine': {
    background: `
      radial-gradient(circle at 50% 0%, rgba(0, 255, 255, 0.15) 0%, transparent 50%),
      radial-gradient(circle at 50% 100%, rgba(255, 0, 255, 0.15) 0%, transparent 50%),
      linear-gradient(135deg, #0a0a1a 0%, #1a1a2e 100%)
    `,
  },
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
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          The Portal
        </motion.h1>

        <motion.p
          className={styles.subtitle}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          Choose Your Reality
        </motion.p>

        {/* Interface Grid */}
        <motion.div
          className={styles.grid}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          {interfaces.map((iface, index) => {
            const isVisited = visitedInterfaces.includes(iface.id);

            return (
              <motion.button
                key={iface.id}
                className={`${styles.card} ${isVisited ? styles.cardVisited : ''}`}
                onClick={() => setInterface(iface.id)}
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: 1,
                  y: [0, -8, 0],
                }}
                transition={{
                  opacity: { duration: 0.5, delay: index * 0.1 },
                  y: {
                    duration: 3 + index * 0.3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: index * 0.2,
                  },
                }}
                whileHover={{ scale: 1.05, y: -15 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Thumbnail preview */}
                <div className={styles.cardThumbnail} style={thumbnailStyles[iface.slug]} />

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
          transition={{ delay: 0.6 }}
          whileHover={{ scale: 1.02 }}
        >
          ← Roll the Dice
        </motion.button>
      </div>
    </div>
  );
}
