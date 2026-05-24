<template>
    <div class="kanban-card fade-in-up delay-1 bg-card border border-[#1e2530] rounded-xl overflow-hidden">

        <!-- Header -->
        <div class="p-4 pb-3">
            <div class="flex items-start justify-between mb-3 text-sm font-semibold text-white">
                {{ title }}<span v-if="status === true" class="text-green-400">(Active)</span>
            </div>
            <div class="flex items-center gap-1.5 flex-wrap">

                <!-- priority MBG -->
                <span v-if="priority === 1"
                    class="px-2 py-0.5 text-[10px] font-bold rounded bg-red-900/40 text-red-400 border border-red-800/40">!HIGH</span>
                <span v-else-if="priority === 2"
                    class="px-2 py-0.5 text-[10px] font-bold rounded bg-orange-900/40 text-orange-400 border border-orange-800/40">!MED</span>
                <span v-else-if="priority === 3"
                    class="px-2 py-0.5 text-[10px] font-bold rounded bg-blue-900/40 text-blue-400 border border-blue-800/40">!HIGH</span>

                <!-- hashtag gulingkan prabowo -->
                <span
                    class="px-2 py-0.5 text-[10px] font-semibold rounded bg-[#1e2530] text-indigo-400 border border-[#30363d]">#{{
                        hashtag }}</span>
            </div>
        </div>

        <!-- Sprint velocity chart -->
        <div class="relative bg-[#0f1923] overflow-hidden" style="height: 130px;">
            <svg class="absolute inset-0 w-full h-full" viewBox="0 0 280 130" preserveAspectRatio="none">
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
        </div>
    </div>
</template>

<script setup>
defineProps(['title', 'status', 'priority', 'hashtag'])
</script>