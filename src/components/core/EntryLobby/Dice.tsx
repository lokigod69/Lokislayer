// src/components/core/EntryLobby/Dice.tsx

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../../store/useStore';

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
      whileHover={{ scale: isRolling ? 1 : 1.05 }}
      whileTap={{ scale: isRolling ? 1 : 0.95 }}
      className={`
        relative px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-lg sm:text-xl font-bold
        transition-all overflow-hidden
        ${isRolling
          ? 'bg-gradient-to-r from-purple-600 to-pink-600 cursor-wait'
          : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500'
        }
      `}
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={currentFace}
          initial={{ rotateX: -90, opacity: 0 }}
          animate={{ rotateX: 0, opacity: 1 }}
          exit={{ rotateX: 90, opacity: 0 }}
          transition={{ duration: 0.1 }}
          className="flex items-center gap-2"
        >
          <span className={`text-2xl ${isRolling ? 'animate-bounce' : ''}`}>
            {diceFaces[currentFace - 1]}
          </span>
          <span>{isRolling ? 'Rolling...' : 'Roll the Dice'}</span>
        </motion.span>
      </AnimatePresence>

      {/* Shimmer effect */}
      {isRolling && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
        />
      )}
    </motion.button>
  );
}
