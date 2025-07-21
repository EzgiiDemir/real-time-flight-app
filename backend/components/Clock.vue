<template>
  <div       class=" bg-gradient-to-br from-sky-900 to-gray-950 text-white flex flex-col items-center p-6">

  <div
        class="backdrop-blur-md bg-white/60 dark:bg-gray-900/60  border-gray-200 dark:border-gray-700 rounded-xl p-8 w-full max-w-md text-center"
    >
      <h2 class="text-4xl md:text-5xl font-extrabold text-white dark:text-white tracking-wide">
        {{ time }}
      </h2>
      <p class="mt-4 text-lg text-gray-600 dark:text-gray-300">
        {{ date }}
      </p>
      <p class="mt-2 text-sm text-white dark:text-gray-400 italic">
        Real-time airport system clock
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const time = ref('');
const date = ref('');

function updateTime() {
  const now = new Date();
  time.value = now.toLocaleTimeString('en-GB', { hour12: false }); // 24-hour format
  date.value = now.toLocaleDateString('en-GB', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

onMounted(() => {
  updateTime();
  setInterval(updateTime, 1000);
});
</script>
