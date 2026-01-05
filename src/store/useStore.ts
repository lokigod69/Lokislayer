// src/store/useStore.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getRandomInterfaceId } from '../config/interfaces';

// Navigation source type - tracks where user entered an interface from
type NavigationSource = 'dice' | 'selection' | null;

interface AppState {
  // Current active interface (null = entry lobby)
  currentInterface: number | null;

  // Track where user entered interface from (for back navigation)
  navigationSource: NavigationSource;

  // Loading state for lazy components
  isLoading: boolean;

  // Audio settings
  audioEnabled: boolean;

  // Track visited interfaces for potential "collect them all" feature
  visitedInterfaces: number[];

  // Actions
  setInterface: (id: number | null, source?: NavigationSource) => void;
  rollDice: () => number;
  setLoading: (loading: boolean) => void;
  toggleAudio: () => void;
  goToLobby: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentInterface: null,
      navigationSource: null,
      isLoading: false,
      audioEnabled: false,
      visitedInterfaces: [],

      setInterface: (id, source) => {
        const visited = get().visitedInterfaces;
        set({
          currentInterface: id,
          navigationSource: source ?? null,
          visitedInterfaces: id && !visited.includes(id)
            ? [...visited, id]
            : visited,
        });
      },

      rollDice: () => {
        const newId = getRandomInterfaceId();
        get().setInterface(newId, 'dice');
        return newId;
      },

      setLoading: (loading) => set({ isLoading: loading }),

      toggleAudio: () => set((state) => ({ audioEnabled: !state.audioEnabled })),

      goToLobby: () => {
        const source = get().navigationSource;
        set({ 
          currentInterface: source === 'dice' ? null : -1,
          navigationSource: null,
        });
      },
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
