<template>
    <teleport to="body">
        <transition name="fade">
            <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 font-mono">
                <div class="absolute inset-0 bg-black/60 backdrop-blur-xs" @click="closeModal"></div>

                <div
                    class="relative w-full max-w-md rounded-xl bg-[#0d1117] border border-[#1e2530] p-5 md:p-6 shadow-2xl animate-[fadeUp_0.3s_ease-out]">

                    <div class="flex items-center justify-between pb-4 border-b border-[#1e2530] mb-5">
                        <h3 class="text-base font-bold text-white">Edit Profile Datas</h3>
                    </div>

                    <form @submit.prevent="handleSubmit" class="space-y-4">
                        <FieldInput v-model="localForm.fullname" label="Full Name" type="text"
                            placeholder="Enter your full name" name="fullname" />

                        <FieldInput v-model="localForm.username" label="Username" type="text"
                            placeholder="Enter your username" name="username" />


                        <FieldInput v-model="localForm.email" label="Email" type="email" placeholder="Enter your email"
                            name="mail" />

                        <FieldInput v-model="localForm.oldPassword" label="Your Password" type="password"
                            placeholder="Enter your password" name="confirm" />

                        <FieldInput v-model="localForm.newPassword" label="New Passowrd" type="password"
                            placeholder="Enter your new password" name="password" />

                        <p v-if="localError"
                            class="text-red-500 text-xs font-mono bg-red-950/20 border border-red-900/40 p-2 rounded text-center">
                            {{ localError }}
                        </p>

                        <!-- Tombol Aksi -->
                        <div class="flex justify-end gap-3 pt-3 border-t border-[#1e2530] mt-5">
                            <button type="button" @click="closeModal"
                                class="px-4 py-2 rounded-lg text-sm font-semibold text-gray-400 hover:text-white hover:bg-[#1e2530] transition-colors cursor-pointer">
                                Cancel
                            </button>
                            <button type="submit" :disabled="configStore.isLoading"
                                class="px-5 py-2 rounded-lg text-sm font-bold text-white bg-linear-to-r from-indigo-500 to-indigo-600 hover:from-indigo-400 hover:to-indigo-500 shadow-lg shadow-indigo-900/30 cursor-pointer disabled:opacity-50">
                                {{ configStore.isLoading ? 'Saving...' : 'Save Changes' }}
                            </button>
                        </div>
                    </form>

                </div>
            </div>
        </transition>
    </teleport>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useConfigStore } from '../stores/configStore.js';
import FieldInput from './fieldInput.vue';

const props = defineProps({
    isOpen: { type: Boolean, required: true },
    initialData: { type: Object, default: () => ({ fullname: '', username: '', email: '' }) }
});

const emit = defineEmits(['close', 'saved']);
const configStore = useConfigStore();

const localForm = ref({ fullname: '', username: '', email: '', oldPassword: '', newPassword: '' });
const localError = ref('');

// 🌟 Sinkronisasi data awal saat modal dibuka oleh pengguna
watch(() => props.isOpen, (newVal) => {
    if (newVal && props.initialData) {
        localForm.value = {
            fullname: props.initialData.fullname || '',
            username: props.initialData.username || '',
            email: props.initialData.email || '',
            oldPassword: '',
            newPassword: ''

        };
        localError.value = '';
    }
});

function closeModal() {
    if (!configStore.isLoading) {
        emit('close');
    }
}

async function handleSubmit() {
    localError.value = '';

    const fullname = localForm.value.fullname.trim();
    const username = localForm.value.username.trim();
    const email = localForm.value.email.trim();
    const oldPassword = localForm.value.oldPassword.trim();
    const newPassword = localForm.value.newPassword.trim();

    if (!fullname || !username || !email) {
        localError.value = 'All fields fullname, username and email are required.';
        return;
    }

    if (newPassword && !oldPassword) {
        localError.value = 'Please enter your current password to verify your identity before setting a new password.';
        return;
    }

    if (oldPassword && !newPassword) {
        localError.value = 'Please enter your new password if you wish to change your password.';
        return;
    }

    if (newPassword && newPassword.length < 6) {
        localError.value = 'New password must be at least 6 characters long.';
        return;
    }

    try {
        const payload = { fullname, username, email };

        if (newPassword && oldPassword) {
            payload.oldPassword = oldPassword;
            payload.newPassword = newPassword;
        }

        const result = await configStore.updateProfile(payload);

        if (result?.status === 'success') {
            const successMessage = newPassword
                ? 'Profile and Password updated successfully!'
                : 'Profile updated successfully!';

            emit('saved', successMessage);
            closeModal();
        }
    } catch (error) {
        localError.value = error || 'Failed to update profile.';
    }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>