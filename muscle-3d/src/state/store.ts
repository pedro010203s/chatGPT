import { create } from 'zustand'

export type Sex = 'male' | 'female'

type AppState = {
  sex: Sex
  playing: boolean
  speed: number
  hoveredPartName: string | null
  setSex: (sex: Sex) => void
  togglePlaying: () => void
  setPlaying: (value: boolean) => void
  setSpeed: (value: number) => void
  setHoveredPartName: (name: string | null) => void
}

export const useAppStore = create<AppState>((set) => ({
  sex: 'male',
  playing: true,
  speed: 1.0,
  hoveredPartName: null,
  setSex: (sex) => set({ sex }),
  togglePlaying: () => set((s) => ({ playing: !s.playing })),
  setPlaying: (value) => set({ playing: value }),
  setSpeed: (value) => set({ speed: value }),
  setHoveredPartName: (name) => set({ hoveredPartName: name }),
}))
