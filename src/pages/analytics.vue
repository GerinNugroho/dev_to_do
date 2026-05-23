<template>
    <div class="px-8 py-6">
        <h1 class="mb-5 text-2xl font-bold font-mono">Activity Analytic</h1>
        <div class="flex flex-col md:flex-row gap-5 items-center mb-10 fade-in-up">
            <AnalyticCards :card="1" />
            <AnalyticCards :card="2" />
            <AnalyticCards :card="3" />
        </div>
        <div class="w-full flex flex-col md:flex-row gap-5 fade-in-up delay-1">
            <GraphActivity :year="currentYear"
                class="flex-4 min-w-0 hover:border-border-hover transition-[border-color_var(--transition-smooth)]" />

            <div
                class="w-full p-5 flex-1 flex items-center justify-center flex-col min-w-0 relative bg-card border border-border rounded-lg overflow-hidden parent">
                <span class="text-accent flex justify-center items-center p-3 mb-5 z-10">
                    <gearSolidIcon class="w-30 h-30" />
                </span>
                <div class="flex flex-col items-center justify-center z-10">
                    <p class="text-accent-hover uppercase font-bold text-sm mb-1">Focus Score</p>
                    <p class="text-xl"><span class="text-4xl text-accent">11</span> / 100</p>
                </div>
                <gearSolidIcon class="absolute w-40 h-40 -right-2 -bottom-2 text-hover child" />
                <gearSolidIcon class="absolute w-40 h-40 -left-2 -top-10 text-hover child" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import AnalyticCards from '../components/AnalyticCards.vue';
import GraphActivity from '../components/GraphActivity.vue';

import gearSolidIcon from "../assets/gear-solid.svg";

const currentYear = ref(2026);

</script>

<style scoped>
@reference "../style.css";

.child,
.parent {
    transition: all var(--transition-smooth);
}

.parent:hover {
    @apply border-border-hover;
}

.parent:hover .child {
    @apply w-50 h-50
}
</style>
