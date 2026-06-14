import { create } from 'zustand';

interface AppState {
  user: any | null;
  profile: any | null;
  setUser: (user: any) => void;
  setProfile: (profile: any) => void;
  logout: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  profile: null,
  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  logout: () => set({ user: null, profile: null }),
}));
