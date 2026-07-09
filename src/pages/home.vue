<template>
  <div class="flex flex-col px-3 md:px-8 py-4 md:py-6 space-y-4 md:space-y-5 font-mono">

    <!-- Command Input -->
    <div class="cmd-input-wrapper rounded-xl border border-[#1e2530] bg-card p-3 md:p-4 transition-all">
      <div class="flex items-center gap-2 md:gap-3">
        <img :src="taskIcon" class="shrink-0 icon-indigo" width="16" height="16" alt="" />

        <input v-model="cmdValue" @keydown.enter="submitCmd" :disabled="isLoading" type="text"
          placeholder="Fix bug #frontend !high @me due tomorrow"
          class="flex-1 min-w-0 bg-transparent text-gray-300 placeholder-gray-600 text-xs md:text-sm outline-none" />
        <kbd
          class="hidden sm:inline-block px-2 py-1 text-[10px] text-gray-500 border border-[#30363d] rounded bg-[#0d1117] shrink-0">
          ENTER
        </kbd>

      </div>

      <!-- Parsed preview -->
      <div v-if="cmdValue" class="mt-2.5 flex flex-wrap items-center gap-1.5">
        <span class="text-gray-600 text-[11px]">Notes : Please enjoy while using website!</span>
      </div>
    </div>

    <!-- DESKTOP: 3-column kanban (md+) -->
    <div class="hidden md:grid grid-cols-3 gap-4 h-[70vh] overflow-auto">

      <!-- Branches -->
      <div>
        <KanbanColHeader label="Branches" dot="bg-gray-500" :count="branchesList.length" />
        <div class="space-y-3">
          <BranchesCard v-for="branch in branchesList" :key="branch.id" :title="branch.name"
            :status="selectedBranch === branch.name" :priority="2" :hashtag="branch.name"
            @click="selectBranchFilter(branch.name)"
            class="cursor-pointer transition-all border border-transparent rounded-xl hover:border-gray-700" />
          <div v-if="branchesList.length === 0" class="text-xs text-gray-600 text-center py-4 italic">
            No branches found.
          </div>
        </div>
      </div>

      <!-- In Progress -->
      <div>
        <KanbanColHeader label="In Progress" dot="bg-yellow-400" :count="inProgressCards.length" />
        <div class="space-y-3">
          <KanbanCard v-for="(card, i) in inProgressCards" :key="card.id" :card="card" :delay-class="Math.min(i + 1, 4)"
            @remove="removoCard(card.id)" @click="openCompleteModal(card)" />

          <div v-if="inProgressCards.length === 0" class="text-xs text-gray-600 text-center py-4 italic">
            No active tasks.
          </div>
        </div>
      </div>

      <!-- Completed -->
      <div>
        <KanbanColHeader label="Completed" dot="bg-emerald-400" :count="completedCards.length" />
        <div class="space-y-3">
          <CompletedCard v-for="(card, i) in completedCards" :key="card.id" :card="card"
            :delay-class="Math.min(i + 1, 4)" />

          <div v-if="completedCards.length === 0" class="text-xs text-gray-600 text-center py-4 italic">
            No completed tasks.
          </div>
        </div>
      </div>
    </div>

    <!-- MOBILE: tab switcher (<md) -->
    <div class="md:hidden">
      <div class="flex gap-1 p-1 bg-card rounded-xl border border-[#1e2530] mb-4">
        <button v-for="tab in tabs" :key="tab.key" @click="activeTab = tab.key" :class="[
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

      <div class="h-[70vh] overflow-auto">
        <!-- Panel: Branches -->
        <div v-if="activeTab === 'branches'" class="space-y-3">
          <KanbanColHeader label="Branches" dot="bg-gray-500" :count="branchesList.length" />
          <BranchesCard v-for="branch in branchesList" :key="branch.id" :title="branch.name"
            :status="selectedBranch === branch.name" :priority="2" :hashtag="branch.name"
            @click="selectBranchFilter(branch.name)" />
          <div v-if="branchesList.length === 0" class="text-xs text-gray-600 text-center py-4 italic">
            No branches found.
          </div>
        </div>

        <!-- Panel: In Progress -->
        <div v-if="activeTab === 'inprogress'" class="space-y-3">
          <KanbanColHeader label="In Progress" dot="bg-yellow-400" :count="inProgressCards.length" />
          <KanbanCard v-for="(card, i) in inProgressCards" :key="card.id" :card="card" :delay-class="Math.min(i + 1, 4)"
            @remove="removeCard" @click="openCompleteModal(card)" />

          <div v-if="inProgressCards.length === 0" class="text-xs text-gray-600 text-center py-4 italic">
            No active tasks.
          </div>
        </div>

        <!-- Panel: Completed -->
        <div v-if="activeTab === 'completed'" class="space-y-3">
          <KanbanColHeader label="Completed" dot="bg-emerald-400" :count="completedCards.length" />
          <CompletedCard v-for="(card, i) in completedCards" :key="card.id" :card="card"
            :delay-class="Math.min(i + 1, 4)" />
          <div v-if="completedCards.length === 0" class="text-xs text-gray-600 text-center py-4 italic">
            No completed tasks.
          </div>
        </div>
      </div>
    </div>

    <div class="h-2 md:h-0" />

    <!-- Status Bar (desktop) -->
    <div class="hidden md:flex status-bar items-center justify-between pt-2 border-t border-[#1e2530]">
      <div class="flex items-center gap-4 text-[11px] text-gray-600">
        <span class="flex items-center gap-1.5">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="4" />
            <line x1="1.05" y1="12" x2="7" y2="12" />
            <line x1="17.01" y1="12" x2="22.96" y2="12" />
            <line x1="12" y1="1.05" x2="12" y2="7" />
            <line x1="12" y1="17.01" x2="12" y2="22.96" />
          </svg>
        </span>
        <span class="flex items-center gap-1.5">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-dot" />
          <span class="text-emerald-400">Sync with GitHub active</span>
        </span>
      </div>
    </div>

    <!-- POPUP MODAL: Presisi Desain Sesuai Ref image_ee06c4.png -->
    <div v-if="isModalOpen && selectedTask" @click.self="closeModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md font-mono transition-all duration-300">

      <!-- Modal Card Box Container -->
      <div
        class="w-full max-w-md rounded-xl border border-[#1e2530] bg-[#11151d] p-6 space-y-6 shadow-2xl shadow-black/80 animate-scaleUp">

        <!-- Header: Judul dengan garis pembatas horizontal penuh -->
        <div class="border-b border-[#1e2530] pb-4">
          <h2 class="text-sm md:text-base font-bold text-gray-200 tracking-wide">
            Task Action
          </h2>
        </div>

        <!-- Body: Area Detail Konten Task -->
        <div class="space-y-3 py-1">
          <div class="flex items-center gap-2 text-[11px] text-gray-500">
            <span
              class="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-950/40 text-indigo-400 border border-indigo-900/30">
              #{{ selectedTask.tag || 'general' }}
            </span>
            <span>•</span>
            <span>{{ selectedTask.meta }}</span>
          </div>

          <!-- Box teks deskripsi task -->
          <p
            class="text-gray-300 text-xs md:text-sm leading-relaxed bg-[#0d1017] p-3 rounded-lg border border-[#1e2530]/60 break-words">
            {{ selectedTask.title }}
          </p>
        </div>

        <!-- Footer: Posisi Kanan (Cancel berupa teks biasa, Tombol utama solid Indigo) -->
        <div class="flex items-center justify-end gap-3 pt-2">
          <button @click="closeModal"
            class="px-4 py-2 text-xs md:text-sm font-bold text-gray-400 hover:text-gray-200 transition-colors outline-none">
            Cancel
          </button>

          <button @click="completeTask" :disabled="isUpdatingStatus"
            class="flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-emerald-950/40 text-emerald-400 border border-emerald-800/40 text-xs font-bold hover:bg-emerald-900/30 transition-all disabled:opacity-50">
            <svg v-if="!isUpdatingStatus" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <!-- PERBAIKAN: Teks diubah menjadi Mark as Completed -->
            {{ isUpdatingStatus ? 'Processing...' : 'Mark as Completed' }}
          </button>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, h } from 'vue'
