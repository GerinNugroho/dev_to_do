<template>
    <div class="bg-card border border-border rounded-md p-6 text-primary font-mono w-full">
        <div class="flex justify-between items-center mb-5">
            <div class="flex items-center gap-2">
                <span>
                    <activityIcon class="w-6 h-6" />
                </span>
                <h3 class="m-0 font-normal">Graph Activity</h3>
            </div>
            <div class="text-xs font-mono hidden md:block">
                {{ totalContributions }} Kontribusi Pada {{ year }}
            </div>
        </div>

        <div class="flex overflow-x-auto gap-2 pb-2 w-full">

            <div>
                <div class="grid grid-cols-[max-content_repeat(53,18px)] gap-0.75 text-[11px] mb-1.5 h-3.5 w-full">
                    <div class="invisible pr-2 text-right">Sen</div>

                    <span v-for="(month, index) in monthPositions" :key="index"
                        :style="{ gridColumnStart: month.colIndex + 1 }" class="whitespace-nowrap">{{ month.name
                        }}</span>
                </div>

                <div class="grid grid-rows-7 grid-cols-[max-content_repeat(53,18px)] grid-flow-col gap-0.75 w-full">

                    <div class="text-[11px] pr-2 flex items-center justify-end select-none text-muted-foreground"></div>
                    <div class="text-[11px] pr-2 flex items-center justify-end select-none text-primary font-medium">Sen
                    </div>
                    <div class="text-[11px] pr-2 flex items-center justify-end select-none text-muted-foreground"></div>
                    <div class="text-[11px] pr-2 flex items-center justify-end select-none text-primary font-medium">Rab
                    </div>
                    <div class="text-[11px] pr-2 flex items-center justify-end select-none text-muted-foreground"></div>
                    <div class="text-[11px] pr-2 flex items-center justify-end select-none text-primary font-medium">Jum
                    </div>
                    <div class="text-[11px] pr-2 flex items-center justify-end select-none text-muted-foreground"></div>

                    <div v-for="pad in startPadding" :key="'pad' + pad" class="w-full aspect-square invisible"></div>

                    <div v-for="day in daysData" :key="day.date"
                        class="w-full aspect-square rounded-xs transition-colors duration-200"
                        :class="levelClasses[day.level]" :title="`${day.date}: ${day.count} kontribusi`"></div>
                </div>
            </div>
        </div>

        <div class="flex justify-end items-center gap-1.5 mt-4 text-xs">
            <span class="text-[11px]">Lebih sedikit</span>
            <div class="flex gap-0.75">
                <div class="w-2.75 h-2.75 rounded-xs bg-[#222538]"></div>
                <div class="w-2.75 h-2.75 rounded-xs bg-[#343a6b]"></div>
                <div class="w-2.75 h-2.75 rounded-xs bg-[#4c53b3]"></div>
                <div class="w-2.75 h-2.75 rounded-xs bg-[#646ccf]"></div>
                <div class="w-2.75 h-2.75 rounded-xs bg-[#7c84ff]"></div>
            </div>
            <span class="text-[11px]">Lebih banyak</span>
        </div>

    </div>
</template>

<script setup>
import { computed } from 'vue';
import activityIcon from "../assets/activity.svg";

const props = defineProps({
    year: {
        type: Number,
        required: true
    },
    contributions: {
        type: Array,
        default: () => []
    }
});

const contributionMap = computed(() => {
    const map = {};
    props.contributions.forEach(item => {
        map[item.date] = item.count;
    });
    return map;
});

const totalContributions = computed(() => {
    return props.contributions.reduce((sum, item) => sum + item.count, 0);
});

const levelClasses = {
    0: 'bg-[#222538]',
    1: 'bg-[#343a6b]',
    2: 'bg-[#4c53b3]',
    3: 'bg-[#646ccf]',
    4: 'bg-[#7c84ff]'
};

const getLevel = (count) => {
    if (!count || count === 0) return 0;
    if (count <= 3) return 1;
    if (count <= 7) return 2;
    if (count <= 15) return 3;
    return 4;
};

const startPadding = computed(() => {
    const firstDayOfYear = new Date(props.year, 0, 1);
    return firstDayOfYear.getDay();
});

const daysData = computed(() => {
    const data = [];
    const startDate = new Date(props.year, 0, 1);
    const endDate = new Date(props.year, 11, 31);

    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        const yearStr = d.getFullYear();
        const monthStr = String(d.getMonth() + 1).padStart(2, '0');
        const dateStr = String(d.getDate()).padStart(2, '0');
        const formattedDate = `${yearStr}-${monthStr}-${dateStr}`;

        const count = contributionMap.value[formattedDate] || 0;

        data.push({
            date: formattedDate,
            count: count,
            level: getLevel(count)
        });
    }
    return data;
});

const monthPositions = computed(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'];
    return months.map((name, index) => {
        const firstOfMonth = new Date(props.year, index, 1);
        const dayOfYearDiff = Math.floor((firstOfMonth - new Date(props.year, 0, 1)) / (1000 * 60 * 60 * 24));
        const colIndex = Math.floor((dayOfYearDiff + startPadding.value) / 7) + 1;
        return { name, colIndex };
    });
});
</script>

<style lang="scss" scoped></style>