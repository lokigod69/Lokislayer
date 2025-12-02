// src/components/interfaces/PirateBroadcast/index.tsx

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { projects } from '../../../config/projects';
import RadioDial from './RadioDial';
import SignalVisualizer from './SignalVisualizer';
import styles from './styles.module.css';

const TUNE_THRESHOLD = 0.3; // How close to frequency to be "tuned in"

export default function PirateBroadcast() {
  const [frequency, setFrequency] = useState(98.0);

  // Find if we're tuned to a project
  const tunedProject = useMemo(() => {
    return projects.find((p) => {
      const projectFreq = p.mappings.pirateBroadcast.frequency;
      return Math.abs(frequency - projectFreq) <= TUNE_THRESHOLD;
    });
  }, [frequency]);

  // Calculate signal strength (1 when perfectly tuned, 0 when far)
  const signalStrength = useMemo(() => {
    if (!tunedProject) return 0;
    const projectFreq = tunedProject.mappings.pirateBroadcast.frequency;
    const distance = Math.abs(frequency - projectFreq);
    return Math.max(0, 1 - distance / TUNE_THRESHOLD);
  }, [frequency, tunedProject]);

  const handleVisit = () => {
    if (tunedProject && tunedProject.status === 'live') {
      window.open(tunedProject.url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className={styles.container}>
      {/* Effects */}
      <div className={styles.scanlines} />
      <div className={styles.vignette} />

      {/* Title */}
      <motion.div
        className={styles.title}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Pirate Broadcast
      </motion.div>

      {/* Entry message */}
      <motion.div
        className={styles.entryMessage}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        "You've intercepted the signal. Tune the dial to decode transmissions..."
      </motion.div>

      {/* Radio Unit */}
      <motion.div
        className={styles.radioUnit}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, type: 'spring' }}
      >
        {/* Frequency Display */}
        <div className={styles.frequencyDisplay}>
          <div className={styles.frequencyValue}>{frequency.toFixed(1)}</div>
          <div className={styles.frequencyLabel}>FM MHz</div>
        </div>

        {/* Signal Visualizer */}
        <SignalVisualizer
          signalStrength={signalStrength}
          isTuned={!!tunedProject}
        />

        {/* Radio Dial */}
        <RadioDial
          frequency={frequency}
          onFrequencyChange={setFrequency}
        />

        {/* Content Area */}
        {tunedProject ? (
          <motion.div
            className={styles.tunedInfo}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            key={tunedProject.id}
          >
            <div className={styles.tunedTitle}>{tunedProject.name}</div>
            <div className={styles.tunedDescription}>
              {tunedProject.description}
            </div>
            <div
              className={`${styles.tunedStatus} ${
                tunedProject.status === 'live'
                  ? styles.statusLive
                  : styles.statusComingSoon
              }`}
            >
              {tunedProject.status === 'live' ? '● Signal Locked' : '◐ Coming Soon'}
            </div>
            <br />
            <button
              className={styles.enterButton}
              onClick={handleVisit}
              disabled={tunedProject.status !== 'live'}
            >
              {tunedProject.status === 'live' ? 'Enter Transmission' : 'Standby'}
            </button>
          </motion.div>
        ) : (
          <div className={styles.searchingText}>
            Searching for signal<span>...</span>
          </div>
        )}
      </motion.div>

      {/* Instructions */}
      <motion.div
        className={styles.instructions}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        Drag the dial to tune • Frequencies: 88.1, 92.5, 96.3, 101.7, 105.9, 108.0
      </motion.div>
    </div>
  );
}
