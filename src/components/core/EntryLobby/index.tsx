// src/components/core/EntryLobby/index.tsx
// Portal - Elegant Black & White Interface Selection with 3D card effects

import { useMemo, useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../../../store/useStore';
import { interfaces } from '../../../config/interfaces';
import WaveGrid from '../WaveGrid';
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

// Interface card with 3D tilt effect
function InterfaceCard({
  iface,
  index,
  onClick
}: {
  iface: typeof interfaces[0];
  index: number;
  onClick: () => void;
}) {
  const cardRef = useRef<HTMLButtonElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    // Calculate tilt (stronger effect)
    setTilt({
      x: (y - 0.5) * -25,
      y: (x - 0.5) * 25,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setIsHovered(false);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  return (
    <motion.button
      ref={cardRef}
      className={styles.card}
      onClick={onClick}
      initial={{ opacity: 0, y: 30, rotateX: 10 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{
        duration: 0.7,
        delay: 0.4 + index * 0.1,
        ease: [0.16, 1, 0.3, 1],
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) ${isHovered ? 'translateZ(40px) scale(1.08)' : 'translateZ(0) scale(1)'}`,
        transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.4s ease-out',
      }}
    >
      {/* 3D lighting effect */}
      <div
        className={styles.cardShine}
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(circle at ${50 + tilt.y * 2}% ${50 + tilt.x * 2}%, rgba(255,255,255,0.2) 0%, transparent 60%)`,
        }}
      />

      {/* Interface Preview Thumbnail */}
      <div className={styles.cardThumbnail}>
        <InterfacePreview slug={iface.slug} isHovered={isHovered} />
      </div>

      {/* Content */}
      <div className={styles.cardContent}>
        <div className={styles.cardName}>{iface.name}</div>
      </div>

      {/* Edge highlight on hover */}
      <div
        className={styles.cardEdge}
        style={{ opacity: isHovered ? 1 : 0 }}
      />
    </motion.button>
  );
}

// Miniature preview of each interface in B&W
function InterfacePreview({ slug, isHovered }: { slug: string; isHovered: boolean }) {
  switch (slug) {
    case 'neural-map':
      return (
        <div className={styles.previewNeuralMap}>
          {/* Center node */}
          <div className={styles.neuralCenter} />
          {/* Orbiting nodes */}
          {[0, 60, 120, 180, 240, 300].map((angle, i) => (
            <div
              key={i}
              className={styles.neuralNode}
              style={{
                transform: `rotate(${angle}deg) translateX(32px) rotate(-${angle}deg)`,
                animationDelay: `${i * 0.1}s`,
              }}
            />
          ))}
          {/* Connection lines */}
          <svg className={styles.neuralLines}>
            {[0, 60, 120, 180, 240, 300].map((angle, i) => {
              const rad = (angle * Math.PI) / 180;
              return (
                <line
                  key={i}
                  x1="50%"
                  y1="50%"
                  x2={`${50 + Math.cos(rad) * 32}%`}
                  y2={`${50 + Math.sin(rad) * 32}%`}
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="1"
                />
              );
            })}
          </svg>
        </div>
      );

    case 'anatomical-map':
      return (
        <div className={styles.previewAnatomical}>
          {/* Vitruvian man silhouette */}
          <div className={styles.anatomicalFigure}>
            <div className={styles.anatomicalHead} />
            <div className={styles.anatomicalBody} />
            <div className={styles.anatomicalArm} style={{ left: '15%' }} />
            <div className={styles.anatomicalArm} style={{ right: '15%' }} />
            <div className={styles.anatomicalLeg} style={{ left: '35%' }} />
            <div className={styles.anatomicalLeg} style={{ right: '35%' }} />
          </div>
          {/* Circle */}
          <div className={styles.anatomicalCircle} />
        </div>
      );

    case 'retro-os':
      return (
        <div className={styles.previewRetroOS}>
          {/* Title bar */}
          <div className={styles.retroTitleBar}>
            <div className={styles.retroButtons}>
              <span /><span /><span />
            </div>
          </div>
          {/* Desktop icons */}
          <div className={styles.retroDesktop}>
            <div className={styles.retroIcon} />
            <div className={styles.retroIcon} />
            <div className={styles.retroIcon} />
          </div>
          {/* Taskbar */}
          <div className={styles.retroTaskbar} />
        </div>
      );

    case 'broadcast':
      return (
        <div className={styles.previewBroadcast}>
          {/* Radio dial */}
          <div className={styles.broadcastDial}>
            <div className={styles.broadcastNeedle} style={{
              transform: `rotate(${isHovered ? 25 : -15}deg)`,
              transition: 'transform 0.3s ease'
            }} />
          </div>
          {/* Frequency lines */}
          <div className={styles.broadcastFreq}>
            {[...Array(7)].map((_, i) => (
              <div key={i} className={styles.freqLine} />
            ))}
          </div>
          {/* Waveform */}
          <div className={styles.broadcastWave} />
        </div>
      );

    case 'control-room':
      return (
        <div className={styles.previewControlRoom}>
          {/* 2x3 panel grid */}
          <div className={styles.controlGrid}>
            {[...Array(6)].map((_, i) => (
              <div key={i} className={styles.controlPanel}>
                <div className={styles.controlLed} />
              </div>
            ))}
          </div>
        </div>
      );

    case 'vending-machine':
      return (
        <div className={styles.previewVending}>
          {/* Centered vending machine cabinet */}
          <div className={styles.vendingCabinet}>
            {/* Glass display with products */}
            <div className={styles.vendingDisplay}>
              <div className={styles.vendingRow}>
                <div className={styles.vendingItem} />
                <div className={styles.vendingItem} />
                <div className={styles.vendingItem} />
              </div>
              <div className={styles.vendingRow}>
                <div className={styles.vendingItem} />
                <div className={styles.vendingItem} />
                <div className={styles.vendingItem} />
              </div>
            </div>
            {/* Dispensing slot */}
            <div className={styles.vendingSlotArea} />
          </div>
        </div>
      );

    default:
      return <div className={styles.previewDefault} />;
  }
}

export default function EntryLobby() {
  const { setInterface } = useStore();

  const handleBackToDice = () => {
    setInterface(null);
  };

  return (
    <div className={styles.portal}>
      {/* Background layers */}
      <div className={styles.backgroundGradient} />
      <WaveGrid />
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
          {interfaces.map((iface, index) => (
            <InterfaceCard
              key={iface.id}
              iface={iface}
              index={index}
              onClick={() => setInterface(iface.id, 'selection')}
            />
          ))}
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
