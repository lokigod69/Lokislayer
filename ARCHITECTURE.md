# 🏗️ ARCHITECTURE.md
## Technical Blueprint for The Poly-Interface Portal

---

## 📦 TECH STACK

### Core Framework
```
React 18+ with Vite
```
**Why React + Vite?**
- Vite: Fastest build tool, instant HMR, optimal production bundles
- React: Component isolation, excellent 3D/animation ecosystem, lazy loading support
- No Next.js needed—pure frontend, no SSR required

### Language
```
TypeScript
```
**Why TypeScript?**
- Strict typing for project data across 6 wildly different interface files
- Better IDE support and refactoring
- Catches errors before runtime

### 3D Engine
```
Three.js via React Three Fiber (R3F) + Drei
```
**Usage:**
- Vending Machine (3D scene)
- Dice roller (physics)
- Neural Map nodes (optional 3D enhancement)
- Shape Constellation (if added later)

**Supporting Libraries:**
- `@react-three/fiber` — React renderer for Three.js
- `@react-three/drei` — Useful helpers (OrbitControls, Html overlay, etc.)
- `@react-three/cannon` — Physics for dice roll

### Animation
```
Framer Motion + GSAP
```
**Framer Motion:**
- UI transitions between interfaces
- Hover effects, drags, shared layout animations
- Entry/exit animations

**GSAP:**
- Complex timelines (tape loading, dial spinning)
- Physics-like tweens
- Precise control for mechanical animations

### State Management
```
Zustand
```
**Why Zustand?**
- Minimal (~1KB), no boilerplate
- Perfect for simple global state
- Easy to understand and debug

**State Shape:**
```typescript
interface StoreState {
  currentInterface: InterfaceId | null;  // Which interface is active
  isLoading: boolean;                     // Loading state for lazy components
  audioEnabled: boolean;                  // Sound toggle
  visitedInterfaces: InterfaceId[];       // Track which ones user has seen
  setInterface: (id: InterfaceId) => void;
  rollDice: () => InterfaceId;
}
```

### Styling
```
Tailwind CSS + CSS Modules
```
**Tailwind:**
- Rapid layout and spacing
- Responsive utilities
- Consistent design tokens

**CSS Modules:**
- Scoped styles per interface (no conflicts)
- Retro effects (CRT scanlines, glitch) isolated
- Each interface has its own `.module.css`

### Audio (Optional)
```
Howler.js
```
- Lazy-loaded
- Static, clicks, ambient sounds
- User-controlled mute (off by default)

---

## 📁 FOLDER STRUCTURE
```
src/
├── assets/
│   ├── models/          # GLB/GLTF files (vending machine, dice)
│   ├── textures/        # Images, patterns, backgrounds
│   ├── sounds/          # Audio files (optional)
│   ├── fonts/           # Bitmap fonts, retro typefaces
│   └── icons/           # Favicons, project icons
│
├── config/
│   ├── projects.ts      # 🔑 THE SOURCE OF TRUTH
│   └── interfaces.ts    # Interface metadata & lazy imports
│
├── store/
│   └── useStore.ts      # Zustand global state
│
├── components/
│   ├── core/
│   │   ├── EntryLobby/         # Dice roller + interface selector
│   │   │   ├── index.tsx
│   │   │   ├── Dice.tsx        # 3D dice component
│   │   │   ├── InterfaceGrid.tsx
│   │   │   └── styles.module.css
│   │   ├── Loader/             # Loading states
│   │   ├── TransitionWrapper/  # Framer AnimatePresence wrapper
│   │   ├── AudioToggle/        # Mute button
│   │   └── BackButton/         # Return to lobby
│   │
│   ├── shared/
│   │   ├── ProjectLink/        # Reusable link launcher
│   │   ├── ProjectPreview/     # Hover preview component
│   │   └── Portal/             # Wormhole/transition effect
│   │
│   └── interfaces/
│       ├── NeuralMap/
│       │   ├── index.tsx
│       │   ├── Node.tsx
│       │   ├── Connections.tsx
│       │   └── styles.module.css
│       │
│       ├── AnatomicalMap/
│       │   ├── index.tsx
│       │   ├── BodySVG.tsx
│       │   ├── OrganOverlay.tsx
│       │   └── styles.module.css
│       │
│       ├── RetroOS/
│       │   ├── index.tsx
│       │   ├── Desktop.tsx
│       │   ├── Window.tsx
│       │   ├── Icon.tsx
│       │   ├── StartMenu.tsx
│       │   ├── BootSequence.tsx
│       │   └── styles.module.css
│       │
│       ├── PirateBroadcast/
│       │   ├── index.tsx
│       │   ├── RadioDial.tsx
│       │   ├── SignalVisualizer.tsx
│       │   └── styles.module.css
│       │
│       ├── ControlRoom/
│       │   ├── index.tsx
│       │   ├── Panel.tsx
│       │   ├── Toggle.tsx
│       │   ├── Dial.tsx
│       │   ├── CRTMonitor.tsx
│       │   └── styles.module.css
│       │
│       └── VendingMachine/
│           ├── index.tsx
│           ├── Scene.tsx         # R3F Canvas
│           ├── Machine.tsx       # 3D model
│           ├── Product.tsx       # Falling item
│           ├── Keypad.tsx        # Button overlay
│           └── styles.module.css
│
├── hooks/
│   ├── useProjects.ts    # Hook to access project data
│   ├── useInterface.ts   # Hook for interface switching
│   └── useAudio.ts       # Audio management hook
│
├── utils/
│   ├── transitions.ts    # Framer Motion variants
│   ├── audio.ts          # Howler wrappers
│   └── analytics.ts      # Simple tracking (localStorage)
│
├── types/
│   └── index.ts          # TypeScript interfaces
│
├── App.tsx               # Root component
├── main.tsx              # Vite entry
└── index.css             # Global styles + Tailwind
```

