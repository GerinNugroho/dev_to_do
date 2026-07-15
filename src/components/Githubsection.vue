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
            <input :value="patValue" @input="handlePatInput($event.target.value)" :type="showPat ? 'text' : 'password'"
              placeholder="ghp_••••••••••••••••••••" class="settings-input pat-input w-full bg-[#0d1117]
                     rounded-lg px-3 py-2.5 text-xs outline-none transition-all pr-10
                     font-mono"
              :class="patErrorStatus ? 'border border-rose-500/60 focus:border-rose-500 text-rose-300' : 'border border-[#30363d] text-gray-300'" />
            <button @click="showPat = !showPat"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-300 transition-colors">
              <img v-if="!showPat" :src="passShowIcon" width="14" height="14" alt=""
                class="opacity-60 invert brightness-0" />
              <img v-else :src="passHideIcon" width="14" height="14" alt="" class="opacity-60 invert brightness-0" />
            </button>
          </div>
        </div>

        <!-- Repo URL -->
        <div class="space-y-1.5">
          <label class="text-[11px] text-gray-400 font-medium block">Repository URL</label>
          <div class="relative">
            <input :value="repoUrl" @input="handleRepoInput($event.target.value)" type="text"
              placeholder="https://github.com/username/reponame" class="settings-input w-full bg-[#0d1117]
                     rounded-lg px-3 py-2.5 text-xs outline-none transition-all pr-8
                     font-mono"
              :class="repoErrorStatus ? 'border border-rose-500/60 focus:border-rose-500 text-rose-300' : 'border border-[#30363d] text-gray-300'" />
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
          <code class="px-1.5 py-0.5 rounded bg-[#1e2530] text-indigo-300 text-[10px] font-mono">workflow</code>
          scopes to enable full synchronization and automated task creation from issues.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import githubIcon from '../assets/github-logo.svg?url'
import infoIcon from '../assets/info.svg?url'
import bulbIcon from '../assets/lightbulb.svg?url'
import passShowIcon from '../assets/eyeshow.svg?url'
import passHideIcon from '../assets/eyehide.svg?url'

const props = defineProps({
  patValue: { type: String, default: '' },
  repoUrl: { type: String, default: '' },
  isChanged: { type: Boolean }
})

const emit = defineEmits(['update:patValue', 'update:repoUrl', 'update:isChanged', 'repo-validation-change', 'pat-validation-change'])

const repoErrorStatus = ref(false);
const patErrorStatus = ref(false);
const showPat = ref(false)

const handlePatInput = (value) => {
  emit('update:patValue', value);
  emit('update:isChanged', true);
};

const handleRepoInput = (value) => {
  emit('update:repoUrl', value);
  emit('update:isChanged', true);
};

const validatePat = (value) => {
  if (!value.trim()) {
    patErrorStatus.value = false;
    emit('pat-validation-change', true);
    return;
  }

  const patRegex = /^(ghp_[a-zA-Z0-9]{36}|github_pat_[a-zA-Z0-9_]{82})$/;

  if (!patRegex.test(value)) {
    patErrorStatus.value = true;
    emit('pat-validation-change', false);
  } else {
    patErrorStatus.value = false;
    emit('pat-validation-change', true);
  }
}

const validateRepoUrl = (value) => {
  if (!value.trim()) {
    repoErrorStatus.value = false;
    emit('repo-validation-change', true);
    return;
  }

  const githubRegex = /^https:\/\/github\.com\/[a-zA-Z0-9-]+\/[a-zA-Z0-9-_.]+\/?$/;

  if (!githubRegex.test(value)) {
    repoErrorStatus.value = true;
    emit('repo-validation-change', false);
  } else {
    repoErrorStatus.value = false;
    emit('repo-validation-change', true);
  }
}

watch(
  () => [props.patValue, props.repoUrl],
  ([newPat, newRepo]) => {
    validateRepoUrl(newRepo);
    validatePat(newPat)
  },
  { immediate: true }
);

</script>