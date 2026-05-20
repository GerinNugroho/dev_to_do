<template>
    <div class="px-3 py-4">
        <div class="flex gap-5 justify-center items-center mb-10">
            <AnalyticCards />
            <AnalyticCards />
            <AnalyticCards />
            <AnalyticCards />
        </div>
        <h2 class="text-accent font-mono text-3xl font-bold mb-5">Calendar Activity</h2>
        <div class="flex items-start gap-2">
            <GraphActivity :year="currentYear" :month="currentMonth" :activityData="dummyData" />
            <GraphActivity :year="currentYear" :month="5" />
            <GraphActivity :year="currentYear" :month="6" />
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import AnalyticCards from '../components/AnalyticCards.vue';
import GraphActivity from '../components/GraphActivity.vue';

const currentYear = ref(2026);
const currentMonth = ref(4);

const dummyData = ref({
    "2026-05-01": 1,
    "2026-05-02": 2,
    "2026-05-15": 4,
    "2026-05-20": 3,
    "2026-05-21": 2,
    "2026-05-31": 1
});
</script>

<style lang="scss" scoped></style>