---

## 🔑 THE SOURCE OF TRUTH: projects.ts

This single file controls all project data. Every interface reads from here.
```typescript
// src/config/projects.ts

export interface Project {
  id: string;
  name: string;
  url: string;
  description: string;
  status: 'live' | 'coming-soon';
  theme: {
    primaryColor: string;
    icon: string;  // Path to icon asset
  };
  // Interface-specific mappings
  mappings: {
    neuralMap: {
      position: { x: number; y: number };
      connections: string[];  // IDs of connected projects
    };
    anatomicalMap: {
      bodyPart: 'ear' | 'brain' | 'mouth' | 'hands' | 'eye' | 'heart';
    };
    retroOS: {
      iconType: 'media-player' | 'terminal' | 'folder' | 'sticky' | 'screensaver' | 'hidden';
      filename: string;
    };
    pirateBroadcast: {
      frequency: number;  // 88.1, 92.5, etc.
    };
    controlRoom: {
      panelType: 'oscilloscope' | 'monitor' | 'typewriter' | 'clipboard' | 'radar' | 'tape-recorder';
    };
    vendingMachine: {
      slot: string;       // "A1", "B2", etc.
      productType: 'cassette' | 'pill-bottle' | 'spellbook' | 'coin' | 'viewmaster' | 'vhs';
    };
  };
}

export const projects: Project[] = [
  {
    id: 'lokitunes',
    name: 'LokiTunes',
    url: 'https://lokitunes.art',
    description: 'Music app with 3D orbs—browse and rate pre-samples',
    status: 'live',
    theme: {
      primaryColor: '#8B5CF6',  // Purple
      icon: '/icons/lokitunes.svg',
    },
    mappings: {
      neuralMap: { position: { x: -200, y: 0 }, connections: ['vocapp', 'crym'] },
      anatomicalMap: { bodyPart: 'ear' },
      retroOS: { iconType: 'media-player', filename: 'LokiTunes.exe' },
      pirateBroadcast: { frequency: 88.1 },
      controlRoom: { panelType: 'oscilloscope' },
      vendingMachine: { slot: 'A1', productType: 'cassette' },
    },
  },
  {
    id: 'matrixarena',
    name: 'Matrix Arena',
    url: 'https://matrixarena.pro',
    description: 'LLM debate arena with red pill / blue pill aesthetic',
    status: 'live',
    theme: {
      primaryColor: '#22C55E',  // Matrix green
      icon: '/icons/matrixarena.svg',
    },
    mappings: {
      neuralMap: { position: { x: 200, y: -100 }, connections: ['vocapp'] },
      anatomicalMap: { bodyPart: 'brain' },
      retroOS: { iconType: 'terminal', filename: 'MATRIX.cmd' },
      pirateBroadcast: { frequency: 92.5 },
      controlRoom: { panelType: 'monitor' },
      vendingMachine: { slot: 'A2', productType: 'pill-bottle' },
    },
  },
  {
    id: 'vocapp',
    name: 'VocApp',
    url: 'https://vocapp.xyz',
    description: 'AI-powered vocabulary learning with visual grids',
    status: 'live',
    theme: {
      primaryColor: '#3B82F6',  // Blue
      icon: '/icons/vocapp.svg',
    },
    mappings: {
      neuralMap: { position: { x: 0, y: 150 }, connections: ['lokitunes', 'matrixarena'] },
      anatomicalMap: { bodyPart: 'mouth' },
      retroOS: { iconType: 'folder', filename: 'Language_DB' },
      pirateBroadcast: { frequency: 96.3 },
      controlRoom: { panelType: 'typewriter' },
      vendingMachine: { slot: 'B1', productType: 'spellbook' },
    },
  },
  {
    id: 'bountyhunter',
    name: 'BountyHunter',
    url: 'https://bountyhunter.xyz',
    description: 'Task exchange for friends and couples—earn rewards',
    status: 'live',
    theme: {
      primaryColor: '#F59E0B',  // Gold
      icon: '/icons/bountyhunter.svg',
    },
    mappings: {
      neuralMap: { position: { x: -150, y: -150 }, connections: ['crym'] },
      anatomicalMap: { bodyPart: 'hands' },
      retroOS: { iconType: 'sticky', filename: 'Bounties.txt' },
      pirateBroadcast: { frequency: 101.7 },
      controlRoom: { panelType: 'clipboard' },
      vendingMachine: { slot: 'B2', productType: 'coin' },
    },
  },
  {
    id: 'crym',
    name: 'Crym.space',
    url: 'https://crym.space',
    description: '3D NFT gallery—walk through rooms and portals',
    status: 'live',
    theme: {
      primaryColor: '#EC4899',  // Pink
      icon: '/icons/crym.svg',
    },
    mappings: {
      neuralMap: { position: { x: 150, y: 100 }, connections: ['lokitunes', 'bountyhunter'] },
      anatomicalMap: { bodyPart: 'eye' },
      retroOS: { iconType: 'screensaver', filename: 'Gallery3D.scr' },
      pirateBroadcast: { frequency: 105.9 },
      controlRoom: { panelType: 'radar' },
      vendingMachine: { slot: 'C1', productType: 'viewmaster' },
    },
  },
  {
    id: 'podcast',
    name: 'Psychoanalysis Podcast',
    url: '#',  // Coming soon
    description: 'Audio series exploring psychoanalysis sessions',
    status: 'coming-soon',
    theme: {
      primaryColor: '#6366F1',  // Indigo
      icon: '/icons/podcast.svg',
    },
    mappings: {
      neuralMap: { position: { x: 0, y: -200 }, connections: ['matrixarena'] },
      anatomicalMap: { bodyPart: 'heart' },
      retroOS: { iconType: 'hidden', filename: 'Subconscious' },
      pirateBroadcast: { frequency: 108.0 },
      controlRoom: { panelType: 'tape-recorder' },
      vendingMachine: { slot: 'C2', productType: 'vhs' },
    },
  },
];
```

