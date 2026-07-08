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

            <div v-if="errorMessage" class="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm text-center">
                {{ errorMessage }}
            </div>
            <!--Sign Up form field -->
            <form @submit.prevent="handleRegister" class="flex flex-col gap-4 animate-[fadeUp_0.5s_0.10s_both]">
                <FieldInput v-model="formData.fullname" ref="inputFullname" name="fullname" label="fullname" type="text"
                    placeholder="Your Name" @keydown.enter.prevent="focusNextInput(inputEmail)" />
                <FieldInput v-model="formData.email" ref="inputEmail" name="mail" label="Email" type="email"
                    placeholder="your@email.com" @keydown.enter.prevent="focusNextInput(inputUsername)" />
                <FieldInput v-model="formData.username" ref="inputUsername" name="username" label="username" type="text"
                    placeholder="Your Username" @keydown.enter.prevent="focusNextInput(inputPassword)" />
                <div>
                    <FieldInput v-model="formData.password" ref="inputPassword" name="password" label="password"
                        type="password" placeholder="Create Password"
                        @keydown.enter.prevent="focusNextInput(inputConfirm)" />
                    <div class="strength-bar">
                        <div class="strength-track">
                            <div class="strength-fill" :class="passwordStrength.colorClass"
                                :style="{ width: passwordStrength.width }"></div>
                        </div>
                        <span class="strength-label" :class="passwordStrength.textColor">{{ passwordStrength.label
                        }}</span>
                    </div>
                </div>
                <FieldInput v-model="formData.confirmPassword" ref="inputConfirm" name="confirm"
                    label="Confirm Password" type="password" placeholder="Confirm Password" />

                <!-- Checkbox agreement -->
                <label class="checkContainer">
                    <input v-model="formData.agree" type="checkbox" class="opacity-0 w-0 h-0  absolute cursor-pointer">
                    <span class="checkMark"></span>
                    I agree to the <a href="#" class="inline-link">Term</a> and <a href="#" class="inline-link">Privacy
                        Policy</a>
                </label>

                <button type="submit" :disabled="isLoading" class="btn-login">
                    <span>{{ isLoading ? 'Creating Account...' : 'Create Account' }}</span>
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
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { authService } from "../services/authServices.js";
import FieldInput from '../components/fieldInput.vue';

const inputFullname = ref(null);
const inputEmail = ref(null);
const inputUsername = ref(null);
const inputPassword = ref(null);
const inputConfirm = ref(null);

const formData = ref({
    fullname: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    agree: false
});

const router = useRouter();
const isLoading = ref(false);
const errorMessage = ref('');

onMounted(() => {
    inputFullname.value?.focus();
})

function focusNextInput(nextComponent) {
    if (nextComponent) {
        nextComponent.focus();
    }
}

const passwordStrength = computed(() => {
    const pwd = formData.value.password;
    if (!pwd) {
        return { label: 'None', width: '0%', colorClass: 'bg-transparent', textColor: 'text-secondary' };
    }

    let score = 0;

    if (pwd.length >= 8) score++;

    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score++;

    if (/\d/.test(pwd)) score++;

    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    if (pwd.length < 6 && score > 0) {
        score = 1;
    }

    switch (score) {
        case 1:
            return { label: 'Weak', width: '25%', colorClass: 'bg-red-500', textColor: 'text-red-500' };
        case 2:
            return { label: 'Medium', width: '50%', colorClass: 'bg-yellow-500', textColor: 'text-yellow-500' };
        case 3:
            return { label: 'Strong', width: '75%', colorClass: 'bg-emerald-500', textColor: 'text-emerald-500' };
        case 4:
            return { label: 'Very Strong', width: '100%', colorClass: 'bg-indigo-500', textColor: 'text-indigo-500' };
        default:
            return { label: 'Too Short', width: '10%', colorClass: 'bg-gray-400', textColor: 'text-gray-400' };
    }
})

const handleRegister = async () => {
    errorMessage.value = '';

    if (!formData.value.fullname) {
        errorMessage.value = "You must fill your name!";
        return;
    }
    if (!formData.value.username) {
        errorMessage.value = "You must fill your username!"
        return;
    }
    if (!formData.value.email) {
        errorMessage.value = "You must fill your email!"
        return;
    }
    if (!formData.value.password || formData.value.password.length < 6) {
        errorMessage.value = "Password must be at least 6 characters long!";
        return;
    }
    // 1. Validasi kecocokan password di frontend
    if (formData.value.password !== formData.value.confirmPassword) {
        errorMessage.value = "Passwords do not match!";
        return;
    }

    // 2. Validasi persetujuan aturan (checkbox)
    if (!formData.value.agree) {
        errorMessage.value = "You must agree to the Terms and Privacy Policy.";
        return;
    }

    isLoading.value = true;

    try {
        // Destrukturisasi data untuk dikirim ke backend (sesuai req.body express)
        const { fullname, username, email, password } = formData.value;

        const response = await authService.register({ fullname, username, email, password });

        if (response.status === "success") {
            router.push('/dashboard');
        }
    } catch (error) {
        errorMessage.value = error || "Registration failed. Please try again.";
    } finally {
        isLoading.value = false;
    }
};
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