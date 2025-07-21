<template>
  <div class="text-center text-sm text-gray-600 dark:text-gray-400 select-none">
    🌤️ Weather: <strong>{{ weather }}</strong> | {{ temperature }}°C
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const weather = ref('Loading...')
const temperature = ref('--')

onMounted(async () => {
  try {
    weather.value = 'Partly Cloudy'
    temperature.value = 24
  } catch (e) {
    weather.value = 'Unavailable'
    temperature.value = '--'
  }
})
</script>
