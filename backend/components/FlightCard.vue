<template>
  <div
      class="border rounded p-3 shadow-sm hover:shadow-md transition-shadow cursor-default flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2"
      :class="type === 'departure' ? 'bg-blue-50' : type === 'arrival' ? 'bg-green-50' : 'bg-gray-50'"
  >
    <div class="flex flex-col">
      <p class="font-semibold text-lg">{{ flight.flight.number || 'N/A' }}</p>
      <p class="text-gray-600 text-sm">
        {{ departureAirport }} ➜ {{ arrivalAirport }}
      </p>
    </div>
    <div class="flex flex-col text-right sm:text-left">
      <p class="text-sm text-gray-700 capitalize">{{ flight.status || 'Unknown' }}</p>
      <p class="text-sm text-gray-500">Gate: {{ flight.departure?.gate || '—' }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  flight: any;
  type: 'arrival' | 'departure' | string;
}

const props = defineProps<Props>();

const departureAirport = props.flight.departure?.airport?.name || 'Unknown';
const arrivalAirport = props.flight.arrival?.airport?.name || 'Unknown';
</script>

<style scoped>
</style>
