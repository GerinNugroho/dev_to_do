<template>
    <div v-if="isOpen" @click.self="$emit('close')"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md font-mono transition-all duration-300">
        <div
            class="w-full max-w-md rounded-xl border border-[#1e2530] bg-[#11151d] p-6 space-y-6 shadow-2xl shadow-black/80">
            <div class="border-b border-[#1e2530] pb-4">
                <h2 class="text-sm md:text-base font-bold text-gray-200 tracking-wide">
                    {{ title }}
                </h2>
            </div>

            <div class="space-y-3 py-1">
                <div class="flex items-center gap-2 text-[11px] text-gray-500">
                    <span
                        class="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-950/40 text-indigo-400 border border-indigo-900/30">
                        #{{ tag || 'item' }}
                    </span>
                    <span>•</span>
                    <span>{{ meta }}</span>
                </div>

                <p
                    class="text-gray-300 text-xs md:text-sm leading-relaxed bg-[#0d1017] p-3 rounded-lg border border-[#1e2530]/60 break-words">
                    {{ description }}
                </p>
            </div>

            <div class="flex items-center justify-end gap-3 pt-2">
                <button @click="$emit('close')"
                    class="px-4 py-2 text-xs md:text-sm font-bold text-gray-400 hover:text-gray-200 transition-colors outline-none">
                    {{ cancelText }}
                </button>

                <button @click="$emit('confirm')" :disabled="isLoading"
                    class="flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-rose-950/40 text-rose-400 border border-rose-800/40 text-xs font-bold hover:bg-rose-900/30 transition-all disabled:opacity-50">
                    <svg v-if="!isLoading" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                        stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {{ isLoading ? 'Processing...' : confirmText }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
defineProps({
    isOpen: {
        type: Boolean,
        required: true,
    },
    title: {
        type: String,
        default: 'Action',
    },
    description: {
        type: String,
        default: 'Are you sure?',
    },
    tag: {
        type: String,
        default: 'item',
    },
    meta: {
        type: String,
        default: 'Selection',
    },
    confirmText: {
        type: String,
        default: 'Confirm',
    },
    cancelText: {
        type: String,
        default: 'Cancel',
    },
    isLoading: {
        type: Boolean,
        default: false,
    },
})

defineEmits(['close', 'confirm'])
</script>

<style lang="scss" scoped></style>