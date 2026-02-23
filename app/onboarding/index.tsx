import { useState, useRef } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native'
import { router } from 'expo-router'
import { useStore } from '@/store/useStore'
import { schedulePacketNotifications } from '@/services/notifications'

const QUESTIONS = [
  { key: 'name', question: "Hey! What should I call you? 👋" },
  { key: 'wakeTime', question: "What time do you usually wake up? (e.g. 7:00 AM)" },
  { key: 'sleepTime', question: "What time do you sleep? (e.g. 11:00 PM)" },
  { key: 'dsaLevel', question: "How would you rate your DSA level?\n1 = Beginner  2 = Some basics  3 = Intermediate  4 = Advanced" },
  { key: 'goal', question: "What's your main goal? (e.g. crack FAANG, learn DSA, prep for interviews)" },
]

export default function Onboarding() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([
    { from: 'bot', text: "Hey! I'm DSAFlow. I'll help you learn DSA without ever feeling like you're studying. Let's get to know each other 🚀" },
    { from: 'bot', text: QUESTIONS[0].question },
  ])
  const setPreferences = useStore((s) => s.setPreferences)
  const scrollRef = useRef<ScrollView>(null)

  const handleSend = () => {
    if (!input.trim()) return

    const currentQ = QUESTIONS[currentQuestion]
    const newAnswers = { ...answers, [currentQ.key]: input.trim() }
    setAnswers(newAnswers)

    const newMessages = [
      ...messages,
      { from: 'user', text: input.trim() },
    ]

    setInput('')

    if (currentQuestion < QUESTIONS.length - 1) {
      const nextQ = currentQuestion + 1
      setCurrentQuestion(nextQ)
      setMessages([
        ...newMessages,
        { from: 'bot', text: QUESTIONS[nextQ].question },
      ])
    } else {
      setMessages([
        ...newMessages,
        { from: 'bot', text: `Perfect ${newAnswers.name}! Your DSA journey starts now. I'll send you bite-sized packets throughout your day 🎯` },
      ])

      setPreferences({
  wakeTime: newAnswers.wakeTime,
  sleepTime: newAnswers.sleepTime,
  dsaLevel: newAnswers.dsaLevel,
  onboardingComplete: true,
})

schedulePacketNotifications(newAnswers.wakeTime, newAnswers.sleepTime)

setTimeout(() => {
  router.replace('/(tabs)')
}, 2000)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inner}
      >
        <View style={styles.header}>
          <Text style={styles.logo}>DSAFlow</Text>
          <Text style={styles.subtitle}>Your DSA co-pilot</Text>
        </View>

        <ScrollView
          ref={scrollRef}
          style={styles.messages}
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.map((msg, i) => (
            <View
              key={i}
              style={[
                styles.bubble,
                msg.from === 'user' ? styles.userBubble : styles.botBubble,
              ]}
            >
              <Text style={[
                styles.bubbleText,
                msg.from === 'user' ? styles.userText : styles.botText,
              ]}>
                {msg.text}
              </Text>
            </View>
          ))}
        </ScrollView>

        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Type your answer..."
            placeholderTextColor="#666"
            onSubmitEditing={handleSend}
            returnKeyType="send"
          />
          <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
            <Text style={styles.sendText}>→</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  inner: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  logo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#6EE7B7',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  messages: {
    flex: 1,
    paddingBottom: 20,
  },
  bubble: {
    maxWidth: '80%',
    padding: 14,
    borderRadius: 18,
    marginBottom: 12,
  },
  botBubble: {
    backgroundColor: '#1a1a1a',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  userBubble: {
    backgroundColor: '#6EE7B7',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  bubbleText: {
    fontSize: 15,
    lineHeight: 22,
  },
  botText: {
    color: '#fff',
  },
  userText: {
    color: '#0a0a0a',
  },
  inputRow: {
    flexDirection: 'row',
    gap: 10,
    paddingBottom: 10,
  },
  input: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    color: '#fff',
    padding: 14,
    borderRadius: 12,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#333',
  },
  sendBtn: {
    backgroundColor: '#6EE7B7',
    width: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendText: {
    fontSize: 20,
    color: '#0a0a0a',
    fontWeight: 'bold',
  },
})