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
            <form @submit.prevent="handleLogin" class="flex flex-col gap-4 animate-[fadeUp_0.5s_0.10s_both]">
                <FieldInput ref="inputUsername" name="username" label="username" type="text" placeholder="Your Username"
                    @keydown.enter="focusNextInput(inputPassword)" />
                <FieldInput ref="inputPassword" name="password" label="password" type="password"
                    placeholder="●●●●●●●●" />

                <label class="checkContainer">
                    <input type="checkbox" class="opacity-0 w-0 h-0  absolute cursor-pointer">
                    <span class="checkMark"></span>
                    Remember Me
                </label>

                <button type="submit" class="btn-login">
                    <span>Sign In</span>
                </button>
            </form>
            <p class="text-secondary text-center mt-3 font-mono">
                Don't have an account?
                <routerLink to="/register" class="text-accent">
                    Sign Up
                </routerLink>
            </p>
        </div>
        <!--Login Card End-->
    </main>
</template>

<script setup>
import { useRouter } from "vue-router";
import { ref, onMounted } from "vue";
import FieldInput from '../components/fieldInput.vue';

const router = useRouter();

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

async function handleLogin() {
    try {
        router.push("/dashboard");
    } catch (error) {
        //coming soon :)
    }
}

</script>

<style scoped></style>