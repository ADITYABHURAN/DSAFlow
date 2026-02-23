import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native'
import { useEffect } from 'react'
import { router } from 'expo-router'
import { useStore } from '@/store/useStore'
import { getPacketsForConcept } from '@/data/packets'

const PACKET_ICONS: Record<string, string> = {
  concept: '💡',
  visual: '👁️',
  challenge: '⚡',
  connection: '🌍',
  recall: '🧠',
}

const PACKET_LABELS: Record<string, string> = {
  concept: 'Concept',
  visual: 'Visual',
  challenge: 'Challenge',
  connection: 'Connection',
  recall: 'Recall',
}

export default function HomeScreen() {
  const { currentConcept, preferences, completedPackets, isLoading } = useStore()
  const packets = getPacketsForConcept(currentConcept || 'arrays')
  const completedCount = packets.filter(p => completedPackets.includes(p.id)).length

  useEffect(() => {
    if (!isLoading && preferences && !preferences.onboardingComplete) {
      router.replace('/onboarding')
    }
  }, [isLoading, preferences])

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: '#6EE7B7', fontSize: 18 }}>Loading...</Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>

        <View style={styles.header}>
          <Text style={styles.greeting}>Good morning 👋</Text>
          <Text style={styles.tagline}>Your DSA packets are ready</Text>
        </View>

        <View style={styles.conceptCard}>
          <Text style={styles.conceptLabel}>TODAY'S CONCEPT</Text>
          <Text style={styles.conceptName}>
            {currentConcept ? currentConcept.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : 'Arrays'}
          </Text>
          <Text style={styles.conceptSub}>5 packets · ~15 mins total</Text>

          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${(completedCount / 5) * 100}%` }]} />
          </View>
          <Text style={styles.progressText}>{completedCount} of 5 packets completed</Text>
        </View>

        <Text style={styles.sectionTitle}>Today's Packets</Text>

        {packets.map((packet) => (
          <TouchableOpacity
            key={packet.id}
            style={styles.packetRow}
            onPress={() => router.push(`/packet/${packet.id}`)}
          >
            <View style={styles.packetIcon}>
              <Text style={styles.packetEmoji}>{PACKET_ICONS[packet.type]}</Text>
            </View>
            <View style={styles.packetInfo}>
              <Text style={styles.packetTitle}>{packet.title}</Text>
              <Text style={styles.packetMeta}>{PACKET_LABELS[packet.type]} · {packet.duration}s</Text>
            </View>
            <Text style={styles.packetArrow}>›</Text>
          </TouchableOpacity>
        ))}

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{useStore.getState().completedConcepts.length}</Text>
            <Text style={styles.statLabel}>Concepts Done</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {Math.round((useStore.getState().completedConcepts.length / 35) * 100)}%
            </Text>
            <Text style={styles.statLabel}>Interview Ready</Text>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  scroll: {
    flex: 1,
    padding: 20,
  },
  header: {
    paddingTop: 10,
    marginBottom: 24,
  },
  greeting: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
  },
  tagline: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  conceptCard: {
    backgroundColor: '#111',
    borderRadius: 20,
    padding: 20,
    marginBottom: 28,
    borderWidth: 1,
    borderColor: '#222',
  },
  conceptLabel: {
    fontSize: 11,
    color: '#6EE7B7',
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: 8,
  },
  conceptName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  conceptSub: {
    fontSize: 13,
    color: '#666',
    marginBottom: 16,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#222',
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: 4,
    backgroundColor: '#6EE7B7',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    color: '#555',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
  },
  packetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111',
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#1e1e1e',
  },
  packetIcon: {
    width: 44,
    height: 44,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  packetEmoji: {
    fontSize: 20,
  },
  packetInfo: {
    flex: 1,
  },
  packetTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 3,
  },
  packetMeta: {
    fontSize: 12,
    color: '#555',
  },
  packetArrow: {
    fontSize: 22,
    color: '#444',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 24,
    marginBottom: 40,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#111',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1e1e1e',
  },
  statNumber: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#6EE7B7',
  },
  statLabel: {
    fontSize: 11,
    color: '#555',
    marginTop: 4,
    textAlign: 'center',
  },
})