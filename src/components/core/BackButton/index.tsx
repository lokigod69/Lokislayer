// src/components/core/BackButton/index.tsx

import { useStore } from '../../../store/useStore';

export default function BackButton() {
  const { goToLobby } = useStore();

  return (
    <button
      onClick={goToLobby}
      className="fixed top-5 left-5 z-50 w-9 h-9 flex items-center justify-center text-white/40 hover:text-white/80 text-lg transition-all duration-300 hover:scale-110"
      title="Back to Portal"
    >
      ←
    </button>
  );
}
