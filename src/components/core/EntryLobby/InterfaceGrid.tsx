// src/components/core/EntryLobby/InterfaceGrid.tsx

import { motion } from 'framer-motion';
import { useStore } from '../../../store/useStore';
import { interfaces } from '../../../config/interfaces';
import styles from './styles.module.css';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

// Thumbnail backgrounds with animated effects
const thumbnailStyles: Record<string, React.CSSProperties> = {
  'neural-map': {
    background: `
      radial-gradient(circle at 30% 40%, rgba(139, 92, 246, 0.8) 0%, transparent 25%),
      radial-gradient(circle at 70% 30%, rgba(34, 197, 94, 0.8) 0%, transparent 25%),
      radial-gradient(circle at 50% 70%, rgba(59, 130, 246, 0.8) 0%, transparent 25%),
      radial-gradient(circle at 80% 60%, rgba(236, 72, 153, 0.6) 0%, transparent 20%),
      linear-gradient(135deg, #0c0118 0%, #1a0a2e 100%)
    `,
  },
  'anatomical-map': {
    background: `
      radial-gradient(ellipse at 50% 30%, rgba(139, 90, 43, 0.3) 0%, transparent 50%),
      linear-gradient(135deg, #f4e4c8 0%, #d4c4a8 50%, #c4b498 100%)
    `,
  },
  'retro-os': {
    background: `
      linear-gradient(180deg, #000080 0%, #000080 8%, #008080 8%, #008080 100%)
    `,
  },
  'pirate-broadcast': {
    background: `
      repeating-linear-gradient(0deg, rgba(0,0,0,0.3) 0px, rgba(0,0,0,0.3) 2px, transparent 2px, transparent 4px),
      radial-gradient(circle at 50% 50%, rgba(34, 197, 94, 0.2) 0%, transparent 50%),
      linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)
    `,
  },
  'control-room': {
    background: `
      radial-gradient(circle at 30% 30%, rgba(59, 130, 246, 0.2) 0%, transparent 30%),
      radial-gradient(circle at 70% 70%, rgba(239, 68, 68, 0.15) 0%, transparent 30%),
      linear-gradient(135deg, #0a1628 0%, #162033 100%)
    `,
  },
  'vending-machine': {
    background: `
      radial-gradient(circle at 50% 0%, rgba(0, 255, 255, 0.15) 0%, transparent 50%),
      radial-gradient(circle at 50% 100%, rgba(255, 0, 255, 0.15) 0%, transparent 50%),
      linear-gradient(135deg, #0a0a1a 0%, #1a1a2e 100%)
    `,
  },
};

