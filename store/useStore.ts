import { create } from 'zustand'
import { DSA_GRAPH } from '@/data/dsa-graph'
import { signInAnonymously, getCurrentUser, saveUserProfile, saveProgress, loadUserProfile, loadUserProgress } from '@/services/auth'

interface UserPreferences {
  wakeTime: string
  sleepTime: string
  dsaLevel: string
  onboardingComplete: boolean
  name?: string
}

interface AppState {
  user: any
  preferences: UserPreferences | null
  currentConcept: string
  completedConcepts: string[]
  completedPackets: string[]
  isLoading: boolean
  setUser: (user: any) => void
  setPreferences: (prefs: UserPreferences) => void
  completePacket: (packetId: string, conceptId: string) => void
  initializeApp: () => Promise<void>
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
  isLoading: true,

  setUser: (user) => set({ user }),

  setPreferences: async (preferences) => {
    set({ preferences })
    const { user } = get()
    if (user && preferences.name) {
      await saveUserProfile(user.id, {
        wakeTime: preferences.wakeTime,
        sleepTime: preferences.sleepTime,
        dsaLevel: preferences.dsaLevel,
        name: preferences.name || '',
      })
    }
  },

  completePacket: async (packetId, conceptId) => {
    const { completedPackets, completedConcepts, user } = get()

    if (completedPackets.includes(packetId)) return

    const newCompletedPackets = [...completedPackets, packetId]
    const conceptPackets = newCompletedPackets.filter(id => id.startsWith(conceptId))

    if (conceptPackets.length >= 5) {
      const newCompletedConcepts = [...completedConcepts, conceptId]
      const nextConcept = getNextConcept(newCompletedConcepts)
      set({
        completedPackets: newCompletedPackets,
        completedConcepts: newCompletedConcepts,
        currentConcept: nextConcept,
      })
      if (user) {
        await saveProgress(user.id, newCompletedConcepts, newCompletedPackets, nextConcept)
      }
    } else {
      set({ completedPackets: newCompletedPackets })
    }
  },

  initializeApp: async () => {
    try {
      set({ isLoading: true })

      // Sign in anonymously if no user
      let user = await getCurrentUser()
      if (!user) {
        const data = await signInAnonymously()
        user = data.user
      }

      set({ user })

      if (!user) {
        set({ isLoading: false })
        return
      }

      // Load saved profile
      const profile = await loadUserProfile(user.id)
      if (profile) {
        set({
          preferences: {
            wakeTime: profile.wake_time,
            sleepTime: profile.sleep_time,
            dsaLevel: profile.dsa_level,
            onboardingComplete: profile.onboarding_complete,
          }
        })
      }

      // Load saved progress
      const progress = await loadUserProgress(user.id)
      if (progress && progress.length > 0) {
        const completedConcepts = progress
          .filter((p: any) => p.status === 'completed')
          .map((p: any) => p.concept_id)

        const nextConcept = getNextConcept(completedConcepts)
        set({ completedConcepts, currentConcept: nextConcept })
      }

    } catch (error) {
      console.log('Init error:', error)
    } finally {
      set({ isLoading: false })
    }
  },
}))