<template>
  <div
      :class="[
      $darkMode ? 'dark bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-900'
    ]"
      class=" flex flex-col transition-colors duration-300"
  >
    <!-- Başlık / Navbar -->
    <header class="flex items-center justify-between p-4 shadow-md bg-white dark:bg-gray-800 transition">
      <h1 class="text-xl font-bold select-none">🛫 Airport Flight Display</h1>

      <!-- Dark Mode Toggle -->
      <button
          @click="toggleDarkMode"
          class="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          aria-label="Toggle Dark Mode"
      >
        <span v-if="!$darkMode">🌙</span>
        <span v-else>☀️</span>
      </button>
    </header>

    <!-- Arama + Saat -->
    <section
        class="flex flex-wrap items-center justify-between gap-4 p-4 bg-white dark:bg-gray-800 shadow-inner transition"
    >
      <FlightSearchBar v-model:searchTerm="searchTerm" />
      <AnalogClock />
    </section>

    <!-- Sayfa İçeriği -->
    <main class="flex-grow p-6 max-w-7xl mx-auto w-full">
      <slot :search-term="searchTerm" />
    </main>

    <!-- Footer -->
    <footer class="p-4 bg-white text-center text-gray-600 dark:text-gray-400 select-none">
      <WeatherWidget />
      <p class="mt-2 text-xs">© 2025 Flight Display Project</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

import FlightSearchBar from '../components/FlightSearchBar.vue'
import AnalogClock from '../components/AnalogClock.vue'
import WeatherWidget from '../components/WeatherWidget.vue'

const searchTerm = ref('')
const darkMode = ref(false)

const $darkMode = computed(() => darkMode.value)

function toggleDarkMode() {
  darkMode.value = !darkMode.value
  if (darkMode.value) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

onMounted(() => {
  if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
    darkMode.value = true
    document.documentElement.classList.add('dark')
  }
})
</script>

<style scoped>
html.dark {
  background-color: #1a202c;
  color: #edf2f7;
}
</style>
