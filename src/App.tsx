// src/App.tsx

import { Suspense } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useStore } from './store/useStore';
import { interfaces } from './config/interfaces';
import DiceLanding from './components/core/DiceLanding';
import EntryLobby from './components/core/EntryLobby';
import Loader from './components/core/Loader';
import TransitionWrapper from './components/core/TransitionWrapper';
import BackButton from './components/core/BackButton';
import AudioToggle from './components/core/AudioToggle';

function App() {
  const { currentInterface } = useStore();

  // Find the active interface config
  // -1 means "show selection", null means "show dice landing"
  const activeInterface = currentInterface && currentInterface > 0
    ? interfaces.find((i) => i.id === currentInterface)
    : null;

  // Determine which screen to show
  const showDiceLanding = currentInterface === null;
  const showSelection = currentInterface === -1;
  const showInterface = currentInterface !== null && currentInterface > 0;

  return (
    <div className="w-screen h-screen overflow-hidden bg-black">
      {/* Global UI */}
      <AudioToggle />
      {showInterface && <BackButton />}

      {/* Main Content */}
      <AnimatePresence mode="wait">
        {showDiceLanding && (
          // Dice Landing (main entry)
          <TransitionWrapper key="dice-landing">
            <DiceLanding />
          </TransitionWrapper>
        )}

        {showSelection && (
          // Interface Selection (after skipping dice)
          <TransitionWrapper key="selection">
            <EntryLobby />
          </TransitionWrapper>
        )}

        {showInterface && activeInterface && (
          // Active Interface
          <TransitionWrapper key={`interface-${currentInterface}`}>
            <Suspense fallback={<Loader />}>
              <activeInterface.component />
            </Suspense>
          </TransitionWrapper>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
