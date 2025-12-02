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

// Helper to get interface by ID
export const getInterfaceById = (id: number): InterfaceConfig | undefined => {
  return interfaces.find((i) => i.id === id);
};
