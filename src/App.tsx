// src/App.tsx

import { Suspense } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useStore } from './store/useStore';
import { interfaces } from './config/interfaces';

// Placeholder components (will be replaced in Phase 1)
function Loader() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-black">
      <div className="text-white text-xl animate-pulse">Loading...</div>
    </div>
  );
}

function BackButton() {
  const { goToLobby } = useStore();
  return (
    <button
      onClick={goToLobby}
      className="fixed top-4 left-4 z-50 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg backdrop-blur-sm transition-colors"
    >
      ← Back
    </button>
  );
}

function AudioToggle() {
  const { audioEnabled, toggleAudio } = useStore();
  return (
    <button
      onClick={toggleAudio}
      className="fixed top-4 right-4 z-50 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg backdrop-blur-sm transition-colors"
    >
      {audioEnabled ? '🔊' : '🔇'}
    </button>
  );
}

function EntryLobby() {
  const { setInterface, rollDice } = useStore();

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-black text-white p-8">
      <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
        The Poly-Interface Portal
      </h1>
      <p className="text-gray-400 mb-12 text-center max-w-md">
        Choose your reality. Roll the dice or select your experience.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 mb-12">
        <button
          onClick={() => rollDice()}
          className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-xl font-bold hover:scale-105 transition-transform"
        >
          🎲 Roll the Dice
        </button>
        <button
          onClick={() => setInterface(1)}
          className="px-8 py-4 bg-white/10 hover:bg-white/20 rounded-xl text-xl font-bold transition-colors"
        >
          🧠 Enter Neural Map
        </button>
      </div>

      <h2 className="text-xl text-gray-400 mb-4">Or choose your reality:</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-2xl">
        {interfaces.map((iface) => (
          <button
            key={iface.id}
            onClick={() => setInterface(iface.id)}
            className="p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-colors text-left"
          >
            <div className="text-lg font-bold">{iface.name}</div>
            <div className="text-sm text-gray-400">{iface.description}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

// Transition wrapper component
const transitionVariants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 1.05 },
};

function TransitionWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={transitionVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="w-full h-full"
    >
      {children}
    </motion.div>
  );
}

function App() {
  const { currentInterface } = useStore();

  // Find the active interface config
  const activeInterface = currentInterface
    ? interfaces.find((i) => i.id === currentInterface)
    : null;

  return (
    <div className="w-screen h-screen overflow-hidden bg-black">
      {/* Global UI */}
      <AudioToggle />
      {currentInterface && <BackButton />}

      {/* Main Content */}
      <AnimatePresence mode="wait">
        {!currentInterface ? (
          <TransitionWrapper key="lobby">
            <EntryLobby />
          </TransitionWrapper>
        ) : (
          <TransitionWrapper key={`interface-${currentInterface}`}>
            <Suspense fallback={<Loader />}>
              {activeInterface && <activeInterface.component />}
            </Suspense>
          </TransitionWrapper>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
