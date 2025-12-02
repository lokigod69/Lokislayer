// src/components/interfaces/VendingMachine/Keypad.tsx

import { useState } from 'react';
import { motion } from 'framer-motion';
import styles from './styles.module.css';

interface KeypadProps {
  onSelect: (code: string) => void;
}

const keys = ['A', 'B', 'C', '1', '2', 'CLR'];
const validCodes = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

export default function Keypad({ onSelect }: KeypadProps) {
  const [input, setInput] = useState('');

  const handleKeyPress = (key: string) => {
    if (key === 'CLR') {
      setInput('');
      return;
    }

    const newInput = (input + key).slice(-2);
    setInput(newInput);

    // Check if valid code
    if (validCodes.includes(newInput)) {
      onSelect(newInput);
      // Clear after selection with small delay
      setTimeout(() => setInput(''), 500);
    }
  };

  return (
    <motion.div
      className={styles.keypad}
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5 }}
    >
      <div className={styles.keypadDisplay}>{input || '_ _'}</div>
      {keys.map((key) => (
        <motion.button
          key={key}
          className={styles.keypadKey}
          onClick={() => handleKeyPress(key)}
          whileTap={{ scale: 0.9 }}
        >
          {key}
        </motion.button>
      ))}
    </motion.div>
  );
}
