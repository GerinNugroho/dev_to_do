<template>
    <div class="settings-section settings-card bg-card border border-[#1e2530] rounded-xl overflow-hidden">

        <!-- Header -->
        <div class="flex items-center gap-3 px-4 md:px-5 pt-4 md:pt-5 pb-3 border-b border-[#1e2530]">
            <div
                class="w-8 h-8 rounded-lg bg-indigo-900/40 border border-indigo-800/40 flex items-center justify-center shrink-0">
                <img :src="githubIcon" width="16" height="16" alt="" class="icon-indigo" />
            </div>
            <div>
                <div class="text-sm font-bold text-white">GitHub Integration</div>
                <div class="text-[11px] text-gray-500 mt-0.5">
                    Sync your tasks and workflow directly with your repositories.
                </div>
            </div>
        </div>

        <!-- Fields -->
        <div class="px-4 md:px-5 py-4 space-y-4">

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">

                <!-- PAT -->
                <div class="space-y-1.5">
                    <label class="flex items-center gap-1.5 text-[11px] text-gray-400 font-medium">
                        Personal Access Token (PAT)
                        <button title="A PAT is required to authenticate with GitHub API"
                            class="text-gray-600 hover:text-gray-400 transition-colors">
                            <img :src="infoIcon" width="13" height="13" alt="" class="opacity-60" />
                        </button>
                    </label>
                    <div class="relative">
                        <input :value="patValue" @input="$emit('update:patValue', $event.target.value)"
                            :type="showPat ? 'text' : 'password'" placeholder="ghp_••••••••••••••••••••"
                            class="settings-input pat-input w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-3 py-2.5 text-xs text-gray-300 outline-none transition-all pr-10"
                            style="font-family: inherit;" />
                        <button @click="showPat = !showPat"
                            class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-300 transition-colors ">
                            <img v-if="!showPat" :src="passShowIcon" width="14" height="14" alt=""
                                class="opacity-60 invert-md brightness-0" />
                            <img v-else :src="passHideIcon" width="14" height="14" alt=""
                                class="opacity-60  invert-md brightness-0" />
                        </button>
                    </div>
                </div>

                <!-- Repo URL -->
                <div class="space-y-1.5">
                    <label class="text-[11px] text-gray-400 font-medium block">Repository URL</label>
                    <div class="relative">
                        <input :value="repoUrl" @input="$emit('update:repoUrl', $event.target.value)" type="text"
                            placeholder="https://github.com/username/repo"
                            class="settings-input w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-3 py-2.5 text-xs text-gray-300 outline-none transition-all pr-8"
                            style="font-family: inherit;" />
                        <div
                            class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center">
                            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3.5"
                                stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Info tip -->
            <div class="flex items-start gap-3 p-3 md:p-4 rounded-xl bg-[#0d1117] border border-[#1e2530]">
                <img :src="bulbIcon" width="16" height="16" alt="" class="shrink-0 mt-0.5 icon-indigo-soft" />
                <p class="text-[11px] text-gray-400 leading-relaxed">
                    Use a PAT with
                    <code class="px-1.5 py-0.5 rounded bg-[#1e2530] text-indigo-300 text-[10px] font-mono">repo</code>
                    and
                    <code
                        class="px-1.5 py-0.5 rounded bg-[#1e2530] text-indigo-300 text-[10px] font-mono">workflow</code>
                    scopes to enable full synchronization and automated task creation from issues.
                </p>
            </div>
        </div>
    </div>
</template>

<script>
import githubIcon from '../assets/github-logo.svg?url'
import infoIcon from '../assets/info.svg?url'
import bulbIcon from '../assets/lightbulb.svg?url'
import passShowIcon from '../assets/eyeshow.svg?url'
import passHideIcon from '../assets/eyehide.svg?url'

export default {
    name: 'GithubSection',

    props: {
        patValue: { type: String, default: '' },
        repoUrl: { type: String, default: '' },
    },

    emits: ['update:patValue', 'update:repoUrl'],

    data() {
        return {
            githubIcon, infoIcon, bulbIcon, passShowIcon, passHideIcon,
            showPat: false,
        }
    },
}
</script>