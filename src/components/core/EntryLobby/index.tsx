// src/components/core/EntryLobby/index.tsx

import { useStore } from '../../../store/useStore';
import InterfaceGrid from './InterfaceGrid';
import Dice from './Dice';
import styles from './styles.module.css';

export default function EntryLobby() {
  const { setInterface } = useStore();

  return (
    <div className={`w-full h-full flex flex-col items-center justify-center bg-black text-white p-4 sm:p-8 ${styles.lobby}`}>
      {/* Background effect */}
      <div className={styles.backgroundGlow} />

      {/* Title */}
      <h1 className="text-3xl sm:text-5xl font-bold mb-2 sm:mb-4 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent text-center">
        The Poly-Interface Portal
      </h1>
      <p className="text-gray-400 mb-8 sm:mb-12 text-center max-w-md text-sm sm:text-base">
        Choose your reality. Roll the dice or select your experience.
      </p>

      {/* Main Actions */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8 sm:mb-12 w-full max-w-md sm:max-w-none sm:w-auto">
        <Dice />
        <button
          onClick={() => setInterface(1)}
          className="px-6 sm:px-8 py-3 sm:py-4 bg-white/10 hover:bg-white/20 rounded-xl text-lg sm:text-xl font-bold transition-all hover:scale-105 border border-white/10 backdrop-blur-sm"
        >
          🧠 Enter Neural Map
        </button>
      </div>

      {/* Interface Grid */}
      <h2 className="text-lg sm:text-xl text-gray-400 mb-4">Or choose your reality:</h2>
      <InterfaceGrid />
    </div>
  );
}
