// src/components/core/DiceLanding/index.tsx
// Clean 3D dice landing - bigger dice, simpler text

import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../../store/useStore';
import { getRandomInterfaceId, getInterfaceById } from '../../../config/interfaces';
import WaveGrid from '../WaveGrid';
import styles from './styles.module.css';

// Dice face dot patterns (1-6)
const dotPatterns: Record<number, number[][]> = {
  1: [[1, 1]],
  2: [[0, 0], [2, 2]],
  3: [[0, 0], [1, 1], [2, 2]],
  4: [[0, 0], [0, 2], [2, 0], [2, 2]],
  5: [[0, 0], [0, 2], [1, 1], [2, 0], [2, 2]],
  6: [[0, 0], [0, 2], [1, 0], [1, 2], [2, 0], [2, 2]],
};

// 3D rotation for each face
// Face positions: Front=1, Back=6, Right=2, Left=5, Top=3, Bottom=4
const faceRotations: Record<number, { rotateX: number; rotateY: number }> = {
  1: { rotateX: 0, rotateY: 0 },      // Front face - no rotation
  2: { rotateX: 0, rotateY: -90 },    // Right face - rotate left to show
  3: { rotateX: -90, rotateY: 0 },    // Top face - rotate up
  4: { rotateX: 90, rotateY: 0 },     // Bottom face - rotate down
  5: { rotateX: 0, rotateY: 90 },     // Left face - rotate right to show
  6: { rotateX: 180, rotateY: 0 },    // Back face - flip
};

function DiceFace({ value }: { value: number }) {
  const dots = dotPatterns[value];
  return (
    <div className={styles.diceFace}>
      <div className={styles.dotGrid}>
        {dots.map((pos, i) => (
          <div
            key={i}
            className={styles.dot}
            style={{
              gridRow: pos[0] + 1,
              gridColumn: pos[1] + 1,
            }}
          />
        ))}
      </div>
    </div>
  );
}

