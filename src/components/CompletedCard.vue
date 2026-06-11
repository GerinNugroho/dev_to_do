<template>
  <div :class="['kanban-card fade-in-up bg-card border border-[#1e2530] rounded-xl p-4', `delay-${delayClass}`]">

    <!-- Title + check -->
    <div class="flex items-start justify-between mb-3">
      <span class="text-sm font-semibold text-gray-400 line-through leading-snug pr-2">
        {{ card.title }}
      </span>
      <div class="shrink-0 w-6 h-6 rounded-full border-2 border-emerald-500 flex items-center justify-center mt-0.5">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
          stroke="#34d399" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
    </div>

    <!-- Badge -->
    <div class="flex items-center gap-1.5 mb-4">
      <span class="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-900/30 text-emerald-400 border border-emerald-800/30">
        DONE
      </span>
    </div>

    <!-- Meta -->
    <div class="text-[11px] text-gray-600 font-mono">{{ card.meta }}</div>
  </div>
</template>

<script setup>
defineProps({
  card: { type: Object, required: true },
  delayClass: { type: Number, default: 1 },
})
</script>