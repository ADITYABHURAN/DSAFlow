# DSAFlow — Project Documentation
**Date:** February 22, 2026  
**Developer:** Aditya Bhuran  
**Project:** DSAFlow — A mobile app that applies distributed systems concepts to DSA learning

---

## What We Built

DSAFlow is a React Native mobile app that delivers DSA (Data Structures & Algorithms) concepts in bite-sized "packets" throughout your day — instead of requiring you to sit down for long study sessions. The core idea: treat your brain like a distributed system and send knowledge packets at the right moment, every day.

---

## The Core Idea

Instead of you going to study DSA, DSA comes to you. Every concept is broken into 5 packet types delivered throughout your day:

| Packet | Time | Purpose |
|--------|------|---------|
| 💡 Concept | Morning | The idea explained simply with an analogy |
| 👁️ Visual | Mid-morning | Interactive visualization of the concept |
| ⚡ Challenge | Afternoon | A single question to make you think |
| 🌍 Connection | Evening | Real world applications of the concept |
| 🧠 Recall | Night | Memory check before sleep |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Mobile Framework | React Native + Expo SDK 54 |
| Navigation | Expo Router (file-based) |
| State Management | Zustand |
| Backend / Database | Supabase (PostgreSQL) |
| Styling | React Native StyleSheet |
| Language | TypeScript |

---

## Project Structure
```
DSAFlow/
├── app/
│   ├── index.tsx                 # Entry point → redirects to onboarding
│   ├── _layout.tsx               # Root layout
│   ├── onboarding/
│   │   └── index.tsx             # Conversational onboarding screen
│   ├── (tabs)/
│   │   ├── _layout.tsx           # Tab bar configuration
│   │   ├── index.tsx             # Home screen
│   │   └── graph.tsx             # Knowledge graph screen
│   └── packet/
│       └── [id].tsx              # Dynamic packet screen
│
├── data/
│   ├── dsa-graph.ts              # All DSA concepts + dependency graph
│   └── packets.ts                # Packet content for each concept
│
├── store/
│   └── useStore.ts               # Zustand global state
│
├── services/
│   └── supabase.ts               # Supabase client
│
├── .env                          # Environment variables (never commit)
├── babel.config.js               # Babel configuration
└── tailwind.config.js            # Tailwind configuration
```

---

## Database Schema (Supabase)
```sql
-- User preferences saved from onboarding
profiles (
  id uuid,
  wake_time text,
  sleep_time text,
  focus_hours text[],
  dsa_level text,
  onboarding_complete boolean
)

-- Progress per concept
user_progress (
  id uuid,
  user_id uuid,
  concept_id text,
  status text,           -- locked / current / completed
  packets_completed text[]
)

-- Packet completion history
user_packets (
  id uuid,
  user_id uuid,
  concept_id text,
  packet_type text,
  scheduled_time timestamp,
  opened_at timestamp,
  completed_at timestamp,
  response text
)
```

---

## Features Built Today

### 1. Onboarding Conversation
- Chat-style UI — feels like talking to a friend
- 5 questions: name, wake time, sleep time, DSA level, goal
- Saves preferences to Zustand store
- Auto-scrolls as conversation grows
- Redirects to home after completion

### 2. Home Screen
- Displays today's concept
- Lists all 5 packets with type icons and duration
- Live progress bar — updates as packets are completed
- Stats row: streak, concepts done, interview readiness

### 3. Packet Screens (5 Types)
- **Concept** — explanation, analogy, key points
- **Visual** — interactive array visualization with index labels
- **Challenge** — multiple choice with green/red feedback, explanation revealed after answering
- **Connection** — real world examples of the concept
- **Recall** — question + answer + deeper explanation

### 4. Knowledge Graph
- Grid of all DSA concept nodes
- Color coded by status: green (completed), blue (current), white (unlocked), dark (locked)
- Filter by category: All, Basics, Algorithms, Data Structures
- Tap any node to see name, description, dependencies, difficulty
- Progress bar showing % of DSA mastered

### 5. Progress System
- Completing all 5 packets for a concept marks it as done
- Automatically unlocks the next concept based on dependency graph
- Graph updates in real time

---

## DSA Knowledge Graph

The app models DSA concepts as a dependency graph — you cannot learn Binary Search before Arrays, you cannot learn Trees before Linked Lists. The graph has 35+ concepts across 3 categories:

**Basics:** Arrays, Strings, Hash Maps  
**Algorithms:** Two Pointers, Sliding Window, Binary Search, Sorting, BFS, DFS, Backtracking, Greedy, Dynamic Programming (1D, 2D, Knapsack, Trees), Intervals, Bit Manipulation  
**Data Structures:** Linked List, Stack, Queue, Trees, BST, Heap, Graphs, Trie, Segment Tree, Union Find

---

## Zustand Store
```typescript
AppState {
  user: any
  preferences: UserPreferences | null
  currentConcept: string          // currently active concept
  completedConcepts: string[]     // fully completed concepts
  completedPackets: string[]      // individual packets completed

  setUser()
  setPreferences()
  completePacket(packetId, conceptId)  // marks packet done, unlocks next concept if all 5 done
}
```

---

## Environment Variables
```
EXPO_PUBLIC_SUPABASE_URL=your_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

Never commit `.env` to GitHub. It is already in `.gitignore`.

---

## Commands Reference
```bash
# Start development server
npx expo start

# Start with cache cleared (use when fixing errors)
npx expo start --clear

# Install Expo compatible packages
npx expo install <package-name>

# Install regular npm packages
npm install <package-name>
```

---

## What's Left to Build (v2)

| Feature | Priority | Notes |
|---------|----------|-------|
| Push Notifications | High | Schedule 5 packets based on wake/sleep time from onboarding |
| Auth (Supabase) | High | Save progress across devices and app restarts |
| More concept content | High | Currently only Arrays and Binary Search have full packets |
| Streak tracking | Medium | Track daily consistency |
| Interview readiness score | Medium | % based on concepts completed |
| Animated graph | Low | Upgrade to React Native Skia for visual connections between nodes |
| TestFlight / App Store | High | Needed for real users to install |

---

## Notification Scheduling Logic (To Build)
```
User wake time: 6:30 AM
User sleep time: 11:00 PM
Active window: 16.5 hours

Packet 1 — Concept    → 7:00 AM   (30 mins after wake)
Packet 2 — Visual     → 10:00 AM  (mid morning)
Packet 3 — Challenge  → 2:00 PM   (afternoon)
Packet 4 — Connection → 6:00 PM   (evening)
Packet 5 — Recall     → 9:30 PM   (90 mins before sleep)
```

Implementation: use `expo-notifications` with `scheduleNotificationAsync` and `CalendarTriggerInput`.

---

## Session Summary

**Started:** Fresh Expo project  
**Ended:** Fully working MVP on real iPhone with:
- Conversational onboarding
- 5 packet type screens
- Interactive challenge with feedback
- Knowledge graph with 35+ concepts
- Live progress tracking
- Concept unlocking system

---

*Built with DSAFlow : learning DSA the distributed way.*