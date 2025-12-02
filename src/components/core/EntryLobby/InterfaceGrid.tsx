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
              relative p-3 sm:p-4 rounded-xl transition-colors text-left
              bg-white/5 hover:bg-white/10 border border-white/10
              ${isVisited ? 'border-purple-500/30' : ''}
            `}
          >
            {isVisited && (
              <span className="absolute top-2 right-2 text-xs text-purple-400">
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
                {iface.mobileSupport === 'full' ? '📱 Mobile' :
                 iface.mobileSupport === 'partial' ? '📱 Partial' : '🖥️ Desktop'}
              </span>
            </div>
          </motion.button>
        );
      })}
    </motion.div>
  );
}
