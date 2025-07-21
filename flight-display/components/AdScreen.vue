<template>
  <div class="p-6 text-center">
    <h2 class="text-2xl font-bold mb-4 text-white">📢 Advertisement</h2>

    <div v-if="firstAd" class="max-w-2xl mx-auto">
      <img
          src="/flight.jpg"
          :alt="firstAd.text"
          class="w-full h-auto rounded-xl shadow-lg object-cover transition-transform duration-300 hover:scale-105"
      />
      <p class="mt-4 text-lg font-medium text-white">{{ firstAd.text }}</p>
    </div>

    <div v-else class="text-white">
      No advertisement to display.
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ flights: any }>();

const firstAd = props.flights.ads?.[0] || null;
</script>