import taskIcon from '../assets/scroll.svg?url'
import KanbanCard from '../components/KanbanCard.vue'
import BranchesCard from '../components/BranchesCard.vue'
import CompletedCard from '../components/CompletedCard.vue'
import { dashboardServices } from '../services/dashboardServices.js'


const KanbanColHeader = (props) => {
  return h('div', { class: 'flex items-center justify-between mb-3 px-1' }, [
    h('div', { class: 'flex items-center gap-2' }, [
      h('span', { class: ['w-2 h-2 rounded-full', props.dot] }),
      h('span', { class: 'text-[11px] font-bold tracking-widest text-gray-400 uppercase' }, props.label)
    ]),
    h('span', { class: 'text-[11px] font-mono text-gray-600' }, String(props.count).padStart(2, '0'))
  ])
}

KanbanColHeader.props = {
  label: {
    type: String,
    required: true
  },
  dot: {
    type: String,
    required: true
  },
  count: {
    type: Number,
    required: true
  }
}


const cmdValue = ref('')
const activeTab = ref('branches')

const branchesList = ref([])
const allTasks = ref([])
const selectedBranch = ref('main')

const isLoading = ref(false)

const isModalOpen = ref(false)
const selectedTask = ref(null)
const isUpdatingStatus = ref(false)

