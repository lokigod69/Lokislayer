// src/components/interfaces/VendingMachine/index.tsx
// Redesigned Vending Machine with proper interaction flow

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { projects, Project } from '../../../config/projects';
import { useStore } from '../../../store/useStore';
import styles from './styles.module.css';

// Create a ding sound using Web Audio API
function playDingSound() {
  try {
    const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();

    // Create oscillator for the main ding tone
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Bell-like frequency
    oscillator.frequency.setValueAtTime(880, audioContext.currentTime); // A5 note
    oscillator.type = 'sine';

    // Quick attack, medium decay for "ding" effect
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.8);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.8);

    // Add a second harmonic for richer sound
    const oscillator2 = audioContext.createOscillator();
    const gainNode2 = audioContext.createGain();

    oscillator2.connect(gainNode2);
    gainNode2.connect(audioContext.destination);

    oscillator2.frequency.setValueAtTime(1760, audioContext.currentTime); // A6 (octave up)
    oscillator2.type = 'sine';

    gainNode2.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode2.gain.linearRampToValueAtTime(0.15, audioContext.currentTime + 0.01);
    gainNode2.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.5);

    oscillator2.start(audioContext.currentTime);
    oscillator2.stop(audioContext.currentTime + 0.5);
  } catch (e) {
    // Audio not supported, fail silently
    console.log('Audio not available');
  }
}

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
type MachineState = 'idle' | 'selected' | 'coinDropping' | 'loading' | 'ready' | 'dispensing';

