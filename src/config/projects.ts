// src/config/projects.ts
// THE SOURCE OF TRUTH - All project data lives here

export interface Project {
  id: string;
  name: string;
  url: string;
  description: string;
  status: 'live' | 'coming-soon';
  theme: {
    primaryColor: string;
    icon: string;
  };
  mappings: {
    neuralMap: {
      position: { x: number; y: number };
      connections: string[];
    };
    anatomicalMap: {
      bodyPart: 'ear' | 'brain' | 'mouth' | 'hands' | 'eye' | 'heart';
    };
    retroOS: {
      iconType: 'media-player' | 'terminal' | 'folder' | 'sticky' | 'screensaver' | 'hidden';
      filename: string;
    };
    pirateBroadcast: {
      frequency: number;
    };
    controlRoom: {
      panelType: 'oscilloscope' | 'monitor' | 'typewriter' | 'clipboard' | 'radar' | 'tape-recorder';
    };
    vendingMachine: {
      slot: string;
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
      primaryColor: '#8B5CF6',
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
      primaryColor: '#22C55E',
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
      primaryColor: '#3B82F6',
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
      primaryColor: '#F59E0B',
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
      primaryColor: '#EC4899',
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
    url: '#',
    description: 'Audio series exploring psychoanalysis sessions',
    status: 'coming-soon',
    theme: {
      primaryColor: '#6366F1',
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

// Helper to get project by ID
export const getProjectById = (id: string): Project | undefined => {
  return projects.find((p) => p.id === id);
};
