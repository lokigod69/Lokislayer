// src/components/core/AudioToggle/index.tsx

import { useStore } from '../../../store/useStore';

export default function AudioToggle() {
  const { audioEnabled, toggleAudio } = useStore();

  return (
    <button
      onClick={toggleAudio}
      className="fixed bottom-4 right-4 z-50 w-10 h-10 flex items-center justify-center bg-black/40 hover:bg-black/60 text-white/60 hover:text-white rounded-full backdrop-blur-sm transition-all hover:scale-105 border border-white/10"
      title={audioEnabled ? 'Mute audio' : 'Unmute audio'}
    >
      {audioEnabled ? '🔊' : '🔇'}
    </button>
  );
}
