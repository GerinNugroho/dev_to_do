<template>
  <div class="flex flex-col md:flex-row h-dvh bg-[#0d1117] text-gray-100 overflow-hidden font-mono">

    <!-- Sidebar -->
    <aside :class="[
      'fixed inset-y-0 left-0 z-50 flex w-60 min-w-60 flex-col shrink-0',
      'bg-[#0d1117] border-r border-[#1e2530]',
      'transition-transform duration-300 ease-in-out md:relative md:translate-x-0',
      sidebarOpen ? 'translate-x-0' : '-translate-x-full',
    ]">
      <!-- Logo -->
      <div class="px-5 py-5 border-b border-[#1e2530]">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 font-bold rounded-xl bg-linear-to-br from-indigo-500 to-purple-600
                      flex items-center justify-center shadow-lg shadow-indigo-900/40">
            {{ userInitials }}
          </div>
          <div>
            <div class="text-sm font-bold text-white tracking-tight">{{ authStore.user?.username || "Loading..." }}
            </div>
            <!-- <div class="text-[10px] text-gray-500">Project Manager</div> -->
          </div>
        </div>
      </div>

      <!-- Nav -->
      <header class="flex-1">
        <nav class="px-3 py-4 space-y-1">
          <router-link v-for="link in navLinks" :key="link.to" :to="link.to" @click="closeSidebar" :class="navLinkClass"
            active-class="!bg-[#161b22] !text-white">
            <img :src="link.icon" class="opacity-60 shrink-0" :class="link.iconClass" width="16" height="16" alt="" />
            {{ link.label }}
          </router-link>
        </nav>
      </header>

      <!-- Logout -->
      <div class="px-3 py-4 border-t border-[#1e2530]">
        <button @click="openLogoutModal" :disabled="isLoggingOut" class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                 text-gray-400 hover:text-red-400 hover:bg-red-900/10 transition-colors
                 bg-transparent border-0 cursor-pointer font-mono">
          <img :src="logoutIcon" class="opacity-60 shrink-0" width="16" height="16" alt="" />
          Log Out
        </button>
      </div>
    </aside>

    <!-- Logout Modal -->
    <div v-if="showLogoutModal" class="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 px-4">
      <div class="w-full max-w-sm rounded-2xl border border-[#1e2530] bg-[#161b22] p-5 shadow-2xl">
        <h3 class="text-lg font-semibold text-white">Log out of your account?</h3>
        <p class="mt-2 text-sm text-gray-400">Are you sure you want to log out from this app?</p>

        <div class="mt-5 flex justify-end gap-3">
          <button @click="closeLogoutModal"
            class="rounded-lg border border-[#30363d] bg-transparent px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-[#1f2937]">
            Cancel
          </button>
          <button @click="confirmLogOut" :disabled="isLoggingOut"
            class="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-500 disabled:opacity-60">
            {{ isLoggingOut ? 'Logging out...' : 'Yes, Logout' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Backdrop -->
    <div v-if="sidebarOpen" @click="closeSidebar" class="fixed inset-0 bg-black/50 z-40 md:hidden" />

    <!-- Main content area -->
    <div class="flex-1 flex flex-col overflow-hidden min-w-0">
      <header class="flex items-center justify-between px-4 md:px-6 py-3 md:py-7
                     border-b border-[#1e2530] bg-[#0d1117] shrink-0">
        <div class="flex items-center gap-2">
          <button @click="toggleSidebar"
            class="md:hidden flex items-center justify-center w-8.5 h-8.5 rounded-md hover:bg-[#1a1a24] transition-all">
            <img :src="burgerbuttonIcon" alt="Menu" class="w-4.5 h-4.5 opacity-70" />
          </button>
          <span class="text-[10px] font-bold tracking-[0.2em] text-indigo-400 uppercase">DevTodo</span>
        </div>
      </header>

      <!-- Child pages -->
      <div class="flex-1 overflow-y-auto">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import homeIcon from '../../assets/house.svg?url'
import analyticsIcon from '../../assets/analytic.svg?url'
import settingIcon from '../../assets/gear.svg?url'
import logoutIcon from '../../assets/logout.svg?url'
import burgerbuttonIcon from '../../assets/list.svg?url'
import { useAuthStore } from '../../stores/authStore.js'

const navLinkClass = [
  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium',
  'text-gray-400 hover:text-gray-200 hover:bg-card transition-colors no-underline',
]

const navLinks = [
  { to: '/dashboard/home', label: 'Dashboard', icon: homeIcon, iconClass: '' },
  { to: '/dashboard/analytics', label: 'Analytics', icon: analyticsIcon, iconClass: 'invert brightness-0' },
  { to: '/dashboard/settings', label: 'Settings', icon: settingIcon, iconClass: '' },
]

const sidebarOpen = ref(false)
const isLoggingOut = ref(false)
const showLogoutModal = ref(false)
const router = useRouter()
const authStore = useAuthStore()

const isCompleteModalOpen = ref(false)
const selectedTask = ref(null)

function toggleSidebar() { sidebarOpen.value = !sidebarOpen.value }
function closeSidebar() { sidebarOpen.value = false }
function openLogoutModal() { showLogoutModal.value = true }
function closeLogoutModal() { showLogoutModal.value = false }

const userInitials = computed(() => {
  const name = authStore.user?.fullname;
  if (!name) return "??";

  const words = name.trim().split(' ')
  if (words.length > 1) {
    return (words[0][0] + words[1][0]).toUpperCase()
  }

  return words[0].substring(0, 2).toUpperCase()
})

async function confirmLogOut() {
  isLoggingOut.value = true
  try {
    await authStore.handleLogout()
    closeLogoutModal()
    router.push({ name: "Login" })
  } catch {
    console.log("Gagal mengirim request ke server!")
    closeLogoutModal()
    router.push({ name: "Login" })
  } finally {
    isLoggingOut.value = false
  }
}
</script>

<style>
aside .router-link-active img,
aside .router-link-exact-active img {
  opacity: 1 !important;
  filter: brightness(0) invert(1);
}
</style>
