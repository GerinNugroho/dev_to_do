<template>
    <div class="flex flex-col px-3 md:px-6 py-4 md:py-5 space-y-4 md:space-y-5"
        style="font-family: 'JetBrains Mono', 'Fira Code', monospace;">

        <!-- ── Command Input ── -->
        <div class="cmd-input-wrapper rounded-xl border border-[#1e2530] bg-[#161b22] p-3 md:p-4 transition-all">
            <div class="flex items-center gap-2 md:gap-3">
                <img :src="taskIcon" class="shrink-0" width="16" height="16" alt=""
                    style="filter: invert(52%) sepia(79%) saturate(500%) hue-rotate(210deg) brightness(105%);" />
                <input v-model="cmdValue" @input="parseCmd" @keydown.enter="submitCmd" type="text"
                    placeholder="Fix bug #frontend !high @me due tomorrow"
                    class="flex-1 min-w-0 bg-transparent text-gray-300 placeholder-gray-600 text-xs md:text-sm outline-none"
                    style="font-family: inherit;" />
                <kbd
                    class="hidden sm:inline-block px-2 py-1 text-[10px] text-gray-500 border border-[#30363d] rounded bg-[#0d1117] shrink-0">
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

        <!-- ══════════════════════════════
             DESKTOP: 3-column kanban (md+)
        ══════════════════════════════ -->
        <div class="hidden md:grid grid-cols-3 gap-4">

            <!-- IN PROGRESS -->
            <div>
                <div class="flex items-center justify-between mb-3 px-1">
                    <div class="flex items-center gap-2">
                        <span class="w-2 h-2 rounded-full bg-yellow-400"></span>
                        <span class="text-[11px] font-bold tracking-widest text-gray-400 uppercase">In Progress</span>
                    </div>
                    <span class="text-[11px] font-mono text-gray-600">
                        {{ String(inProgressCards.length).padStart(2, '0') }}
                    </span>
                </div>
                <div class="space-y-3">
                    <KanbanCard v-for="(card, i) in inProgressCards" :key="card.id" :card="card"
                        :delay-class="Math.min(i + 1, 4)" @remove="removeCard" @toggle="toggleCard" />
                </div>
            </div>

            <!-- BACKLOG -->
            <div>
                <div class="flex items-center justify-between mb-3 px-1">
                    <div class="flex items-center gap-2">
                        <span class="w-2 h-2 rounded-full bg-gray-500"></span>
                        <span class="text-[11px] font-bold tracking-widest text-gray-400 uppercase">Backlog</span>
                    </div>
                    <span class="text-[11px] font-mono text-gray-600">12</span>
                </div>
                <div class="space-y-3">
                    <BacklogCard />
                </div>
            </div>

            <!-- COMPLETED -->
            <div>
                <div class="flex items-center justify-between mb-3 px-1">
                    <div class="flex items-center gap-2">
                        <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
                        <span class="text-[11px] font-bold tracking-widest text-gray-400 uppercase">Completed</span>
                    </div>
                    <span class="text-[11px] font-mono text-gray-600">
                        {{ String(completedCards.length).padStart(2, '0') }}
                    </span>
                </div>
                <div class="space-y-3">
                    <CompletedCard v-for="(card, i) in completedCards" :key="card.id" :card="card"
                        :delay-class="Math.min(i + 1, 4)" />
                </div>
            </div>
        </div>

        <!-- ══════════════════════════════
             MOBILE: tab switcher (< md)
        ══════════════════════════════ -->
        <div class="md:hidden">

            <!-- Tab bar -->
            <div class="flex gap-1 p-1 bg-[#161b22] rounded-xl border border-[#1e2530] mb-4">
                <button v-for="tab in tabs" :key="tab.key" @click="activeTab = tab.key" :class="[
                    'flex-1 py-2 px-1 rounded-lg text-[10px] font-bold tracking-wide transition-all',
                    activeTab === tab.key
                        ? `bg-[#0d1117] border border-[#30363d] ${tab.activeColor}`
                        : 'text-gray-500'
                ]">
                    <span class="flex items-center justify-center gap-1">
                        <span :class="`w-1.5 h-1.5 rounded-full shrink-0 ${tab.dot}`"></span>
                        {{ tab.label }}
                    </span>
                </button>
            </div>

            <!-- Panel: In Progress -->
            <div v-if="activeTab === 'inprogress'" class="space-y-3">
                <div class="flex items-center justify-between mb-3 px-1">
                    <div class="flex items-center gap-2">
                        <span class="w-2 h-2 rounded-full bg-yellow-400"></span>
                        <span class="text-[11px] font-bold tracking-widest text-gray-400 uppercase">In Progress</span>
                    </div>
                    <span class="text-[11px] font-mono text-gray-600">
                        {{ String(inProgressCards.length).padStart(2, '0') }}
                    </span>
                </div>
                <KanbanCard v-for="(card, i) in inProgressCards" :key="card.id" :card="card"
                    :delay-class="Math.min(i + 1, 4)" @remove="removeCard" @toggle="toggleCard" />
            </div>

            <!-- Panel: Backlog -->
            <div v-if="activeTab === 'backlog'" class="space-y-3">
                <div class="flex items-center justify-between mb-3 px-1">
                    <div class="flex items-center gap-2">
                        <span class="w-2 h-2 rounded-full bg-gray-500"></span>
                        <span class="text-[11px] font-bold tracking-widest text-gray-400 uppercase">Backlog</span>
                    </div>
                    <span class="text-[11px] font-mono text-gray-600">12</span>
                </div>
                <BacklogCard />
            </div>

            <!-- Panel: Completed -->
            <div v-if="activeTab === 'completed'" class="space-y-3">
                <div class="flex items-center justify-between mb-3 px-1">
                    <div class="flex items-center gap-2">
                        <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
                        <span class="text-[11px] font-bold tracking-widest text-gray-400 uppercase">Completed</span>
                    </div>
                    <span class="text-[11px] font-mono text-gray-600">
                        {{ String(completedCards.length).padStart(2, '0') }}
                    </span>
                </div>
                <CompletedCard v-for="(card, i) in completedCards" :key="card.id" :card="card"
                    :delay-class="Math.min(i + 1, 4)" />
            </div>

        </div>
        <!-- end mobile -->

        <!-- Padding bottom -->
        <div class="h-2 md:h-0"></div>

        <!-- ── Status Bar — desktop only ── -->
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
                    main
                </span>
                <span class="flex items-center gap-1.5">
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-dot"></span>
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

