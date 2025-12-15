// src/components/interfaces/NeuralMap/index.tsx
// Neural Map - Beautiful node-based visualization using React Flow

import { useCallback, useMemo, useState } from 'react';
import {
  ReactFlow,
  Node,
  Edge,
  Background,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
  ConnectionLineType,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { motion, AnimatePresence } from 'framer-motion';
import { projects, Project } from '../../../config/projects';
import { useStore } from '../../../store/useStore';
import styles from './styles.module.css';

// Custom Hub Node Component
function HubNode({ data }: { data: { label: string; onClick: () => void } }) {
  return (
    <motion.div
      className={styles.hubNode}
      onClick={data.onClick}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
    >
      <div className={styles.hubGlow} />
      <div className={styles.hubRing} />
      <div className={styles.hubCore}>
        <span className={styles.hubIcon}>◈</span>
      </div>
      <div className={styles.hubLabel}>{data.label}</div>
    </motion.div>
  );
}

// Custom Project Node Component
function ProjectNode({ data }: { data: {
  project: Project;
  icon: string;
  onClick: () => void;
  index: number;
} }) {
  const { project, icon, onClick, index } = data;

  return (
    <motion.div
      className={`${styles.projectNode} ${project.status === 'coming-soon' ? styles.comingSoon : ''}`}
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 200, delay: 0.3 + index * 0.08 }}
      style={{
        '--node-color': project.theme.primaryColor,
      } as React.CSSProperties}
    >
      <div className={styles.nodeGlow} />
      <div className={styles.nodeRing} />
      <div className={styles.nodeCore}>
        <span className={styles.nodeIcon}>{icon}</span>
      </div>
      <div className={styles.nodeLabel}>{project.name}</div>
      {project.status === 'coming-soon' && (
        <div className={styles.statusBadge}>Soon</div>
      )}
    </motion.div>
  );
}

// Node types configuration
const nodeTypes = {
  hub: HubNode,
  project: ProjectNode,
};

// Project icons mapping
const projectIcons: Record<string, string> = {
  lokitunes: '♫',
  matrixarena: '◉',
  vocapp: '✎',
  bountyhunter: '⌖',
  crym: '◐',
  crymera: '✧',
};

export default function NeuralMap() {
  const { setInterface } = useStore();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Handle hub click - go back to portal
  const handleHubClick = useCallback(() => {
    setInterface(-1);
  }, [setInterface]);

  // Handle project click - show modal
  const handleProjectClick = useCallback((project: Project) => {
    setSelectedProject(project);
  }, []);

  // Handle visit
  const handleVisit = useCallback(() => {
    if (selectedProject?.status === 'live') {
      window.open(selectedProject.url, '_blank', 'noopener,noreferrer');
    }
    setSelectedProject(null);
  }, [selectedProject]);

  // Close modal
  const handleCloseModal = useCallback(() => {
    setSelectedProject(null);
  }, []);

  // Create initial nodes
  const initialNodes: Node[] = useMemo(() => {
    // Hub node at center
    const nodes: Node[] = [
      {
        id: 'hub',
        type: 'hub',
        position: { x: 400, y: 300 },
        data: { label: 'NEXUS', onClick: handleHubClick },
        draggable: true,
      },
    ];

    // Project nodes in organic positions
    const positions = [
      { x: 150, y: 120 },   // Top left
      { x: 650, y: 100 },   // Top right
      { x: 80, y: 350 },    // Middle left
      { x: 720, y: 320 },   // Middle right
      { x: 200, y: 520 },   // Bottom left
      { x: 600, y: 500 },   // Bottom right
    ];

    projects.forEach((project, index) => {
      nodes.push({
        id: project.id,
        type: 'project',
        position: positions[index] || { x: 400 + Math.random() * 200, y: 300 + Math.random() * 200 },
        data: {
          project,
          icon: projectIcons[project.id] || '◆',
          onClick: () => handleProjectClick(project),
          index,
        },
        draggable: true,
      });
    });

    return nodes;
  }, [handleHubClick, handleProjectClick]);

  // Create edges from hub to all projects
  const initialEdges: Edge[] = useMemo(() => {
    return projects.map((project, index) => ({
      id: `hub-${project.id}`,
      source: 'hub',
      target: project.id,
      type: 'default',
      animated: true,
      style: {
        stroke: project.theme.primaryColor,
        strokeWidth: 2,
        opacity: 0.6,
      },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: project.theme.primaryColor,
        width: 15,
        height: 15,
      },
    }));
  }, []);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  return (
    <div className={styles.container}>
      {/* Animated background elements */}
      <div className={styles.backgroundOrbs}>
        <div className={styles.orb1} />
        <div className={styles.orb2} />
        <div className={styles.orb3} />
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        connectionLineType={ConnectionLineType.SmoothStep}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        minZoom={0.5}
        maxZoom={1.5}
        defaultEdgeOptions={{
          type: 'smoothstep',
          animated: true,
        }}
        proOptions={{ hideAttribution: true }}
        className={styles.flow}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={30}
          size={1}
          color="rgba(139, 92, 246, 0.15)"
        />
      </ReactFlow>

      {/* Title */}
      <motion.div
        className={styles.title}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        NEURAL MAP
      </motion.div>

      {/* Instructions */}
      <motion.div
        className={styles.instructions}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        Drag nodes to rearrange • Click to explore • Scroll to zoom
      </motion.div>

      {/* Project Modal */}
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
              initial={{ scale: 0.85, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 20 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                '--modal-color': selectedProject.theme.primaryColor,
              } as React.CSSProperties}
            >
              <div className={styles.modalGlow} />
              <div className={styles.modalIcon}>
                {projectIcons[selectedProject.id] || '◆'}
              </div>
              <h2 className={styles.modalTitle}>{selectedProject.name}</h2>
              <p className={styles.modalDescription}>{selectedProject.description}</p>

              {selectedProject.status === 'coming-soon' ? (
                <div className={styles.comingSoonBadge}>
                  <span>◐</span> Coming Soon
                </div>
              ) : (
                <div className={styles.modalActions}>
                  <button className={styles.cancelBtn} onClick={handleCloseModal}>
                    Cancel
                  </button>
                  <button className={styles.visitBtn} onClick={handleVisit}>
                    Enter Portal →
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
