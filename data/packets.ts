export interface Packet {
  id: string
  conceptId: string
  type: 'concept' | 'visual' | 'challenge' | 'connection' | 'recall'
  title: string
  duration: number
  content: any
}

export const PACKETS: Packet[] = [
  // ─── ARRAYS ───────────────────────────────────────────
  {
    id: 'arrays-concept',
    conceptId: 'arrays',
    type: 'concept',
    title: 'What is an Array?',
    duration: 60,
    content: {
      explanation:
        'An array is a collection of items stored at contiguous memory locations. Think of it like a row of lockers — each locker has a number and you can instantly jump to any locker you want.',
      keyPoints: [
        'Fixed size in most languages',
        'O(1) access by index',
        'O(n) search without sorting',
        'Foundation of almost every other data structure',
      ],
      analogy:
        'Imagine a parking lot where every spot is numbered. You can drive directly to spot 42 without checking every spot first.',
    },
  },
  {
    id: 'arrays-visual',
    conceptId: 'arrays',
    type: 'visual',
    title: 'See Arrays in Action',
    duration: 90,
    content: {
      animation: 'arrays',
      instruction: 'Tap any element to highlight it and see its index',
      interactable: true,
      data: [3, 7, 1, 9, 4, 6, 2, 8],
    },
  },
  {
    id: 'arrays-challenge',
    conceptId: 'arrays',
    type: 'challenge',
    title: 'Quick Challenge',
    duration: 300,
    content: {
      question:
        'Given array [2, 4, 6, 8, 10], what is the value at index 3?',
      options: ['6', '8', '4', '10'],
      correct: '8',
      explanation:
        'Arrays are zero indexed. Index 0=2, 1=4, 2=6, 3=8, 4=10. So index 3 is 8.',
    },
  },
  {
    id: 'arrays-connection',
    conceptId: 'arrays',
    type: 'connection',
    title: 'Arrays in the Real World',
    duration: 60,
    content: {
      examples: [
        {
          title: 'Your Instagram Feed',
          description:
            'Every post in your feed is stored in an array. Scrolling down is just iterating through it.',
        },
        {
          title: 'Spotify Queue',
          description:
            'Your music queue is an array. Skip is just moving to the next index.',
        },
        {
          title: 'Excel Spreadsheet',
          description:
            'Every row in Excel is an array of cells. Every column too.',
        },
      ],
    },
  },
  {
    id: 'arrays-recall',
    conceptId: 'arrays',
    type: 'recall',
    title: 'Memory Check',
    duration: 60,
    content: {
      question: 'What is the time complexity of accessing an element by index in an array?',
      answer: 'O(1) — Constant time',
      followUp:
        'Because arrays store elements in contiguous memory, the computer can calculate the exact memory address instantly using: base address + (index × element size)',
    },
  },

  // ─── BINARY SEARCH ───────────────────────────────────
  {
    id: 'binary-search-concept',
    conceptId: 'binary-search',
    type: 'concept',
    title: 'What is Binary Search?',
    duration: 60,
    content: {
      explanation:
        'Binary search is a way to find an item in a sorted list by repeatedly cutting the search space in half. Instead of checking every element, you always check the middle.',
      keyPoints: [
        'Only works on sorted arrays',
        'O(log n) time complexity',
        'Divide and conquer approach',
        'Used everywhere in real systems',
      ],
      analogy:
        'Imagine guessing a number between 1 and 100. The smart strategy is always guess 50 first. Too high? Guess 25. Too low? Guess 75. You find it in at most 7 guesses.',
    },
  },
  {
    id: 'binary-search-visual',
    conceptId: 'binary-search',
    type: 'visual',
    title: 'Watch Binary Search',
    duration: 90,
    content: {
      animation: 'binary-search',
      instruction: 'Tap Next to step through each iteration',
      interactable: true,
      data: [1, 3, 5, 7, 9, 11, 13, 15, 17, 19],
      target: 13,
    },
  },
  {
    id: 'binary-search-challenge',
    conceptId: 'binary-search',
    type: 'challenge',
    title: 'Binary Search Challenge',
    duration: 300,
    content: {
      question:
        'In array [1, 3, 5, 7, 9], how many steps does binary search take to find 7?',
      options: ['1 step', '2 steps', '3 steps', '4 steps'],
      correct: '2 steps',
      explanation:
        'Step 1: Check middle element 5. 7 > 5 so search right half. Step 2: Check middle of [7,9] which is 7. Found it!',
    },
  },
  {
    id: 'binary-search-connection',
    conceptId: 'binary-search',
    type: 'connection',
    title: 'Binary Search Everywhere',
    duration: 60,
    content: {
      examples: [
        {
          title: 'Git Bisect',
          description:
            'Git uses binary search to find which commit introduced a bug. It cuts the commit history in half each time.',
        },
        {
          title: 'Database Indexes',
          description:
            'When you search a database, it uses binary search on indexed columns to find rows instantly.',
        },
        {
          title: 'Dictionary',
          description:
            'Opening a physical dictionary to the middle and deciding left or right is literally binary search.',
        },
      ],
    },
  },
  {
    id: 'binary-search-recall',
    conceptId: 'binary-search',
    type: 'recall',
    title: 'Memory Check',
    duration: 60,
    content: {
      question: 'What is the prerequisite for binary search to work?',
      answer: 'The array must be sorted',
      followUp:
        'Without sorting, you cannot determine which half to discard. Sorting is what makes the divide and conquer strategy valid.',
    },
  },
]

export const getPacketsForConcept = (conceptId: string): Packet[] => {
  return PACKETS.filter((p) => p.conceptId === conceptId)
}

export const getPacketById = (id: string): Packet | undefined => {
  return PACKETS.find((p) => p.id === id)
}