// Thumbnail decoration components
function ThumbnailDecor({ slug }: { slug: string }) {
  switch (slug) {
    case 'neural-map':
      return (
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 120 80" style={{ opacity: 0.7 }}>
          {/* Connections */}
          <line x1="30" y1="30" x2="70" y2="25" stroke="url(#purpleGreen)" strokeWidth="1" opacity="0.6" />
          <line x1="30" y1="30" x2="55" y2="55" stroke="url(#purpleBlue)" strokeWidth="1" opacity="0.6" />
          <line x1="70" y1="25" x2="55" y2="55" stroke="url(#greenBlue)" strokeWidth="1" opacity="0.6" />
          <line x1="90" y1="45" x2="70" y2="25" stroke="url(#pinkGreen)" strokeWidth="1" opacity="0.6" />

          {/* Nodes with glow */}
          <circle cx="30" cy="30" r="8" fill="#8B5CF6" filter="url(#glow)" />
          <circle cx="70" cy="25" r="8" fill="#22C55E" filter="url(#glow)" />
          <circle cx="55" cy="55" r="8" fill="#3B82F6" filter="url(#glow)" />
          <circle cx="90" cy="45" r="6" fill="#EC4899" filter="url(#glow)" />

          {/* Inner dots */}
          <circle cx="30" cy="30" r="3" fill="white" opacity="0.8" />
          <circle cx="70" cy="25" r="3" fill="white" opacity="0.8" />
          <circle cx="55" cy="55" r="3" fill="white" opacity="0.8" />
          <circle cx="90" cy="45" r="2" fill="white" opacity="0.8" />

          <defs>
            <linearGradient id="purpleGreen" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#22C55E" />
            </linearGradient>
            <linearGradient id="purpleBlue" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#3B82F6" />
            </linearGradient>
            <linearGradient id="greenBlue" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#22C55E" />
              <stop offset="100%" stopColor="#3B82F6" />
            </linearGradient>
            <linearGradient id="pinkGreen" x1="100%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#EC4899" />
              <stop offset="100%" stopColor="#22C55E" />
            </linearGradient>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
        </svg>
      );

    case 'anatomical-map':
      return (
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 120 80" style={{ opacity: 0.8 }}>
          {/* Vitruvian circle */}
          <circle cx="60" cy="45" r="28" stroke="#8b5a2b" strokeWidth="0.5" strokeDasharray="3,3" fill="none" opacity="0.4" />

          {/* Body figure */}
          <ellipse cx="60" cy="18" rx="10" ry="12" stroke="#8b5a2b" strokeWidth="1.5" fill="none" />
          <line x1="60" y1="30" x2="60" y2="55" stroke="#8b5a2b" strokeWidth="1.5" />
          <line x1="40" y1="40" x2="60" y2="35" stroke="#8b5a2b" strokeWidth="1.5" />
          <line x1="80" y1="40" x2="60" y2="35" stroke="#8b5a2b" strokeWidth="1.5" />
          <line x1="50" y1="55" x2="45" y2="75" stroke="#8b5a2b" strokeWidth="1.5" />
          <line x1="70" y1="55" x2="75" y2="75" stroke="#8b5a2b" strokeWidth="1.5" />

          {/* Hotspot indicators */}
          <circle cx="60" cy="18" r="3" fill="#8b5a2b" opacity="0.6" />
          <circle cx="55" cy="42" r="3" fill="#c45c5c" opacity="0.6" />
        </svg>
      );

    case 'retro-os':
      return (
        <div className="absolute inset-2 flex flex-col gap-1" style={{ fontSize: '6px' }}>
          {/* Window */}
          <div className="flex-1 bg-white rounded-sm shadow-md overflow-hidden border border-gray-400">
            <div className="h-4 bg-gradient-to-r from-blue-800 to-blue-600 flex items-center px-1 gap-1">
              <div className="w-2 h-2 bg-gray-300 rounded-sm" />
              <span className="text-white font-bold truncate">My Computer</span>
            </div>
            <div className="p-1 bg-white grid grid-cols-3 gap-1">
              <div className="flex flex-col items-center">
                <div className="w-4 h-4 bg-yellow-300 rounded-sm" />
              </div>
              <div className="flex flex-col items-center">
                <div className="w-4 h-4 bg-blue-300 rounded-sm" />
              </div>
              <div className="flex flex-col items-center">
                <div className="w-4 h-4 bg-green-300 rounded-sm" />
              </div>
            </div>
          </div>
          {/* Taskbar */}
          <div className="h-4 bg-gradient-to-b from-gray-300 to-gray-400 rounded-sm flex items-center px-1 border-t border-white">
            <div className="px-2 py-0.5 bg-gray-200 rounded-sm border border-gray-400 text-[5px] font-bold">
              Start
            </div>
          </div>
        </div>
      );

    case 'pirate-broadcast':
      return (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {/* Radio dial */}
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-gray-700 bg-gradient-to-b from-gray-800 to-gray-900" />
            <div className="absolute inset-2 rounded-full border border-gray-600 bg-black" />
            {/* Frequency marks */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
              <div
                key={deg}
                className="absolute w-0.5 h-2 bg-gray-500"
                style={{
                  left: '50%',
                  top: '4px',
                  transform: `translateX(-50%) rotate(${deg}deg)`,
                  transformOrigin: '50% 28px',
                }}
              />
            ))}
            {/* Center glow */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-green-500 shadow-lg shadow-green-500/80 animate-pulse" />
            </div>
          </div>
          {/* Frequency display */}
          <div className="mt-2 px-2 py-0.5 bg-black rounded text-green-400 font-mono text-[10px] border border-green-900">
            98.0 FM
          </div>
        </div>
      );

    case 'control-room':
      return (
        <div className="absolute inset-2 grid grid-cols-2 gap-1.5">
          {[
            { color: '#22C55E', active: true },
            { color: '#3B82F6', active: false },
            { color: '#EF4444', active: false },
            { color: '#F59E0B', active: true },
          ].map((panel, i) => (
            <div
              key={i}
              className="rounded bg-gray-900 border border-gray-700 flex items-center justify-center relative overflow-hidden"
            >
              {/* Screen glow */}
              <div
                className="absolute inset-1 rounded opacity-20"
                style={{ background: panel.color }}
              />
              {/* LED indicator */}
              <div
                className="w-2 h-2 rounded-full"
                style={{
                  background: panel.active ? panel.color : '#333',
                  boxShadow: panel.active ? `0 0 8px ${panel.color}` : 'none',
                }}
              />
              {/* Scanlines */}
              <div
                className="absolute inset-0 opacity-30"
                style={{
                  background: 'repeating-linear-gradient(0deg, transparent 0px, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)',
                }}
              />
            </div>
          ))}
        </div>
      );

    case 'vending-machine':
      return (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-14 h-20 bg-gray-900 rounded-lg border border-gray-700 flex flex-col p-1 gap-0.5 relative overflow-hidden">
            {/* Neon glow */}
            <div className="absolute inset-0 rounded-lg" style={{
              boxShadow: 'inset 0 0 20px rgba(0, 255, 255, 0.1), inset 0 0 20px rgba(255, 0, 255, 0.1)',
            }} />

            {/* Product grid */}
            <div className="flex-1 grid grid-cols-2 gap-0.5 relative z-10">
              {['#8B5CF6', '#22C55E', '#3B82F6', '#F59E0B', '#EC4899', '#6366F1'].map((color, i) => (
                <div
                  key={i}
                  className="rounded-sm flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${color}aa, ${color}66)`,
                    boxShadow: `0 0 4px ${color}44`,
                  }}
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-white/50" />
                </div>
              ))}
            </div>

            {/* Dispense slot */}
            <div className="h-3 bg-black rounded border border-cyan-900 flex items-center justify-center relative z-10">
              <div className="w-4 h-0.5 bg-cyan-500/50 rounded" />
            </div>
          </div>
        </div>
      );

    default:
      return null;
  }
}

