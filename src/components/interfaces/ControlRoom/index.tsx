// src/components/interfaces/ControlRoom/index.tsx

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { projects } from '../../../config/projects';
import Panel from './Panel';
import styles from './styles.module.css';

export default function ControlRoom() {
  const [currentTime, setCurrentTime] = useState('');
  const [systemStatus, setSystemStatus] = useState('NOMINAL');

  // Update clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Cycle through status messages
  useEffect(() => {
    const statuses = ['NOMINAL', 'ALL SYSTEMS GO', 'READY', 'STANDING BY'];
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % statuses.length;
      setSystemStatus(statuses[index]);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.container}>
      {/* Ambient glow */}
      <div className={styles.ambientGlow} />

      {/* Title Bar */}
      <motion.div
        className={styles.titleBar}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <span className={styles.title}>Control Room</span>
      </motion.div>

      {/* Panel Grid */}
      <div className={styles.panelArea}>
        {projects.map((project, index) => (
          <Panel key={project.id} project={project} index={index} />
        ))}
      </div>

      {/* Status Bar */}
      <motion.div
        className={styles.statusBar}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.3 }}
      >
        <div className={styles.statusItem}>
          <div className={styles.statusLed} />
          <span>SYS: {systemStatus}</span>
        </div>
        <div className={styles.statusItem}>
          <span>POLY-INTERFACE PORTAL v1.0</span>
        </div>
        <div className={styles.statusItem}>
          <span>UTC {currentTime}</span>
        </div>
      </motion.div>
    </div>
  );
}
