<template>
  <div class="screen">
    <Clock />
    <h2 class="text-xl font-bold mb-4 text-yellow-600">🔁 Transfers</h2>
    <div v-if="transfers.length" class="w-full space-y-2">
      <FlightCard
          v-for="(flight, index) in transfers.slice(0, 5)"
          :key="index"
          :flight="flight"
          type="transfer"
      />
    </div>
    <p v-else class="text-gray-400">No transfer flights available.</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Clock from './Clock.vue';
import FlightCard from './FlightCard.vue';

interface Props {
  flights: {
    transfers: any[];
  };
}

const props = defineProps<Props>();
const transfers = computed(() => props.flights.transfers || []);
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
