// src/components/interfaces/NeuralMap/index.tsx
// Neural Map with center home node, draggable project nodes, and connection lines
// Nodes stay where dragged, click opens confirmation modal

import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { projects, Project } from '../../../config/projects';
import { useStore } from '../../../store/useStore';
import styles from './styles.module.css';

// Project icons
const projectIcons: Record<string, string> = {
  lokitunes: '🎵',
  matrixarena: '💊',
  vocapp: '📚',
  bountyhunter: '🎯',
  crym: '🖼️',
  crymera: '🎨',
};

interface Position {
  x: number;
  y: number;
}

export default function NeuralMap() {
  const { setInterface } = useStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 800, height: 600 });
  const [hoveredHome, setHoveredHome] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Node positions - persist where they're dragged
  const [nodePositions, setNodePositions] = useState<Record<string, Position>>({});

  // Calculate center
  const centerX = containerSize.width / 2;
  const centerY = containerSize.height / 2;

  // Calculate initial positions in a circle
  const calculateInitialPositions = useCallback((width: number, height: number) => {
    const cx = width / 2;
    const cy = height / 2;
    const radius = Math.min(width, height) * 0.32;

    const positions: Record<string, Position> = {};
    projects.forEach((project, index) => {
      const angle = (index * 2 * Math.PI) / projects.length - Math.PI / 2;
      positions[project.id] = {
        x: cx + radius * Math.cos(angle),
        y: cy + radius * Math.sin(angle),
      };
    });
    return positions;
  }, []);

  // Initialize positions on mount and resize
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const width = rect.width || 800;
        const height = rect.height || 600;
        setContainerSize({ width, height });
        // Only set initial positions if not already set
        setNodePositions((prev) => {
          if (Object.keys(prev).length === 0) {
            return calculateInitialPositions(width, height);
          }
          return prev;
        });
        setIsReady(true);
      }
    };

    updateSize();
    const timer = setTimeout(updateSize, 100);

    window.addEventListener('resize', updateSize);
    return () => {
      window.removeEventListener('resize', updateSize);
      clearTimeout(timer);
    };
  }, [calculateInitialPositions]);

  // Handle home node click
  const handleHomeClick = useCallback(() => {
    setInterface(-1);
  }, [setInterface]);

  // Update node position (called during drag)
  const handleNodeMove = useCallback((projectId: string, newPos: Position) => {
    setNodePositions((prev) => ({
      ...prev,
      [projectId]: newPos,
    }));
  }, []);

  // Handle node click - show confirmation modal
  const handleNodeClick = useCallback((project: Project) => {
    setSelectedProject(project);
  }, []);

  // Handle modal confirm - navigate
  const handleConfirmVisit = useCallback(() => {
    if (selectedProject && selectedProject.status === 'live') {
      window.open(selectedProject.url, '_blank', 'noopener,noreferrer');
    }
    setSelectedProject(null);
  }, [selectedProject]);

  // Handle modal close
  const handleCloseModal = useCallback(() => {
    setSelectedProject(null);
  }, []);

  // Close modal on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedProject) {
        setSelectedProject(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedProject]);

  if (!isReady) {
    return <div ref={containerRef} className={styles.container} />;
  }

  return (
    <div ref={containerRef} className={styles.container} onClick={handleCloseModal}>
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
          const pos = nodePositions[project.id];
          if (!pos) return null;

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
        onClick={(e) => {
          e.stopPropagation();
          handleHomeClick();
        }}
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
        <div className={styles.homeLabel}>HOME</div>
      </motion.div>

      {/* Project Nodes */}
      {projects.map((project, index) => {
        const pos = nodePositions[project.id];
        if (!pos) return null;

        const icon = projectIcons[project.id] || '⚡';

        return (
          <DraggableNode
            key={project.id}
            project={project}
            position={pos}
            icon={icon}
            index={index}
            onMove={(newPos) => handleNodeMove(project.id, newPos)}
            onClick={() => handleNodeClick(project)}
          />
        );
      })}

      {/* Confirmation Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            className={styles.modalOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseModal}
          >
            <motion.div
              className={styles.modal}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.modalIcon}>
                {projectIcons[selectedProject.id] || '⚡'}
              </div>
              <h2 className={styles.modalTitle}>{selectedProject.name}</h2>
              <p className={styles.modalDescription}>{selectedProject.description}</p>
              {selectedProject.status === 'coming-soon' ? (
                <div className={styles.modalComingSoon}>Coming Soon</div>
              ) : (
                <div className={styles.modalButtons}>
                  <button
                    className={styles.modalButtonCancel}
                    onClick={handleCloseModal}
                  >
                    Cancel
                  </button>
                  <button
                    className={styles.modalButtonVisit}
                    onClick={handleConfirmVisit}
                  >
                    Visit Site →
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Instructions */}
      <motion.div
        className={styles.instructions}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        Drag nodes to rearrange • Click to visit
      </motion.div>
    </div>
  );
}

// Separate draggable node component
function DraggableNode({
  project,
  position,
  icon,
  index,
  onMove,
  onClick,
}: {
  project: Project;
  position: Position;
  icon: string;
  index: number;
  onMove: (pos: Position) => void;
  onClick: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0, startPos: { x: 0, y: 0 } });
  const hasDraggedRef = useRef(false);

  // Handle mouse/touch drag
  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    hasDraggedRef.current = false;
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      startPos: { ...position },
    };

    const handlePointerMove = (moveEvent: PointerEvent) => {
      const dx = moveEvent.clientX - dragStartRef.current.x;
      const dy = moveEvent.clientY - dragStartRef.current.y;

      // Mark as dragged if moved more than 5px
      if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
        hasDraggedRef.current = true;
      }

      onMove({
        x: dragStartRef.current.startPos.x + dx,
        y: dragStartRef.current.startPos.y + dy,
      });
    };

    const handlePointerUp = () => {
      setIsDragging(false);
      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerup', handlePointerUp);

      // Only trigger click if we didn't drag
      if (!hasDraggedRef.current) {
        onClick();
      }
    };

    document.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('pointerup', handlePointerUp);
  };

  return (
    <motion.div
      className={`${styles.projectNode} ${project.status === 'coming-soon' ? styles.comingSoon : ''}`}
      style={{
        left: position.x,
        top: position.y,
        zIndex: isDragging ? 100 : isHovered ? 50 : 10,
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        scale: { delay: index * 0.1 + 0.3, type: 'spring', stiffness: 200 },
      }}
      onPointerDown={handlePointerDown}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
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
