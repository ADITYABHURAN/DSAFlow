import { supabase } from './supabase'

export async function signInAnonymously() {
  try {
    console.log('[auth] signInAnonymously called')
    console.log('[auth] Supabase URL:', process.env.EXPO_PUBLIC_SUPABASE_URL)
    const { data, error } = await supabase.auth.signInAnonymously()
    if (error) {
      console.error('[auth] signInAnonymously error:', error.message)
      throw error
    }
    console.log('[auth] Signed in user:', data.user?.id)
    return data
  } catch (err) {
    console.error('[auth] signInAnonymously threw:', err)
    throw err
  }
}

export async function getCurrentUser() {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  } catch (err) {
    console.error('[auth] getCurrentUser threw:', err)
    return null
  }
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
  // First ensure profile exists so foreign key constraint is satisfied
  await supabase
    .from('profiles')
    .upsert({ id: userId, onboarding_complete: false })

  // Then save progress
  if (completedConcepts.length === 0) return

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
  else console.log('[auth] Progress saved successfully!')
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