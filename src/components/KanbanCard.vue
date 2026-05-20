<template>
    <div :class="`kanban-card fade-in-up delay-${delayClass} bg-card border border-[#1e2530] rounded-xl p-4`">

        <!-- Title + remove -->
        <div class="flex items-start justify-between mb-3">
            <span class="text-sm font-semibold text-white leading-snug pr-2">{{ card.title }}</span>
            <button @click="$emit('remove', card.id)"
                class="text-gray-600 hover:text-red-400 transition-colors mt-0.5 shrink-0">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
            </button>
        </div>

        <!-- Badges -->
        <div class="flex items-center gap-1.5 mb-4 flex-wrap">
            <span v-if="card.priority"
                :class="`px-2 py-0.5 text-[10px] font-bold rounded border ${card.priorityColor}`">
                !{{ card.priority }}
            </span>
            <span v-if="card.tag"
                class="px-2 py-0.5 text-[10px] font-semibold rounded bg-[#1e2530] text-indigo-400 border border-[#30363d]">
                #{{ card.tag }}
            </span>
        </div>

        <!-- Footer -->
        <div class="flex items-center justify-between">
            <!-- Toggle -->
            <label v-if="card.type === 'toggle'" class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" class="sr-only peer" :checked="card.active" @change="$emit('toggle', card.id)" />
                <div
                    class="w-9 h-5 bg-[#30363d] peer-checked:bg-indigo-600 rounded-full transition-colors peer-focus:outline-none">
                    <div
                        class="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform peer-checked:translate-x-4">
                    </div>
                </div>
            </label>

            <!-- PR link -->
            <div v-else-if="card.type === 'pr'" class="flex items-center gap-1.5 text-gray-600">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>
                <span class="text-[11px] font-mono">{{ card.pr }}</span>
            </div>

            <div v-else></div>

            <span class="text-[11px] text-gray-600 font-mono">{{ card.meta }}</span>
        </div>
    </div>
</template>

<script>
export default {
    name: 'KanbanCard',
    props: {
        card: { type: Object, required: true },
        delayClass: { type: Number, default: 1 },
    },
    emits: ['remove', 'toggle'],
}
</script>