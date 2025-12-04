// src/components/interfaces/PirateBroadcast/index.tsx
// Redesigned as a clean radio tuner with smooth dial

import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { projects } from '../../../config/projects';
import styles from './styles.module.css';

// Project frequencies - evenly spaced from 88 to 108 MHz
const PROJECT_FREQUENCIES = [88, 92, 96, 100, 104, 108];
const MIN_FREQ = 88;
const MAX_FREQ = 108;
const SNAP_THRESHOLD = 1.0; // How close to snap to a frequency

export default function Broadcast() {
  const [frequency, setFrequency] = useState(98);
  const [isDragging, setIsDragging] = useState(false);
  const dialRef = useRef<HTMLDivElement>(null);
  const startAngleRef = useRef(0);
  const startFreqRef = useRef(frequency);

  // Map projects to their frequencies
  const projectFrequencyMap = useMemo(() => {
    const map: Record<number, typeof projects[0]> = {};
    projects.forEach((project, index) => {
      if (index < PROJECT_FREQUENCIES.length) {
        map[PROJECT_FREQUENCIES[index]] = project;
      }
    });
    return map;
  }, []);

  // Find tuned project (if frequency is close enough)
  const tunedProject = useMemo(() => {
    for (const freq of PROJECT_FREQUENCIES) {
      if (Math.abs(frequency - freq) <= SNAP_THRESHOLD) {
        return projectFrequencyMap[freq];
      }
    }
    return null;
  }, [frequency, projectFrequencyMap]);

  // Convert frequency to dial rotation
  // Dial range: -135deg (left/88MHz) to +135deg (right/108MHz) = 270 degree arc
  const freqToRotation = (freq: number) => {
    return -135 + ((freq - MIN_FREQ) / (MAX_FREQ - MIN_FREQ)) * 270;
  };

  // Handle dial interaction
  const getAngleFromEvent = useCallback((e: MouseEvent | TouchEvent) => {
    if (!dialRef.current) return 0;
    const rect = dialRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    return Math.atan2(clientY - centerY, clientX - centerX) * (180 / Math.PI);
  }, []);

  const handlePointerDown = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsDragging(true);
    const nativeEvent = e.nativeEvent as MouseEvent | TouchEvent;
    startAngleRef.current = getAngleFromEvent(nativeEvent);
    startFreqRef.current = frequency;
  }, [frequency, getAngleFromEvent]);

  useEffect(() => {
    if (!isDragging) return;

    const handleMove = (e: MouseEvent | TouchEvent) => {
      const currentAngle = getAngleFromEvent(e);
      let angleDelta = currentAngle - startAngleRef.current;

      // Handle angle wrapping
      if (angleDelta > 180) angleDelta -= 360;
      if (angleDelta < -180) angleDelta += 360;

      // Convert angle to frequency
      const freqDelta = (angleDelta / 270) * (MAX_FREQ - MIN_FREQ);
      let newFreq = startFreqRef.current + freqDelta;

      // Clamp
      newFreq = Math.max(MIN_FREQ, Math.min(MAX_FREQ, newFreq));

      setFrequency(newFreq);
    };

    const handleEnd = () => {
      setIsDragging(false);
      // Snap to nearest station if close
      for (const freq of PROJECT_FREQUENCIES) {
        if (Math.abs(frequency - freq) <= SNAP_THRESHOLD * 2) {
          setFrequency(freq);
          break;
        }
      }
    };

    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleEnd);
    document.addEventListener('touchmove', handleMove);
    document.addEventListener('touchend', handleEnd);

    return () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchmove', handleMove);
      document.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging, frequency, getAngleFromEvent]);

  const handleVisit = useCallback(() => {
    if (tunedProject?.status === 'live') {
      window.open(tunedProject.url, '_blank', 'noopener,noreferrer');
    }
  }, [tunedProject]);

  // Generate tick marks for the dial
  const tickMarks = useMemo(() => {
    const marks = [];
    for (let freq = MIN_FREQ; freq <= MAX_FREQ; freq += 2) {
      // Tick marks positioned in arc from -135 to +135 degrees
      const angle = freqToRotation(freq);
      const isStation = PROJECT_FREQUENCIES.includes(freq);
      const isTuned = tunedProject && Math.abs(frequency - freq) <= SNAP_THRESHOLD;
      marks.push({ freq, angle, isStation, isTuned });
    }
    return marks;
  }, [tunedProject, frequency]);

  const rotation = freqToRotation(frequency);

  return (
    <div className={styles.container}>
      {/* Effects */}
      <div className={styles.scanlines} />
      <div className={styles.vignette} />

      {/* Title */}
      <motion.h1
        className={styles.title}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        BROADCAST
      </motion.h1>

      {/* Main radio */}
      <motion.div
        className={styles.radio}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        {/* Frequency display */}
        <div className={styles.frequencyDisplay}>
          <motion.span
            className={styles.frequencyValue}
            key={frequency.toFixed(1)}
            initial={{ opacity: 0.5, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            {frequency.toFixed(1)}
          </motion.span>
          <span className={styles.frequencyUnit}>FM MHz</span>
        </div>

        {/* Dial with frequency scale */}
        <div className={styles.dialWrapper}>
          {/* Frequency scale around dial */}
          <div className={styles.frequencyScale}>
            {tickMarks.map(({ freq, angle, isStation, isTuned }) => (
              <div
                key={freq}
                className={`${styles.tick} ${isStation ? styles.stationTick : ''} ${isTuned ? styles.tunedTick : ''}`}
                style={{
                  transform: `rotate(${angle}deg) translateY(-140px)`,
                }}
              >
                {isStation && (
                  <span
                    className={styles.tickLabel}
                    style={{ transform: `rotate(${-angle}deg)` }}
                  >
                    {freq}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Main dial */}
          <div
            ref={dialRef}
            className={styles.dial}
            onMouseDown={handlePointerDown}
            onTouchStart={handlePointerDown}
          >
            <motion.div
              className={styles.dialKnob}
              style={{ rotate: rotation }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <div className={styles.dialIndicator} />
              <div className={styles.dialCenter} />
            </motion.div>
          </div>

          {/* Tuning indicator light */}
          <motion.div
            className={styles.tuningLight}
            animate={{
              backgroundColor: tunedProject ? '#22c55e' : '#333',
              boxShadow: tunedProject ? '0 0 20px #22c55e' : '0 0 0 transparent',
            }}
          />
        </div>

        {/* Content area - fixed height container */}
        <div className={styles.contentArea}>
          <AnimatePresence mode="wait">
            {tunedProject ? (
              <motion.div
                key={tunedProject.id}
                className={styles.stationCard}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className={styles.signalIndicator}>
                  <span>●</span> SIGNAL LOCKED
                </div>
                <h2 className={styles.stationName}>{tunedProject.name}</h2>
                <p className={styles.stationDescription}>{tunedProject.description}</p>
                <div className={styles.stationMeta}>
                  <span
                    className={`${styles.statusBadge} ${
                      tunedProject.status === 'live' ? styles.live : styles.comingSoon
                    }`}
                  >
                    {tunedProject.status === 'live' ? 'LIVE' : 'COMING SOON'}
                  </span>
                </div>
                <motion.button
                  className={styles.enterButton}
                  onClick={handleVisit}
                  disabled={tunedProject.status !== 'live'}
                  whileHover={{ scale: tunedProject.status === 'live' ? 1.05 : 1 }}
                  whileTap={{ scale: tunedProject.status === 'live' ? 0.95 : 1 }}
                >
                  {tunedProject.status === 'live' ? 'ENTER TRANSMISSION' : 'STANDBY'}
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                key="searching"
                className={styles.searchingState}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className={styles.staticBars}>
                  {Array.from({ length: 12 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className={styles.staticBar}
                      animate={{
                        height: [20, 60, 30, 50, 20],
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 0.5,
                        delay: i * 0.05,
                        ease: 'easeInOut',
                      }}
                    />
                  ))}
                </div>
                <p className={styles.searchingText}>
                  Scanning frequencies<span className={styles.dots}>...</span>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Station list hint */}
      <motion.div
        className={styles.stationHint}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        Stations: {PROJECT_FREQUENCIES.join(' • ')} MHz
      </motion.div>

      {/* Instructions */}
      <motion.div
        className={styles.instructions}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        Drag the dial to tune into different frequencies
      </motion.div>
    </div>
  );
}
