import { create } from 'zustand'
import { DSA_GRAPH } from '@/data/dsa-graph'

interface UserPreferences {
  wakeTime: string
  sleepTime: string
  dsaLevel: string
  onboardingComplete: boolean
}

interface AppState {
  user: any
  preferences: UserPreferences | null
  currentConcept: string
  completedConcepts: string[]
  completedPackets: string[]
  setUser: (user: any) => void
  setPreferences: (prefs: UserPreferences) => void
  completePacket: (packetId: string, conceptId: string) => void
}

const getNextConcept = (completedConcepts: string[]): string => {
  const next = DSA_GRAPH.find(node => {
    if (completedConcepts.includes(node.id)) return false
    return node.dependencies.every(dep => completedConcepts.includes(dep))
  })
  return next?.id || 'arrays'
}

export const useStore = create<AppState>((set, get) => ({
  user: null,
  preferences: null,
  currentConcept: 'arrays',
  completedConcepts: [],
  completedPackets: [],
  setUser: (user) => set({ user }),
  setPreferences: (preferences) => set({ preferences }),
  completePacket: (packetId, conceptId) => {
    const { completedPackets, completedConcepts } = get()

    if (completedPackets.includes(packetId)) return

    const newCompletedPackets = [...completedPackets, packetId]

    // Check if all 5 packets for this concept are done
    const conceptPackets = newCompletedPackets.filter(id => id.startsWith(conceptId))

    if (conceptPackets.length >= 5) {
      const newCompletedConcepts = [...completedConcepts, conceptId]
      const nextConcept = getNextConcept(newCompletedConcepts)
      set({
        completedPackets: newCompletedPackets,
        completedConcepts: newCompletedConcepts,
        currentConcept: nextConcept,
      })
    } else {
      set({ completedPackets: newCompletedPackets })
    }
  },
}))