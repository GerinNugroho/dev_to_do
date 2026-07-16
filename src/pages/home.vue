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
            :status="selectedBranch === branch.name" @click="openBranchModal(branch.name)"
            @delete="openDeleteBranchModal(branch)"
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
            :status="selectedBranch === branch.name" @click="openBranchModal(branch.name)"
            @delete="openDeleteBranchModal(branch)"
            class="cursor-pointer transition-all border border-transparent rounded-xl hover:border-gray-700" />
          <div v-if="branchesList.length === 0" class="text-xs text-gray-600 text-center py-4 italic">
            No branches found.
          </div>
        </div>

        <!-- Panel: In Progress -->
        <div v-if="activeTab === 'inprogress'" class="space-y-3">
          <KanbanColHeader label="In Progress" dot="bg-yellow-400" :count="inProgressCards.length" />
          <KanbanCard v-for="(card, i) in inProgressCards" :key="card.id" :card="card" :delay-class="Math.min(i + 1, 4)"
            @remove="removoCard(card.id)" @click="openCompleteModal(card)" />

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

    <TaskActionModal :is-open="isModalOpen" :task="selectedTask" :is-loading="isLoading" @close="closeModal"
      @complete="completeTask" />

    <RemoveItemModel :is-open="isDeleteBranchModalOpen" title="Delete Branch"
      :description="branchToDelete ? `Delete branch ${branchToDelete.name}? This action cannot be undone.` : 'Choose a branch to delete.'"
      tag="delete" :meta="branchToDelete ? `Branch ${branchToDelete.name}` : 'Branch deletion'" confirm-text="Delete"
      cancel-text="Cancel" variant="delete" :is-loading="isLoading" @close="closeDeleteBranchModal"
      @confirm="confirmDeleteBranch" />

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
          <span :class="isGithubConnected ? 'bg-emerald-500' : 'bg-rose-500'"
            class="w-1.5 h-1.5 rounded-full pulse-dot" />
          <span :class="isGithubConnected ? 'text-emerald-400' : 'text-rose-400'"> {{ isGithubConnected ? `Sync With
            Github active` : `Github disconnected` }}</span>
        </span>
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
import TaskActionModal from '../components/TaskActionModal.vue'
import BranchActionModal from '../components/BranchActionModal.vue'
import RemoveItemModel from '../components/RemoveItemModel.vue'
import { useDashboardStore } from '../stores/dashboardStore.js'


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
const dashboardStore = useDashboardStore()

const branchesList = computed(() => dashboardStore.branches)
const allTasks = computed(() => dashboardStore.currentTasks)
const selectedBranch = computed({
  get: () => dashboardStore.selectedBranch,
  set: (value) => {
    dashboardStore.selectedBranch = value
  },
})
const isLoading = ref(false)
const isModalOpen = ref(false)
const selectedTask = ref(null)
const isBranchModalOpen = ref(false)
const selectedBranchItem = ref(null)
const isDeleteBranchModalOpen = ref(false)
const branchToDelete = ref(null)
const isGithubConnected = computed(() => dashboardStore.isGithubConnected)

const openCompleteModal = (card) => {
  selectedTask.value = card
  isModalOpen.value = true
}

const openBranchModal = (branchName) => {
  selectedBranchItem.value = branchName
  if (!selectedBranchItem.value) return
  selectBranchFilter(selectedBranchItem.value)

}

const selectBranchFilter = async (branchName) => {
  if (selectedBranch.value === branchName) return
  await dashboardStore.selectBranch(branchName)
}

const openDeleteBranchModal = (branchObject) => {
  branchToDelete.value = branchObject
  isDeleteBranchModalOpen.value = true
}

const closeDeleteBranchModal = () => {
  isDeleteBranchModalOpen.value = false
  branchToDelete.value = null
}

const confirmDeleteBranch = async () => {
  if (!branchToDelete.value || isLoading.value) return

  try {
    isLoading.value = true
    await dashboardStore.removeBranch(branchToDelete.value.id) // Mengirim ID unik ke store
    closeDeleteBranchModal()
  } catch (error) {
    alert(error.response?.data?.message || "Gagal menghapus branch.")
  } finally {
    isLoading.value = false
  }
}

const closeModal = () => {
  isModalOpen.value = false
  selectedTask.value = null
}

const tabs = [
  { key: 'branches', label: 'BRANCHES', dot: 'bg-gray-500', activeColor: 'text-indigo-400' },
  { key: 'inprogress', label: 'IN PROGRESS', dot: 'bg-yellow-400', activeColor: 'text-yellow-400' },
  { key: 'completed', label: 'DONE', dot: 'bg-emerald-400', activeColor: 'text-emerald-400' },
]


const PRIORITY_COLOR = {
  HIGH: 'bg-red-900/40 text-red-400 border-red-800/40',
  MEDIUM: 'bg-orange-900/40 text-orange-400 border-orange-800/40',
  LOW: 'bg-blue-900/30 text-blue-400 border-blue-800/30',
}

const inProgressCards = computed(() => {
  return allTasks.value
    .filter(task => task.status === 'PROGGRESS')
    .map(task => ({
      id: task.id,
      title: task.title,
      priority: task.priority,
      priorityColor: PRIORITY_COLOR[task.priority],
      tags: task.tags ? task.tags : task.branch.name,
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

const completeTask = async () => {
  if (!selectedTask.value || isLoading.value) return

  try {
    isLoading.value = true
    await dashboardStore.completeTaskStatus(selectedTask.value.id)
    closeModal()
  } catch (error) {
    console.error("Gagal menyelesaikan task:", error)
  } finally {
    isLoading.value = false
  }
}

// watch(selectedBranch, (newBranch, oldBranch) => {
//   if (newBranch && newBranch !== oldBranch) {
//     dashboardStore.fetchTasks({ branchName: newBranch })
//   }
// })

// onMounted(() => {
//   Promise.all([
//     dashboardStore.fetchBranches({ force: true }),
//     dashboardStore.fetchTasks({ branchName: selectedBranch.value })
//   ])
// })

onMounted(async () => {
  try {
    isLoading.value = true
    await dashboardStore.fetchBranches()
    await dashboardStore.fetchTasks({ branchName: selectedBranch.value })
    await dashboardStore.fetchAnalytics()
  } catch (error) {
    console.error("Gagal melakukan inisialisasi awal dashboard:", error)
  } finally {
    isLoading.value = false
  }
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
    await dashboardStore.processNlpInput(val)
    cmdValue.value = ''
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
    await dashboardStore.deleteTaskById(id)
  } catch (error) {
    console.error("Gagal menghapus task:", error)
    alert(error.response?.data?.error || "Terjadi kesalahan saat menghapus task.")
  }
}
</script>