// src/components/core/WelcomeModal/index.tsx
// First-visit welcome modal with witty introduction

import { motion, AnimatePresence } from 'framer-motion';
import styles from './styles.module.css';

interface WelcomeModalProps {
  isOpen: boolean;
  onTakeTour: () => void;
  onSkip: () => void;
}

export default function WelcomeModal({ isOpen, onTakeTour, onSkip }: WelcomeModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <motion.div
            className={styles.modal}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{
              duration: 0.5,
              delay: 0.1,
              ease: [0.16, 1, 0.3, 1]
            }}
          >
            {/* Decorative elements */}
            <div className={styles.cornerTL} />
            <div className={styles.cornerTR} />
            <div className={styles.cornerBL} />
            <div className={styles.cornerBR} />

            {/* Content */}
            <motion.div
              className={styles.content}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <h1 className={styles.title}>You found it.</h1>

              <p className={styles.description}>
                Welcome to the waiting room between ideas. Six doors, six experiments,
                one questionable sense of direction.
              </p>

              <p className={styles.subdescription}>
                Roll the dice and let fate pick your path—or skip ahead
                if patience isn't your thing.
              </p>

              <div className={styles.actions}>
                <motion.button
                  className={styles.primaryButton}
                  onClick={onTakeTour}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <span className={styles.buttonIcon}>⚄</span>
                  Roll the Dice
                </motion.button>

                <motion.button
                  className={styles.secondaryButton}
                  onClick={onSkip}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Skip → Choose Interface
                </motion.button>
              </div>

              <p className={styles.footnote}>
                Don't worry. Nothing here bites. <span className={styles.footnoteEmphasis}>Probably.</span>
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