// Background particles
function Particles() {
  const particles = useMemo(() => {
    return Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: Math.random() * 15,
      duration: 15 + Math.random() * 10,
      size: 2 + Math.random() * 2,
    }));
  }, []);

  return (
    <div className={styles.particles}>
      {particles.map((p) => (
        <div
          key={p.id}
          className={styles.particle}
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  );
}

export default function DiceLanding() {
  const { setInterface } = useStore();
  const [isRolling, setIsRolling] = useState(false);
  const [currentFace, setCurrentFace] = useState<number | null>(null); // null = idle angled view
  const [rolledNumber, setRolledNumber] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [rollPosition, setRollPosition] = useState({ x: 0, y: 0 });

  const handleRoll = useCallback(() => {
    if (isRolling) return;

    setIsRolling(true);
    setShowResult(false);
    setRolledNumber(null);

    // Start from left side of screen
    setRollPosition({ x: -200, y: -50 });

    // Animate through random faces while moving
    let rollCount = 0;
    const maxRolls = 20;
    const interval = setInterval(() => {
      setCurrentFace(Math.floor(Math.random() * 6) + 1);
      rollCount++;

      // Update position - roll across then bounce
      if (rollCount <= 10) {
        // Rolling across (left to center)
        const progress = rollCount / 10;
        setRollPosition({
          x: -200 + (200 * progress),
          y: -50 + Math.sin(progress * Math.PI * 3) * 30, // Bouncing motion
        });
      } else if (rollCount <= 15) {
        // Bouncing phase
        const bounceProgress = (rollCount - 10) / 5;
        setRollPosition({
          x: Math.sin(bounceProgress * Math.PI * 2) * 20,
          y: -Math.abs(Math.sin(bounceProgress * Math.PI * 3)) * 25,
        });
      } else {
        // Settling phase
        const settleProgress = (rollCount - 15) / 5;
        setRollPosition({
          x: 20 * (1 - settleProgress),
          y: 0,
        });
      }

      if (rollCount >= maxRolls) {
        clearInterval(interval);
        const finalNumber = getRandomInterfaceId();
        setCurrentFace(finalNumber);
        setRolledNumber(finalNumber);
        setIsRolling(false);
        setRollPosition({ x: 0, y: 0 });

        // Wait for dice to settle into final position (0.5s animation)
        // Then show the result
        setTimeout(() => {
          setShowResult(true);

          // Navigate after result has been displayed
          setTimeout(() => {
            setInterface(finalNumber, 'dice');  // Came from dice roll
          }, 1500);
        }, 600);
      }
    }, 80);
  }, [isRolling, setInterface]);

  const handleSkip = useCallback(() => {
    setInterface(-1);  // Goes to selection, no source needed (not entering an interface)
  }, [setInterface]);



  // Angled rotation to show dice as 3D cube (edge facing viewer)
  // When currentFace is null (idle), show angled view; otherwise show the specific face
  const rotation = currentFace !== null
    ? faceRotations[currentFace]
    : { rotateX: -25, rotateY: 35 }; // Angled to show corner/edge
  const resultInterface = rolledNumber ? getInterfaceById(rolledNumber) : null;

  return (
    <div className={styles.container}>
      {/* Background */}
      <div className={styles.backgroundGradient} />
      <WaveGrid />
      <Particles />

      {/* Content */}
      <div className={styles.content}>
        {/* Main Title - THE PORTAL */}
        <motion.h1
          className={styles.title}
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          The Portal
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className={styles.subtitle}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          Roll Your Fate
        </motion.p>

        {/* 3D Dice - bigger and more prominent */}
        <motion.div
          className={styles.diceContainer}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2, type: 'spring' }}
        >
          {/* Dice area - fixed size wrapper for centering */}
          <div className={styles.diceArea}>
            <motion.button
              className={styles.diceWrapper}
              onClick={handleRoll}
              disabled={isRolling}
              whileHover={!isRolling ? { scale: 1.05 } : {}}
              whileTap={!isRolling ? { scale: 0.95 } : {}}
              aria-label="Roll the dice"
              animate={{
                x: rollPosition.x,
                y: rollPosition.y,
              }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 20,
              }}
            >
              <motion.div
                className={styles.dice}
                animate={{
                  rotateX: isRolling ? [0, 360, 720, 1080, 1440] : rotation.rotateX,
                  rotateY: isRolling ? [0, 180, 540, 900, 1260] : rotation.rotateY,
                  rotateZ: isRolling ? [0, 90, 180, 270, 360] : 0,
                }}
                transition={{
                  duration: isRolling ? 1.6 : 0.5,
                  ease: isRolling ? 'easeOut' : [0.16, 1, 0.3, 1],
                }}
              >
                {/* Front - 1 */}
                <div className={`${styles.face} ${styles.front}`}>
                  <DiceFace value={1} />
                </div>
                {/* Back - 6 */}
                <div className={`${styles.face} ${styles.back}`}>
                  <DiceFace value={6} />
                </div>
                {/* Right - 2 */}
                <div className={`${styles.face} ${styles.right}`}>
                  <DiceFace value={2} />
                </div>
                {/* Left - 5 */}
                <div className={`${styles.face} ${styles.left}`}>
                  <DiceFace value={5} />
                </div>
                {/* Top - 3 */}
                <div className={`${styles.face} ${styles.top}`}>
                  <DiceFace value={3} />
                </div>
                {/* Bottom - 4 */}
                <div className={`${styles.face} ${styles.bottom}`}>
                  <DiceFace value={4} />
                </div>
              </motion.div>

              {/* Glow effect */}
              <div className={styles.diceGlow} />
            </motion.button>
          </div>

          {/* Rolling indicator - centered below dice */}
          <AnimatePresence>
            {isRolling && (
              <motion.div
                className={styles.rollingText}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                Rolling...
              </motion.div>
            )}
          </AnimatePresence>

          {/* Result display - centered below dice */}
          <AnimatePresence>
            {showResult && resultInterface && (
              <motion.div
                className={styles.result}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ type: 'spring', damping: 15 }}
              >
                <div className={styles.resultNumber}>{rolledNumber}</div>
                <div className={styles.resultName}>{resultInterface.name}</div>
                <div className={styles.resultEntering}>Entering...</div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Skip button */}
        <motion.button
          className={styles.skipButton}
          onClick={handleSkip}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          whileHover={{ scale: 1.02 }}
        >
          Skip → Choose Interface
        </motion.button>


      </div>
    </div>
  );
}
