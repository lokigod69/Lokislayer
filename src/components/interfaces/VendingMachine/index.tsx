// src/components/interfaces/VendingMachine/index.tsx
// Redesigned Vending Machine with proper interaction flow

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { projects, Project } from '../../../config/projects';
import styles from './styles.module.css';

// Product icons for each project - simpler, no heavy glow
const projectIcons: Record<string, string> = {
  lokitunes: '🎵',
  matrixarena: '💊',
  vocapp: '📚',
  bountyhunter: '🎯',
  crym: '🏠', // 3D room/space
  crymera: '🖼️', // Picture/gallery
};

// Display names (without URL extensions)
const displayNames: Record<string, string> = {
  lokitunes: 'LokiTunes',
  matrixarena: 'Matrix Arena',
  vocapp: 'VocApp',
  bountyhunter: 'BountyHunter',
  crym: 'Crym', // Changed from Crym.space
  crymera: 'Crymera',
};

// Slot codes in order
const slotCodes = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

// Interaction states
type MachineState = 'idle' | 'selected' | 'coinInserted' | 'dispensing';

export default function VendingMachine() {
  const [machineState, setMachineState] = useState<MachineState>('idle');
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [dispensedProject, setDispensedProject] = useState<Project | null>(null);

  const getProjectForSlot = useCallback((slot: string): Project | undefined => {
    return projects.find((p) => p.mappings.vendingMachine.slot === slot);
  }, []);

  // Step 1: Select an item
  const handleSlotClick = useCallback((slot: string) => {
    const project = getProjectForSlot(slot);
    if (project && machineState !== 'dispensing') {
      setSelectedSlot(slot);
      setSelectedProject(project);
      setMachineState('selected');
    }
  }, [getProjectForSlot, machineState]);

  // Step 2: Insert coin
  const handleInsertCoin = useCallback(() => {
    if (machineState !== 'selected' || !selectedProject) return;

    // Coin insertion animation/sound could go here
    setMachineState('coinInserted');
  }, [machineState, selectedProject]);

  // Step 3: Vend the product
  const handleVend = useCallback(() => {
    if (machineState !== 'coinInserted' || !selectedProject) return;
    if (selectedProject.status === 'coming-soon') return;

    setMachineState('dispensing');

    // Dispense animation
    setTimeout(() => {
      setDispensedProject(selectedProject);

      // Navigate after showing dispensed item
      setTimeout(() => {
        if (selectedProject.status === 'live') {
          window.open(selectedProject.url, '_blank', 'noopener,noreferrer');
        }
        // Reset machine
        setSelectedSlot(null);
        setSelectedProject(null);
        setDispensedProject(null);
        setMachineState('idle');
      }, 2000);
    }, 1500);
  }, [selectedProject, machineState]);

  // Clear selection
  const handleClear = useCallback(() => {
    setSelectedSlot(null);
    setSelectedProject(null);
    setMachineState('idle');
  }, []);

  const getDisplayName = (project: Project) => {
    return displayNames[project.id] || project.name;
  };

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
        {/* Integrated title - neon style inside machine */}
        <div className={styles.machineHeader}>
          <div className={styles.titleContainer}>
            <span className={styles.titleText}>VEND-O-MATIC</span>
            <div className={styles.titleUnderline} />
          </div>
        </div>

        {/* Digital display */}
        <div className={styles.display}>
          <div className={styles.displayScreen}>
            {machineState === 'dispensing' ? (
              <motion.span
                className={styles.displayDispensing}
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ repeat: Infinity, duration: 0.3 }}
              >
                DISPENSING...
              </motion.span>
            ) : selectedProject ? (
              <>
                <span className={styles.displaySlot}>{selectedSlot}</span>
                <span className={styles.displayName}>{getDisplayName(selectedProject)}</span>
                {machineState === 'coinInserted' && (
                  <span className={styles.displayReady}>READY</span>
                )}
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
            const isReady = isSelected && machineState === 'coinInserted';
            const icon = projectIcons[project.id] || '📦';

            return (
              <motion.button
                key={slot}
                className={`${styles.productSlot} ${isSelected ? styles.selected : ''} ${
                  isReady ? styles.ready : ''
                } ${project.status === 'coming-soon' ? styles.comingSoon : ''}`}
                onClick={() => handleSlotClick(slot)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Slot label */}
                <div className={styles.slotLabel}>{slot}</div>

                {/* Product icon - no heavy glow */}
                <div className={styles.productIcon}>{icon}</div>

                {/* Product name */}
                <div className={styles.productName}>{getDisplayName(project)}</div>

                {/* Status badge */}
                {project.status === 'coming-soon' && (
                  <div className={styles.comingSoonBadge}>SOON</div>
                )}

                {/* Selection glow - subtle pulse when selected */}
                {isSelected && !isReady && <div className={styles.selectionGlow} />}

                {/* Ready glow - green when coin inserted */}
                {isReady && <div className={styles.readyGlow} />}
              </motion.button>
            );
          })}
        </div>

        {/* Control panel */}
        <div className={styles.controlPanel}>
          {/* Coin slot - interactive button */}
          <motion.button
            className={`${styles.coinSlot} ${
              machineState === 'selected' ? styles.coinSlotActive : ''
            }`}
            onClick={handleInsertCoin}
            disabled={machineState !== 'selected'}
            whileHover={machineState === 'selected' ? { scale: 1.05 } : {}}
            whileTap={machineState === 'selected' ? { scale: 0.95 } : {}}
          >
            <div className={styles.coinSlotOpening} />
            <span className={styles.coinSlotText}>INSERT COIN</span>
            {machineState === 'selected' && (
              <motion.div
                className={styles.coinGlow}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
              />
            )}
          </motion.button>

          {/* Action buttons */}
          <div className={styles.actionButtons}>
            <motion.button
              className={`${styles.vendButton} ${
                machineState !== 'coinInserted' ? styles.vendDisabled : ''
              }`}
              onClick={handleVend}
              disabled={machineState !== 'coinInserted' || selectedProject?.status === 'coming-soon'}
              whileHover={machineState === 'coinInserted' ? { scale: 1.05 } : {}}
              whileTap={machineState === 'coinInserted' ? { scale: 0.95 } : {}}
            >
              {machineState === 'dispensing' ? 'VENDING...' : 'VEND'}
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
                    {getDisplayName(dispensedProject)}
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
        {machineState === 'dispensing' && (
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
        Select item → Insert coin → Press VEND
      </motion.div>
    </div>
  );
}
