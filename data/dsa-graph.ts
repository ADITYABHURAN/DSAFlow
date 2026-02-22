export interface DSANode {
  id: string
  name: string
  difficulty: 1 | 2 | 3 | 4 | 5
  category: string
  dependencies: string[]
  description: string
}

export const DSA_GRAPH: DSANode[] = [
  // Basics
  {
    id: 'arrays',
    name: 'Arrays',
    difficulty: 1,
    category: 'basics',
    dependencies: [],
    description: 'The foundation of all data structures',
  },
  {
    id: 'strings',
    name: 'Strings',
    difficulty: 1,
    category: 'basics',
    dependencies: [],
    description: 'Sequences of characters and manipulation',
  },
  {
    id: 'hashmaps',
    name: 'Hash Maps',
    difficulty: 2,
    category: 'basics',
    dependencies: ['arrays'],
    description: 'Key value storage with O(1) lookup',
  },
  {
    id: 'two-pointers',
    name: 'Two Pointers',
    difficulty: 2,
    category: 'algorithms',
    dependencies: ['arrays'],
    description: 'Efficient array traversal technique',
  },
  {
    id: 'sliding-window',
    name: 'Sliding Window',
    difficulty: 2,
    category: 'algorithms',
    dependencies: ['arrays'],
    description: 'Subarray and substring problems',
  },
  {
    id: 'binary-search',
    name: 'Binary Search',
    difficulty: 2,
    category: 'algorithms',
    dependencies: ['arrays'],
    description: 'Divide and conquer search in sorted arrays',
  },
  {
    id: 'linked-list',
    name: 'Linked List',
    difficulty: 2,
    category: 'data-structures',
    dependencies: ['arrays'],
    description: 'Dynamic linear data structure with pointers',
  },
  {
    id: 'stack',
    name: 'Stack',
    difficulty: 2,
    category: 'data-structures',
    dependencies: ['arrays'],
    description: 'LIFO data structure',
  },
  {
    id: 'queue',
    name: 'Queue',
    difficulty: 2,
    category: 'data-structures',
    dependencies: ['arrays'],
    description: 'FIFO data structure',
  },
  {
    id: 'recursion',
    name: 'Recursion',
    difficulty: 3,
    category: 'algorithms',
    dependencies: ['arrays'],
    description: 'Functions that call themselves',
  },
  {
    id: 'trees',
    name: 'Binary Trees',
    difficulty: 3,
    category: 'data-structures',
    dependencies: ['linked-list', 'recursion'],
    description: 'Hierarchical data structure with nodes',
  },
  {
    id: 'bst',
    name: 'Binary Search Tree',
    difficulty: 3,
    category: 'data-structures',
    dependencies: ['trees', 'binary-search'],
    description: 'Sorted binary tree for efficient search',
  },
  {
    id: 'heap',
    name: 'Heap / Priority Queue',
    difficulty: 3,
    category: 'data-structures',
    dependencies: ['trees'],
    description: 'Complete binary tree for min/max operations',
  },

  // Intermediate Algorithms
  {
    id: 'sorting',
    name: 'Sorting Algorithms',
    difficulty: 2,
    category: 'algorithms',
    dependencies: ['arrays', 'recursion'],
    description: 'Merge sort, quick sort, and other comparison sorts',
  },
  {
    id: 'backtracking',
    name: 'Backtracking',
    difficulty: 3,
    category: 'algorithms',
    dependencies: ['recursion'],
    description: 'Explore all possibilities and prune invalid paths',
  },

  // Graphs
  {
    id: 'graphs',
    name: 'Graphs',
    difficulty: 3,
    category: 'data-structures',
    dependencies: ['hashmaps', 'recursion'],
    description: 'Nodes connected by edges, adjacency list/matrix',
  },
  {
    id: 'bfs',
    name: 'Breadth-First Search',
    difficulty: 3,
    category: 'algorithms',
    dependencies: ['graphs', 'queue'],
    description: 'Level-order traversal of graphs and trees',
  },
  {
    id: 'dfs',
    name: 'Depth-First Search',
    difficulty: 3,
    category: 'algorithms',
    dependencies: ['graphs', 'stack', 'recursion'],
    description: 'Deep traversal of graphs and trees',
  },
  {
    id: 'topological-sort',
    name: 'Topological Sort',
    difficulty: 4,
    category: 'algorithms',
    dependencies: ['graphs', 'dfs'],
    description: 'Linear ordering of vertices in a DAG',
  },
  {
    id: 'dijkstra',
    name: "Dijkstra's Algorithm",
    difficulty: 4,
    category: 'algorithms',
    dependencies: ['graphs', 'heap'],
    description: 'Shortest path in weighted graphs',
  },
  {
    id: 'union-find',
    name: 'Union Find / Disjoint Set',
    difficulty: 4,
    category: 'data-structures',
    dependencies: ['graphs'],
    description: 'Track connected components efficiently',
  },

  // Advanced Data Structures
  {
    id: 'trie',
    name: 'Trie',
    difficulty: 3,
    category: 'data-structures',
    dependencies: ['strings', 'trees'],
    description: 'Prefix tree for efficient string operations',
  },
  {
    id: 'segment-tree',
    name: 'Segment Tree',
    difficulty: 4,
    category: 'data-structures',
    dependencies: ['trees', 'recursion'],
    description: 'Range query and update operations',
  },

  // Dynamic Programming
  {
    id: 'dp-1d',
    name: '1D Dynamic Programming',
    difficulty: 3,
    category: 'algorithms',
    dependencies: ['recursion', 'arrays'],
    description: 'Optimal substructure with single dimension state',
  },
  {
    id: 'dp-2d',
    name: '2D Dynamic Programming',
    difficulty: 4,
    category: 'algorithms',
    dependencies: ['dp-1d'],
    description: 'Grid-based and two-state DP problems',
  },
  {
    id: 'dp-knapsack',
    name: 'Knapsack Problems',
    difficulty: 4,
    category: 'algorithms',
    dependencies: ['dp-1d'],
    description: 'Subset selection with constraints',
  },
  {
    id: 'dp-trees',
    name: 'DP on Trees',
    difficulty: 5,
    category: 'algorithms',
    dependencies: ['dp-1d', 'trees', 'dfs'],
    description: 'Dynamic programming on tree structures',
  },

  // Advanced Algorithms
  {
    id: 'greedy',
    name: 'Greedy Algorithms',
    difficulty: 3,
    category: 'algorithms',
    dependencies: ['sorting', 'heap'],
    description: 'Locally optimal choices for global optimum',
  },
  {
    id: 'intervals',
    name: 'Intervals',
    difficulty: 3,
    category: 'algorithms',
    dependencies: ['sorting', 'arrays'],
    description: 'Merge, insert, and schedule interval problems',
  },
  {
    id: 'bit-manipulation',
    name: 'Bit Manipulation',
    difficulty: 3,
    category: 'algorithms',
    dependencies: ['arrays'],
    description: 'Bitwise operations and tricks',
  },
  {
    id: 'math-geometry',
    name: 'Math & Geometry',
    difficulty: 3,
    category: 'algorithms',
    dependencies: ['arrays'],
    description: 'Number theory, GCD, modular arithmetic, geometry',
  },

  // Expert Level
  {
    id: 'mst',
    name: 'Minimum Spanning Tree',
    difficulty: 4,
    category: 'algorithms',
    dependencies: ['graphs', 'union-find', 'heap'],
    description: "Kruskal's and Prim's algorithms",
  },
  {
    id: 'network-flow',
    name: 'Network Flow',
    difficulty: 5,
    category: 'algorithms',
    dependencies: ['graphs', 'bfs'],
    description: 'Max flow / min cut problems',
  },
  {
    id: 'string-matching',
    name: 'Advanced String Matching',
    difficulty: 5,
    category: 'algorithms',
    dependencies: ['strings', 'dp-2d'],
    description: 'KMP, Rabin-Karp, and suffix arrays',
  },
]

export const getCategoryColor = (category: string): string => {
  switch (category) {
    case 'basics': return '#6EE7B7'
    case 'algorithms': return '#93C5FD'
    case 'data-structures': return '#FCA5A5'
    default: return '#888'
  }
}
  