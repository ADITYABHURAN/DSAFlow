import { DarkTheme, ThemeProvider } from '@react-navigation/native'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useEffect } from 'react'
import { useStore } from '@/store/useStore'
import 'react-native-reanimated'

export const unstable_settings = {
  anchor: '(tabs)',
}

export default function RootLayout() {
  const initializeApp = useStore((s) => s.initializeApp)

  useEffect(() => {
    console.log('[RootLayout] useEffect fired, calling initializeApp...')
    initializeApp()
      .then(() => console.log('[RootLayout] initializeApp completed'))
      .catch((err) => console.error('[RootLayout] initializeApp failed:', err))
  }, [])

  return (
    <ThemeProvider value={DarkTheme}>
      <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="onboarding/index" options={{ headerShown: false }} />
      <Stack.Screen name="packet/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
      </Stack>
      <StatusBar style="light" />
    </ThemeProvider>
  )
}