const openCompleteModal = (card) => {
  selectedTask.value = card
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  selectedTask.value = null
}

const completeTask = async () => {
  if (!selectedTask.value || isUpdatingStatus.value) return

  try {
    isUpdatingStatus.value = true
    const response = await dashboardServices.updateTaskStatus(selectedTask.value.id, 'COMPLETED')

    if (response.status === 200 || response.data?.status === 'success') {
      closeModal()
      await fetchTasks()
    }
  } catch (error) {
    console.error("Gagal update status via PATCH:", error)
  } finally {
    isUpdatingStatus.value = false
  }
}

const tabs = [
  { key: 'branches', label: 'BRANCHES', dot: 'bg-gray-500', activeColor: 'text-indigo-400' },
  { key: 'inprogress', label: 'IN PROGRESS', dot: 'bg-yellow-400', activeColor: 'text-yellow-400' },
  { key: 'completed', label: 'DONE', dot: 'bg-emerald-400', activeColor: 'text-emerald-400' },
]


const PRIORITY_COLOR = {
  HIGH: 'bg-red-900/40 text-red-400 border-red-800/40',
  MED: 'bg-orange-900/40 text-orange-400 border-orange-800/40',
  LOW: 'bg-blue-900/30 text-blue-400 border-blue-800/30',
}

const inProgressCards = computed(() => {
  return allTasks.value
    .filter(task => task.status === 'PROGGRESS')
    .map(task => ({
      id: task.id,
      title: task.title,
      priority: 'MED',
      priorityColor: PRIORITY_COLOR.MED,
      tag: task.branch?.name || null,
      active: true,
      meta: task.created_at ? formatTimeAgo(task.created_at) : 'just now',
      pr: null
    }))
})

const completedCards = computed(() => {
  return allTasks.value
    .filter(task => task.status !== 'PROGGRESS')
    .map(task => ({
      id: task.id,
      title: task.title,
      meta: task.completed_at ? `Completed ${formatTimeAgo(task.completed_at)}` : 'Completed yesterday'
    }))
})

const fetchBranches = async () => {
  try {
    const response = await dashboardServices.getBranches()
    if (response.data?.status === 'success') {
      branchesList.value = response.data.data.branches
    }
  } catch (error) {
    console.error('Gagal mengambil data branch:', error)
  }
}

const fetchTasks = async () => {
  try {
    const response = await dashboardServices.getTask(selectedBranch.value || undefined)
    if (response.data?.status === 'success') {
      allTasks.value = response.data.data.tasks
    }
  } catch (error) {
    console.error('failed to fetching datas task:', error)
  }
}

const selectBranchFilter = (branchName) => {
  selectedBranch.value = branchName
}

watch(selectedBranch, () => {
  fetchTasks()
})

onMounted(() => {
  fetchBranches()
  fetchTasks()
})

function formatTimeAgo(dateString) {
  const date = new Date(dateString)
  const now = new Date()
  const diffInHours = Math.floor((now - date) / (1000 * 60 * 60))
  if (diffInHours < 1) return 'Just now'
  if (diffInHours < 24) return `${diffInHours}h ago`
  return date.toLocaleDateString()
}

//prosess request NLP model
const submitCmd = async () => {
  const val = cmdValue.value.trim()

  if (!val || isLoading.value) return

  try {
    isLoading.value = true

    const response = await dashboardServices.processNlpCommand(val, selectedBranch.value)

    if (response.status === 201) {
      const result = response.data

      if (result.type === 'CREATE_BRANCH') {
        await fetchBranches()
        selectedBranch.value = result.data.branch_name
      }

      else if (result.type === 'CREATE_TASK') {
        await fetchTasks()
      }

      cmdValue.value = ''
    }
  } catch (error) {
    console.error("Gagal memproses perintah dengan NLP AI:", error)
    alert(error.response?.data?.error || "Terjadi kesalahan pada server NLP")
  } finally {
    isLoading.value = false
  }
}

const removoCard = async (id) => {
  if (!confirm("Are you sure you want to permanently delete this task?")) return

  try {
    const response = await dashboardServices.deleteTask(id)

    if (response.status === 200 || response.data?.status === 'success') {
      allTasks.value = allTasks.value.filter(c => c.id !== id)
    }
  } catch (error) {
    console.error("Gagal menghapus task:", error)
    alert(error.response?.data?.error || "Terjadi kesalahan saat menghapus task.")
  }
}
</script>