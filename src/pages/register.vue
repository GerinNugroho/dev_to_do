<template>
    <main class="flex flex-1 items-center justify-center px-5 py-10 relative z-1">
        <!--Sign Up Card Start -->
        <div class="card" id="signUpCard">
            <!--Header Sign Up Card-->
            <div class="text-center mt-6 animate-[fadeUp_0.5s_0.08s_both]">
                <h1 class="font-display text-[1.7rem] font-extrabold leading-7">
                    Start Your
                    <br />
                    <span class="bg-clip-text bg-linear-to-r from-accent to-accent-hover"
                        style="-webkit-text-fill-color: transparent;">Flow State.</span>
                </h1>
                <p class="card-subtitle mb-3">Create an account and ship things that matter.</p>
            </div>
            <!--Divider-->
            <div class="flex items-center gap-3 mb-5 animate-[fadeUp_0.5s_0.08s_both]">
                <span class="flex-1 h-px bg-border"></span>
            </div>
            <!--Sign Up form field -->
            <form action="#" class="flex flex-col gap-4 animate-[fadeUp_0.5s_0.10s_both]">
                <FieldInput ref="inputFullname" name="fullname" label="fullname" type="text" placeholder="Your Name"
                    @keydown.enter="focusNextInput(inputUsername)" />
                <FieldInput ref="inputUsername" name="username" label="username" type="text" placeholder="Your Username"
                    @keydown.enter="focusNextInput(inputPassword)" />
                <div>
                    <FieldInput ref="inputPassword" name="password" label="password" type="password"
                        placeholder="Create Password" @keydown.enter="focusNextInput(inputConfirm)" />
                    <div class="strength-bar">
                        <div class="strength-track">
                            <div class="strength-fill"></div>
                        </div>
                        <span class="strength-label">Weak</span>
                    </div>
                </div>
                <FieldInput ref="inputConfirm" name="confirm" label="Confirm Password" type="password"
                    placeholder="Confirm Password" />

                <!-- Checkbox agreement -->
                <label class="checkContainer">
                    <input type="checkbox" class="opacity-0 w-0 h-0  absolute cursor-pointer">
                    <span class="checkMark"></span>
                    I agree to the <a href="#" class="inline-link">Term</a> and <a href="#" class="inline-link">Privacy
                        Policy</a>
                </label>

                <button type="submit" class="btn-login">
                    <span>Create Account</span>
                </button>
            </form>

            <!-- Navigation to Login page -->
            <p class="text-secondary text-center mt-3 font-mono">
                Already have an account?
                <routerLink to="/login" class="text-accent">
                    Sign in
                </routerLink>
            </p>
        </div>
        <!--Sign Up Card End-->
    </main>
</template>

<script setup>
import { ref, onMounted } from "vue";
import FieldInput from '../components/fieldInput.vue';

const inputFullname = ref(null);
const inputUsername = ref(null);
const inputPassword = ref(null);
const inputConfirm = ref(null);

onMounted(() => {
    inputFullname.value?.focus();
})

function focusNextInput(nextComponent) {
    if (nextComponent) {
        nextComponent.focus();
    }
}
</script>

<style scoped>
@reference "../style.css";

.inline-link {
    @apply text-accent no-underline transition-[color_var(--transition-smooth)];
}

.inline-link:hover {
    @apply underline;
}
</style>