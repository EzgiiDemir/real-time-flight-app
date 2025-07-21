<template>
  <div
      class="min-h-screen bg-gradient-to-br from-sky-900 to-gray-950 text-white flex flex-col items-center p-6"
  >
    <!-- Başlık -->
    <header class="mb-10 text-center select-none">
      <h1
          class="text-5xl font-extrabold tracking-widest drop-shadow-lg flex items-center justify-center gap-3"
      >
        🛫 SKYPORT AIRPORT
      </h1>
      <p class="mb-5 text-lg text-sky-300 font-semibold">
        Live Flight Information Display System
      </p>
    </header>

    <!-- Uçuş tablosu kart -->
    <section
        class="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl max-w-6xl w-full overflow-hidden"
        aria-label="Departures flight table"
    >

      <!-- Mobil kart görünümü -->
      <div class="md:hidden space-y-6 p-4">
        <article
            v-for="flight in paginatedFlights"
            :key="flight.flightNumber"
            class="bg-sky-900/50 rounded-xl p-5 shadow-lg  border-sky-700 flex flex-col gap-3"
            tabindex="0"
            role="group"
            :aria-label="`Flight ${flight.airline} ${flight.flightNumber} details`"
        >
          <header class="flex justify-between items-center text-sky-200 font-bold text-lg">
            <span class="flex items-center gap-2">
              {{ flight.airline }} {{ flight.flightNumber }}
              <span
                  class="w-4 h-4 rounded-full bg-sky-400 animate-pulse"
                  aria-hidden="true"
              ></span>
            </span>
            <span
                :class="[
                'inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold',
                statusClass(flight.status)
              ]"
                role="status"
                :aria-label="`Flight status: ${flight.status}`"
            >
              <span
                  class="w-3 h-3 rounded-full"
                  :class="statusSignalClass(flight.status)"
              ></span>
              {{ flight.status }}
            </span>
          </header>
          <p class="text-sky-300 font-medium">
            <strong>Destination:</strong> {{ flight.arrival.airport }}, {{ flight.arrival.country }}
          </p>
          <p class="text-sky-400 font-mono">
            <strong>Scheduled:</strong> {{ formatDate(flight.departure.scheduledTime) }}
          </p>
          <p class="text-sky-300 font-semibold">
            <strong>Aircraft:</strong> {{ flight.aircraft }}
          </p>
        </article>
      </div>

      <!-- Pagination -->
      <nav
          class="flex justify-center items-center gap-6 p-6 select-none"
          aria-label="Pagination Navigation"
      >
        <button
            @click="prevPage"
            :disabled="currentPage === 1"
            class="px-6 py-2 rounded-xl bg-sky-700 hover:bg-sky-800 disabled:bg-sky-600 disabled:cursor-not-allowed transition text-white font-semibold"
        >
          Prev
        </button>
        <span
            class="text-sky-300 font-semibold text-lg"
            aria-live="polite"
            aria-atomic="true"
        >
          Page {{ currentPage }} / {{ totalPages }}
        </span>
        <button
            @click="nextPage"
            :disabled="currentPage === totalPages"
            class="px-6 py-2 rounded-xl bg-sky-700 hover:bg-sky-800 disabled:bg-sky-600 disabled:cursor-not-allowed transition text-white font-semibold"
        >
          Next
        </button>
      </nav>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

const props = defineProps<{ flights: any }>();

const currentPage = ref(1);
const itemsPerPage = 6;

const totalPages = computed(() =>
    props.flights?.departures?.length
        ? Math.ceil(props.flights.departures.length / itemsPerPage)
        : 1
);

const paginatedFlights = computed(() => {
  if (!props.flights?.departures) return [];
  const start = (currentPage.value - 1) * itemsPerPage;
  return props.flights.departures.slice(start, start + itemsPerPage);
});

function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value++;
}
function prevPage() {
  if (currentPage.value > 1) currentPage.value--;
}

function formatDate(dateStr: string) {
  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  };
  return new Date(dateStr).toLocaleString(undefined, options);
}

function statusClass(status: string) {
  switch (status.toLowerCase()) {
    case "delayed":
      return "bg-red-600 text-red-100";
    case "boarding":
      return "bg-green-600 text-green-100";
    case "cancelled":
      return "bg-gray-600 text-gray-300 line-through";
    default:
      return "bg-sky-600 text-sky-100";
  }
}

function statusSignalClass(status: string) {
  switch (status.toLowerCase()) {
    case "delayed":
      return "bg-red-300 animate-ping";
    case "boarding":
      return "bg-green-300 animate-ping";
    case "cancelled":
      return "bg-gray-400";
    default:
      return "bg-sky-300 animate-ping";
  }
}
</script>

<style scoped>
/* Pulse animation for small signals */
.animate-ping {
  position: relative;
}
.animate-ping::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  background-color: currentColor;
  border-radius: 9999px;
  transform: translate(-50%, -50%);
  animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
  opacity: 0.5;
  z-index: -1;
}

@keyframes ping {
  0% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.75;
  }
  75%,
  100% {
    transform: translate(-50%, -50%) scale(1.8);
    opacity: 0;
  }
}
</style>
