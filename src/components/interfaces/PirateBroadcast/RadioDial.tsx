// src/components/interfaces/PirateBroadcast/RadioDial.tsx

import { useRef, useState, useEffect } from 'react';
import styles from './styles.module.css';

interface RadioDialProps {
  frequency: number;
  onFrequencyChange: (freq: number) => void;
  minFreq?: number;
  maxFreq?: number;
}

export default function RadioDial({
  frequency,
  onFrequencyChange,
  minFreq = 88.0,
  maxFreq = 108.0,
}: RadioDialProps) {
  const dialRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startAngle, setStartAngle] = useState(0);
  const [startFreq, setStartFreq] = useState(frequency);

  // Convert frequency to rotation angle
  const freqToAngle = (freq: number) => {
    const range = maxFreq - minFreq;
    const normalized = (freq - minFreq) / range;
    return normalized * 300 - 150; // -150 to 150 degrees
  };

  // Convert angle delta to frequency delta
  const angleDeltaToFreq = (angleDelta: number) => {
    const range = maxFreq - minFreq;
    return (angleDelta / 300) * range;
  };

  const getAngleFromEvent = (e: MouseEvent | TouchEvent) => {
    if (!dialRef.current) return 0;
    const rect = dialRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    return Math.atan2(clientY - centerY, clientX - centerX) * (180 / Math.PI);
  };

  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    const nativeEvent = 'touches' in e ? e.nativeEvent : e.nativeEvent;
    setStartAngle(getAngleFromEvent(nativeEvent as MouseEvent | TouchEvent));
    setStartFreq(frequency);
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMove = (e: MouseEvent | TouchEvent) => {
      const currentAngle = getAngleFromEvent(e);
      let angleDelta = currentAngle - startAngle;

      // Handle angle wrapping
      if (angleDelta > 180) angleDelta -= 360;
      if (angleDelta < -180) angleDelta += 360;

      const freqDelta = angleDeltaToFreq(angleDelta);
      let newFreq = startFreq + freqDelta;

      // Clamp frequency
      newFreq = Math.max(minFreq, Math.min(maxFreq, newFreq));
      // Round to 0.1
      newFreq = Math.round(newFreq * 10) / 10;

      onFrequencyChange(newFreq);
    };

    const handleEnd = () => {
      setIsDragging(false);
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
  }, [isDragging, startAngle, startFreq, minFreq, maxFreq, onFrequencyChange]);

  const rotation = freqToAngle(frequency);

  return (
    <div className={styles.dialContainer}>
      <div
        ref={dialRef}
        className={styles.dial}
        onMouseDown={handleStart}
        onTouchStart={handleStart}
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        <div className={styles.dialKnob}>
          <div className={styles.dialIndicator} />
        </div>
      </div>
      <div className={styles.dialLabel}>Tune Frequency</div>
      <div className={styles.frequencyMarkers}>
        <span className={styles.frequencyMarker}>{minFreq}</span>
        <span className={styles.frequencyMarker}>{maxFreq}</span>
      </div>
    </div>
  );
}
