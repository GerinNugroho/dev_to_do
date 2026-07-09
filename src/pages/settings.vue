<template>
  <div class="flex flex-col px-3 md:px-8 py-4 md:py-6 space-y-4 md:space-y-5 font-mono">

    <!-- Profile Card -->
    <ProfileCard @edit="onEditProfile" :profile="configStore.profile || {}" />

    <!-- GitHub Integration -->
    <GithubSection v-model:patValue="formConfig.pat" v-model:repoUrl="formConfig.repo" />

    <!-- AI Features -->
    <AiSection v-model="formConfig" />

    <div class="h-2 md:h-0" />

    <!-- Action Bar -->
    <div class="flex items-center justify-end gap-3 py-2 md:py-0">
      <button @click="discardChanges" class="px-4 md:px-5 py-2.5 rounded-xl text-sm font-semibold
               text-gray-400 hover:text-white hover:bg-[#1e2530] transition-colors">
        Discard Changes
      </button>
      <button @click="handleSaveConfig"
        class="btn-save flex items-center gap-2 px-4 md:px-5 py-2.5 rounded-xl text-sm font-bold text-white shadow-lg">
        <img :src="saveIcon" width="14" height="14" alt="" class="invert brightness-0" />
        Save Configuration
      </button>
    </div>

    <EditProfileModal :is-open="isEditModalOpen" :initial-data="configStore.profile" @close="isEditModalOpen = false"
      @saved="(msg) => showToast(msg, true)" />

    <!-- Toast -->
    <transition name="toast">
      <div v-if="toast.show" :class="[
        'fixed bottom-24 md:bottom-6 left-1/2 -translate-x-1/2 z-50',
        'flex items-center gap-2 px-4 py-2.5 rounded-xl shadow-xl text-sm font-semibold whitespace-nowrap font-mono',
        toast.success
          ? 'bg-emerald-900/90 border border-emerald-700/60 text-emerald-300'
          : 'bg-[#1e2530] border border-[#30363d] text-gray-300',
      ]">
        <svg v-if="toast.success" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
        <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
          stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
        {{ toast.message }}
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useConfigStore } from '../stores/configStore.js'
import saveIcon from '../assets/save.svg?url'
import ProfileCard from '../components/Profilecard.vue'
import GithubSection from '../components/Githubsection.vue'
import AiSection from '../components/Aisection.vue'
import EditProfileModal from '../components/EditProfileModal.vue'

const configStore = useConfigStore()

const isEditModalOpen = ref(false)

const formConfig = ref({
  pat: "",
  repo: "",
  nlp: true,
})

const initForm = () => {
  if (configStore.config) {
    formConfig.value = {
      pat: configStore.config.pat || "",
      repo: configStore.config.repo || "",
      nlp: configStore.config.nlp
    }

  }
}
const toast = ref({ show: false, message: '', success: true })
let toastTimer = null

onMounted(async () => {
  await configStore.fetchAllSettings();
  initForm();
})

function showToast(message, success) {
  if (toastTimer) clearTimeout(toastTimer)
  toast.value = { show: true, message, success }
  toastTimer = setTimeout(() => { toast.value.show = false }, 2500)
}


const discardChanges = () => {
  initForm();
}

const handleSaveConfig = async () => {
  try {
    const result = await configStore.saveConfiguration(formConfig.value);
    if (result?.status === "success") {
      showToast('Configuration saved!', true)
    }
  } catch (error) {
    showToast("Failed to save Configuration", false)
  }
}

function onEditProfile() {
  isEditModalOpen.value = true
}

</script>