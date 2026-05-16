<template>
    <div class="flex flex-col px-3 md:px-8 py-4 md:py-6 space-y-4 md:space-y-5"
        style="font-family: 'JetBrains Mono', 'Fira Code', monospace;">

        <!-- ── Profile Card ── -->
        <ProfileCard @edit="onEditProfile" />

        <!-- ── GitHub Integration ── -->
        <GithubSection
            v-model:patValue="patValue"
            v-model:repoUrl="repoUrl"
        />

        <!-- ── AI Features ── -->
        <AiSection v-model="toggles" />

        <!-- Safe area padding mobile -->
        <div class="h-2 md:h-0"></div>

        <!-- ── Action Bar ── -->
        <div class="flex items-center justify-end gap-3 py-2 md:py-0">
            <button
                @click="discard"
                class="px-4 md:px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-400 hover:text-white hover:bg-[#1e2530] transition-colors"
            >
                Discard Changes
            </button>
            <button
                @click="save"
                class="btn-save flex items-center gap-2 px-4 md:px-5 py-2.5 rounded-xl text-sm font-bold text-white shadow-lg"
            >
                <img :src="saveIcon" width="14" height="14" alt="" class="invert brightness-0" />
                Save Configuration
            </button>
        </div>

        <!-- ── Toast ── -->
        <transition name="toast">
            <div
                v-if="toast.show"
                :class="[
                    'fixed bottom-24 md:bottom-6 left-1/2 -translate-x-1/2 z-50',
                    'flex items-center gap-2 px-4 py-2.5 rounded-xl shadow-xl text-sm font-semibold whitespace-nowrap',
                    toast.success
                        ? 'bg-emerald-900/90 border border-emerald-700/60 text-emerald-300'
                        : 'bg-[#1e2530] border border-[#30363d] text-gray-300'
                ]"
                style="font-family: inherit;"
            >
                <svg v-if="toast.success" width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                </svg>
                <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
                {{ toast.message }}
            </div>
        </transition>

    </div>
</template>

<script>
import saveIcon      from '../assets/save.svg'
import ProfileCard   from '../components/ProfileCard.vue'
import GithubSection from '../components/GithubSection.vue'
import AiSection     from '../components/AiSection.vue'

const DEFAULT_PAT  = 'ghp_exampletoken123456789'
const DEFAULT_REPO = 'https://github.com/rivera-dev'

export default {
    name: 'SettingsPage',
    components: { ProfileCard, GithubSection, AiSection },

    data() {
        return {
            saveIcon,

            // form state
            patValue: DEFAULT_PAT,
            repoUrl:  DEFAULT_REPO,

            // AI toggles — dikirim ke AiSection via v-model
            toggles: { nlp: true, priority: false, autotag: true },

            // toast
            toast: { show: false, message: '', success: true },
            _toastTimer: null,
        }
    },

    methods: {
        onEditProfile() {
            // placeholder — bisa diarahkan ke modal atau halaman edit
        },

        discard() {
            this.patValue         = DEFAULT_PAT
            this.repoUrl          = DEFAULT_REPO
            this.toggles          = { nlp: true, priority: false, autotag: true }
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