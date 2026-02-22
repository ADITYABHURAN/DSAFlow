import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native'
import { useLocalSearchParams, router } from 'expo-router'
import { getPacketById } from '@/data/packets'
import { useState } from 'react'
import { useStore } from '@/store/useStore'

export default function PacketScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const packet = getPacketById(id)
  const completePacket = useStore((s) => s.completePacket)

  if (!packet) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Packet not found</Text>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>

        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <View style={styles.typeBadge}>
            <Text style={styles.typeText}>{packet.type.toUpperCase()}</Text>
          </View>
        </View>

        <Text style={styles.title}>{packet.title}</Text>
        <Text style={styles.duration}>~{packet.duration} seconds</Text>

        {packet.type === 'concept' && <ConceptContent content={packet.content} />}
        {packet.type === 'visual' && <VisualContent content={packet.content} />}
        {packet.type === 'challenge' && <ChallengeContent content={packet.content} />}
        {packet.type === 'connection' && <ConnectionContent content={packet.content} />}
        {packet.type === 'recall' && <RecallContent content={packet.content} />}

        <TouchableOpacity
          style={styles.doneBtn}
          onPress={() => {
            completePacket(packet.id, packet.conceptId)
            router.back()
          }}
        >
          <Text style={styles.doneBtnText}>Mark Complete ✓</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  )
}

function ConceptContent({ content }: { content: any }) {
  return (
    <View>
      <View style={styles.card}>
        <Text style={styles.cardLabel}>EXPLANATION</Text>
        <Text style={styles.cardText}>{content.explanation}</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.cardLabel}>ANALOGY</Text>
        <Text style={styles.cardText}>{content.analogy}</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.cardLabel}>KEY POINTS</Text>
        {content.keyPoints.map((point: string, i: number) => (
          <View key={i} style={styles.bulletRow}>
            <Text style={styles.bullet}>→</Text>
            <Text style={styles.bulletText}>{point}</Text>
          </View>
        ))}
      </View>
    </View>
  )
}

function VisualContent({ content }: { content: any }) {
  return (
    <View>
      <View style={styles.card}>
        <Text style={styles.cardLabel}>INSTRUCTION</Text>
        <Text style={styles.cardText}>{content.instruction}</Text>
      </View>
      <View style={styles.visualBox}>
        {content.data.map((num: number, i: number) => (
          <View key={i} style={styles.arrayCell}>
            <Text style={styles.arrayCellText}>{num}</Text>
            <Text style={styles.arrayIndex}>{i}</Text>
          </View>
        ))}
      </View>
      <Text style={styles.visualHint}>Each box is an element. The number below is its index.</Text>
    </View>
  )
}

function ChallengeContent({ content }: { content: any }) {
  const [selected, setSelected] = useState<string | null>(null)

  return (
    <View>
      <View style={styles.card}>
        <Text style={styles.cardLabel}>QUESTION</Text>
        <Text style={styles.cardText}>{content.question}</Text>
      </View>
      {content.options.map((option: string, i: number) => {
        const isSelected = selected === option
        const isCorrect = option === content.correct
        const showResult = selected !== null

        let borderColor = '#333'
        let backgroundColor = '#111'
        if (showResult && isCorrect) {
          borderColor = '#6EE7B7'
          backgroundColor = '#0d2e23'
        } else if (showResult && isSelected && !isCorrect) {
          borderColor = '#F87171'
          backgroundColor = '#2e0d0d'
        }

        return (
          <TouchableOpacity
            key={i}
            style={[styles.optionBtn, { borderColor, backgroundColor }]}
            onPress={() => { if (!selected) setSelected(option) }}
          >
            <Text style={styles.optionText}>{option}</Text>
            {showResult && isCorrect && <Text style={styles.optionResult}>✓ Correct</Text>}
            {showResult && isSelected && !isCorrect && <Text style={[styles.optionResult, { color: '#F87171' }]}>✗ Wrong</Text>}
          </TouchableOpacity>
        )
      })}
      {selected && (
        <View style={[styles.card, { marginTop: 16 }]}>
          <Text style={styles.cardLabel}>EXPLANATION</Text>
          <Text style={styles.cardText}>{content.explanation}</Text>
        </View>
      )}
    </View>
  )
}

function ConnectionContent({ content }: { content: any }) {
  return (
    <View>
      {content.examples.map((ex: any, i: number) => (
        <View key={i} style={styles.card}>
          <Text style={styles.cardLabel}>{ex.title.toUpperCase()}</Text>
          <Text style={styles.cardText}>{ex.description}</Text>
        </View>
      ))}
    </View>
  )
}

function RecallContent({ content }: { content: any }) {
  return (
    <View>
      <View style={styles.card}>
        <Text style={styles.cardLabel}>QUESTION</Text>
        <Text style={styles.cardText}>{content.question}</Text>
      </View>
      <View style={[styles.card, { borderColor: '#6EE7B7', borderWidth: 1 }]}>
        <Text style={styles.cardLabel}>ANSWER</Text>
        <Text style={[styles.cardText, { color: '#6EE7B7', fontWeight: '600' }]}>{content.answer}</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.cardLabel}>WHY?</Text>
        <Text style={styles.cardText}>{content.followUp}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  scroll: { flex: 1, padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, paddingTop: 10 },
  backBtn: { padding: 4 },
  backText: { color: '#6EE7B7', fontSize: 16 },
  typeBadge: { backgroundColor: '#1a1a1a', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: '#333' },
  typeText: { color: '#6EE7B7', fontSize: 11, fontWeight: '700', letterSpacing: 2 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginBottom: 6 },
  duration: { fontSize: 13, color: '#555', marginBottom: 28 },
  card: { backgroundColor: '#111', borderRadius: 16, padding: 18, marginBottom: 14, borderWidth: 1, borderColor: '#1e1e1e' },
  cardLabel: { fontSize: 10, color: '#6EE7B7', fontWeight: '700', letterSpacing: 2, marginBottom: 10 },
  cardText: { fontSize: 15, color: '#ccc', lineHeight: 24 },
  bulletRow: { flexDirection: 'row', marginBottom: 8 },
  bullet: { color: '#6EE7B7', marginRight: 8, fontSize: 15 },
  bulletText: { color: '#ccc', fontSize: 15, flex: 1 },
  visualBox: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, backgroundColor: '#111', borderRadius: 16, padding: 20, marginBottom: 14, justifyContent: 'center' },
  arrayCell: { width: 48, height: 56, backgroundColor: '#1a1a1a', borderRadius: 10, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#6EE7B7' },
  arrayCellText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  arrayIndex: { color: '#555', fontSize: 10, marginTop: 2 },
  visualHint: { color: '#555', fontSize: 12, textAlign: 'center', marginBottom: 14 },
  optionBtn: { backgroundColor: '#111', borderRadius: 12, padding: 16, marginBottom: 10, borderWidth: 1, borderColor: '#333' },
  optionText: { color: '#fff', fontSize: 15 },
  optionResult: { fontSize: 12, color: '#6EE7B7', marginTop: 4, fontWeight: '600' },
  errorText: { color: '#fff', fontSize: 16, textAlign: 'center', marginTop: 100 },
  doneBtn: { backgroundColor: '#6EE7B7', borderRadius: 14, padding: 18, alignItems: 'center', marginTop: 10, marginBottom: 40 },
  doneBtnText: { color: '#0a0a0a', fontSize: 16, fontWeight: 'bold' },
})