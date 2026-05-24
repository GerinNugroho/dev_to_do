<template>
    <div class="flex flex-col md:flex-row h-dvh bg-[#0d1117] text-gray-100 overflow-hidden font-mono">
        <aside :class="[
            'fixed inset-y-0 left-0 z-50 flex w-60 min-w-60 bg-[#0d1117] border-r border-[#1e2530] flex-col shrink-0 transition-transform duration-300 ease-in-out md:relative md:translate-x-0',
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        ]">
            <!--Logo bossku mantap-->
            <div class="px-5 py-5 border-b border-[#1e2530]">
                <div class="flex items-center gap-3">
                    <div
                        class="w-9 h-9 font-bold rounded-xl bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-900/40">
                        LO
                    </div>
                    <div>
                        <div class="text-sm font-bold text-white tracking-tight">
                            Lao Deh
                        </div>
                        <div class="text-[10px] text-gray-500">Project Manager</div>
                    </div>
                </div>
            </div>

            <header class="flex-1">
                <nav class="px-3 py-4 space-y-1">
                    <!-- Dashboard Button -->
                    <router-link to="/dashboard/home" @click="closeSidebar"
                        class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-gray-200 hover:bg-card transition-colors no-underline"
                        active-class="!bg-[#161b22] !text-white">
                        <img :src="homeIcon" class="opacity-60 shrink-0" width="16" height="16" alt="" />
                        Dashboard
                    </router-link>
                    <!-- Analytics Button -->
                    <router-link to="/dashboard/analytics" @click="closeSidebar"
                        class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-gray-200 hover:bg-card transition-colors no-underline"
                        active-class="!bg-[#161b22] !text-white">
                        <img :src="analyticsIcon" class="opacity-60 shrink-0 invert brightness-0" width="16" height="16"
                            alt="" />
                        Analytics
                    </router-link>
                    <!-- Setting Button -->
                    <router-link to="/dashboard/settings" @click="closeSidebar"
                        class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-gray-200 hover:bg-card transition-colors no-underline"
                        active-class="!bg-[#161b22] !text-white">
                        <img :src="settingIcon" class="opacity-60 shrink-0" width="16" height="16" alt="" />
                        Settings
                    </router-link>
                </nav>
            </header>
            <!-- Logout Button -->
            <div class="px-3 py-4 border-t border-[#1e2530]">
                <button @click="handleLogOut"
                    class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-900/10 transition-colors bg-transparent border-0 cursor-pointer"
                    style="font-family: inherit;">
                    <img :src="logoutIcon" class="opacity-60 shrink-0" width="16" height="16" alt="" />
                    Log Out
                </button>
            </div>

        </aside>
        <div v-if="sidebarOpen" @click="closeSidebar" class="fixed inset-0 bg-black/50 z-40 md:hidden">
        </div>
        <div class="flex-1 flex flex-col overflow-hidden min-w-0">
            <header
                class="flex items-center justify-between px-4 md:px-6 py-3 md:py-5.5 border-b border-[#1e2530] bg-[#0d1117] shrink-0">
                <!---To Do Title Right -->
                <div class="flex items-center gap-2">
                    <button @click="toggleSidebar"
                        class="md:hidden flex items-center justify-center w-8.5 h-8.5 rounded-md hover:bg-[#1a1a24] transition-all">
                        <img :src="burgerbuttonIcon" alt="Menu" class="w-4.5 h-4.5 opacity-70">
                    </button>
                    <span class="text-[10px] font-bold tracking-[0.2em] text-indigo-400 uppercase">DevTodo</span>
                </div>

                <!-- GitHub badge -->
                <div
                    class="flex items-center gap-1.5 px-2.5 md:px-3 py-1.5 rounded-full border border-emerald-500/40 bg-emerald-900/10 text-emerald-400 text-[10px] md:text-[11px] font-semibold tracking-wide whitespace-nowrap">
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-dot shrink-0"></span>
                    <span class="hidden sm:inline">GITHUB CONNECTED</span>
                    <span class="sm:hidden">CONNECTED</span>
                </div>
            </header>

            <!-- Router view (child pages) -->
            <div class="flex-1 overflow-y-auto">
                <router-view />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue"
import { useRouter } from "vue-router"

import homeIcon from "../../assets/house.svg?url"
import analyticsIcon from '../../assets/analytic.svg?url'
import settingIcon from '../../assets/gear.svg?url'
import logoutIcon from '../../assets/logout.svg?url'
import burgerbuttonIcon from '../../assets/list.svg?url'

const sidebarOpen = ref(false);
const router = useRouter();

function toggleSidebar() {
    sidebarOpen.value = !sidebarOpen.value;
};

function closeSidebar() {
    sidebarOpen.value = false;
};

async function handleLogOut() {
    try {
        router.push("/");
    } catch (error) {

    }
};
</script>

<style>
/* Sidebar active icon — putih penuh */
aside .router-link-active img,
aside .router-link-exact-active img {
    opacity: 1 !important;
    filter: brightness(0) invert(1);
}
</style>