### Adding a New Project
1. Add new object to the `projects` array
2. Fill in all `mappings` for each interface
3. **Done** — All 6 interfaces automatically include it

---

## 🎰 INTERFACES CONFIG: interfaces.ts
```typescript
// src/config/interfaces.ts

import { lazy, ComponentType } from 'react';

export interface InterfaceConfig {
  id: number;
  slug: string;
  name: string;
  description: string;
  thumbnail: string;
  component: React.LazyExoticComponent<ComponentType>;
  complexity: 'low' | 'medium' | 'high';
  mobileSupport: 'full' | 'partial' | 'desktop-only';
}

export const interfaces: InterfaceConfig[] = [
  {
    id: 1,
    slug: 'neural-map',
    name: 'Neural Map',
    description: 'Consciousness network of pulsing nodes',
    thumbnail: '/thumbs/neural-map.png',
    component: lazy(() => import('../components/interfaces/NeuralMap')),
    complexity: 'medium',
    mobileSupport: 'full',
  },
  {
    id: 2,
    slug: 'anatomical-map',
    name: 'Anatomical Map',
    description: 'Da Vinci-style body exploration',
    thumbnail: '/thumbs/anatomical-map.png',
    component: lazy(() => import('../components/interfaces/AnatomicalMap')),
    complexity: 'medium',
    mobileSupport: 'full',
  },
  {
    id: 3,
    slug: 'retro-os',
    name: 'Retro OS',
    description: 'Windows 95 desktop experience',
    thumbnail: '/thumbs/retro-os.png',
    component: lazy(() => import('../components/interfaces/RetroOS')),
    complexity: 'medium',
    mobileSupport: 'partial',
  },
  {
    id: 4,
    slug: 'pirate-broadcast',
    name: 'Pirate Broadcast',
    description: 'Tune into clandestine frequencies',
    thumbnail: '/thumbs/pirate-broadcast.png',
    component: lazy(() => import('../components/interfaces/PirateBroadcast')),
    complexity: 'medium',
    mobileSupport: 'full',
  },
  {
    id: 5,
    slug: 'control-room',
    name: 'Control Room',
    description: '1970s sci-fi command center',
    thumbnail: '/thumbs/control-room.png',
    component: lazy(() => import('../components/interfaces/ControlRoom')),
    complexity: 'medium',
    mobileSupport: 'full',
  },
  {
    id: 6,
    slug: 'vending-machine',
    name: 'Vending Machine',
    description: 'Vaporwave product dispenser',
    thumbnail: '/thumbs/vending-machine.png',
    component: lazy(() => import('../components/interfaces/VendingMachine')),
    complexity: 'high',
    mobileSupport: 'partial',
  },
];

// Helper to get random interface ID (for dice roll)
export const getRandomInterfaceId = (): number => {
  return Math.floor(Math.random() * interfaces.length) + 1;
};
```

