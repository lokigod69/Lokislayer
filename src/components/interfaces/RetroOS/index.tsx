// src/components/interfaces/RetroOS/index.tsx

import { useState, useCallback } from 'react';
import BootSequence from './BootSequence';
import Desktop from './Desktop';

export default function RetroOS() {
  const [booted, setBooted] = useState(false);

  const handleBootComplete = useCallback(() => {
    setBooted(true);
  }, []);

  return (
    <div className="w-full h-full">
      {!booted && <BootSequence onComplete={handleBootComplete} />}
      {booted && <Desktop />}
    </div>
  );
}
