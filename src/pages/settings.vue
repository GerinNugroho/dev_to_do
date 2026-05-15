<template>
    <div class="flex flex-col px-3 md:px-8 py-4 md:py-6 space-y-4 md:space-y-5"
        style="font-family: 'JetBrains Mono', 'Fira Code', monospace;">

        <!-- profile-card -->
        <div class="settings-section settings-card bg-[#161b22] border border-[#1e2530] rounded-xl p-4 md:p-5">
            <div class="flex flex-col sm:flex-row sm:items-center gap-4">

                <!-- Avatar + info -->
                <div class="flex items-center gap-4 flex-1 min-w-0">
                    <div class="relative shrink-0">
                        <div class="avatar-ring w-16 h-16 md:w-18 md:h-18 rounded-2xl overflow-hidden bg-[#0d1117]">
                            <div
                                class="w-full h-full bg-linear-to-br from-indigo-600 to-purple-700 flex items-center justify-center">
                                <span class="text-white text-xl font-bold select-none">AR</span>
                            </div>
                        </div>
                        <span
                            class="absolute -top-1.5 -right-1.5 px-1.5 py-0.5 text-[9px] font-bold rounded-full bg-emerald-500 text-white tracking-wide">
                            ACTIVE
                        </span>
                    </div>
                    <div class="min-w-0">
                        <div class="text-base md:text-lg font-bold text-white truncate">Lao De Muh Alyaddin</div>
                        <div class="text-xs text-gray-500 truncate">Senior Cloud Architect</div>
                    </div>
                </div>

                <!-- Edit Profile button -->
                <button
                    class="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-linear-to-r from-indigo-500 to-indigo-600 hover:from-indigo-400 hover:to-indigo-500 text-white text-sm font-semibold transition-all shadow-lg shadow-indigo-900/30 w-full sm:w-auto shrink-0">
                    <img :src="profileIcon" class="invert brightness-0" width="14" height="14" alt="" />
                    Edit Profile
                </button>
            </div>
        </div>

        <!-- GitHub Integration -->
        <div class="settings-section settings-card bg-[#161b22] border border-[#1e2530] rounded-xl overflow-hidden">

            <!-- Header -->
            <div class="flex items-center gap-3 px-4 md:px-5 pt-4 md:pt-5 pb-3 border-b border-[#1e2530]">
                <div
                    class="w-8 h-8 rounded-lg bg-indigo-900/40 border border-indigo-800/40 flex items-center justify-center shrink-0">
                    <img :src="githubIcon" width="16" height="16" alt="" class="icon-indigo" />
                </div>
                <div>
                    <div class="text-sm font-bold text-white">GitHub Integration</div>
                    <div class="text-[11px] text-gray-500 mt-0.5">Sync your tasks and workflow directly with your
                        repositories.</div>
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
                            <input v-model="patValue" :type="showPat ? 'text' : 'password'"
                                placeholder="ghp_••••••••••••••••••••"
                                class="settings-input pat-input w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-3 py-2.5 text-xs text-gray-300 outline-none transition-all pr-10"
                                style="font-family: inherit;" />
                            <button @click="showPat = !showPat"
                                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-300 transition-colors">
                                <img v-if="!showPat" :src="passShowIcon" width="14" height="14" alt=""
                                    class="opacity-60" />
                                <img v-else :src="passHideIcon" width="14" height="14" alt="" class="opacity-60" />
                            </button>
                        </div>
                    </div>

                    <!-- Repo URL -->
                    <div class="space-y-1.5">
                        <label class="text-[11px] text-gray-400 font-medium block">Repository URL</label>
                        <div class="relative">
                            <input v-model="repoUrl" type="text" placeholder="https://github.com/username/repo"
                                class="settings-input w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-3 py-2.5 text-xs text-gray-300 outline-none transition-all pr-8"
                                style="font-family: inherit;" />
                            <div
                                class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center">
                                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white"
                                    stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">
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
                        <code
                            class="px-1.5 py-0.5 rounded bg-[#1e2530] text-indigo-300 text-[10px] font-mono">repo</code>
                        and
                        <code
                            class="px-1.5 py-0.5 rounded bg-[#1e2530] text-indigo-300 text-[10px] font-mono">workflow</code>
                        scopes to enable full synchronization and automated task creation from issues.
                    </p>
                </div>
            </div>
        </div>

        <!--AI Features-->
        <div class="settings-section settings-card bg-[#161b22] border border-[#1e2530] rounded-xl overflow-hidden">

            <!-- Header -->
            <div class="flex items-center gap-3 px-4 md:px-5 pt-4 md:pt-5 pb-3 border-b border-[#1e2530]">
                <div
                    class="w-8 h-8 rounded-lg bg-indigo-900/40 border border-indigo-800/40 flex items-center justify-center shrink-0">
                    <img :src="aiIcon" width="16" height="16" alt="" class="icon-indigo" />
                </div>
                <div>
                    <div class="text-sm font-bold text-white">AI Features</div>
                    <div class="text-[11px] text-gray-500 mt-0.5">Intelligent automation to boost your coding flow
                        state.</div>
                </div>
            </div>

            <!-- Toggles -->
            <div class="px-4 md:px-5 py-4 space-y-3">

                <div v-for="item in aiToggles" :key="item.key"
                    class="flex items-start justify-between gap-4 p-3 md:p-4 rounded-xl bg-[#0d1117] border border-[#1e2530]">
                    <div class="min-w-0">
                        <div class="text-sm font-semibold text-white">{{ item.label }}</div>
                        <div class="text-[11px] text-gray-500 mt-1 leading-relaxed">{{ item.desc }}</div>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer shrink-0 mt-0.5">
                        <input type="checkbox" v-model="toggles[item.key]" class="sr-only peer" />
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

        <div class="h-2 md:h-0"></div>

        <!-- Action Bar -->
        <div class="flex items-center justify-end gap-3 py-2 md:py-0">
            <button @click="discard"
                class="px-4 md:px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-400 hover:text-white hover:bg-[#1e2530] transition-colors">
                Discard Changes
            </button>
            <button @click="save"
                class="btn-save flex items-center gap-2 px-4 md:px-5 py-2.5 rounded-xl text-sm font-bold text-white shadow-lg">
                <img :src="saveIcon" width="14" height="14" alt="" class="invert brightness-0" />
                Save Configuration
            </button>
        </div>

        <!-- Toast -->
        <transition name="toast">
            <div v-if="toast.show" :class="[
                'fixed bottom-24 md:bottom-6 left-1/2 -translate-x-1/2 z-50',
                'flex items-center gap-2 px-4 py-2.5 rounded-xl shadow-xl text-sm font-semibold whitespace-nowrap',
                toast.success
                    ? 'bg-emerald-900/90 border border-emerald-700/60 text-emerald-300'
                    : 'bg-[#1e2530] border border-[#30363d] text-gray-300'
            ]" style="font-family: inherit;">
                <svg v-if="toast.success" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                </svg>
                <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
                {{ toast.message }}
            </div>
        </transition>
    </div>
