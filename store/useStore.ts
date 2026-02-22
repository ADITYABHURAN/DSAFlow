import { create } from 'zustand'

interface UserPreferences {
  wakeTime: string
  sleepTime: string
  dsaLevel: string
  onboardingComplete: boolean
}

interface AppState {
  user: any
  preferences: UserPreferences | null
  currentConcept: string | null
  completedConcepts: string[]
  setUser: (user: any) => void
  setPreferences: (prefs: UserPreferences) => void
  setCurrentConcept: (concept: string) => void
  addCompletedConcept: (concept: string) => void
}

export const useStore = create<AppState>((set) => ({
  user: null,
  preferences: null,
  currentConcept: 'arrays',
  completedConcepts: [],
  setUser: (user) => set({ user }),
  setPreferences: (preferences) => set({ preferences }),
  setCurrentConcept: (concept) => set({ currentConcept: concept }),
  addCompletedConcept: (concept) =>
    set((state) => ({
      completedConcepts: [...state.completedConcepts, concept],
    })),
}))