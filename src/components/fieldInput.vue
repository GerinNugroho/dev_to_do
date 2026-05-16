<template>
    <div class="flex flex-col gap-2">
        <label :for="name" class="uppercase text-[0.78rem] text-secondary tracking-[0.06em]">{{ label }}</label>
        <div class="field-wrapper relative flex items-center">
            <span class="field-icon absolute left-3 flex items-center cursor-none">
                <userIcon v-if="type === 'text'" />
                <lockIcon v-else />
            </span>
            <input :type="isOpen ? 'text' : type" class="field-input" ref="inputRef" :name="name"
                :placeholder="placeholder">
            <button v-if="type === 'password'" type="button" @click="eyeHandler"
                class="absolute flex items-center p-1 right-2.5 text-muted bg-none border-none rounded-sm cursor-pointer hover:text-accent">
                <eyeOpen v-if="isOpen" />
                <eyeClose v-else />
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import userIcon from "../assets/user.svg";
import eyeClose from "../assets/eye-close.svg";
import eyeOpen from "../assets/eye-open.svg";
import lockIcon from "../assets/lock.svg";

const isOpen = ref(false);
const inputRef = ref(null);

defineProps(['label', 'type', 'placeholder', 'name']);
defineExpose({
    focus: () => {
        if (inputRef.value) {
            inputRef.value.focus();
        }
    }
})


function eyeHandler(event) {
    event.preventDefault();
    isOpen.value = !isOpen.value;
}

</script>

<style lang="scss" scoped></style>