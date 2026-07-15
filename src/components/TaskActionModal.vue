<template>
    <div v-if="isOpen && task" @click.self="$emit('close')"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md font-mono transition-all duration-300">

        <!-- Modal Card Box Container -->
        <div
            class="w-full max-w-md rounded-xl border border-[#1e2530] bg-[#11151d] p-6 space-y-6 shadow-2xl shadow-black/80 animate-scaleUp">

            <!-- Header: Judul dengan garis pembatas horizontal penuh -->
            <div class="border-b border-[#1e2530] pb-4">
                <h2 class="text-sm md:text-base font-bold text-gray-200 tracking-wide">
                    Task Action
                </h2>
            </div>

            <!-- Body: Area Detail Konten Task -->
            <div class="space-y-3 py-1">
                <div class="flex items-center gap-2 text-[11px] text-gray-500">
                    <span
                        class="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-950/40 text-indigo-400 border border-indigo-900/30">
                        #{{ task.tag || 'general' }}
                    </span>
                    <span>•</span>
                    <span>{{ task.meta }}</span>
                </div>

                <!-- Box teks deskripsi task -->
                <p
                    class="text-gray-300 text-xs md:text-sm leading-relaxed bg-[#0d1017] p-3 rounded-lg border border-[#1e2530]/60 break-words">
                    {{ task.title }}
                </p>
            </div>

            <!-- Footer: Posisi Kanan (Cancel berupa teks biasa, Tombol utama solid Indigo) -->
            <div class="flex items-center justify-end gap-3 pt-2">
                <button @click="$emit('close')"
                    class="px-4 py-2 text-xs md:text-sm font-bold text-gray-400 hover:text-gray-200 transition-colors outline-none">
                    Cancel
                </button>

                <button @click="$emit('complete')" :disabled="isLoading"
                    class="flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-emerald-950/40 text-emerald-400 border border-emerald-800/40 text-xs font-bold hover:bg-emerald-900/30 transition-all disabled:opacity-50">
                    <svg v-if="!isLoading" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                        stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <!-- PERBAIKAN: Teks diubah menjadi Mark as Completed -->
                    {{ isLoading ? 'Processing...' : 'Mark as Completed' }}
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
    task: {
        type: Object,
        required: true,
    },
    isLoading: {
        type: Boolean,
        required: true,
    }
});

defineEmits(['close', 'complete']);

</script>

<style lang="scss" scoped></style>