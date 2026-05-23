<template>
    <div class="bg-card font-mono text-primary">
        <div class="flex flex-col overflow-x-hidden relative min-h-screen min-w-screen bg-dark">

            <!-- Pattern Background -->
            <div class="bg-grid-pattern absolute inset-0 pointer-events-none z-0"></div>
            <div class="bg-glow-effect absolute inset-0 pointer-events-none z-0"></div>

            <header>
                <nav
                    class="flex item-center py-3.5 px-7 bg-[#0d1117b3] justify-center border-b-border backdrop-blur-md">
                    <span class="font-display font-bold text-[1.25rem] text-primary"><i
                            class="bg-clip-text bg-linear-to-r from-accent to-accent-hover"
                            style="-webkit-text-fill-color: transparent;">Dev</i> To Do</span>
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

<script>
export default {

}
</script>

<style lang="scss" scoped></style>