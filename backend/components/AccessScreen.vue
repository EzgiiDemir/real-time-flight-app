<template>
  <div class="screen">
    <Clock />
    <h2 class="text-xl font-bold mb-4 text-blue-600">🔐 Access Status</h2>

    <div
        v-if="accessStatus === 'granted'"
        class="bg-green-100 border border-green-400 text-green-800 p-4 rounded w-full text-center"
    >
      ✅ Access Granted
    </div>

    <div
        v-else-if="accessStatus === 'denied'"
        class="bg-red-100 border border-red-400 text-red-800 p-4 rounded w-full text-center"
    >
      ❌ Access Denied
    </div>

    <div v-else class="text-gray-400">Scan a valid QR code to continue.</div>
  </div>
</template>

<script setup lang="ts">
import Clock from './Clock.vue';

interface Props {
  accessStatus: 'granted' | 'denied' | '';
}

const props = defineProps<Props>();
</script>

<style scoped>
.screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 1rem;
}
</style>
