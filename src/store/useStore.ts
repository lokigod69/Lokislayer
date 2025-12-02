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
