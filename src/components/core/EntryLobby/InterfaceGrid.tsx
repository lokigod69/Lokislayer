// src/components/core/EntryLobby/InterfaceGrid.tsx

import { motion } from 'framer-motion';
import { useStore } from '../../../store/useStore';
import { interfaces } from '../../../config/interfaces';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

// Visual thumbnail styles for each interface (keyed by slug)
const thumbnailStyles: Record<string, React.CSSProperties> = {
  'neural-map': {
    background: 'radial-gradient(circle at 30% 40%, #8B5CF6 2px, transparent 2px), radial-gradient(circle at 70% 30%, #22C55E 2px, transparent 2px), radial-gradient(circle at 50% 70%, #3B82F6 2px, transparent 2px), radial-gradient(circle at 20% 60%, #EC4899 2px, transparent 2px), linear-gradient(135deg, #0a0a1a 0%, #1a1a2e 100%)',
  },
  'anatomical-map': {
    background: 'linear-gradient(135deg, #f4e4c8 0%, #d4c4a8 100%)',
    position: 'relative',
  },
  'retro-os': {
    background: 'linear-gradient(180deg, #008080 0%, #006666 100%)',
  },
  'pirate-broadcast': {
    background: 'repeating-linear-gradient(0deg, #111 0px, #111 2px, #222 2px, #222 4px), linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%)',
  },
  'control-room': {
    background: 'linear-gradient(135deg, #0f1419 0%, #1a2332 100%)',
  },
  'vending-machine': {
    background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a2e 100%)',
  },
};

// Thumbnail decorations (keyed by slug)
function ThumbnailDecor({ slug }: { slug: string }) {
  switch (slug) {
    case 'neural-map':
      return (
        <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 100 60">
          <line x1="30" y1="24" x2="70" y2="18" stroke="#8B5CF6" strokeWidth="0.5" />
          <line x1="30" y1="24" x2="50" y2="42" stroke="#22C55E" strokeWidth="0.5" />
          <line x1="70" y1="18" x2="50" y2="42" stroke="#3B82F6" strokeWidth="0.5" />
          <circle cx="30" cy="24" r="4" fill="#8B5CF6" />
          <circle cx="70" cy="18" r="4" fill="#22C55E" />
          <circle cx="50" cy="42" r="4" fill="#3B82F6" />
          <circle cx="20" cy="36" r="3" fill="#EC4899" />
        </svg>
      );
    case 'anatomical-map':
      return (
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 60">
          <ellipse cx="50" cy="15" rx="8" ry="10" stroke="#8b5a2b" strokeWidth="1" fill="none" />
          <line x1="50" y1="25" x2="50" y2="40" stroke="#8b5a2b" strokeWidth="1" />
          <line x1="35" y1="30" x2="50" y2="28" stroke="#8b5a2b" strokeWidth="1" />
          <line x1="65" y1="30" x2="50" y2="28" stroke="#8b5a2b" strokeWidth="1" />
          <line x1="45" y1="40" x2="40" y2="55" stroke="#8b5a2b" strokeWidth="1" />
          <line x1="55" y1="40" x2="60" y2="55" stroke="#8b5a2b" strokeWidth="1" />
          <circle cx="50" cy="30" r="15" stroke="#8b5a2b" strokeWidth="0.3" strokeDasharray="2,2" fill="none" opacity="0.5" />
        </svg>
      );
    case 'retro-os':
      return (
        <div className="absolute inset-1 flex flex-col gap-1">
          <div className="h-2 bg-blue-900 rounded-sm flex items-center px-1">
            <span className="text-[6px] text-white">Window</span>
          </div>
          <div className="flex-1 bg-white/80 rounded-sm p-1">
            <div className="w-4 h-4 bg-yellow-200 rounded-sm mb-1" />
            <div className="w-4 h-4 bg-blue-200 rounded-sm" />
          </div>
          <div className="h-2 bg-gray-400 rounded-sm" />
        </div>
      );
    case 'pirate-broadcast':
      return (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full border-2 border-gray-600 bg-gray-800 flex items-center justify-center">
            <div className="w-2 h-2 bg-green-500 rounded-full shadow-lg shadow-green-500/50" />
          </div>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[8px] text-green-500 font-mono">
            98.0 FM
          </div>
        </div>
      );
    case 'control-room':
      return (
        <div className="absolute inset-1 grid grid-cols-2 gap-1">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-800 rounded-sm border border-gray-600 flex items-center justify-center">
              <div className={`w-1.5 h-1.5 rounded-full ${i === 0 ? 'bg-green-500' : 'bg-gray-600'}`} />
            </div>
          ))}
        </div>
      );
    case 'vending-machine':
      return (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-10 h-14 bg-gray-800 rounded border border-cyan-500/30 flex flex-col p-1 gap-0.5">
            <div className="flex-1 grid grid-cols-2 gap-0.5">
              {['#8B5CF6', '#22C55E', '#3B82F6', '#F59E0B', '#EC4899', '#6366F1'].map((color, i) => (
                <div key={i} className="rounded-sm" style={{ background: color, opacity: 0.7 }} />
              ))}
            </div>
            <div className="h-2 bg-black rounded-sm" />
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
      className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 max-w-2xl w-full"
    >
      {interfaces.map((iface) => {
        const isVisited = visitedInterfaces.includes(iface.id);

        return (
          <motion.button
            key={iface.id}
            variants={itemVariants}
            onClick={() => setInterface(iface.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`
              relative rounded-xl transition-colors text-left overflow-hidden
              bg-white/5 hover:bg-white/10 border border-white/10
              ${isVisited ? 'border-purple-500/30' : ''}
            `}
          >
            {/* Thumbnail preview */}
            <div
              className="relative h-16 sm:h-20 overflow-hidden"
              style={thumbnailStyles[iface.slug]}
            >
              <ThumbnailDecor slug={iface.slug} />
            </div>

            {/* Content */}
            <div className="p-3 sm:p-4">
              {isVisited && (
                <span className="absolute top-2 right-2 text-xs text-purple-400 bg-black/50 px-1.5 py-0.5 rounded">
                  ✓
                </span>
              )}
              <div className="text-base sm:text-lg font-bold mb-1">{iface.name}</div>
              <div className="text-xs sm:text-sm text-gray-400 line-clamp-2">
                {iface.description}
              </div>
              <div className="mt-2 flex gap-2">
                <span className={`
                  text-xs px-2 py-0.5 rounded-full
                  ${iface.mobileSupport === 'full' ? 'bg-green-500/20 text-green-400' :
                    iface.mobileSupport === 'partial' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'}
                `}>
                  {iface.mobileSupport === 'full' ? '📱' :
                   iface.mobileSupport === 'partial' ? '📱' : '🖥️'}
                </span>
              </div>
            </div>
          </motion.button>
        );
      })}
    </motion.div>
  );
}
