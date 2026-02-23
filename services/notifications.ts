import * as Notifications from 'expo-notifications'
import { Platform } from 'react-native'

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
})

export async function requestNotificationPermission(): Promise<boolean> {
  const { status: existingStatus } = await Notifications.getPermissionsAsync()
  let finalStatus = existingStatus

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync()
    finalStatus = status
  }

  return finalStatus === 'granted'
}

function parseTime(timeStr: string): { hour: number; minute: number } {
  // Handles formats like "7:00 AM", "11:00 PM", "7:30 AM"
  const clean = timeStr.trim().toUpperCase()
  const [timePart, period] = clean.split(' ')
  const [hourStr, minuteStr] = timePart.split(':')
  let hour = parseInt(hourStr)
  const minute = parseInt(minuteStr || '0')

  if (period === 'PM' && hour !== 12) hour += 12
  if (period === 'AM' && hour === 12) hour = 0

  return { hour, minute }
}

function calculatePacketTimes(wakeTime: string, sleepTime: string) {
  const wake = parseTime(wakeTime)
  const sleep = parseTime(sleepTime)

  // Active window in minutes
  const wakeMinutes = wake.hour * 60 + wake.minute
  const sleepMinutes = sleep.hour * 60 + sleep.minute
  const activeWindow = sleepMinutes - wakeMinutes

  // Distribute 5 packets across the active window
  const slots = [0.1, 0.3, 0.5, 0.7, 0.9]

  return slots.map((ratio, i) => {
    const totalMinutes = wakeMinutes + Math.floor(ratio * activeWindow)
    const hour = Math.floor(totalMinutes / 60)
    const minute = totalMinutes % 60
    return { hour, minute, index: i }
  })
}

const PACKET_NOTIFICATIONS = [
  {
    title: '💡 Time to learn',
    body: "Today's concept is ready. 60 seconds is all it takes.",
  },
  {
    title: '👁️ See it in action',
    body: 'Your visual packet is ready. Watch the algorithm move.',
  },
  {
    title: '⚡ Quick challenge',
    body: 'One question. Can you get it right?',
  },
  {
    title: '🌍 Real world connection',
    body: "See where today's concept lives in the real world.",
  },
  {
    title: '🧠 Before you sleep',
    body: 'One last recall. Lock in what you learned today.',
  },
]

export async function schedulePacketNotifications(
  wakeTime: string,
  sleepTime: string
) {
  // Cancel all existing notifications first
  await Notifications.cancelAllScheduledNotificationsAsync()

  const hasPermission = await requestNotificationPermission()
  if (!hasPermission) return false

  const packetTimes = calculatePacketTimes(wakeTime, sleepTime)

  for (const slot of packetTimes) {
    const notification = PACKET_NOTIFICATIONS[slot.index]

    await Notifications.scheduleNotificationAsync({
      content: {
        title: notification.title,
        body: notification.body,
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: slot.hour,
        minute: slot.minute,
      },
    })
  }

  return true
}

export async function cancelAllNotifications() {
  await Notifications.cancelAllScheduledNotificationsAsync()
}