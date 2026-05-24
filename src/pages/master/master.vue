<template>
    <div class="bg-card font-mono text-primary">
        <div class="flex flex-col overflow-x-hidden relative min-h-screen min-w-screen bg-dark">

            <!-- Pattern Background -->
            <div class="bg-grid-pattern absolute inset-0 pointer-events-none z-0"></div>
            <div class="bg-glow-effect absolute inset-0 pointer-events-none z-0"></div>

            <header class="relative z-2">
                <nav
                    class="flex items-center py-4 px-7 bg-[#0d1117b3] justify-between border-b-border backdrop-blur-md">
                    <span class="font-display font-bold text-[1.25rem] text-primary"><i
                            class="bg-clip-text bg-linear-to-r from-accent to-accent-hover"
                            style="-webkit-text-fill-color: transparent;">Dev</i> To Do</span>

                    <ul class="hidden md:flex items-center font-mono gap-10">
                        <li>
                            <router-link to="/"
                                class="hover:text-accent text-secondary transition-[all_var('--transition-smooth')]">
                                Home
                            </router-link>
                        </li>
                        <li>
                            <router-link to="/login"
                                class="hover:text-accent text-secondary transition-[all_var('--transition-smooth')]">
                                Login
                            </router-link>
                        </li>
                        <li>
                            <router-link to="/register" class="bg-accent px-4 py-1.5 rounded-md">
                                Register
                            </router-link>
                        </li>
                    </ul>

                    <button @click="toggleMenu" class="block md:hidden text-primary focus:outline-none"
                        aria-label="Toggle Menu">
                        <listIcon v-if="!isMenuOpen" class="h-6 w-6" />
                        <xmarkIcon v-else class="h-6 w-6" />

                    </button>


                    <transition enter-active-class="transition ease-out duration-200"
                        enter-from-class="transform opacity-0 -translate-y-2"
                        enter-to-class="transform opacity-100 translate-y-0"
                        leave-active-class="transition ease-in duration-150"
                        leave-from-class="transform opacity-100 translate-y-0"
                        leave-to-class="transform opacity-0 -translate-y-2">
                        <div v-if="isMenuOpen"
                            class="absolute top-full left-0 w-full bg-[#0d1117f2] border-b border-b-border backdrop-blur-md md:hidden">
                            <ul class="flex flex-col font-mono px-7 py-4 gap-4">
                                <li>
                                    <router-link to="/" @click="isMenuOpen = false"
                                        class="block py-2 text-secondary hover:text-primary transition-colors">
                                        Home
                                    </router-link>
                                </li>
                                <li>
                                    <router-link to="/login" @click="isMenuOpen = false"
                                        class="block py-2 text-secondary hover:text-primary transition-colors">
                                        Login
                                    </router-link>
                                </li>
                                <li>
                                    <router-link to="/register" @click="isMenuOpen = false"
                                        class="block text-center bg-accent px-4 py-2 rounded-md mt-1">
                                        Register
                                    </router-link>
                                </li>
                            </ul>
                        </div>
                    </transition>

                </nav>
            </header>

            <!-- Main Section -->
            <router-view />
            <!-- Main Section End -->
        </div>

        <footer class="bg-card p-5 rounded-t-md h-full text-secondary">

            <div class="text-center">
                <small>Copyright &copy; 2026 All Right Reserved by DevToDo</small>
            </div>

        </footer>

    </div>
</template>

<script setup>
import { ref } from 'vue';

import listIcon from "../../assets/list.svg";
import xmarkIcon from "../../assets/xmark.svg";

const isMenuOpen = ref(false)

const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value
}
</script>

<style lang="scss" scoped></style>