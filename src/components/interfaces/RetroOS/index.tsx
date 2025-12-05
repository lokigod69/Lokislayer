// src/components/interfaces/RetroOS/index.tsx
// Windows XP Style Desktop

import { useState, useCallback, useEffect } from 'react';
import Desktop from './Desktop';
import styles from './styles.module.css';

// Windows logo SVG component
function WindowsLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 88 88" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 12.4L35.7 7.6V42.1H0V12.4Z" fill="#F25022"/>
      <path d="M40.2 6.9L87.8 0V42.1H40.2V6.9Z" fill="#7FBA00"/>
      <path d="M0 45.9H35.7V80.4L0 75.6V45.9Z" fill="#00A4EF"/>
      <path d="M40.2 45.9H87.8V88L40.2 81.1V45.9Z" fill="#FFB900"/>
    </svg>
  );
}

export default function RetroOS() {
  const [booted, setBooted] = useState(false);

  // Set Windows favicon when this interface is active
  useEffect(() => {
    const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
    const originalHref = link?.href;

    if (link) {
      link.href = '/windows-favicon.svg';
    }

    return () => {
      if (link && originalHref) {
        link.href = originalHref;
      }
    };
  }, []);

  const handleBootComplete = useCallback(() => {
    setBooted(true);
  }, []);

  // Simple XP boot screen
  if (!booted) {
    return (
      <div className={styles.bootScreen}>
        <div className={styles.xpLogo}>
          <WindowsLogo className={styles.xpLogoFlag} />
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
