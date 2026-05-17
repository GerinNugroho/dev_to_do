<template>
    <main class="flex flex-1 items-center justify-center px-5 py-10 relative z-1">
        <!--Login Card start -->
        <div class="card" id="loginCard">
            <!--Header Login Card-->
            <div class="text-center mt-6 animate-[fadeUp_0.5s_0.08s_both]">
                <h1 class="font-display text-[1.7rem] font-extrabold leading-7">
                    Welcome back
                    <br />
                    <span class="bg-clip-text bg-linear-to-r from-accent to-accent-hover"
                        style="-webkit-text-fill-color: transparent;">Developer.</span>
                </h1>
                <p class="card-subtitle mb-3">Log in to enter your flow state.</p>
            </div>
            <!--Divider-->
            <div class="flex items-center gap-3 mb-5 animate-[fadeUp_0.5s_0.08s_both]">
                <span class="flex-1 h-px bg-border"></span>
            </div>
            <!--Form Login Card -->
            <form action="#" class="flex flex-col gap-4 animate-[fadeUp_0.5s_0.10s_both]">
                <fieldInput ref="inputUsername" name="username" label="username" type="text" placeholder="Your Username"
                    @keydown.enter="focusNextInput(inputPassword)" />
                <fieldInput ref="inputPassword" name="password" label="password" type="password"
                    placeholder="●●●●●●●●" />

                <label class="checkContainer">
                    <input type="checkbox" class="opacity-0 w-0 h-0  absolute cursor-pointer">
                    <span class="checkMark"></span>
                    Remember Me
                </label>

                <button type="submit" class="btn-login">
                    <span>Sign In</span>
                    <span></span>
                </button>
            </form>
            <p class="text-secondary text-center mt-3 font-mono">
                Don't have an account?
                <a href="#" class="text-accent">
                    Sign Up
                </a>
            </p>
        </div>
        <!--Login Card End-->
    </main>
</template>

<script setup>
import { ref, onMounted } from "vue";
import fieldInput from '../components/fieldInput.vue';

const inputUsername = ref(null);
const inputPassword = ref(null);

onMounted(() => {
    inputUsername.value?.focus();
})

function focusNextInput(nextComponent) {
    if (nextComponent) {
        nextComponent.focus();
    }
}

</script>

<style scoped>
@import "../style.css";

.checkContainer {
    @apply text-muted font-mono relative cursor-pointer select-none pl-6;
}

.checkMark {
    @apply absolute top-[50%] translate-y-[-50%] left-0 h-5 w-5 bg-input transition-[smooth] rounded-sm;
}

.checkContainer:hover input~.checkMark {
    @apply border-accent border-solid border;
}

.checkContainer input:checked~.checkMark {
    @apply bg-accent;
}

/* .checkMark::after {
    content: '';
    @apply absolute left-0 top-0 w-full h-full;
    display: none;
    background: url('../assets/check.svg');
    background-size: cover;
    background-position: center;
} */

.checkContainer input:checked~.checkMark::after {
    content: '';
    @apply absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%];
    display: block;
    width: 9px;
    height: 5px;
    border-left: 2px solid #fff;
    border-bottom: 2px solid #fff;
    transform: rotate(-45deg) translateY(-1px);
}
</style>