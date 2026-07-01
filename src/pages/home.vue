<template>
  <div class="flex flex-col px-3 md:px-8 py-4 md:py-6 space-y-4 md:space-y-5 font-mono">

    <!-- Command Input -->
    <div class="cmd-input-wrapper rounded-xl border border-[#1e2530] bg-card p-3 md:p-4 transition-all">
      <div class="flex items-center gap-2 md:gap-3">
        <img :src="taskIcon" class="shrink-0 icon-indigo" width="16" height="16" alt="" />
        <input v-model="cmdValue" @input="parseCmd" @keydown.enter="submitCmd" type="text"
          placeholder="Fix bug #frontend !high @me due tomorrow"
          class="flex-1 min-w-0 bg-transparent text-gray-300 placeholder-gray-600 text-xs md:text-sm outline-none" />
        <kbd class="hidden sm:inline-block px-2 py-1 text-[10px] text-gray-500 border border-[#30363d] rounded bg-[#0d1117] shrink-0">
          ENTER
        </kbd>
      </div>

      <!-- Parsed preview -->
      <div v-if="cmdValue" class="mt-2.5 flex flex-wrap items-center gap-1.5">
        <span class="text-gray-600 text-[11px]">Parsed:</span>
        <span v-if="parsedPriority"
          class="px-2 py-0.5 rounded text-[10px] font-bold bg-red-900/40 text-red-400 border border-red-800/40">
          {{ parsedPriority }}
        </span>
        <span v-if="parsedTag"
          class="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-900/30 text-indigo-400 border border-indigo-800/40">
          {{ parsedTag }}
        </span>
        <span class="italic text-gray-600 text-[11px]">{{ parsedMsg }}</span>
      </div>
    </div>

    <!-- DESKTOP: 3-column kanban (md+) -->
    <div class="hidden md:grid grid-cols-3 gap-4">

      <!-- Branches -->
      <div>
        <KanbanColHeader label="Branches" dot="bg-gray-500" :count="12" />
        <div class="space-y-3">
          <BranchesCard title="main" :status="false" :priority="3" hashtag="mergeBranch" />
          <BranchesCard title="home-branch" :status="true" :priority="2" hashtag="homePage" />
        </div>
      </div>

      <!-- In Progress -->
      <div>
        <KanbanColHeader label="In Progress" dot="bg-yellow-400" :count="inProgressCards.length" />
        <div class="space-y-3">
          <KanbanCard v-for="(card, i) in inProgressCards" :key="card.id"
            :card="card" :delay-class="Math.min(i + 1, 4)" @remove="removeCard" />
        </div>
      </div>

      <!-- Completed -->
      <div>
        <KanbanColHeader label="Completed" dot="bg-emerald-400" :count="completedCards.length" />
        <div class="space-y-3">
          <CompletedCard v-for="(card, i) in completedCards" :key="card.id"
            :card="card" :delay-class="Math.min(i + 1, 4)" />
        </div>
      </div>
    </div>

    <!-- MOBILE: tab switcher (<md) -->
    <div class="md:hidden">
      <div class="flex gap-1 p-1 bg-card rounded-xl border border-[#1e2530] mb-4">
        <button v-for="tab in tabs" :key="tab.key" @click="activeTab = tab.key"
          :class="[
            'flex-1 py-2 px-1 rounded-lg text-[10px] font-bold tracking-wide transition-all',
            activeTab === tab.key
              ? `bg-[#0d1117] border border-[#30363d] ${tab.activeColor}`
              : 'text-gray-500',
          ]">
          <span class="flex items-center justify-center gap-1">
            <span :class="['w-1.5 h-1.5 rounded-full shrink-0', tab.dot]" />
            {{ tab.label }}
          </span>
        </button>
      </div>

      <!-- Panel: Branches -->
      <div v-if="activeTab === 'branches'" class="space-y-3">
        <KanbanColHeader label="Branches" dot="bg-gray-500" :count="12" />
        <BranchesCard title="main" :status="false" :priority="3" hashtag="mergeBranch" />
        <BranchesCard title="home-branch" :status="true" :priority="2" hashtag="homePage" />
      </div>

      <!-- Panel: In Progress -->
      <div v-if="activeTab === 'inprogress'" class="space-y-3">
        <KanbanColHeader label="In Progress" dot="bg-yellow-400" :count="inProgressCards.length" />
        <KanbanCard v-for="(card, i) in inProgressCards" :key="card.id"
          :card="card" :delay-class="Math.min(i + 1, 4)" @remove="removeCard" />
      </div>

      <!-- Panel: Completed -->
      <div v-if="activeTab === 'completed'" class="space-y-3">
        <KanbanColHeader label="Completed" dot="bg-emerald-400" :count="completedCards.length" />
        <CompletedCard v-for="(card, i) in completedCards" :key="card.id"
          :card="card" :delay-class="Math.min(i + 1, 4)" />
      </div>
    </div>

    <div class="h-2 md:h-0" />

    <!-- Status Bar (desktop) -->
    <div class="hidden md:flex status-bar items-center justify-between pt-2 border-t border-[#1e2530]">
      <div class="flex items-center gap-4 text-[11px] text-gray-600">
        <span class="flex items-center gap-1.5">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="4" />
            <line x1="1.05" y1="12" x2="7" y2="12" />
            <line x1="17.01" y1="12" x2="22.96" y2="12" />
            <line x1="12" y1="1.05" x2="12" y2="7" />
            <line x1="12" y1="17.01" x2="12" y2="22.96" />
          </svg>
          main
        </span>
        <span class="flex items-center gap-1.5">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-dot" />
          <span class="text-emerald-400">Sync with GitHub active</span>
        </span>
      </div>
      <div class="flex items-center gap-3 text-[11px] text-gray-600">
        <span>L: 42</span>
        <span>C: 12</span>
        <span class="text-gray-500">UTF-8</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import taskIcon from '../assets/scroll.svg?url'
