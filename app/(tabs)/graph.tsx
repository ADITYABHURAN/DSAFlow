import { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Dimensions } from 'react-native'
import { DSA_GRAPH, getCategoryColor, DSANode } from '@/data/dsa-graph'
import { useStore } from '@/store/useStore'

const { width } = Dimensions.get('window')

export default function GraphScreen() {
  const { completedConcepts, currentConcept } = useStore()
  const [selectedNode, setSelectedNode] = useState<DSANode | null>(null)
  const [filter, setFilter] = useState<string>('all')

  const categories = ['all', 'basics', 'algorithms', 'data-structures']

  const getNodeStatus = (node: DSANode) => {
    if (completedConcepts.includes(node.id)) return 'completed'
    if (node.id === currentConcept) return 'current'
    const depsCompleted = node.dependencies.every(d => completedConcepts.includes(d))
    if (depsCompleted) return 'unlocked'
    return 'locked'
  }

  const getNodeStyle = (status: string) => {
    switch (status) {
      case 'completed': return { bg: '#0d2e23', border: '#6EE7B7', text: '#6EE7B7' }
      case 'current': return { bg: '#1a1a2e', border: '#93C5FD', text: '#93C5FD' }
      case 'unlocked': return { bg: '#1a1a1a', border: '#444', text: '#fff' }
      case 'locked': return { bg: '#0f0f0f', border: '#222', text: '#444' }
      default: return { bg: '#1a1a1a', border: '#444', text: '#fff' }
    }
  }

  const filteredNodes = DSA_GRAPH.filter(n =>
    filter === 'all' || n.category === filter
  )

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Knowledge Graph</Text>
          <Text style={styles.subtitle}>
            {completedConcepts.length} / {DSA_GRAPH.length} concepts completed
          </Text>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, {
              width: `${(completedConcepts.length / DSA_GRAPH.length) * 100}%`
            }]} />
          </View>
          <Text style={styles.progressText}>
            {Math.round((completedConcepts.length / DSA_GRAPH.length) * 100)}% mastered
          </Text>
        </View>

        {/* Filter Tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
          {categories.map(cat => (
            <TouchableOpacity
              key={cat}
              style={[styles.filterTab, filter === cat && styles.filterTabActive]}
              onPress={() => setFilter(cat)}
            >
              <Text style={[styles.filterText, filter === cat && styles.filterTextActive]}>
                {cat.charAt(0).toUpperCase() + cat.slice(1).replace('-', ' ')}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Legend */}
        <View style={styles.legend}>
          {[
            { color: '#6EE7B7', label: 'Completed' },
            { color: '#93C5FD', label: 'Current' },
            { color: '#fff', label: 'Unlocked' },
            { color: '#333', label: 'Locked' },
          ].map(item => (
            <View key={item.label} style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: item.color }]} />
              <Text style={styles.legendText}>{item.label}</Text>
            </View>
          ))}
        </View>

        {/* Nodes Grid */}
        <View style={styles.grid}>
          {filteredNodes.map(node => {
            const status = getNodeStatus(node)
            const nodeStyle = getNodeStyle(status)
            const isSelected = selectedNode?.id === node.id

            return (
              <TouchableOpacity
                key={node.id}
                style={[
                  styles.node,
                  {
                    backgroundColor: nodeStyle.bg,
                    borderColor: isSelected ? '#fff' : nodeStyle.border,
                    borderWidth: isSelected ? 2 : 1,
                  }
                ]}
                onPress={() => setSelectedNode(isSelected ? null : node)}
              >
                <View style={styles.nodeTop}>
                  <View style={[styles.categoryDot, { backgroundColor: getCategoryColor(node.category) }]} />
                  <Text style={styles.nodeDifficulty}>{'★'.repeat(node.difficulty)}</Text>
                </View>
                <Text style={[styles.nodeName, { color: nodeStyle.text }]}>{node.name}</Text>
                {status === 'completed' && <Text style={styles.nodeCheck}>✓</Text>}
                {status === 'current' && <Text style={styles.nodeCurrent}>●</Text>}
                {status === 'locked' && <Text style={styles.nodeLock}>🔒</Text>}
              </TouchableOpacity>
            )
          })}
        </View>

        {/* Selected Node Detail */}
        {selectedNode && (
          <View style={styles.detailCard}>
            <Text style={styles.detailName}>{selectedNode.name}</Text>
            <Text style={styles.detailDesc}>{selectedNode.description}</Text>
            {selectedNode.dependencies.length > 0 && (
              <View style={styles.detailDeps}>
                <Text style={styles.detailDepsLabel}>REQUIRES</Text>
                <View style={styles.depsRow}>
                  {selectedNode.dependencies.map(dep => {
                    const depNode = DSA_GRAPH.find(n => n.id === dep)
                    return (
                      <View key={dep} style={styles.depChip}>
                        <Text style={styles.depChipText}>{depNode?.name || dep}</Text>
                      </View>
                    )
                  })}
                </View>
              </View>
            )}
            <View style={styles.detailMeta}>
              <Text style={styles.detailMetaText}>
                Difficulty: {'★'.repeat(selectedNode.difficulty)}{'☆'.repeat(5 - selectedNode.difficulty)}
              </Text>
              <Text style={styles.detailMetaText}>
                Status: {getNodeStatus(selectedNode).toUpperCase()}
              </Text>
            </View>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  header: {
    padding: 20,
    paddingBottom: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 13,
    color: '#555',
    marginTop: 4,
  },
  progressContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#1a1a1a',
    borderRadius: 3,
    marginBottom: 6,
  },
  progressFill: {
    height: 6,
    backgroundColor: '#6EE7B7',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#555',
  },
  filterRow: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#111',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#222',
  },
  filterTabActive: {
    backgroundColor: '#6EE7B7',
    borderColor: '#6EE7B7',
  },
  filterText: {
    color: '#666',
    fontSize: 13,
  },
  filterTextActive: {
    color: '#0a0a0a',
    fontWeight: '600',
  },
  legend: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    color: '#555',
    fontSize: 11,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 10,
  },
  node: {
    width: (width - 52) / 2,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    minHeight: 90,
    justifyContent: 'space-between',
  },
  nodeTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  nodeDifficulty: {
    fontSize: 8,
    color: '#FCD34D',
  },
  nodeName: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  nodeCheck: {
    fontSize: 16,
    color: '#6EE7B7',
    marginTop: 6,
  },
  nodeCurrent: {
    fontSize: 12,
    color: '#93C5FD',
    marginTop: 6,
  },
  nodeLock: {
    fontSize: 12,
    marginTop: 6,
  },
  detailCard: {
    margin: 16,
    backgroundColor: '#111',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#6EE7B7',
  },
  detailName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  detailDesc: {
    fontSize: 14,
    color: '#aaa',
    lineHeight: 22,
    marginBottom: 16,
  },
  detailDeps: {
    marginBottom: 16,
  },
  detailDepsLabel: {
    fontSize: 10,
    color: '#6EE7B7',
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: 8,
  },
  depsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  depChip: {
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#333',
  },
  depChipText: {
    color: '#aaa',
    fontSize: 12,
  },
  detailMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailMetaText: {
    color: '#555',
    fontSize: 12,
  },
})