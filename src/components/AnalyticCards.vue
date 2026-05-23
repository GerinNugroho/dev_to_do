<template>
    <div class="w-full p-5 relative bg-card border border-border overflow-hidden rounded-lg">
        <div v-if="card === 1" class="parentCompleted">
            <div class="flex items-center gap-2 mb-5">
                <p class="text-green-200 uppercase font-bold text-md completedHover">Completed Task</p>
                <span class="text-green-200 flex justify-center items-center completedHover">
                    <confirmIcon class="w-7 h-7" />
                </span>
            </div>
            <div class="relative z-10">
                <p class="text-xl"><span class="text-4xl text-green-200 completedHover">200</span> Task</p>
            </div>

            <confirmIcon class="absolute -bottom-5 -right-2 text-hover w-40 h-40 pointer-none completedHover" />
        </div>
        <div v-if="card === 2" class="parentLate">
            <div class="flex items-center gap-2 mb-5">
                <p class="text-red-200 uppercase font-bold text-md lateHover">Late Task</p>
                <span class="text-red-200 flex justify-center items-center lateHover">
                    <warningIcon class="w-7 h-7" />
                </span>
            </div>
            <div class="relative z-10">
                <p class="text-xl"><span class="text-4xl text-red-200 lateHover">20</span> Task</p>
            </div>

            <warningIcon class="absolute -bottom-5 -right-2 text-hover w-40 h-40 pointer-none lateHover" />
        </div>
        <div v-if="card === 3" class="parentTotal">
            <div class="flex items-center gap-2 mb-5">
                <p class="text-yellow-200 uppercase font-bold text-md totalHover">Total Task</p>
                <span class="text-yellow-200 flex justify-center items-center totalHover">
                    <totalIcon class="w-7 h-7" />
                </span>
            </div>
            <div class="relative z-10">
                <p class="text-xl"><span class="text-4xl text-yellow-200 totalHover">670</span> Task</p>
            </div>

            <totalIcon class="absolute -bottom-5 -right-2 text-hover w-40 h-40 pointer-none totalHover" />
        </div>
    </div>
</template>

<script setup>
import totalIcon from "../assets/total.svg";
import warningIcon from "../assets/warning.svg";
import confirmIcon from "../assets/confirm.svg";

defineProps(['card']);
</script>
<style scoped>
@import '../style.css';

.completedHover,
.lateHover,
.totalHover {
    transition: color var(--transition-smooth);
}

.parentCompleted:hover .completedHover {
    @apply text-green-500;
}

.parentLate:hover .lateHover {
    @apply text-red-500;
}

.parentTotal:hover .totalHover {
    @apply text-yellow-500;
}
</style>