<template>
  <div class="settings-section settings-card bg-card border border-[#1e2530] rounded-xl overflow-hidden">

    <!-- Header -->
    <div class="flex items-center gap-3 px-4 md:px-5 pt-4 md:pt-5 pb-3 border-b border-[#1e2530]">
      <div class="w-8 h-8 rounded-lg bg-indigo-900/40 border border-indigo-800/40 flex items-center justify-center shrink-0">
        <img :src="aiIcon" width="16" height="16" alt="" class="icon-indigo" />
      </div>
      <div>
        <div class="text-sm font-bold text-white">AI Features</div>
        <div class="text-[11px] text-gray-500 mt-0.5">
          Intelligent automation to boost your coding flow state.
        </div>
      </div>
    </div>

    <!-- NLP toggle row -->
    <div class="px-4 md:px-5 py-4">
      <div class="flex items-start justify-between gap-4 p-3 md:p-4 rounded-xl bg-[#0d1117] border border-[#1e2530]">
        <div class="min-w-0">
          <div class="text-sm font-semibold text-white">NLP Task Input</div>
          <div class="text-[11px] text-gray-500 mt-1 leading-relaxed">
            Convert natural language descriptions into structured dev-tasks automatically.
          </div>
        </div>
        <button @click="toggle" class="shrink-0 mt-0.5 cursor-pointer" aria-label="Toggle NLP">
          <img v-if="modelValue.nlp" :src="toggleOnIcon" width="36" height="36" alt="On" class="icon-indigo" />
          <img v-else :src="toggleOffIcon" width="36" height="36" alt="Off" class="opacity-40" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import aiIcon from '../assets/AI-logo.svg?url'
import toggleOnIcon from '../assets/Toggleon.svg?url'
import toggleOffIcon from '../assets/Toggleoff.svg?url'

const props = defineProps({
  modelValue: { type: Object, required: true },
})

const emit = defineEmits(['update:modelValue'])

function toggle() {
  emit('update:modelValue', { ...props.modelValue, nlp: !props.modelValue.nlp })
}
</script>