</template>

<script>
import profileIcon from '../assets/Pencil-logo.svg'
import githubIcon from '../assets/github-logo.svg'
import aiIcon from '../assets/AI-logo.svg'
import bulbIcon from '../assets/lightbulb.svg'
import infoIcon from '../assets/info.svg'
import passShowIcon from '../assets/eyeshow.svg'
import passHideIcon from '../assets/eyehide.svg'
import saveIcon from '../assets/save.svg'

const DEFAULT_PAT = 'ghp_exampletoken123456789'
const DEFAULT_REPO = 'https://github.com/rivera-dev'

export default {
    name: 'SettingsPage',

    data() {
        return {
            // icons
            profileIcon, githubIcon, aiIcon, bulbIcon,
            infoIcon, passShowIcon, passHideIcon, saveIcon,

            // form
            patValue: DEFAULT_PAT,
            repoUrl: DEFAULT_REPO,
            showPat: false,

            // AI toggle definitions
            aiToggles: [
                {
                    key: 'nlp',
                    label: 'NLP Task Input',
                    desc: 'Convert natural language descriptions into structured dev-tasks automatically.',
                },

            ],

            toggles: { nlp: true, priority: false, autotag: true },

            // toast
            toast: { show: false, message: '', success: true },
            _toastTimer: null,
        }
    },

    methods: {
        discard() {
            this.patValue = DEFAULT_PAT
            this.repoUrl = DEFAULT_REPO
            this.toggles.nlp = true
            this.toggles.priority = false
            this.toggles.autotag = true
            this.showToast('Changes discarded', false)
        },

        save() {
            this.showToast('Configuration saved!', true)
        },

        showToast(message, success) {
            if (this._toastTimer) clearTimeout(this._toastTimer)
            this.toast = { show: true, message, success }
            this._toastTimer = setTimeout(() => { this.toast.show = false }, 2500)
        },
    },
}
</script>

<style lang="scss" scoped></style>