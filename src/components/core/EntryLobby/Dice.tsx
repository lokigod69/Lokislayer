// src/components/core/EntryLobby/Dice.tsx

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../../store/useStore';
import styles from './styles.module.css';

export default function Dice() {
  const { rollDice } = useStore();
  const [isRolling, setIsRolling] = useState(false);
  const [currentFace, setCurrentFace] = useState(1);

  const handleRoll = () => {
    if (isRolling) return;

    setIsRolling(true);

    // Animate through random faces
    let rollCount = 0;
    const maxRolls = 15;
    const interval = setInterval(() => {
      setCurrentFace(Math.floor(Math.random() * 6) + 1);
      rollCount++;

      if (rollCount >= maxRolls) {
        clearInterval(interval);
        // Final roll determines the interface
        const result = rollDice();
        setCurrentFace(result);

        // Small delay before transitioning
        setTimeout(() => {
          setIsRolling(false);
        }, 500);
      }
    }, 100);
  };

  const diceFaces = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];

  return (
    <motion.button
      onClick={handleRoll}
      disabled={isRolling}
      whileHover={{ scale: isRolling ? 1 : 1.02 }}
      whileTap={{ scale: isRolling ? 1 : 0.98 }}
      className={styles.diceButton}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentFace}
          initial={{ rotateX: -90, opacity: 0 }}
          animate={{ rotateX: 0, opacity: 1 }}
          exit={{ rotateX: 90, opacity: 0 }}
          transition={{ duration: 0.1 }}
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}
        >
          <span
            className={styles.diceIcon}
            style={{
              display: 'inline-block',
              animation: isRolling ? 'bounce 0.3s infinite' : 'none'
            }}
          >
            {diceFaces[currentFace - 1]}
          </span>
          <span>{isRolling ? 'Rolling...' : 'Roll the Dice'}</span>
        </motion.div>
      </AnimatePresence>

      {/* Shimmer effect */}
      {isRolling && <div className={styles.shimmer} />}
    </motion.button>
  );
}
