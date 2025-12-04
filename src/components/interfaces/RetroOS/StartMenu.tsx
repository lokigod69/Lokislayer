// src/components/interfaces/RetroOS/StartMenu.tsx
// Windows XP Style Start Menu - Simplified with Settings, Help, Shut Down

import styles from './styles.module.css';

interface StartMenuProps {
  onSettings: () => void;
  onHelp: () => void;
  onShutDown: () => void;
  onClose: () => void;
}

export default function StartMenu({ onSettings, onHelp, onShutDown, onClose }: StartMenuProps) {
  return (
    <div className={styles.startMenu} onClick={(e) => e.stopPropagation()}>
      {/* Header with user info */}
      <div className={styles.startMenuHeader}>
        <div className={styles.userAvatar}>👤</div>
        <span className={styles.userName}>User</span>
      </div>

      {/* Menu Body */}
      <div className={styles.startMenuBody}>
        {/* Left side - empty since we removed programs list */}
        <div className={styles.startMenuLeft}>
          <div className={styles.startMenuItem} style={{ opacity: 0.5, cursor: 'default' }}>
            <span className={styles.startMenuItemIcon}>📂</span>
            <span>All Programs</span>
          </div>
          <div className={styles.startMenuDivider} />
          <div style={{ padding: '20px', textAlign: 'center', color: '#888', fontSize: 11 }}>
            Click icons on the desktop<br />to open programs
          </div>
        </div>

        {/* Right side - Settings, Help, etc. */}
        <div className={styles.startMenuRight}>
          <div
            className={styles.startMenuItem}
            onClick={() => {
              onSettings();
              onClose();
            }}
          >
            <span className={styles.startMenuItemIcon}>⚙️</span>
            <span>Settings</span>
          </div>

          <div className={styles.startMenuDivider} />

          <div
            className={styles.startMenuItem}
            onClick={() => {
              onHelp();
              onClose();
            }}
          >
            <span className={styles.startMenuItemIcon}>❓</span>
            <span>Help and Support</span>
          </div>

          <div className={styles.startMenuDivider} />

          <div
            className={styles.startMenuItem}
            onClick={() => {
              onShutDown();
              onClose();
            }}
          >
            <span className={styles.startMenuItemIcon}>🔴</span>
            <span>Shut Down</span>
          </div>
        </div>
      </div>

      {/* Footer with Log Off and Shut Down buttons */}
      <div className={styles.startMenuFooter}>
        <button
          className={styles.footerButton}
          onClick={() => {
            onShutDown();
            onClose();
          }}
        >
          <span className={styles.footerButtonIcon}>🚪</span>
          Log Off
        </button>
        <button
          className={styles.footerButton}
          onClick={() => {
            onShutDown();
            onClose();
          }}
        >
          <span className={styles.footerButtonIcon}>⏻</span>
          Shut Down
        </button>
      </div>
    </div>
  );
}
