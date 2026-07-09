<template>
  <div class="settings-section settings-card bg-card border border-[#1e2530] rounded-xl p-4 md:p-5">
    <div class="flex flex-col sm:flex-row sm:items-center gap-4">

      <!-- Avatar + info -->
      <div class="flex items-center gap-4 flex-1 min-w-0">
        <div class="relative shrink-0">
          <div class="avatar-ring w-16 h-16 md:w-18 md:h-18 rounded-2xl overflow-hidden bg-[#0d1117]">
            <div class="w-full h-full bg-linear-to-br from-indigo-600 to-purple-700 flex items-center justify-center">
              <span class="text-white text-xl font-bold select-none">{{ userInitials }}</span>
            </div>
          </div>
        </div>
        <div class="min-w-0">
          <div class="text-base md:text-lg font-bold text-white truncate">{{ profile?.fullname || "Loading Profile..."
          }}</div>
          <div class="text-xs text-gray-500 truncate">{{ profile?.email || 'loading@email.com' }}</div>
        </div>
      </div>

      <!-- Edit Profile button -->
      <button @click="emit('edit')" class="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl
               bg-linear-to-r from-indigo-500 to-indigo-600
               hover:from-indigo-400 hover:to-indigo-500
               text-white text-sm font-semibold transition-all
               shadow-lg shadow-indigo-900/30 w-full sm:w-auto shrink-0">
        <img :src="profileIcon" class="invert brightness-0" width="14" height="14" alt="" />
        Edit Profile
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import profileIcon from '../assets/Pencil-logo.svg?url'

const props = defineProps({
  profile: {
    type: Object,
    required: true,
    default: () => ({ fullname: '', email: '' })
  }
})

const emit = defineEmits(['edit'])

const userInitials = computed(() => {
  if (!props.profile?.fullname) return '??'

  const words = props.profile.fullname.trim().split(' ')
  if (words.length > 1) {
    return (words[0][0] + words[1][0]).toUpperCase()
  }

  return words[0].substring(0, 2).toUpperCase()
})
</script>