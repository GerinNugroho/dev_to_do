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
                <!-- ── KOTAK PERINTAH GIT OTOMATIS (UX BARU) ── -->
                <div class="space-y-2 bg-[#07090d] p-3 rounded-lg border border-[#1e2530] text-left">
                    <div
                        class="flex items-center justify-between text-gray-400 border-b border-[#1e2530]/60 pb-1.5 mb-1">
                        <span class="text-indigo-400 text-[10px] font-bold tracking-wider">💡 GIT VALIDATOR REQ</span>
                        <span
                            class="text-[9px] bg-indigo-950/50 text-indigo-300 px-1 py-0.5 rounded border border-indigo-900/40 font-bold">
                            Tag: {{ taskTag }}
                        </span>
                    </div>
                    <div
                        class="flex items-center gap-2 bg-black/40 border border-[#1e2530]  rounded text-emerald-400 relative group">
                        <div class="flex-1 overflow-x-auto p-5">
                            <code class="pr-12 whitespace-nowrap text-[12px] mb-4">{{ generatedGitCommand }}</code>
                        </div>
                        <button @click="copyCommand"
                            class="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-0.5 rounded text-[9px] font-sans font-bold bg-[#1e2530] hover:bg-[#293342] text-gray-300 border border-[#2d3748] transition-all outline-none">
                            {{ isCopied ? 'Copied ✓' : 'Copy' }}
                        </button>
                    </div>
                </div>
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
import { computed, ref } from 'vue';
const props = defineProps({
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

const isCopied = ref(false);
const taskTag = computed(() => {
    return props.task?.id ? props.task.id.split('-')[0] : '';
});
const generatedGitCommand = computed(() => {
    if (!props.task) return '';
    const cleanTitle = props.task.title
        .toLowerCase()
        .replace(/[^a-zA-Z0-9\s]/g, '')
        .replace(/\s+/g, ' ')
        .trim();

    return `git commit -m "feat: ${cleanTitle} #${taskTag.value}" && git push`;
});

const copyCommand = async () => {
    try {
        await navigator.clipboard.writeText(generatedGitCommand.value);
        isCopied.value = true;
        setTimeout(() => {
            isCopied.value = false;
        }, 2000);
    } catch (err) {
        console.error('Gagal menyalin perintah teks ke clipboard:', err);
    }
};

</script>

<style lang="scss" scoped></style>