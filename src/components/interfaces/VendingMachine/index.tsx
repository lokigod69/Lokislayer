// src/components/interfaces/VendingMachine/index.tsx

import { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, PerspectiveCamera } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { projects, Project } from '../../../config/projects';
import Machine from './Machine';
import Keypad from './Keypad';
import styles from './styles.module.css';

// Product type to emoji mapping
const productEmojis: Record<string, string> = {
  cassette: '📼',
  'pill-bottle': '💊',
  spellbook: '📖',
  coin: '🪙',
  viewmaster: '🔭',
  vhs: '📹',
};

export default function VendingMachine() {
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isDispensing, setIsDispensing] = useState(false);

  const handleSlotSelect = (slot: string, project: Project) => {
    setSelectedSlot(slot);
    setSelectedProject(project);
  };

  const handleKeypadSelect = (code: string) => {
    const project = projects.find((p) => p.mappings.vendingMachine.slot === code);
    if (project) {
      handleSlotSelect(code, project);
    }
  };

  const handleDispense = () => {
    if (!selectedProject) return;

    setIsDispensing(true);

    // Simulate dispensing animation
    setTimeout(() => {
      setIsDispensing(false);
      if (selectedProject.status === 'live') {
        window.open(selectedProject.url, '_blank', 'noopener,noreferrer');
      }
      setSelectedSlot(null);
      setSelectedProject(null);
    }, 1500);
  };

  return (
    <div className={styles.container}>
      {/* Scanlines */}
      <div className={styles.scanlines} />

      {/* Vignette */}
      <div className={styles.vignette} />

      {/* 3D Canvas */}
      <div className={styles.canvasContainer}>
        <Canvas shadows>
          <PerspectiveCamera makeDefault position={[0, 0, 4]} fov={50} />
          <OrbitControls
            enablePan={false}
            enableZoom={false}
            minPolarAngle={Math.PI / 3}
            maxPolarAngle={Math.PI / 2}
            minAzimuthAngle={-Math.PI / 6}
            maxAzimuthAngle={Math.PI / 6}
          />

          {/* Lighting */}
          <ambientLight intensity={0.2} />
          <spotLight
            position={[0, 5, 5]}
            angle={0.3}
            penumbra={1}
            intensity={1}
            castShadow
          />
          <pointLight position={[-3, 2, 2]} color="#00ffff" intensity={0.5} />
          <pointLight position={[3, 2, 2]} color="#ff00ff" intensity={0.5} />

          <Suspense fallback={null}>
            <Machine
              selectedSlot={selectedSlot}
              onSlotClick={handleSlotSelect}
            />
            <Environment preset="night" />
          </Suspense>
        </Canvas>
      </div>

      {/* HUD */}
      <div className={styles.hud}>
        {/* Title */}
        <motion.div
          className={styles.title}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Vending Machine
        </motion.div>

        {/* Credits */}
        <motion.div
          className={styles.credits}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          INSERT COIN ▶ FREE PLAY
        </motion.div>

        {/* Keypad */}
        <Keypad onSelect={handleKeypadSelect} />

        {/* Product Info */}
        <AnimatePresence>
          {selectedProject && (
            <motion.div
              className={styles.productInfo}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
            >
              <div className={styles.productSlot}>
                {productEmojis[selectedProject.mappings.vendingMachine.productType]}{' '}
                SLOT {selectedProject.mappings.vendingMachine.slot}
              </div>
              <div className={styles.productName}>{selectedProject.name}</div>
              <div className={styles.productDescription}>
                {selectedProject.description}
              </div>
              <button
                className={styles.dispenseButton}
                onClick={handleDispense}
                disabled={isDispensing || selectedProject.status !== 'live'}
              >
                {isDispensing
                  ? 'DISPENSING...'
                  : selectedProject.status === 'live'
                  ? 'DISPENSE'
                  : 'COMING SOON'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dispensing overlay */}
        <AnimatePresence>
          {isDispensing && (
            <motion.div
              className={styles.dispensingOverlay}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className={styles.dispensingText}>★ VENDING ★</div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Instructions */}
        <motion.div
          className={styles.instructions}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          Click products or use keypad • Drag to rotate view
        </motion.div>
      </div>
    </div>
  );
}
