// src/components/interfaces/RetroOS/index.tsx
// Windows XP Style Desktop

import { useState, useCallback } from 'react';
import Desktop from './Desktop';
import styles from './styles.module.css';

export default function RetroOS() {
  const [booted, setBooted] = useState(false);

  const handleBootComplete = useCallback(() => {
    setBooted(true);
  }, []);

  // Simple XP boot screen
  if (!booted) {
    return (
      <div className={styles.bootScreen}>
        <div className={styles.xpLogo}>
          <div className={styles.xpLogoFlag}>🪟</div>
          <div className={styles.xpLogoText}>
            <span className={styles.xpMicrosoft}>Microsoft</span>
            <span className={styles.xpWindows}>Windows</span>
            <span className={styles.xpXP}>XP</span>
          </div>
        </div>
        <div className={styles.bootProgress}>
          <div className={styles.bootProgressBar} onAnimationEnd={handleBootComplete} />
        </div>
        <div className={styles.bootCopyright}>Copyright © Microsoft Corporation</div>
      </div>
    );
  }

  return <Desktop />;
}