export default function InterfaceGrid() {
  const { setInterface, visitedInterfaces } = useStore();

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className={styles.grid}
    >
      {interfaces.map((iface) => {
        const isVisited = visitedInterfaces.includes(iface.id);

        return (
          <motion.button
            key={iface.id}
            variants={itemVariants}
            onClick={() => setInterface(iface.id)}
            whileHover={{ y: -8, transition: { duration: 0.3 } }}
            whileTap={{ scale: 0.98 }}
            className={`${styles.card} ${isVisited ? styles.cardVisited : ''}`}
          >
            {/* Thumbnail preview */}
            <div className={styles.cardThumbnail} style={thumbnailStyles[iface.slug]}>
              <ThumbnailDecor slug={iface.slug} />
            </div>

            {/* Content */}
            <div className={styles.cardContent}>
              <div className={styles.cardName}>{iface.name}</div>
              <div className={styles.cardDescription}>{iface.description}</div>
              <span
                className={`${styles.cardBadge} ${
                  iface.mobileSupport === 'full'
                    ? styles.badgeFull
                    : iface.mobileSupport === 'partial'
                    ? styles.badgePartial
                    : ''
                }`}
              >
                {iface.mobileSupport === 'full' ? '📱 Mobile Ready' :
                 iface.mobileSupport === 'partial' ? '📱 Partial' : '🖥️ Desktop'}
              </span>
            </div>
          </motion.button>
        );
      })}
    </motion.div>
  );
}