export default function VendingMachine() {
  const { audioEnabled } = useStore();
  const [machineState, setMachineState] = useState<MachineState>('idle');
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [dispensedProject, setDispensedProject] = useState<Project | null>(null);
  const [loadProgress, setLoadProgress] = useState(0);

  const getProjectForSlot = useCallback((slot: string): Project | undefined => {
    return projects.find((p) => p.mappings.vendingMachine.slot === slot);
  }, []);

  // Step 1: Select an item
  const handleSlotClick = useCallback((slot: string) => {
    const project = getProjectForSlot(slot);
    if (project && machineState !== 'dispensing' && machineState !== 'coinDropping' && machineState !== 'loading') {
      setSelectedSlot(slot);
      setSelectedProject(project);
      setMachineState('selected');
      setLoadProgress(0);
    }
  }, [getProjectForSlot, machineState]);

  // Step 2: Insert coin - now with animation and sound
  const handleInsertCoin = useCallback(() => {
    if (machineState !== 'selected' || !selectedProject) return;

    // Play ding sound if audio is enabled
    if (audioEnabled) {
      playDingSound();
    }

    // Show coin dropping animation
    setMachineState('coinDropping');

    // After coin drops, start loading the product
    setTimeout(() => {
      setMachineState('loading');

      // Animate loading progress from 0 to 100
      let progress = 0;
      const loadInterval = setInterval(() => {
        progress += 5;
        setLoadProgress(progress);

        if (progress >= 100) {
          clearInterval(loadInterval);
          setMachineState('ready');
        }
      }, 100); // 100ms * 20 steps = 2 seconds to load
    }, 800); // Coin drop animation duration
  }, [machineState, selectedProject, audioEnabled]);

  // Step 3: Vend the product
  const handleVend = useCallback(() => {
    if (machineState !== 'ready' || !selectedProject) return;
    if (selectedProject.status === 'coming-soon') return;

    setMachineState('dispensing');
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
      setLoadProgress(0);
    }, 2000);
  }, [selectedProject, machineState]);

  // Clear selection
  const handleClear = useCallback(() => {
    if (machineState === 'dispensing') return;
    setSelectedSlot(null);
    setSelectedProject(null);
    setMachineState('idle');
    setLoadProgress(0);
  }, [machineState]);

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
            ) : machineState === 'coinDropping' ? (
              <motion.span
                className={styles.displayCoin}
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ repeat: Infinity, duration: 0.2 }}
              >
                🪙 DING! 🪙
              </motion.span>
            ) : machineState === 'loading' ? (
              <>
                <span className={styles.displaySlot}>{selectedSlot}</span>
                <span className={styles.displayLoading}>LOADING... {loadProgress}%</span>
              </>
            ) : machineState === 'ready' ? (
              <>
                <span className={styles.displaySlot}>{selectedSlot}</span>
                <motion.span
                  className={styles.displayReady}
                  animate={{ opacity: [1, 0.7, 1] }}
                  transition={{ repeat: Infinity, duration: 0.8 }}
                >
                  ✓ READY TO VEND
                </motion.span>
              </>
            ) : selectedProject ? (
              <>
                <span className={styles.displaySlot}>{selectedSlot}</span>
                <span className={styles.displayName}>{getDisplayName(selectedProject)}</span>
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
            const isReady = isSelected && machineState === 'ready';
            const isLoading = isSelected && (machineState === 'loading' || machineState === 'coinDropping');
            const icon = projectIcons[project.id] || '📦';

            return (
              <motion.button
                key={slot}
                className={`${styles.productSlot} ${isSelected ? styles.selected : ''} ${
                  isReady ? styles.ready : ''
                } ${isLoading ? styles.loading : ''} ${project.status === 'coming-soon' ? styles.comingSoon : ''}`}
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
                {isSelected && !isReady && !isLoading && <div className={styles.selectionGlow} />}

                {/* Loading glow - yellow when loading */}
                {isLoading && <div className={styles.loadingGlow} />}

                {/* Ready glow - green when ready */}
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
            } ${machineState === 'coinDropping' ? styles.coinSlotDropping : ''}`}
            onClick={handleInsertCoin}
            disabled={machineState !== 'selected'}
            whileHover={machineState === 'selected' ? { scale: 1.05 } : {}}
            whileTap={machineState === 'selected' ? { scale: 0.95 } : {}}
          >
            <div className={styles.coinSlotOpening} />
            <span className={styles.coinSlotText}>
              {machineState === 'coinDropping' ? '🪙 DING!' : 'INSERT COIN'}
            </span>
            {machineState === 'selected' && (
              <motion.div
                className={styles.coinGlow}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
              />
            )}
            {/* Coin dropping animation */}
            {machineState === 'coinDropping' && (
              <motion.div
                className={styles.droppingCoin}
                initial={{ y: -30, opacity: 1 }}
                animate={{ y: 30, opacity: 0 }}
                transition={{ duration: 0.6, ease: 'easeIn' }}
              >
                🪙
              </motion.div>
            )}
          </motion.button>

          {/* Action buttons */}
          <div className={styles.actionButtons}>
            <motion.button
              className={`${styles.vendButton} ${
                machineState !== 'ready' ? styles.vendDisabled : ''
              } ${machineState === 'ready' ? styles.vendReady : ''}`}
              onClick={handleVend}
              disabled={machineState !== 'ready' || selectedProject?.status === 'coming-soon'}
              whileHover={machineState === 'ready' ? { scale: 1.05 } : {}}
              whileTap={machineState === 'ready' ? { scale: 0.95 } : {}}
            >
              {machineState === 'dispensing' ? 'VENDING...' : 'VEND'}
            </motion.button>

            <motion.button
              className={styles.clearButton}
              onClick={handleClear}
              disabled={machineState === 'dispensing'}
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
            <AnimatePresence mode="wait">
              {/* Show loading product */}
              {(machineState === 'loading' || machineState === 'ready') && selectedProject && (
                <motion.div
                  key="loading"
                  className={styles.loadingItem}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <span
                    className={styles.loadingIcon}
                    style={{
                      filter: machineState === 'loading'
                        ? `blur(${Math.max(0, 8 - loadProgress / 12.5)}px) grayscale(${Math.max(0, 100 - loadProgress)}%)`
                        : 'none',
                    }}
                  >
                    {projectIcons[selectedProject.id] || '📦'}
                  </span>
                  <span className={styles.loadingText}>
                    {machineState === 'loading' ? `Loading... ${loadProgress}%` : getDisplayName(selectedProject)}
                  </span>
                  {/* Progress bar */}
                  <div className={styles.loadingBar}>
                    <motion.div
                      className={styles.loadingBarFill}
                      style={{ width: `${loadProgress}%` }}
                    />
                  </div>
                </motion.div>
              )}
              {/* Show dispensed product */}
              {dispensedProject && machineState === 'dispensing' && (
                <motion.div
                  key="dispensed"
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

      {/* Audio toggle button */}
      <AudioToggleButton />
    </div>
  );
}

// Inline audio toggle for vending machine
function AudioToggleButton() {
  const { audioEnabled, toggleAudio } = useStore();

  return (
    <button
      onClick={toggleAudio}
      className={styles.audioToggle}
      title={audioEnabled ? 'Mute audio' : 'Unmute audio'}
    >
      {audioEnabled ? '🔊' : '🔇'}
    </button>
  );
}
