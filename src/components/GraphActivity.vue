<template>
    <div class="w-full max-w-lg p-4 bg-slate-900 rounded-lg">
        <h3 class="text-center text-2xl text-slate-500 font-bold mb-2">{{ getMonthName }}</h3>
        <div class="grid grid-cols-7 gap-1.5 mb-2 text-center text-xs font-semibold text-slate-400">
            <div>S</div>
            <div>M</div>
            <div>T</div>
            <div>W</div>
            <div>T</div>
            <div>F</div>
            <div>S</div>
        </div>

        <div class="grid grid-cols-7 gap-1.5">
            <div v-for="blankBefore in startDayOfWeek" :key="'blank-before-' + blankBefore"
                class="aspect-square rounded-sm bg-slate-800/20"></div>


            <div v-for="item in days" :key="item.dateKey"
                :class="['aspect-square rounded-sm transition-colors duration-200', item.colorClass]"
                :title="`Tanggal: ${item.dateKey} | Level: ${item.level}`"></div>

            <div v-for="blankAfter in blankDaysAfter" :key="'blank-after-' + blankAfter"
                class="aspect-square rounded-sm bg-slate-800/20"></div>
        </div>

    </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    year: {
        type: Number,
        required: true
    },
    month: {
        type: Number,
        required: true
    },
    activityData: {
        type: Object,
        default: () => ({})
    }
});

const activityColors = {
    0: 'bg-slate-800',
    1: 'bg-indigo-900',
    2: 'bg-indigo-700',
    3: 'bg-indigo-500',
    4: 'bg-emerald-500'
};

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

const getMonthName = computed(() => {
    const name = months[props.month];
    return name;
});

const startDayOfWeek = computed(() => {
    return new Date(props.year, props.month, 1).getDay();
});

const totalDaysInMonth = computed(() => {
    return new Date(props.year, props.month + 1, 0).getDate();
})

const days = computed(() => {
    const daysArray = [];

    for (let day = 1; day <= totalDaysInMonth.value; day++) {
        const dateKey = `${props.year}-${String(props.month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const level = props.activityData[dateKey] !== undefined ? props.activityData[dateKey] : 0;

        daysArray.push({
            day,
            dateKey,
            level,
            colorClass: activityColors[level] || activityColors[0]
        });
    }

    return daysArray;
})

const blankDaysAfter = computed(() => {
    const totalRendered = startDayOfWeek.value + totalDaysInMonth.value;
    return (7 - (totalRendered % 7)) % 7;
});
</script>

<style lang="scss" scoped></style>