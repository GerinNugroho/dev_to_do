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
                    class="px-2 py-0.5 rounded text-[10px] font-bold bg-red-900/40 text-red-400 border border-red-800/40">{{
                        parsedPriority }}</span>
                <span v-if="parsedTag"
                    class="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-900/30 text-indigo-400 border border-indigo-800/40">{{
                        parsedTag }}</span>
                <span class="italic text-gray-600 text-[11px]">{{ parsedMsg }}</span>
            </div>
        </div>

        <!--Task Layout-->
        <div class="hidden md:grid grid-cols-3 gap-4">
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
                    <div v-for="(card, i) in inProgressCards" :key="card.id"
                        :class="`kanban-card fade-in-up delay-${Math.min(i + 1, 4)} bg-[#161b22] border border-[#1e2530] rounded-xl p-4`">
                        <!-- Title + remove -->
                        <div class="flex items-start justify-between mb-3">
                            <span class="text-sm font-semibold text-white leading-snug pr-2">{{ card.title }}</span>
                            <button @click="removeCard(card.id)"
                                class="text-gray-600 hover:text-red-400 transition-colors mt-0.5 shrink-0">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                        </div>

                        <!-- Badges -->
                        <div class="flex items-center gap-1.5 mb-4 flex-wrap">
                            <span v-if="card.priority"
                                :class="`px-2 py-0.5 text-[10px] font-bold rounded border ${card.priorityColor}`">!{{
                                    card.priority
                                }}</span>
                            <span v-if="card.tag"
                                class="px-2 py-0.5 text-[10px] font-semibold rounded bg-[#1e2530] text-indigo-400 border border-[#30363d]">#{{
                                    card.tag }}</span>
                        </div>

                        <!-- Footer -->
                        <div class="flex items-center justify-between">
                            <!-- Toggle -->
                            <label v-if="card.type === 'toggle'"
                                class="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" class="sr-only peer" :checked="card.active"
                                    @change="card.active = !card.active" />
                                <div
                                    class="w-9 h-5 bg-[#30363d] peer-checked:bg-indigo-600 rounded-full transition-colors peer-focus:outline-none">
                                    <div
                                        class="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform peer-checked:translate-x-4">
                                    </div>
                                </div>
                            </label>
                            <!-- PR link -->
                            <div v-else-if="card.type === 'pr'" class="flex items-center gap-1.5 text-gray-600">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                                </svg>
                                <span class="text-[11px] font-mono">{{ card.pr }}</span>
                            </div>
                            <div v-else></div>
                            <span class="text-[11px] text-gray-600 font-mono">{{ card.meta }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Backlog-->
            <div>
                <div class="flex items-center justify-between mb-3 px-1">
                    <div class="flex items-center gap-2">
                        <span class="w-2 h-2 rounded-full bg-gray-500"></span>
                        <span class="text-[11px] font-bold tracking-widest text-gray-400 uppercase">Backlog</span>
                    </div>
                    <span class="text-[11px] font-mono text-gray-600">12</span>
                </div>

                <div class="space-y-3">
                    <!-- Backlog card dengan chart -->
                    <div
                        class="kanban-card fade-in-up delay-1 bg-[#161b22] border border-[#1e2530] rounded-xl overflow-hidden">
                        <div class="p-4 pb-3">
                            <div class="flex items-start justify-between mb-3">
                                <span class="text-sm font-semibold text-white">Upgrade Tailwind Config</span>
                            </div>
                            <div class="flex items-center gap-1.5 flex-wrap">
                                <span
                                    class="px-2 py-0.5 text-[10px] font-bold rounded bg-blue-900/30 text-blue-400 border border-blue-800/30">!LOW</span>
                                <span
                                    class="px-2 py-0.5 text-[10px] font-semibold rounded bg-[#1e2530] text-indigo-400 border border-[#30363d]">#ui-refresh</span>
                            </div>
                        </div>
                        <!-- Sprint velocity chart -->
                        <div class="relative bg-[#0f1923] overflow-hidden" style="height:130px">
                            <svg class="absolute inset-0 w-full h-full" viewBox="0 0 280 130"
                                preserveAspectRatio="none">
                                <defs>
                                    <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stop-color="#6366f1" stop-opacity="0.3" />
                                        <stop offset="100%" stop-color="#6366f1" stop-opacity="0" />
                                    </linearGradient>
                                    <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                                        <stop offset="0%" stop-color="#818cf8" />
                                        <stop offset="100%" stop-color="#34d399" />
                                    </linearGradient>
                                </defs>
                                <line x1="0" y1="32" x2="280" y2="32" stroke="#1e2530" stroke-width="1" />
                                <line x1="0" y1="64" x2="280" y2="64" stroke="#1e2530" stroke-width="1" />
                                <line x1="0" y1="96" x2="280" y2="96" stroke="#1e2530" stroke-width="1" />
                                <path
                                    d="M0,90 C30,80 50,60 70,55 C90,50 110,70 130,65 C150,60 170,30 200,25 C220,20 250,35 280,30 L280,130 L0,130 Z"
                                    fill="url(#areaGrad)" />
                                <path class="chart-line"
                                    d="M0,90 C30,80 50,60 70,55 C90,50 110,70 130,65 C150,60 170,30 200,25 C220,20 250,35 280,30"
                                    fill="none" stroke="url(#lineGrad)" stroke-width="2" />
                                <g opacity="0.5">
                                    <rect x="10" y="80" width="12" height="45" rx="2" fill="#6366f1" opacity="0.6" />
                                    <rect x="30" y="65" width="12" height="60" rx="2" fill="#6366f1" opacity="0.7" />
                                    <rect x="50" y="55" width="12" height="70" rx="2" fill="#34d399" opacity="0.6" />
                                    <rect x="70" y="70" width="12" height="55" rx="2" fill="#6366f1" opacity="0.6" />
                                    <rect x="90" y="60" width="12" height="65" rx="2" fill="#6366f1" opacity="0.7" />
                                    <rect x="110" y="45" width="12" height="80" rx="2" fill="#34d399" opacity="0.7" />
                                    <rect x="130" y="55" width="12" height="70" rx="2" fill="#6366f1" opacity="0.6" />
                                    <rect x="150" y="35" width="12" height="90" rx="2" fill="#34d399" opacity="0.8" />
                                    <rect x="170" y="25" width="12" height="100" rx="2" fill="#34d399" opacity="0.9" />
                                    <rect x="190" y="40" width="12" height="85" rx="2" fill="#6366f1" opacity="0.7" />
                                    <rect x="210" y="30" width="12" height="95" rx="2" fill="#34d399" opacity="0.8" />
                                    <rect x="230" y="45" width="12" height="80" rx="2" fill="#6366f1" opacity="0.6" />
                                    <rect x="250" y="20" width="12" height="105" rx="2" fill="#34d399" opacity="0.9" />
                                </g>
                            </svg>
                            <div class="absolute bottom-2 left-3">
                                <div class="text-[10px] font-bold tracking-widest text-emerald-400 uppercase">Sprint
                                    Velocity</div>
                                <div class="text-[10px] text-gray-500 font-mono">+14% vs last week</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Completed -->
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
                    <div v-for="(card, i) in completedCards" :key="card.id"
                        :class="`kanban-card fade-in-up delay-${Math.min(i + 1, 4)} bg-[#161b22] border border-[#1e2530] rounded-xl p-4`">
                        <div class="flex items-start justify-between mb-3">
                            <span class="text-sm font-semibold text-gray-400 line-through leading-snug pr-2">{{
                                card.title }}</span>
                            <div
                                class="shrink-0 w-6 h-6 rounded-full border-2 border-emerald-500 flex items-center justify-center mt-0.5">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#34d399"
                                    stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                            </div>
                        </div>
                        <div class="flex items-center gap-1.5 mb-4">
                            <span
                                class="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-900/30 text-emerald-400 border border-emerald-800/30">DONE</span>
                        </div>
                        <div class="text-[11px] text-gray-600 font-mono">{{ card.meta }}</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- ══════════════════════════════════════════
         MOBILE: tab switcher + single column (< md)
    ══════════════════════════════════════════ -->
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

                <div v-for="(card, i) in inProgressCards" :key="card.id"
                    :class="`kanban-card fade-in-up delay-${Math.min(i + 1, 4)} bg-[#161b22] border border-[#1e2530] rounded-xl p-4`">
                    <div class="flex items-start justify-between mb-3">
                        <span class="text-sm font-semibold text-white leading-snug pr-2">{{ card.title }}</span>
                        <button @click="removeCard(card.id)"
                            class="text-gray-600 hover:text-red-400 transition-colors mt-0.5 shrink-0">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>
                    </div>
                    <div class="flex items-center gap-1.5 mb-4 flex-wrap">
                        <span v-if="card.priority"
                            :class="`px-2 py-0.5 text-[10px] font-bold rounded border ${card.priorityColor}`">!{{
                                card.priority
                            }}</span>
                        <span v-if="card.tag"
                            class="px-2 py-0.5 text-[10px] font-semibold rounded bg-[#1e2530] text-indigo-400 border border-[#30363d]">#{{
                            card.tag }}</span>
                    </div>
                    <div class="flex items-center justify-between">
                        <label v-if="card.type === 'toggle'" class="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" class="sr-only peer" :checked="card.active"
                                @change="card.active = !card.active" />
                            <div class="w-9 h-5 bg-[#30363d] peer-checked:bg-indigo-600 rounded-full transition-colors">
                                <div
                                    class="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform peer-checked:translate-x-4">
                                </div>
                            </div>
                        </label>
                        <div v-else-if="card.type === 'pr'" class="flex items-center gap-1.5 text-gray-600">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                            </svg>
                            <span class="text-[11px] font-mono">{{ card.pr }}</span>
                        </div>
                        <div v-else></div>
                        <span class="text-[11px] text-gray-600 font-mono">{{ card.meta }}</span>
                    </div>
                </div>
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
                <!-- Backlog card dengan chart (sama dengan desktop) -->
                <div
                    class="kanban-card fade-in-up delay-1 bg-[#161b22] border border-[#1e2530] rounded-xl overflow-hidden">
                    <div class="p-4 pb-3">
                        <div class="flex items-start justify-between mb-3">
                            <span class="text-sm font-semibold text-white">Upgrade Tailwind Config</span>
                        </div>
                        <div class="flex items-center gap-1.5 flex-wrap">
                            <span
                                class="px-2 py-0.5 text-[10px] font-bold rounded bg-blue-900/30 text-blue-400 border border-blue-800/30">!LOW</span>
                            <span
                                class="px-2 py-0.5 text-[10px] font-semibold rounded bg-[#1e2530] text-indigo-400 border border-[#30363d]">#ui-refresh</span>
                        </div>
                    </div>
                    <div class="relative bg-[#0f1923] overflow-hidden" style="height:130px">
                        <svg class="absolute inset-0 w-full h-full" viewBox="0 0 280 130" preserveAspectRatio="none">
                            <defs>
                                <linearGradient id="areaGrad2" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stop-color="#6366f1" stop-opacity="0.3" />
                                    <stop offset="100%" stop-color="#6366f1" stop-opacity="0" />
                                </linearGradient>
                                <linearGradient id="lineGrad2" x1="0" y1="0" x2="1" y2="0">
                                    <stop offset="0%" stop-color="#818cf8" />
                                    <stop offset="100%" stop-color="#34d399" />
                                </linearGradient>
                            </defs>
                            <line x1="0" y1="32" x2="280" y2="32" stroke="#1e2530" stroke-width="1" />
                            <line x1="0" y1="64" x2="280" y2="64" stroke="#1e2530" stroke-width="1" />
                            <line x1="0" y1="96" x2="280" y2="96" stroke="#1e2530" stroke-width="1" />
                            <path
                                d="M0,90 C30,80 50,60 70,55 C90,50 110,70 130,65 C150,60 170,30 200,25 C220,20 250,35 280,30 L280,130 L0,130 Z"
                                fill="url(#areaGrad2)" />
                            <path
                                d="M0,90 C30,80 50,60 70,55 C90,50 110,70 130,65 C150,60 170,30 200,25 C220,20 250,35 280,30"
                                fill="none" stroke="url(#lineGrad2)" stroke-width="2" stroke-dasharray="1000"
                                style="animation: wave 2s ease forwards;" />
                            <g opacity="0.5">
                                <rect x="10" y="80" width="12" height="45" rx="2" fill="#6366f1" opacity="0.6" />
                                <rect x="30" y="65" width="12" height="60" rx="2" fill="#6366f1" opacity="0.7" />
                                <rect x="50" y="55" width="12" height="70" rx="2" fill="#34d399" opacity="0.6" />
                                <rect x="70" y="70" width="12" height="55" rx="2" fill="#6366f1" opacity="0.6" />
                                <rect x="90" y="60" width="12" height="65" rx="2" fill="#6366f1" opacity="0.7" />
                                <rect x="110" y="45" width="12" height="80" rx="2" fill="#34d399" opacity="0.7" />
                                <rect x="130" y="55" width="12" height="70" rx="2" fill="#6366f1" opacity="0.6" />
                                <rect x="150" y="35" width="12" height="90" rx="2" fill="#34d399" opacity="0.8" />
                                <rect x="170" y="25" width="12" height="100" rx="2" fill="#34d399" opacity="0.9" />
                                <rect x="190" y="40" width="12" height="85" rx="2" fill="#6366f1" opacity="0.7" />
                                <rect x="210" y="30" width="12" height="95" rx="2" fill="#34d399" opacity="0.8" />
                                <rect x="230" y="45" width="12" height="80" rx="2" fill="#6366f1" opacity="0.6" />
                                <rect x="250" y="20" width="12" height="105" rx="2" fill="#34d399" opacity="0.9" />
                            </g>
                        </svg>
                        <div class="absolute bottom-2 left-3">
                            <div class="text-[10px] font-bold tracking-widest text-emerald-400 uppercase">Sprint
                                Velocity</div>
                            <div class="text-[10px] text-gray-500 font-mono">+14% vs last week</div>
                        </div>
                    </div>
                </div>
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
                <div v-for="(card, i) in completedCards" :key="card.id"
                    :class="`kanban-card fade-in-up delay-${Math.min(i + 1, 4)} bg-[#161b22] border border-[#1e2530] rounded-xl p-4`">
                    <div class="flex items-start justify-between mb-3">
                        <span class="text-sm font-semibold text-gray-400 line-through leading-snug pr-2">{{ card.title
                            }}</span>
                        <div
                            class="shrink-0 w-6 h-6 rounded-full border-2 border-emerald-500 flex items-center justify-center mt-0.5">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#34d399"
                                stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                        </div>
                    </div>
                    <div class="flex items-center gap-1.5 mb-4">
                        <span
                            class="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-900/30 text-emerald-400 border border-emerald-800/30">DONE</span>
                    </div>
                    <div class="text-[11px] text-gray-600 font-mono">{{ card.meta }}</div>
                </div>
            </div>

        </div>
        <!-- end mobile -->

        <!-- Divider Padding -->
        <div class="h-2 md:h-0"></div>

        <!-- ── Status Bar  -->
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
import taskIcon from "../assets/scroll.svg";
let _idCounter = 100

export default {
    name: 'HomePage',

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
                    id: 1, title: 'Refactor Auth Middleware',
                    priority: 'HIGH', priorityColor: 'bg-red-900/40 text-red-400 border-red-800/40',
                    tag: 'core-api', active: true, meta: '2h ago', type: 'toggle',
                },
                {
                    id: 2, title: 'Optimize SQL Queries',
                    priority: 'MED', priorityColor: 'bg-orange-900/40 text-orange-400 border-orange-800/40',
                    tag: 'db-perf', active: false, meta: '5h ago', type: 'pr', pr: 'PR-421',
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
            if (!val) { this.parsedPriority = ''; this.parsedTag = ''; this.parsedMsg = ''; return }
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

        // Remove card dari inProgressCards
        removeCard(id) {
            this.inProgressCards = this.inProgressCards.filter(c => c.id !== id)
        },
    },
}
</script>

<style lang="scss" scoped></style>
