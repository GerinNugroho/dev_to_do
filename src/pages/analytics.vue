<template>
    <div class="px-8 py-6">
        <h1 class="mb-5 text-2xl font-bold font-mono">Activity Analytic</h1>

        <div v-if="isLoading" class="text-xs text-gray-500 font-mono italic py-16 text-center animate-pulse">
            Fetching metrics from server...
        </div>

        <div v-else class="space-y-10 animate-fadeIn">
            <div class="flex flex-col md:flex-row gap-5 items-center mb-10 fade-in-up">
                <AnalyticCards :card="1" :count="metrics.completedTasks" />
                <AnalyticCards :card="2" :count="metrics.lateTasks" />
                <AnalyticCards :card="3" :count="metrics.totalTasks" />
            </div>
            <div class="w-full flex flex-col md:flex-row gap-5 fade-in-up delay-1">
                <GraphActivity :year="currentYear" :contributions="metrics.contributionGrid"
                    class="flex-4 min-w-0 hover:border-border-hover transition-[border-color_var(--transition-smooth)]" />

                <div
                    class="w-full p-5 flex-1 flex items-center justify-center flex-col min-w-0 relative bg-card border border-border rounded-lg overflow-hidden parent">
                    <span class="text-accent flex justify-center items-center p-3 mb-5 z-10">
                        <gearSolidIcon class="w-30 h-30" />
                    </span>
                    <div class="flex flex-col items-center justify-center z-10">
                        <p class="text-accent-hover uppercase font-bold text-sm mb-1">Focus Score</p>
                        <p class="text-xl"><span class="text-4xl text-accent">{{ metrics.focusScore }}</span> / 100</p>
                    </div>
                    <gearSolidIcon class="absolute w-40 h-40 -right-2 -bottom-2 text-hover child" />
                    <gearSolidIcon class="absolute w-40 h-40 -left-2 -top-10 text-hover child" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted, watch } from 'vue';
import AnalyticCards from '../components/AnalyticCards.vue';
import GraphActivity from '../components/GraphActivity.vue';
import gearSolidIcon from "../assets/gear-solid.svg";
import { useDashboardStore } from '../stores/dashboardStore.js';

const dashboardStore = useDashboardStore();
const currentYear = computed(() => Number(dashboardStore.currentYear || 2026));
const isLoading = computed(() => dashboardStore.analyticsLoading);
const metrics = computed(() => dashboardStore.analyticsMetrics || {
    completedTasks: 0,
    lateTasks: 0,
    totalTasks: 0,
    focusScore: 0,
    contributionGrid: [],
});

const fetchAnalyticsData = async ({ force = true } = {}) => {
    await dashboardStore.fetchAnalytics({ year: currentYear.value, force });
};

watch(currentYear, (newYear, oldYear) => {
    if (newYear !== oldYear) {
        fetchAnalyticsData({ force: true });
    }
});

onMounted(() => {
    fetchAnalyticsData({ force: true });
});
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
