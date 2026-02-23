import { supabase } from './supabase'

export async function signInAnonymously() {
  const { data, error } = await supabase.auth.signInAnonymously()
  if (error) throw error
  return data
}

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function saveUserProfile(userId: string, preferences: {
  wakeTime: string
  sleepTime: string
  dsaLevel: string
  name: string
}) {
  const { error } = await supabase
    .from('profiles')
    .upsert({
      id: userId,
      wake_time: preferences.wakeTime,
      sleep_time: preferences.sleepTime,
      dsa_level: preferences.dsaLevel,
      onboarding_complete: true,
    })

  if (error) throw error
}

export async function saveProgress(userId: string, completedConcepts: string[], completedPackets: string[], currentConcept: string) {
  const { error } = await supabase
    .from('user_progress')
    .upsert(
      completedConcepts.map(conceptId => ({
        user_id: userId,
        concept_id: conceptId,
        status: 'completed',
      }))
    )

  if (error) console.log('Progress save error:', error)
}

export async function loadUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) return null
  return data
}

export async function loadUserProgress(userId: string) {
  const { data, error } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', userId)

  if (error) return []
  return data
}