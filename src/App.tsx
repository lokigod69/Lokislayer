// src/App.tsx

import { Suspense } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useStore } from './store/useStore';
import { interfaces } from './config/interfaces';
import EntryLobby from './components/core/EntryLobby';
import Loader from './components/core/Loader';
import TransitionWrapper from './components/core/TransitionWrapper';
import BackButton from './components/core/BackButton';
import AudioToggle from './components/core/AudioToggle';

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
          // Entry Lobby (Dice + Selection)
          <TransitionWrapper key="lobby">
            <EntryLobby />
          </TransitionWrapper>
        ) : (
          // Active Interface
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
