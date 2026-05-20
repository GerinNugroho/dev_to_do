<template>
    <div class=" w-[20%] p-5 relative bg-card border overflow-hidden border-border rounded-lg">
        <span class="flex justify-center items-center w-8 h-9 bg-blue-200 rounded-md mb-6">
            <BoltIcon class="w-4 h-4 text-blue-500" />
        </span>
        <div class="relative z-10">
            <p class="text-accent-hover uppercase font-bold text-sm mb-2">Focus Score</p>
            <p class="text-xl"><span class="text-4xl text-accent">11</span> / 100</p>
        </div>

        <GearSolidIcon class="absolute bottom-0 -right-4 text-hover w-40 h-40 pointer-none" />
    </div>
</template>

<script setup>
import BoltIcon from "../assets/bolt.svg";
import GearSolidIcon from "../assets/gear-solid.svg";
</script>

<style lang="scss" scoped></style>