---

## 🔄 STATE MANAGEMENT: useStore.ts
```typescript
// src/store/useStore.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getRandomInterfaceId } from '../config/interfaces';

interface AppState {
  // Current active interface (null = entry lobby)
  currentInterface: number | null;
  
  // Loading state for lazy components
  isLoading: boolean;
  
  // Audio settings
  audioEnabled: boolean;
  
  // Track visited interfaces for potential "collect them all" feature
  visitedInterfaces: number[];
  
  // Actions
  setInterface: (id: number | null) => void;
  rollDice: () => number;
  setLoading: (loading: boolean) => void;
  toggleAudio: () => void;
  goToLobby: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentInterface: null,
      isLoading: false,
      audioEnabled: false,
      visitedInterfaces: [],

      setInterface: (id) => {
        const visited = get().visitedInterfaces;
        set({
          currentInterface: id,
          visitedInterfaces: id && !visited.includes(id) 
            ? [...visited, id] 
            : visited,
        });
      },

      rollDice: () => {
        const newId = getRandomInterfaceId();
        get().setInterface(newId);
        return newId;
      },

      setLoading: (loading) => set({ isLoading: loading }),

      toggleAudio: () => set((state) => ({ audioEnabled: !state.audioEnabled })),

      goToLobby: () => set({ currentInterface: null }),
    }),
    {
      name: 'poly-interface-storage',
      partialize: (state) => ({
        audioEnabled: state.audioEnabled,
        visitedInterfaces: state.visitedInterfaces,
      }),
    }
  )
);
```

---

## 🎬 APP COMPONENT STRUCTURE
```typescript
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
  const { currentInterface, isLoading } = useStore();

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
```

---

## 🎲 DICE ROLL MECHANISM
```typescript
// src/components/core/EntryLobby/Dice.tsx

import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { RigidBody, Physics } from '@react-three/rapier';
import { useStore } from '../../../store/useStore';

// Simplified dice component
function DiceModel({ onRollComplete }: { onRollComplete: (face: number) => void }) {
  const meshRef = useRef();
  const [isRolling, setIsRolling] = useState(false);

  const handleClick = () => {
    if (isRolling) return;
    setIsRolling(true);
    
    // Apply random impulse for realistic tumble
    // After settling, determine face-up value
    setTimeout(() => {
      const face = Math.floor(Math.random() * 6) + 1;
      onRollComplete(face);
      setIsRolling(false);
    }, 2000);
  };

  return (
    <mesh ref={meshRef} onClick={handleClick}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={isRolling ? '#ff6b6b' : '#ffffff'} />
    </mesh>
  );
}

export function Dice() {
  const { setInterface } = useStore();

  const handleRollComplete = (face: number) => {
    // Transition to the rolled interface
    setInterface(face);
  };

  return (
    <div className="w-64 h-64">
      <Canvas camera={{ position: [0, 2, 5] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Physics>
          <DiceModel onRollComplete={handleRollComplete} />
        </Physics>
      </Canvas>
    </div>
  );
}
```

---

## 🔌 SHARED COMPONENTS

### ProjectLink — Universal Project Launcher
```typescript
// src/components/shared/ProjectLink/index.tsx

import { motion } from 'framer-motion';
import { Project } from '../../../config/projects';

interface ProjectLinkProps {
  project: Project;
  children: React.ReactNode;
  transitionEffect?: 'wormhole' | 'glitch' | 'fade';
}

export function ProjectLink({ 
  project, 
  children, 
  transitionEffect = 'fade' 
}: ProjectLinkProps) {
  
  const handleClick = () => {
    // Play transition animation
    // Then open link in new tab
    window.open(project.url, '_blank');
  };

  return (
    <motion.button
      onClick={handleClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      disabled={project.status === 'coming-soon'}
      className="cursor-pointer"
    >
      {children}
    </motion.button>
  );
}
```

