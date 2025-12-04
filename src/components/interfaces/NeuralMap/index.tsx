// src/components/interfaces/NeuralMap/index.tsx
// Neural Map with center home node, draggable project nodes, and connection lines
// Lines follow nodes during drag and snap back on release

import { useState, useCallback, useEffect, useRef } from 'react';
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

interface Position {
  x: number;
  y: number;
}

interface NodeState {
  basePosition: Position; // Original position in circle
  currentOffset: Position; // Current drag offset
  isSnapping: boolean; // Whether snapping back
}

export default function NeuralMap() {
  const { setInterface } = useStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 800, height: 600 });
  const [hoveredHome, setHoveredHome] = useState(false);
  const [isReady, setIsReady] = useState(false);

  // Node states with positions and drag offsets
  const [nodeStates, setNodeStates] = useState<Record<string, NodeState>>({});

  // Calculate center
  const centerX = containerSize.width / 2;
  const centerY = containerSize.height / 2;

  // Calculate positions in a circle
  const calculatePositions = useCallback((width: number, height: number) => {
    const cx = width / 2;
    const cy = height / 2;
    const radius = Math.min(width, height) * 0.32;

    const states: Record<string, NodeState> = {};
    projects.forEach((project, index) => {
      const angle = (index * 2 * Math.PI) / projects.length - Math.PI / 2;
      states[project.id] = {
        basePosition: {
          x: cx + radius * Math.cos(angle),
          y: cy + radius * Math.sin(angle),
        },
        currentOffset: { x: 0, y: 0 },
        isSnapping: false,
      };
    });
    return states;
  }, []);

  // Initialize positions on mount and resize
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const width = rect.width || 800;
        const height = rect.height || 600;
        setContainerSize({ width, height });
        setNodeStates(calculatePositions(width, height));
        setIsReady(true);
      }
    };

    // Initial update
    updateSize();

    // Small delay to ensure proper measurement
    const timer = setTimeout(updateSize, 100);

    window.addEventListener('resize', updateSize);
    return () => {
      window.removeEventListener('resize', updateSize);
      clearTimeout(timer);
    };
  }, [calculatePositions]);

  // Handle home node click
  const handleHomeClick = useCallback(() => {
    setInterface(-1);
  }, [setInterface]);

  // Handle node drag
  const handleDrag = useCallback((projectId: string, offsetX: number, offsetY: number) => {
    setNodeStates((prev) => ({
      ...prev,
      [projectId]: {
        ...prev[projectId],
        currentOffset: { x: offsetX, y: offsetY },
        isSnapping: false,
      },
    }));
  }, []);

  // Handle drag end - snap back
  const handleDragEnd = useCallback((projectId: string) => {
    setNodeStates((prev) => ({
      ...prev,
      [projectId]: {
        ...prev[projectId],
        currentOffset: { x: 0, y: 0 },
        isSnapping: true,
      },
    }));
    // Reset snapping flag after animation
    setTimeout(() => {
      setNodeStates((prev) => ({
        ...prev,
        [projectId]: {
          ...prev[projectId],
          isSnapping: false,
        },
      }));
    }, 300);
  }, []);

  // Handle node click
  const handleNodeClick = useCallback((project: typeof projects[0]) => {
    if (project.status === 'coming-soon') return;
    window.open(project.url, '_blank', 'noopener,noreferrer');
  }, []);

  // Get current position of a node (base + offset)
  const getNodePosition = (projectId: string) => {
    const state = nodeStates[projectId];
    if (!state) return { x: centerX, y: centerY };
    return {
      x: state.basePosition.x + state.currentOffset.x,
      y: state.basePosition.y + state.currentOffset.y,
    };
  };

  if (!isReady) {
    return <div ref={containerRef} className={styles.container} />;
  }

  return (
    <div ref={containerRef} className={styles.container}>
      {/* Animated background */}
      <div className={styles.backgroundParticles} />

      {/* Connection lines SVG - rendered first (underneath nodes) */}
      <svg
        className={styles.connections}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
      >
        <defs>
          <filter id="lineGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Lines from center to each node */}
        {projects.map((project) => {
          const pos = getNodePosition(project.id);
          const state = nodeStates[project.id];

          return (
            <g key={`line-${project.id}`}>
              {/* Glow effect line */}
              <line
                x1={centerX}
                y1={centerY}
                x2={pos.x}
                y2={pos.y}
                stroke={project.theme.primaryColor}
                strokeWidth="6"
                opacity="0.3"
                filter="url(#lineGlow)"
                style={{
                  transition: state?.isSnapping ? 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)' : 'none',
                }}
              />
              {/* Main solid line */}
              <line
                x1={centerX}
                y1={centerY}
                x2={pos.x}
                y2={pos.y}
                stroke={project.theme.primaryColor}
                strokeWidth="2"
                opacity="0.7"
                style={{
                  transition: state?.isSnapping ? 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)' : 'none',
                }}
              />
              {/* Animated flowing particles */}
              <line
                x1={centerX}
                y1={centerY}
                x2={pos.x}
                y2={pos.y}
                stroke="white"
                strokeWidth="2"
                strokeDasharray="4 16"
                opacity="0.4"
                className={styles.animatedLine}
                style={{
                  transition: state?.isSnapping ? 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)' : 'none',
                }}
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
        const state = nodeStates[project.id];
        if (!state) return null;

        const icon = projectIcons[project.id] || '⚡';

        return (
          <DraggableNode
            key={project.id}
            project={project}
            basePosition={state.basePosition}
            icon={icon}
            index={index}
            isSnapping={state.isSnapping}
            onDrag={(ox, oy) => handleDrag(project.id, ox, oy)}
            onDragEnd={() => handleDragEnd(project.id)}
            onClick={() => handleNodeClick(project)}
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

// Separate draggable node component
function DraggableNode({
  project,
  basePosition,
  icon,
  index,
  isSnapping,
  onDrag,
  onDragEnd,
  onClick,
}: {
  project: typeof projects[0];
  basePosition: Position;
  icon: string;
  index: number;
  isSnapping: boolean;
  onDrag: (offsetX: number, offsetY: number) => void;
  onDragEnd: () => void;
  onClick: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const dragStartRef = useRef({ x: 0, y: 0 });
  const nodeRef = useRef<HTMLDivElement>(null);

  // Handle mouse/touch drag
  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    setDragOffset({ x: 0, y: 0 });

    const handlePointerMove = (moveEvent: PointerEvent) => {
      const offsetX = moveEvent.clientX - dragStartRef.current.x;
      const offsetY = moveEvent.clientY - dragStartRef.current.y;
      setDragOffset({ x: offsetX, y: offsetY });
      onDrag(offsetX, offsetY);
    };

    const handlePointerUp = () => {
      setIsDragging(false);
      setDragOffset({ x: 0, y: 0 });
      onDragEnd();
      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerup', handlePointerUp);
    };

    document.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('pointerup', handlePointerUp);
  };

  const handleClick = () => {
    // Only trigger click if not dragging (no significant movement)
    if (Math.abs(dragOffset.x) < 5 && Math.abs(dragOffset.y) < 5) {
      onClick();
    }
  };

  return (
    <motion.div
      ref={nodeRef}
      className={`${styles.projectNode} ${project.status === 'coming-soon' ? styles.comingSoon : ''}`}
      style={{
        left: basePosition.x,
        top: basePosition.y,
        x: dragOffset.x,
        y: dragOffset.y,
        zIndex: isDragging ? 100 : isHovered ? 50 : 10,
        cursor: isDragging ? 'grabbing' : 'grab',
        transition: isSnapping ? 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)' : 'none',
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{
        scale: 1,
        opacity: 1,
        x: isSnapping ? 0 : dragOffset.x,
        y: isSnapping ? 0 : dragOffset.y,
      }}
      transition={{
        scale: { delay: index * 0.1 + 0.3, type: 'spring', stiffness: 200 },
        x: isSnapping ? { type: 'spring', stiffness: 300, damping: 20 } : { duration: 0 },
        y: isSnapping ? { type: 'spring', stiffness: 300, damping: 20 } : { duration: 0 },
      }}
      onPointerDown={handlePointerDown}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={handleClick}
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
