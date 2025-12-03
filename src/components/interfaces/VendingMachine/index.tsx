// src/components/interfaces/VendingMachine/index.tsx
// Redesigned as 2D CSS vending machine

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { projects, Project } from '../../../config/projects';
import styles from './styles.module.css';

// Product icons for each project
const projectIcons: Record<string, string> = {
  lokitunes: '🎵',
  matrixarena: '💊',
  vocapp: '📚',
  bountyhunter: '🎯',
  crym: '🖼️',
  podcast: '🎧',
};

// Slot codes in order
const slotCodes = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

export default function VendingMachine() {
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isDispensing, setIsDispensing] = useState(false);
  const [dispensedProject, setDispensedProject] = useState<Project | null>(null);

  const getProjectForSlot = useCallback((slot: string): Project | undefined => {
    return projects.find((p) => p.mappings.vendingMachine.slot === slot);
  }, []);

  const handleSlotClick = useCallback((slot: string) => {
    const project = getProjectForSlot(slot);
    if (project) {
      setSelectedSlot(slot);
      setSelectedProject(project);
    }
  }, [getProjectForSlot]);

  const handleInsertCoin = useCallback(() => {
    if (!selectedProject || isDispensing) return;

    setIsDispensing(true);

    // Dispense animation
    setTimeout(() => {
      setDispensedProject(selectedProject);
      setIsDispensing(false);

      // Navigate after showing dispensed item
      setTimeout(() => {
        if (selectedProject.status === 'live') {
          window.open(selectedProject.url, '_blank', 'noopener,noreferrer');
        }
        setSelectedSlot(null);
        setSelectedProject(null);
        setDispensedProject(null);
      }, 2000);
    }, 1500);
  }, [selectedProject, isDispensing]);

  const handleClear = useCallback(() => {
    setSelectedSlot(null);
    setSelectedProject(null);
  }, []);

  return (
    <div className={styles.container}>
      {/* Scanlines overlay */}
      <div className={styles.scanlines} />

      {/* Main vending machine */}
      <motion.div
        className={styles.machine}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Top sign */}
        <div className={styles.topSign}>
          <span className={styles.signText}>VEND-O-MATIC</span>
          <span className={styles.signSubtext}>SELECT YOUR DESTINATION</span>
        </div>

        {/* Digital display */}
        <div className={styles.display}>
          <div className={styles.displayScreen}>
            {isDispensing ? (
              <motion.span
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ repeat: Infinity, duration: 0.3 }}
              >
                DISPENSING...
              </motion.span>
            ) : selectedProject ? (
              <>
                <span className={styles.displaySlot}>{selectedSlot}</span>
                <span className={styles.displayName}>{selectedProject.name}</span>
              </>
            ) : (
              <span className={styles.displayIdle}>SELECT ITEM</span>
            )}
          </div>
        </div>

        {/* Product grid */}
        <div className={styles.productGrid}>
          {slotCodes.map((slot) => {
            const project = getProjectForSlot(slot);
            if (!project) return null;

            const isSelected = selectedSlot === slot;
            const icon = projectIcons[project.id] || '📦';

            return (
              <motion.button
                key={slot}
                className={`${styles.productSlot} ${isSelected ? styles.selected : ''} ${
                  project.status === 'coming-soon' ? styles.comingSoon : ''
                }`}
                onClick={() => handleSlotClick(slot)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Slot label */}
                <div className={styles.slotLabel}>{slot}</div>

                {/* Product icon */}
                <div className={styles.productIcon}>{icon}</div>

                {/* Product name */}
                <div className={styles.productName}>{project.name}</div>

                {/* Status badge */}
                {project.status === 'coming-soon' && (
                  <div className={styles.comingSoonBadge}>SOON</div>
                )}

                {/* Selection glow */}
                {isSelected && <div className={styles.selectionGlow} />}
              </motion.button>
            );
          })}
        </div>

        {/* Control panel */}
        <div className={styles.controlPanel}>
          {/* Coin slot */}
          <div className={styles.coinSlot}>
            <div className={styles.coinSlotInner}>
              <span>INSERT COIN</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className={styles.actionButtons}>
            <motion.button
              className={`${styles.vendButton} ${!selectedProject || isDispensing ? styles.disabled : ''}`}
              onClick={handleInsertCoin}
              disabled={!selectedProject || isDispensing || selectedProject?.status === 'coming-soon'}
              whileHover={selectedProject && !isDispensing ? { scale: 1.05 } : {}}
              whileTap={selectedProject && !isDispensing ? { scale: 0.95 } : {}}
            >
              {isDispensing ? 'VENDING...' : 'VEND'}
            </motion.button>

            <motion.button
              className={styles.clearButton}
              onClick={handleClear}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              CLR
            </motion.button>
          </div>
        </div>

        {/* Dispense tray */}
        <div className={styles.dispenseTray}>
          <div className={styles.trayOpening}>
            <AnimatePresence>
              {dispensedProject && (
                <motion.div
                  className={styles.dispensedItem}
                  initial={{ y: -100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 50, opacity: 0 }}
                  transition={{ type: 'spring', damping: 15 }}
                >
                  <span className={styles.dispensedIcon}>
                    {projectIcons[dispensedProject.id] || '📦'}
                  </span>
                  <span className={styles.dispensedText}>
                    {dispensedProject.name}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className={styles.trayLabel}>▼ COLLECT HERE ▼</div>
        </div>

        {/* Machine frame decorations */}
        <div className={styles.frameLeft} />
        <div className={styles.frameRight} />
      </motion.div>

      {/* Dispensing overlay */}
      <AnimatePresence>
        {isDispensing && (
          <motion.div
            className={styles.dispensingOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className={styles.dispensingText}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 0.5 }}
            >
              ★ VENDING ★
            </motion.div>
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
        Click a product to select • Press VEND to dispense
      </motion.div>
    </div>
  );
}