<script>
import taskIcon from '../assets/scroll.svg'
import KanbanCard from '../components/KanbanCard.vue'
import BacklogCard from '../components/BacklogCard.vue'
import CompletedCard from '../components/CompletedCard.vue'

let _idCounter = 100

export default {
    name: 'HomePage',
    components: { KanbanCard, BacklogCard, CompletedCard },

    data() {
        return {
            taskIcon,

            // Command input
            cmdValue: '',
            parsedPriority: '',
            parsedTag: '',
            parsedMsg: '',

            // Mobile active tab
            activeTab: 'inprogress',
            tabs: [
                { key: 'inprogress', label: 'IN PROGRESS', dot: 'bg-yellow-400', activeColor: 'text-yellow-400' },
                { key: 'backlog', label: 'BACKLOG', dot: 'bg-gray-500', activeColor: 'text-indigo-400' },
                { key: 'completed', label: 'DONE', dot: 'bg-emerald-400', activeColor: 'text-emerald-400' },
            ],

            // In Progress cards
            inProgressCards: [
                {
                    id: 1,
                    title: 'Refactor Auth Middleware',
                    priority: 'HIGH',
                    priorityColor: 'bg-red-900/40 text-red-400 border-red-800/40',
                    tag: 'core-api',
                    active: true,
                    meta: '2h ago',
                    type: 'toggle',
                },
                {
                    id: 2,
                    title: 'Optimize SQL Queries',
                    priority: 'MED',
                    priorityColor: 'bg-orange-900/40 text-orange-400 border-orange-800/40',
                    tag: 'db-perf',
                    active: false,
                    meta: '5h ago',
                    type: 'pr',
                    pr: 'PR-421',
                },
            ],

            // Completed cards
            completedCards: [
                { id: 10, title: 'Implement Webhooks', meta: 'Completed yesterday' },
            ],
        }
    },

    methods: {
        // Live parse command input
        parseCmd() {
            const val = this.cmdValue.trim()
            if (!val) {
                this.parsedPriority = ''
                this.parsedTag = ''
                this.parsedMsg = ''
                return
            }
            const pm = val.match(/!(\w+)/)
            const tm = val.match(/#(\w[\w-]*)/)
            this.parsedPriority = pm ? '!' + pm[1].toLowerCase() : ''
            this.parsedTag = tm ? '#' + tm[1].toLowerCase() : ''
            this.parsedMsg = tm
                ? `"Adding with ${pm ? pm[1].toLowerCase() + ' priority and ' : ''}${tm[1]} tag..."`
                : '"Type !priority and #tag to categorize..."'
        },

        // Submit new card on Enter
        submitCmd() {
            const val = this.cmdValue.trim()
            if (!val) return

            const pm = val.match(/!(\w+)/)
            const tm = val.match(/#(\w[\w-]*)/)
            const title = val
                .replace(/!(\w+)/g, '').replace(/#(\w[\w-]*)/g, '')
                .replace(/@(\w+)/g, '').replace(/due\s+\w+/gi, '').trim() || 'New Task'

            const priorityMap = {
                HIGH: 'bg-red-900/40 text-red-400 border-red-800/40',
                MED: 'bg-orange-900/40 text-orange-400 border-orange-800/40',
                LOW: 'bg-blue-900/30 text-blue-400 border-blue-800/30',
            }
            const priority = pm ? pm[1].toUpperCase() : null

            this.inProgressCards.unshift({
                id: ++_idCounter,
                title,
                priority,
                priorityColor: priority ? (priorityMap[priority] ?? 'bg-gray-700 text-gray-300 border-gray-600') : '',
                tag: tm ? tm[1].toLowerCase() : null,
                active: false,
                meta: 'just now',
                type: 'toggle',
            })

            this.cmdValue = ''
            this.parsedPriority = ''
            this.parsedTag = ''
            this.parsedMsg = ''
        },

        // Toggle active state kartu
        toggleCard(id) {
            const card = this.inProgressCards.find(c => c.id === id)
            if (card) card.active = !card.active
        },

        // Hapus kartu dari In Progress
        removeCard(id) {
            this.inProgressCards = this.inProgressCards.filter(c => c.id !== id)
        },
    },
}
</script>

<style lang="scss" scoped></style>