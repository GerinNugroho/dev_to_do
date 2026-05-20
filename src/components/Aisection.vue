<template>
    <div class="settings-section settings-card bg-card border border-[#1e2530] rounded-xl overflow-hidden">

        <!-- Header -->
        <div class="flex items-center gap-3 px-4 md:px-5 pt-4 md:pt-5 pb-3 border-b border-[#1e2530]">
            <div
                class="w-8 h-8 rounded-lg bg-indigo-900/40 border border-indigo-800/40 flex items-center justify-center shrink-0">
                <img :src="aiIcon" width="16" height="16" alt="" class="icon-indigo" />
            </div>
            <div>
                <div class="text-sm font-bold text-white">AI Features</div>
                <div class="text-[11px] text-gray-500 mt-0.5">
                    Intelligent automation to boost your coding flow state.
                </div>
            </div>
        </div>

        <!-- Toggle rows -->
        <div class="px-4 md:px-5 py-4 space-y-3">
            <div v-for="item in items" :key="item.key"
                class="flex items-start justify-between gap-4 p-3 md:p-4 rounded-xl bg-[#0d1117] border border-[#1e2530]">
                <div class="min-w-0">
                    <div class="text-sm font-semibold text-white">{{ item.label }}</div>
                    <div class="text-[11px] text-gray-500 mt-1 leading-relaxed">{{ item.desc }}</div>
                </div>
                <label class="relative inline-flex items-center cursor-pointer shrink-0 mt-0.5">
                    <input type="checkbox" :checked="modelValue[item.key]" @change="onToggle(item.key)"
                        class="sr-only peer" />
                    <div
                        class="w-11 h-6 bg-[#30363d] peer-checked:bg-indigo-600 rounded-full transition-colors peer-focus:outline-none">
                        <div
                            class="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform peer-checked:translate-x-5">
                        </div>
                    </div>
                </label>
            </div>
        </div>
    </div>
</template>

<script>
import aiIcon from '../assets/AI-logo.svg?url'

export default {
    name: 'AiSection',

    props: {
        // { nlp: Boolean, priority: Boolean, autotag: Boolean }
        modelValue: { type: Object, required: true },
    },

    emits: ['update:modelValue'],

    data() {
        return {
            aiIcon,
            items: [
                {
                    key: 'nlp',
                    label: 'NLP Task Input',
                    desc: 'Convert natural language descriptions into structured dev-tasks automatically.',
                },
                {
                    key: 'priority',
                    label: 'Smart Priority Suggestions',
                    desc: 'Automatically suggest task priority based on description keywords and deadlines.',
                },
                {
                    key: 'autotag',
                    label: 'Auto-Tag from Commit',
                    desc: 'Parse commit messages to automatically tag and categorize related tasks.',
                },
            ],
        }
    },

    methods: {
        onToggle(key) {
            this.$emit('update:modelValue', {
                ...this.modelValue,
                [key]: !this.modelValue[key],
            })
        },
    },
}
</script>