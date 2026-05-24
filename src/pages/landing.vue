<template>
    <main class="relative z- 1 flex justify-center h-full flex-1 items-center px-3 md:px-30">

        <div
            class="bg-card md:h-150 w-full flex flex-col md:flex-row items-center border border-border rounded-md px-5 md:px-10 py-10 md:py-15 text-primary fade-in-up">
            <div class="w-full h-full font-mono flex-1">
                <h1 class="font-display font-bold text-2xl text-center md:text-left md:text-4xl mb-7">Make Your Own <i
                        class="bg-clip-text bg-linear-to-r
                        from-accent to-accent-hover" style="-webkit-text-fill-color: transparent;">Flow State <br
                            class="hidden md:block"></i>
                    & Become Legendary
                </h1>
                <p class="hidden md:block text-md md:text-lg mb-7">
                    Dev To Do is a web-based platform designed to create and monitor your IT project development
                    process. Equipped with NLP and GitHub Integration to streamline your project documentation.
                </p>

                <p class="font-bold mb-8 md:mb-15 text-md md:text-lg">
                    What are you waiting for? Enter your flow state and become legendary!
                </p>

                <router-link to="/register" custom v-slot="{ navigate }">
                    <button @click="navigate"
                        class="bg-accent px-4 py-1 rounded-md text-lg btnHover shadow-btn transition-[transform_var('--transiton-smooth')] block mx-auto md:mx-0">
                        Register Now!
                    </button>
                </router-link>
            </div>
            <div class="hidden  md:block w-full h-full flex-1 bg-center bg-size-[90%] bg-no-repeat fade-in-up"
                :style="{ backgroundImage: `url(${heroImg})` }">
            </div>
        </div>

    </main>
</template>

<script setup>
import heroImg from "../assets/hero.png";
</script>

<style scoped>
.btnHover:hover {
    transform: translateY(-1px);
    box-shadow:
        0 0 32px var(--accent-glow),
        0 4px 12px rgba(0, 0, 0, 0.5);
}
</style>