// src/components/interfaces/RetroOS/StartMenu.tsx

import { projects } from '../../../config/projects';
import styles from './styles.module.css';

interface StartMenuProps {
  onSelectProject: (projectId: string) => void;
  onClose: () => void;
}

// Icons for start menu items
const iconEmojis: Record<string, string> = {
  'media-player': '🎵',
  terminal: '💻',
  folder: '📁',
  sticky: '📝',
  screensaver: '🖼️',
  hidden: '🗑️',
};

export default function StartMenu({ onSelectProject, onClose }: StartMenuProps) {
  return (
    <div className={styles.startMenu} onClick={(e) => e.stopPropagation()}>
      {/* Sidebar */}
      <div className={styles.startMenuSidebar}>
        <span className={styles.startMenuTitle}>Poly95</span>
      </div>

      {/* Menu Items */}
      <div className={styles.startMenuItems}>
        <div className={styles.startMenuItem}>
          <span>📂</span>
          <span>Programs</span>
          <span style={{ marginLeft: 'auto' }}>▶</span>
        </div>

        <div className={styles.startMenuDivider} />

        {projects.map((project) => (
          <div
            key={project.id}
            className={styles.startMenuItem}
            onClick={() => {
              onSelectProject(project.id);
              onClose();
            }}
          >
            <span>{iconEmojis[project.mappings.retroOS.iconType] || '📄'}</span>
            <span>{project.name}</span>
          </div>
        ))}

        <div className={styles.startMenuDivider} />

        <div className={styles.startMenuItem}>
          <span>⚙️</span>
          <span>Settings</span>
        </div>
        <div className={styles.startMenuItem}>
          <span>📄</span>
          <span>Documents</span>
        </div>
        <div className={styles.startMenuItem}>
          <span>❓</span>
          <span>Help</span>
        </div>

        <div className={styles.startMenuDivider} />

        <div className={styles.startMenuItem}>
          <span>🔌</span>
          <span>Shut Down...</span>
        </div>
      </div>
    </div>
  );
}
