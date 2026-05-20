<template>
    <div class="bg-dark font-mono text-primary min-h-screen min-w-screen flex flex-col overflow-x-hidden relative">
        <div class="bg-grid-pattern fixed inset-0 pointer-events-none z-0"></div>
        <div class="bg-glow-effect fixed inset-0 pointer-events-none z-0"></div>

        <nav class="flex item-center py-3.5 px-7 bg-[#0d1117b3] justify-center border-b-border backdrop-blur-md">
            <span class="font-display font-bold text-[1.25rem] text-primary"><i
                    class="bg-clip-text bg-linear-to-r from-accent to-accent-hover"
                    style="-webkit-text-fill-color: transparent;">Dev</i> To Do</span>
        </nav>
        <router-view />
    </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped></style>