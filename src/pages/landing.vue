<template>
  <div class="min-h-screen bg-dark text-primary" style="font-family: 'JetBrains Mono', monospace;">

    <!-- ── HERO ── -->
    <section class="relative px-6 md:px-12 lg:px-20 pt-20 md:pt-28 pb-16 md:pb-24">
      <div class="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-10 md:gap-16">

        <!-- Left: Text content -->
        <div class="flex-1 text-center md:text-left">
          <!-- Badge -->
          <div
            class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#1e2530] bg-[#161b22] text-xs text-gray-400 mb-6 fade-in-up">
            <span class="text-amber-400"></span>
            <span>Integrated with GitHub</span>
          </div>

          <!-- Title -->
          <h1 class="font-display font-bold text-4xl md:text-5xl lg:text-6xl leading-tight mb-6 fade-in-up"
            style="animation-delay: 0.05s;">
            Master Your
            <span class="bg-clip-text bg-linear-to-r from-[#34d399] to-[#6ee7b7]"
              style="-webkit-text-fill-color: transparent;">Flow State</span>
            <br />& Become Legendary
          </h1>

          <!-- Description -->
          <p class="text-gray-400 text-base md:text-lg leading-relaxed mb-8 max-w-xl mx-auto md:mx-0 fade-in-up"
            style="animation-delay: 0.1s;">
            DevTodo is the AI-powered workspace built for the modern developer.
            Integrated with GitHub, driven by NLP, and optimized for speed.
            Eliminate context switching and focus on code.
          </p>

          <!-- CTA Button -->
          <div class="fade-in-up" style="animation-delay: 0.15s;">
            <router-link to="/register"
              class="inline-flex items-center gap-2 px-6 py-3 bg-accent hover:bg-accent-hover text-white text-sm font-bold rounded-lg transition-all duration-200 hover:translate-y-[-1px] hover:shadow-[0_0_32px_var(--color-accent-glow),0_4px_12px_rgba(0,0,0,0.5)]">
              Get Started for Free
              <span>→</span>
            </router-link>
          </div>

          <!-- Social proof -->
          <div class="flex items-center gap-3 mt-8 justify-center md:justify-start fade-in-up"
            style="animation-delay: 0.2s;">
            <div class="flex -space-x-2">
              <div class="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 border-2 border-dark">
              </div>
              <div class="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 border-2 border-dark">
              </div>
              <div class="w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 border-2 border-dark">
              </div>
            </div>
            <span class="text-sm font-bold text-white">+10k</span>
            <span class="text-sm text-gray-400">Trusted by 10,000+ developers</span>
          </div>
        </div>

        <!-- Right: Dashboard preview -->
        <div class="flex-1 fade-in-up" style="animation-delay: 0.1s;">
          <div class="relative">
            <div class="absolute -inset-4 bg-gradient-to-r from-accent/10 to-purple-600/10 rounded-2xl blur-xl">
            </div>
            <img :src="dashboardImg" alt="DevTodo Dashboard"
              class="relative rounded-xl border border-[#1e2530] shadow-2xl shadow-indigo-900/20 w-full" />
          </div>
        </div>
      </div>
    </section>

    <!-- ── TECH STACK STRIP ── -->
    <section class="px-6 md:px-12 py-12 md:py-16 border-t border-b border-[#1e2530]">
      <div class="max-w-5xl mx-auto">
        <p class="text-[0.65rem] text-gray-600 tracking-[0.3em] uppercase text-center mb-8 font-mono">
          THIS PROJECT WAS CARRIED OUT WITH
        </p>
        <div class="flex flex-wrap items-center justify-center gap-6 md:gap-10">
          <div v-for="tech in techStack" :key="tech.name"
            class="flex items-center gap-2 text-gray-500 hover:text-gray-200 transition-colors duration-200">
            <img :src="tech.icon" width="20" height="20" class="opacity-60" :alt="tech.name" />
            <span class="text-sm font-medium">{{ tech.name }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- ── FEATURES SECTION ── -->
    <section id="features" class="px-6 md:px-12 lg:px-20 py-16 md:py-24">
      <div class="max-w-5xl mx-auto">
        <h2 class="font-display text-3xl md:text-4xl font-bold text-center mb-3 fade-in-up">
          Engineered for Velocity
        </h2>
        <p class="text-center text-gray-400 text-base md:text-lg max-w-2xl mx-auto mb-12 fade-in-up"
          style="animation-delay: 0.05s;">
          Everything you need to ship faster, neatly organized in a distraction-free environment.
        </p>

        <!-- 2x2 grid of feature cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div v-for="(feature, index) in features" :key="feature.title"
            class="bg-card border border-border rounded-2xl p-6 hover:border-accent/30 transition-all duration-300 fade-in-up"
            :style="{ animationDelay: `${0.1 + index * 0.05}s` }">
            <!-- Icon container -->
            <div class="w-10 h-10 rounded-lg bg-[#1e2530] flex items-center justify-center mb-4">
              <img :src="feature.icon" width="20" height="20" class="icon-indigo" :alt="feature.title" />
            </div>
            <!-- Title -->
            <h3 class="text-base font-semibold text-white mb-2">{{ feature.title }}</h3>
            <!-- Description -->
            <p class="text-sm text-gray-400 leading-relaxed">
              {{ feature.description }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- ── FOOTER ── -->
    <footer class="px-6 md:px-12 py-8 border-t border-[#1e2530]">
      <div class="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <!-- Logo -->
        <div class="flex items-center gap-2">
          <div
            class="w-6 h-6 rounded-md bg-gradient-to-br from-accent to-accent-hover flex items-center justify-center">
            <span class="text-white text-[0.6rem] font-bold">D</span>
          </div>
          <span class="font-display font-bold text-white text-sm">DevTodo</span>
        </div>

        <!-- Copyright -->
        <p class="text-xs text-gray-600">
          © 2026 DevTodo. Built for the Flow State.
        </p>

        <!-- Footer links -->
        <div class="flex flex-wrap justify-center gap-4 text-xs text-gray-500">
          <a href="#" class="hover:text-gray-300 transition-colors">Privacy Policy</a>
          <a href="#" class="hover:text-gray-300 transition-colors">Terms of Service</a>
          <a href="#" class="hover:text-gray-300 transition-colors">Github</a>
          <a href="#" class="hover:text-gray-300 transition-colors">Discord</a>
          <a href="#" class="hover:text-gray-300 transition-colors">Changelog</a>
        </div>
      </div>
    </footer>

  </div>
</template>

<script setup>
import dashboardImg from '../assets/SS_dashboard.png'
import databaseIcon from '../assets/database.svg?url'
import frontendIcon from '../assets/frontend.svg?url'
import aiIcon from '../assets/AI-logo.svg?url'
import jsIcon from '../assets/js.svg?url'
import expressIcon from '../assets/express.svg?url'
import stackIcon from '../assets/stack.svg?url'
import githubIcon from '../assets/github-logo.svg?url'
import chatIcon from '../assets/chat.svg?url'
import monitoringIcon from '../assets/monitoring.svg?url'
import focusIcon from '../assets/focus.svg?url'

const techStack = [
  { name: 'PostgreSQL', icon: databaseIcon },
  { name: 'Vue', icon: frontendIcon },
  { name: 'Grok AI', icon: aiIcon },
  { name: 'node.js', icon: jsIcon },
  { name: 'express.js', icon: expressIcon },
  { name: 'prisma', icon: stackIcon },
]

const features = [
  {
    title: 'GitHub Integrated',
    icon: githubIcon,
    description: 'Real-time bi-directional sync with your repositories. PRs, issues, and commits appear magically in your workflow.',
  },
  {
    title: 'NLP Task Input',
    icon: chatIcon,
    description: 'Type "fix the auth bug in login" and watch AI parse it into structured tasks with labels, priorities, and assignments.',
  },
  {
    title: 'Deep Analytics',
    icon: monitoringIcon,
    description: 'Track velocity, burndown, and cycle time. Spot bottlenecks before they slow your team down.',
  },
  {
    title: 'Focus Mode',
    icon: focusIcon,
    description: 'Zero-distraction workspace that blocks noise and surfaces only what matters for your current sprint.',
  },
]
</script>

<style scoped>
@reference "../style.css";
</style>