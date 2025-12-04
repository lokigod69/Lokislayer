// src/components/interfaces/NeuralMap/index.tsx
// Neural Map with center home node, draggable project nodes, and connection lines

import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { projects } from '../../../config/projects';
import { useStore } from '../../../store/useStore';
import styles from './styles.module.css';

// Project icons
const projectIcons: Record<string, string> = {
  lokitunes: '🎵',
  matrixarena: '💊',
  vocapp: '📚',
  bountyhunter: '🎯',
  crym: '🖼️',
  podcast: '🎧',
};

interface Position {
  x: number;
  y: number;
}

// Individual draggable node component
function ProjectNode({
  project,
  position,
  index,
  onPositionChange,
}: {
  project: typeof projects[0];
  position: Position;
  index: number;
  onPositionChange: (id: string, x: number, y: number) => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const icon = projectIcons[project.id] || '⚡';

  // Motion values for smooth dragging
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Spring for snap back
  const springX = useSpring(x, { stiffness: 300, damping: 30 });
  const springY = useSpring(y, { stiffness: 300, damping: 30 });

  // Update line position during drag
  useEffect(() => {
    const unsubX = x.on('change', (latestX) => {
      onPositionChange(project.id, position.x + latestX, position.y + y.get());
    });
    const unsubY = y.on('change', (latestY) => {
      onPositionChange(project.id, position.x + x.get(), position.y + latestY);
    });
    return () => {
      unsubX();
      unsubY();
    };
  }, [x, y, position.x, position.y, project.id, onPositionChange]);

  const handleProjectClick = useCallback(() => {
    if (isDragging) return;
    if (project.status === 'coming-soon') return;
    window.open(project.url, '_blank', 'noopener,noreferrer');
  }, [isDragging, project]);

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    // Snap back to original position
    x.set(0);
    y.set(0);
    onPositionChange(project.id, position.x, position.y);
  };

  return (
    <motion.div
      className={`${styles.projectNode} ${project.status === 'coming-soon' ? styles.comingSoon : ''}`}
      style={{
        left: position.x,
        top: position.y,
        x: springX,
        y: springY,
        zIndex: isDragging ? 100 : isHovered ? 50 : 10,
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: index * 0.1 + 0.3, type: 'spring', stiffness: 200 }}
      drag
      dragMomentum={false}
      dragElastic={0}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={handleProjectClick}
    >
      {/* Glow */}
      <motion.div
        className={styles.nodeGlow}
        style={{
          background: `radial-gradient(circle, ${project.theme.primaryColor}50 0%, transparent 70%)`,
        }}
        animate={{
          scale: isHovered ? 1.5 : [1, 1.2, 1],
          opacity: isHovered ? 0.8 : [0.5, 0.3, 0.5],
        }}
        transition={{
          duration: isHovered ? 0.3 : 3,
          repeat: isHovered ? 0 : Infinity,
        }}
      />

      {/* Core */}
      <motion.div
        className={styles.nodeCore}
        style={{
          background: `linear-gradient(135deg, ${project.theme.primaryColor}30 0%, ${project.theme.primaryColor}10 100%)`,
          borderColor: `${project.theme.primaryColor}60`,
          boxShadow: `0 0 20px ${project.theme.primaryColor}30, inset 0 0 20px ${project.theme.primaryColor}20`,
        }}
        whileHover={{ scale: 1.1 }}
      >
        <span className={styles.nodeIcon}>{icon}</span>
      </motion.div>

      {/* Label */}
      <div className={styles.nodeLabel}>{project.name}</div>

      {/* Status badge */}
      {project.status === 'coming-soon' && (
        <div className={styles.statusBadge}>Soon</div>
      )}
    </motion.div>
  );
}

export default function NeuralMap() {
  const { setInterface } = useStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [hoveredHome, setHoveredHome] = useState(false);

  // Store current positions for connection lines
  const [linePositions, setLinePositions] = useState<Record<string, Position>>({});

  // Calculate original positions in a circle
  const calculatePositions = useCallback((width: number, height: number) => {
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.32;

    const positions: Record<string, Position> = {};
    projects.forEach((project, index) => {
      const angle = (index * 2 * Math.PI) / projects.length - Math.PI / 2;
      positions[project.id] = {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
      };
    });
    return positions;
  }, []);

  // Original positions (don't change during drag)
  const [originalPositions, setOriginalPositions] = useState<Record<string, Position>>({});

  // Update positions on resize
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setContainerSize({ width, height });
        const positions = calculatePositions(width, height);
        setOriginalPositions(positions);
        setLinePositions(positions);
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [calculatePositions]);

  const centerX = containerSize.width / 2;
  const centerY = containerSize.height / 2;

  // Handle position change for lines
  const handlePositionChange = useCallback((id: string, x: number, y: number) => {
    setLinePositions((prev) => ({
      ...prev,
      [id]: { x, y },
    }));
  }, []);

  // Handle home node click
  const handleHomeClick = useCallback(() => {
    setInterface(-1);
  }, [setInterface]);

  return (
    <div ref={containerRef} className={styles.container}>
      {/* Animated background */}
      <div className={styles.backgroundParticles} />

      {/* Connection lines from center to nodes */}
      <svg className={styles.connections} width="100%" height="100%">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Lines from center to each node */}
        {projects.map((project) => {
          const pos = linePositions[project.id];
          if (!pos) return null;

          return (
            <g key={`line-${project.id}`}>
              {/* Glow line */}
              <line
                x1={centerX}
                y1={centerY}
                x2={pos.x}
                y2={pos.y}
                stroke={project.theme.primaryColor}
                strokeWidth="4"
                opacity="0.2"
                filter="url(#glow)"
              />
              {/* Main line */}
              <line
                x1={centerX}
                y1={centerY}
                x2={pos.x}
                y2={pos.y}
                stroke={project.theme.primaryColor}
                strokeWidth="2"
                opacity="0.5"
              />
              {/* Animated particles on line */}
              <line
                x1={centerX}
                y1={centerY}
                x2={pos.x}
                y2={pos.y}
                stroke="white"
                strokeWidth="2"
                strokeDasharray="4 12"
                opacity="0.3"
                className={styles.animatedLine}
              />
            </g>
          );
        })}
      </svg>

      {/* Center Home Node */}
      <motion.div
        className={styles.homeNode}
        style={{
          left: centerX,
          top: centerY,
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
        onClick={handleHomeClick}
        onHoverStart={() => setHoveredHome(true)}
        onHoverEnd={() => setHoveredHome(false)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          className={styles.homeGlow}
          animate={{
            scale: hoveredHome ? 1.5 : [1, 1.3, 1],
            opacity: hoveredHome ? 0.7 : [0.4, 0.2, 0.4],
          }}
          transition={{
            duration: hoveredHome ? 0.3 : 3,
            repeat: hoveredHome ? 0 : Infinity,
          }}
        />
        <div className={styles.homeCore}>
          <span className={styles.homeIcon}>🏠</span>
        </div>
        <div className={styles.homeLabel}>Home</div>
      </motion.div>

      {/* Project Nodes */}
      {projects.map((project, index) => {
        const pos = originalPositions[project.id];
        if (!pos) return null;

        return (
          <ProjectNode
            key={project.id}
            project={project}
            position={pos}
            index={index}
            onPositionChange={handlePositionChange}
          />
        );
      })}

      {/* Instructions */}
      <motion.div
        className={styles.instructions}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        Click home to return • Drag nodes to explore • Click to visit
      </motion.div>
    </div>
  );
}
