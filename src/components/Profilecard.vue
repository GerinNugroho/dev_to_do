<template>
    <div class="settings-section settings-card bg-[#161b22] border border-[#1e2530] rounded-xl p-4 md:p-5">
        <div class="flex flex-col sm:flex-row sm:items-center gap-4">

            <!-- Avatar + info -->
            <div class="flex items-center gap-4 flex-1 min-w-0">
                <div class="relative shrink-0">
                    <div class="avatar-ring w-16 h-16 md:w-[72px] md:h-[72px] rounded-2xl overflow-hidden bg-[#0d1117]">
                        <div class="w-full h-full bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center">
                            <span class="text-white text-xl font-bold select-none">AR</span>
                        </div>
                    </div>
                    <span class="absolute -top-1.5 -right-1.5 px-1.5 py-0.5 text-[9px] font-bold rounded-full bg-emerald-500 text-white tracking-wide">
                        ACTIVE
                    </span>
                </div>
                <div class="min-w-0">
                    <div class="text-base md:text-lg font-bold text-white truncate">Lao De Muh Alyaddin</div>
                    <div class="text-xs text-gray-500 truncate">Senior Cloud Architect</div>
                </div>
            </div>

            <!-- Edit Profile button -->
            <button
                @click="$emit('edit')"
                class="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-400 hover:to-indigo-500 text-white text-sm font-semibold transition-all shadow-lg shadow-indigo-900/30 w-full sm:w-auto shrink-0"
            >
                <img :src="profileIcon" class="invert brightness-0" width="14" height="14" alt="" />
                Edit Profile
            </button>
        </div>
    </div>
</template>

<script>
import profileIcon from '../assets/Pencil-logo.svg'

export default {
    name: 'ProfileCard',
    emits: ['edit'],
    data() {
        return { profileIcon }
    },
}
</script>