import KanbanCard from '../components/KanbanCard.vue'
import BranchesCard from '../components/BranchesCard.vue'
import CompletedCard from '../components/CompletedCard.vue'

/* ── Inline micro-component to avoid triple repetition of column headers ── */
const KanbanColHeader = {
  props: {
    label: { type: String, required: true },
    dot: { type: String, required: true },
    count: { type: Number, required: true },
  },
  template: `
    <div class="flex items-center justify-between mb-3 px-1">
      <div class="flex items-center gap-2">
        <span :class="['w-2 h-2 rounded-full', dot]" />
        <span class="text-[11px] font-bold tracking-widest text-gray-400 uppercase">{{ label }}</span>
      </div>
      <span class="text-[11px] font-mono text-gray-600">{{ String(count).padStart(2, '0') }}</span>
    </div>
  `,
}

let _idCounter = 100

const cmdValue = ref('')
const parsedPriority = ref('')
const parsedTag = ref('')
const parsedMsg = ref('')
const activeTab = ref('branches')

const tabs = [
  { key: 'branches', label: 'BRANCHES', dot: 'bg-gray-500', activeColor: 'text-indigo-400' },
  { key: 'inprogress', label: 'IN PROGRESS', dot: 'bg-yellow-400', activeColor: 'text-yellow-400' },
  { key: 'completed', label: 'DONE', dot: 'bg-emerald-400', activeColor: 'text-emerald-400' },
]

const inProgressCards = ref([
  {
    id: 1, title: 'Home Mobile Version',
    priority: 'HIGH', priorityColor: 'bg-red-900/40 text-red-400 border-red-800/40',
    tag: 'core-api', active: true, meta: '2h ago', pr: 'PR-420',
  },
  {
    id: 2, title: 'Reactivity Homepage',
    priority: 'MED', priorityColor: 'bg-orange-900/40 text-orange-400 border-orange-800/40',
    tag: 'db-perf', active: false, meta: '5h ago', pr: 'PR-421',
  },
])

const completedCards = ref([
  { id: 10, title: 'Home Desktop Version', meta: 'Completed yesterday' },
])

const PRIORITY_COLOR = {
  HIGH: 'bg-red-900/40 text-red-400 border-red-800/40',
  MED: 'bg-orange-900/40 text-orange-400 border-orange-800/40',
  LOW: 'bg-blue-900/30 text-blue-400 border-blue-800/30',
}

function parseCmd() {
  const val = cmdValue.value.trim()
  if (!val) { parsedPriority.value = ''; parsedTag.value = ''; parsedMsg.value = ''; return }
  const pm = val.match(/!(\w+)/)
  const tm = val.match(/#(\w[\w-]*)/)
  parsedPriority.value = pm ? '!' + pm[1].toLowerCase() : ''
  parsedTag.value = tm ? '#' + tm[1].toLowerCase() : ''
  parsedMsg.value = tm
    ? `"Adding with ${pm ? pm[1].toLowerCase() + ' priority and ' : ''}${tm[1]} tag..."`
    : '"Type !priority and #tag to categorize..."'
}

function submitCmd() {
  const val = cmdValue.value.trim()
  if (!val) return
  const pm = val.match(/!(\w+)/)
  const tm = val.match(/#(\w[\w-]*)/)
  const title = val
    .replace(/!(\w+)/g, '').replace(/#(\w[\w-]*)/g, '')
    .replace(/@(\w+)/g, '').replace(/due\s+\w+/gi, '').trim() || 'New Task'
  const priority = pm ? pm[1].toUpperCase() : null
  inProgressCards.value.unshift({
    id: ++_idCounter, title, priority,
    priorityColor: priority ? (PRIORITY_COLOR[priority] ?? 'bg-gray-700 text-gray-300 border-gray-600') : '',
    tag: tm ? tm[1].toLowerCase() : null,
    active: false, meta: 'just now',
  })
  cmdValue.value = ''; parsedPriority.value = ''; parsedTag.value = ''; parsedMsg.value = ''
}

function removeCard(id) {
  inProgressCards.value = inProgressCards.value.filter(c => c.id !== id)
}
</script>