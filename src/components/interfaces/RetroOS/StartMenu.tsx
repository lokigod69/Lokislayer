// src/components/interfaces/RetroOS/StartMenu.tsx
// Windows XP Style Start Menu - Simplified with Settings, Help, Shut Down

import { projects, Project } from '../../../config/projects';
import styles from './styles.module.css';

// XP-style emoji icons for each project type
const iconEmojis: Record<string, string> = {
  'media-player': '🎵',
  terminal: '💻',
  folder: '📁',
  sticky: '📝',
  screensaver: '🖼️',
  hidden: '🗑️',
  speech: '🗣️',
};

interface StartMenuProps {
  onSettings: () => void;
  onHelp: () => void;
  onShutDown: () => void;
  onClose: () => void;
  onProgramClick: (project: Project) => void;
}

export default function StartMenu({ onSettings, onHelp, onShutDown, onClose, onProgramClick }: StartMenuProps) {
  return (
    <div className={styles.startMenu} onClick={(e) => e.stopPropagation()}>
      {/* Header with user info */}
      <div className={styles.startMenuHeader}>
        <div className={styles.userAvatar}>👤</div>
        <span className={styles.userName}>User</span>
      </div>

      {/* Menu Body */}
      <div className={styles.startMenuBody}>
        {/* Left side - Programs list */}
        <div className={styles.startMenuLeft}>
          <div className={styles.startMenuSectionTitle}>All Programs</div>
          <div className={styles.startMenuDivider} />
          <div className={styles.programsList}>
            {projects.map((project) => (
              <div
                key={project.id}
                className={`${styles.startMenuItem} ${styles.programItem}`}
                onClick={() => {
                  onProgramClick(project);
                  onClose();
                }}
              >
                <span className={styles.startMenuItemIcon}>
                  {iconEmojis[project.mappings.retroOS.iconType] || '📄'}
                </span>
                <span className={styles.programName}>{project.name}</span>
                {project.status === 'coming-soon' && (
                  <span className={styles.comingSoonTag}>Soon</span>
                )}
              </div>
            ))}
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
