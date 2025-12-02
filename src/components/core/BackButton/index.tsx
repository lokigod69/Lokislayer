// src/components/core/BackButton/index.tsx

import { useStore } from '../../../store/useStore';

export default function BackButton() {
  const { goToLobby } = useStore();

  return (
    <button
      onClick={goToLobby}
      className="fixed top-4 left-4 z-50 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg backdrop-blur-sm transition-all hover:scale-105 border border-white/10"
    >
      ← Back to Lobby
    </button>
  );
}
