// src/components/interfaces/NeuralMap/index.tsx

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { projects } from '../../../config/projects';
import Node from './Node';
import Connections from './Connections';
import styles from './styles.module.css';

export default function NeuralMap() {
  const [isMobile, setIsMobile] = useState(false);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      // Scale down positions on mobile
      setScale(mobile ? 0.6 : window.innerWidth < 1024 ? 0.8 : 1);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Scale positions based on screen size
  const getScaledPosition = (pos: { x: number; y: number }) => ({
    x: pos.x * scale,
    y: pos.y * scale,
  });

  return (
    <div className={styles.container}>
      {/* Animated background */}
      <div className={styles.backgroundParticles} />

      {/* Title */}
      <motion.div
        className={styles.title}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        Neural Map
      </motion.div>

      {/* Main canvas */}
      <div className={styles.canvas}>
        {/* Connection lines (rendered first, behind nodes) */}
        <Connections />

        {/* Project nodes */}
        {projects.map((project, index) => (
          <Node
            key={project.id}
            project={project}
            position={getScaledPosition(project.mappings.neuralMap.position)}
            index={index}
          />
        ))}
      </div>

      {/* Instructions */}
      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/40 text-sm text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.5 }}
      >
        {isMobile ? 'Tap a node to explore' : 'Hover over nodes to preview • Click to visit'}
      </motion.div>
    </div>
  );
}
