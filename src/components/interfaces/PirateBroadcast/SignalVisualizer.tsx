// src/components/interfaces/PirateBroadcast/SignalVisualizer.tsx

import { useEffect, useState } from 'react';
import styles from './styles.module.css';

interface SignalVisualizerProps {
  signalStrength: number; // 0 to 1
  isTuned: boolean;
}

export default function SignalVisualizer({ signalStrength, isTuned }: SignalVisualizerProps) {
  const [bars, setBars] = useState<number[]>(Array(20).fill(0));

  useEffect(() => {
    const interval = setInterval(() => {
      setBars((prevBars) =>
        prevBars.map(() => {
          if (isTuned) {
            // Clean signal - rhythmic bars
            return 30 + Math.random() * 40 * signalStrength;
          } else {
            // Static noise - random chaos
            return Math.random() * 60 * (1 - signalStrength * 0.5);
          }
        })
      );
    }, 100);

    return () => clearInterval(interval);
  }, [signalStrength, isTuned]);

  return (
    <div className={styles.visualizer}>
      {/* Static noise overlay - fades when tuned */}
      <div
        className={styles.staticNoise}
        style={{ opacity: isTuned ? 0 : 0.3 + (1 - signalStrength) * 0.4 }}
      />

      {/* Signal bars */}
      <div className={styles.signalBars}>
        {bars.map((height, i) => (
          <div
            key={i}
            className={styles.signalBar}
            style={{
              height: `${height}%`,
              opacity: isTuned ? 1 : 0.3 + signalStrength * 0.7,
              background: isTuned
                ? 'linear-gradient(to top, #22c55e, #4ade80)'
                : `linear-gradient(to top, #666, #888)`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
