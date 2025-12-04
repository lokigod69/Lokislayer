// src/components/interfaces/NeuralMap/index.tsx
// Redesigned with center home node and draggable project nodes

import { useState, useCallback, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
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

interface NodePosition {
  x: number;
  y: number;
  originalX: number;
  originalY: number;
}

export default function NeuralMap() {
  const { setInterface } = useStore();
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [nodePositions, setNodePositions] = useState<Record<string, NodePosition>>({});
  const [draggingNode, setDraggingNode] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  // Calculate positions in a circle around center
  const calculatePositions = useCallback((width: number, height: number) => {
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.32;

    const positions: Record<string, NodePosition> = {};

    projects.forEach((project, index) => {
      const angle = (index * 2 * Math.PI) / projects.length - Math.PI / 2;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      positions[project.id] = { x, y, originalX: x, originalY: y };
    });

    return positions;
  }, []);

  // Update positions on resize
  useEffect(() => {
    const updateSize = () => {
      const container = document.getElementById('neural-map-container');
      if (container) {
        const { width, height } = container.getBoundingClientRect();
        setContainerSize({ width, height });
        setNodePositions(calculatePositions(width, height));
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [calculatePositions]);

  const centerX = containerSize.width / 2;
  const centerY = containerSize.height / 2;

  // Handle node drag
  const handleDragStart = useCallback((projectId: string) => {
    setDraggingNode(projectId);
  }, []);

  const handleDrag = useCallback((projectId: string, x: number, y: number) => {
    setNodePositions((prev) => ({
      ...prev,
      [projectId]: { ...prev[projectId], x, y },
    }));
  }, []);

  const handleDragEnd = useCallback((projectId: string) => {
    setDraggingNode(null);
    // Snap back to original position
    setNodePositions((prev) => ({
      ...prev,
      [projectId]: {
        ...prev[projectId],
        x: prev[projectId].originalX,
        y: prev[projectId].originalY,
      },
    }));
  }, []);

  // Handle home node click
  const handleHomeClick = useCallback(() => {
    setInterface(-1);
  }, [setInterface]);

  // Handle project node click
  const handleProjectClick = useCallback((project: typeof projects[0]) => {
    if (project.status === 'coming-soon') return;
    window.open(project.url, '_blank', 'noopener,noreferrer');
  }, []);

  // Calculate line endpoints for connections
  const connections = useMemo(() => {
    return projects.map((project) => {
      const pos = nodePositions[project.id];
      if (!pos) return null;
      return {
        project,
        x: pos.x,
        y: pos.y,
      };
    }).filter(Boolean);
  }, [nodePositions]);

  return (
    <div id="neural-map-container" className={styles.container}>
      {/* Animated background */}
      <div className={styles.backgroundParticles} />

      {/* Connection lines from center to nodes */}
      <svg className={styles.connections}>
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <radialGradient id="homeGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#a78bfa" />
            <stop offset="100%" stopColor="#6366f1" />
          </radialGradient>
        </defs>

        {/* Lines from center to each node */}
        {connections.map((conn) => {
          if (!conn) return null;
          const isDragging = draggingNode === conn.project.id;

          return (
            <g key={`line-${conn.project.id}`}>
              {/* Glow line */}
              <motion.line
                x1={centerX}
                y1={centerY}
                x2={conn.x}
                y2={conn.y}
                stroke={conn.project.theme.primaryColor}
                strokeWidth="4"
                opacity={isDragging ? 0.5 : 0.2}
                filter="url(#glow)"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: 0.3 }}
              />
              {/* Main line */}
              <motion.line
                x1={centerX}
                y1={centerY}
                x2={conn.x}
                y2={conn.y}
                stroke={conn.project.theme.primaryColor}
                strokeWidth="2"
                opacity={isDragging ? 0.8 : 0.4}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: 0.3 }}
              />
              {/* Animated particles on line */}
              <motion.line
                x1={centerX}
                y1={centerY}
                x2={conn.x}
                y2={conn.y}
                stroke="white"
                strokeWidth="2"
                strokeDasharray="4 12"
                opacity={0.3}
                initial={{ strokeDashoffset: 0 }}
                animate={{ strokeDashoffset: -16 }}
                transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
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
        onHoverStart={() => setHoveredNode('home')}
        onHoverEnd={() => setHoveredNode(null)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          className={styles.homeGlow}
          animate={{
            scale: hoveredNode === 'home' ? 1.5 : [1, 1.3, 1],
            opacity: hoveredNode === 'home' ? 0.7 : [0.4, 0.2, 0.4],
          }}
          transition={{
            duration: hoveredNode === 'home' ? 0.3 : 3,
            repeat: hoveredNode === 'home' ? 0 : Infinity,
          }}
        />
        <div className={styles.homeCore}>
          <span className={styles.homeIcon}>🏠</span>
        </div>
        <div className={styles.homeLabel}>Home</div>
      </motion.div>

      {/* Project Nodes */}
      {projects.map((project, index) => {
        const pos = nodePositions[project.id];
        if (!pos) return null;

        const isHovered = hoveredNode === project.id;
        const isDragging = draggingNode === project.id;
        const icon = projectIcons[project.id] || '⚡';

        return (
          <motion.div
            key={project.id}
            className={`${styles.projectNode} ${project.status === 'coming-soon' ? styles.comingSoon : ''}`}
            style={{
              left: pos.x,
              top: pos.y,
              zIndex: isDragging ? 100 : isHovered ? 50 : 10,
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: 1,
              opacity: 1,
              x: isDragging ? 0 : pos.x - pos.originalX,
              y: isDragging ? 0 : pos.y - pos.originalY,
            }}
            transition={{
              type: 'spring',
              stiffness: isDragging ? 0 : 200,
              damping: 20,
              delay: isDragging ? 0 : index * 0.1 + 0.3,
            }}
            drag
            dragMomentum={false}
            onDragStart={() => handleDragStart(project.id)}
            onDrag={(_, info) => {
              handleDrag(
                project.id,
                pos.originalX + info.offset.x,
                pos.originalY + info.offset.y
              );
            }}
            onDragEnd={() => handleDragEnd(project.id)}
            onHoverStart={() => setHoveredNode(project.id)}
            onHoverEnd={() => setHoveredNode(null)}
            onClick={() => handleProjectClick(project)}
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

            {/* Preview tooltip on hover */}
            {isHovered && !isDragging && (
              <motion.div
                className={styles.preview}
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.9 }}
              >
                <div
                  className={styles.previewTitle}
                  style={{ color: project.theme.primaryColor }}
                >
                  {project.name}
                </div>
                <div className={styles.previewDescription}>
                  {project.description}
                </div>
                {project.status === 'live' && (
                  <div className={styles.previewHint}>
                    Click to visit • Drag to explore
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>
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