### TransitionWrapper — Smooth Interface Switches
```typescript
// src/components/core/TransitionWrapper/index.tsx

import { motion } from 'framer-motion';

const variants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 1.05 },
};

export default function TransitionWrapper({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return (
    <motion.div
      variants={variants}
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
```

---

## ⚡ PERFORMANCE OPTIMIZATION

### Code Splitting
Each interface is lazy-loaded. User only downloads code for the interface they're viewing.
```typescript
// Automatic with React.lazy()
const NeuralMap = lazy(() => import('./components/interfaces/NeuralMap'));
```

### Asset Management
- **3D Models**: Store in `/public/models/` or external CDN (Cloudflare R2, AWS S3)
- **Large assets**: Keep out of Git repo if >50MB total
- **Compression**: Use GLB (binary GLTF) for 3D, WebP for images, OGG for audio

### Mobile Detection
```typescript
// src/hooks/useIsMobile.ts
export function useIsMobile() {
  return window.innerWidth < 768 || 
         /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}
```

### Conditional Loading
```typescript
// In VendingMachine component
const isMobile = useIsMobile();

if (isMobile) {
  return <VendingMachine2D />; // Simplified version
}
return <VendingMachine3D />; // Full WebGL version
```

---

## 🚀 DEPLOYMENT

### Recommended: Vercel
- Zero config deployment
- Free SSL
- Global CDN
- Connect to GitHub for auto-deploys

### Build Command
```bash
npm run build
# or
pnpm build
```

### Output
```
dist/
├── index.html
├── assets/
│   ├── index-[hash].js      # Main bundle (keep < 150KB gzipped)
│   ├── NeuralMap-[hash].js  # Lazy chunk
│   ├── RetroOS-[hash].js    # Lazy chunk
│   └── ...
```

### Environment Variables
```env
# .env (if needed)
VITE_GA_ID=your-analytics-id  # Optional analytics
```

---

## 📊 INTERFACE COMPLEXITY REFERENCE

| Interface | Tech Stack | Key Challenges | Est. Dev Time |
|-----------|------------|----------------|---------------|
| Neural Map | Canvas/SVG + Framer | Organic pulsing, connections | 2-3 days |
| Anatomical Map | SVG + clip-paths | Asset creation, masking | 2-3 days |
| Retro OS | React + CSS | Z-index management, drags | 2-3 days |
| Pirate Broadcast | Canvas + Web Audio | Audio permissions, dial UX | 2-3 days |
| Control Room | CSS/SVG + Framer | Asset weight, many elements | 3-4 days |
| Vending Machine | R3F + Drei + Physics | 3D performance, mobile fallback | 4-5 days |

**Total estimated: 3-4 weeks** for all 6 interfaces (solo developer)

---

## 🧩 ADDING NEW INTERFACES

1. Create folder: `src/components/interfaces/NewInterface/`
2. Create `index.tsx` with default export
3. Add to `src/config/interfaces.ts`:
```typescript
   {
     id: 7,
     slug: 'new-interface',
     name: 'New Interface',
     component: lazy(() => import('../components/interfaces/NewInterface')),
     // ...
   }
```
4. Update dice to be D8 (or whatever) if needed
5. **Done** — New interface appears in selection grid and dice pool

---

## 📝 TYPESCRIPT TYPES
```typescript
// src/types/index.ts

export type InterfaceId = 1 | 2 | 3 | 4 | 5 | 6;

export type ProjectId = 
  | 'lokitunes' 
  | 'matrixarena' 
  | 'vocapp' 
  | 'bountyhunter' 
  | 'crym' 
  | 'podcast';

export type BodyPart = 
  | 'ear' 
  | 'brain' 
  | 'mouth' 
  | 'hands' 
  | 'eye' 
  | 'heart';

export type ControlPanelType = 
  | 'oscilloscope' 
  | 'monitor' 
  | 'typewriter' 
  | 'clipboard' 
  | 'radar' 
  | 'tape-recorder';

export type VendingProductType = 
  | 'cassette' 
  | 'pill-bottle' 
  | 'spellbook' 
  | 'coin' 
  | 'viewmaster' 
  | 'vhs';
```

---

*Document 2 of 3: ARCHITECTURE.md*  
*Previous: PROJECT_VISION.md — What we're building and why*  
*Next: IMPLEMENTATION_PHASES.md — Step-by-step build order*