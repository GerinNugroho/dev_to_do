<template>
    <div
        class="w-full p-5 relative bg-card border border-border overflow-hidden rounded-lg group hover:border hover:border-border-hover card-hover">
        <div v-if="card === 1">
            <div class="flex justify-between md:justify-normal items-center gap-2 mb-5">
                <p class="text-green-200 uppercase font-bold text-md group-hover:text-green-500 card-hover">
                    Completed Task</p>
                <span class="text-green-200 flex justify-center items-center group-hover:text-green-500 card-hover">
                    <confirmIcon class="w-7 h-7" />
                </span>
            </div>
            <div class="relative z-10">
                <p class="text-xl"><span class="text-4xl text-green-200 group-hover:text-green-500 card-hover">1</span>
                    Task</p>
            </div>

            <confirmIcon
                class="absolute hidden md:block -bottom-5 -right-2 text-hover w-40 h-40 pointer-none group-hover:text-green-500 card-hover" />
        </div>
        <div v-if="card === 2">
            <div class="flex justify-between md:justify-normal items-center gap-2 mb-5">
                <p class="text-red-200 uppercase font-bold text-md group-hover:text-red-500 card-hover">
                    Late Task</p>
                <span class="text-red-200 flex justify-center items-center group-hover:text-red-500 card-hover">
                    <warningIcon class="w-7 h-7" />
                </span>
            </div>
            <div class="relative z-10">
                <p class="text-xl"><span class="text-4xl text-red-200 group-hover:text-red-500 card-hover">1</span>
                    Task
                </p>
            </div>

            <warningIcon
                class="absolute hidden md:block -bottom-5 -right-2 text-hover w-40 h-40 pointer-none group-hover:text-red-500 card-hover" />
        </div>
        <div v-if="card === 3">
            <div class="flex justify-between md:justify-normal items-center gap-2 mb-5">
                <p class="text-yellow-200 uppercase font-bold text-md group-hover:text-yellow-500 card-hover">
                    Total Task</p>
                <span class="text-yellow-200 flex justify-center items-center group-hover:text-yellow-500 card-hover">
                    <totalIcon class="w-7 h-7" />
                </span>
            </div>
            <div class="relative z-10">
                <p class="text-xl"><span
                        class="text-4xl text-yellow-200 group-hover:text-yellow-500 card-hover">3</span>
                    Task</p>
            </div>

            <totalIcon
                class="absolute hidden md:block -bottom-5 -right-2 text-hover w-40 h-40 pointer-none group-hover:text-yellow-500 card-hover" />
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
@reference "../style.css";

.card-hover {
    transition: border-color var(--transition-smooth), color var(--transition-smooth);
}
</style>